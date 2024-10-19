import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "An error occurred",
    error: error.message,
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ success: true, token });
  } catch (error) {
    handleError(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Credentials" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData });
  } catch (error) {
    handleError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!userId || !name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const updatedData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updatedData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updatedData);

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }

    let slotsBooked = docData.slots_booked || {};

    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return res
          .status(400)
          .json({ success: false, message: "Slot not available" });
      }
    } else {
      slotsBooked[slotDate] = [];
    }
    slotsBooked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select("-password");

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res
      .status(200)
      .json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    handleError(res, error);
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({ success: true, message: "Appointment canceled" });
  } catch (error) {
    handleError(res, error);
  }
};

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "precripto@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

    await sendOtpEmail(email, otp);
    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    handleError(res, error);
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    const storedData = otpStore[email];
    if (!storedData || storedData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > storedData.expires) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email];

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

const sendWelcomeEmail = async (req, res) => {
  const { email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Precipto@gmail.com',
    to: email,
    subject: "Welcome to Precipto",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

const processPayment = async (req, res) => {};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  sendWelcomeEmail,
  processPayment,
};
