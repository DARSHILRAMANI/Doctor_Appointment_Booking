// import validator from "validator";
// import bcrypt from "bcrypt";
// import { v2 as cloudinary } from "cloudinary";
// import doctorModel from "../models/doctorModel.js";
// import jwt from "jsonwebtoken";

// // Function to add a doctor
// const addDoctor = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       speciality,
//       degree,
//       experience,
//       about,
//       available,
//       fees,
//       address,
//     } = req.body;

//     const imageFile = req.file;

//     // Check for missing details
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !speciality ||
//       !degree ||
//       !experience ||
//       !about ||
//       !fees ||
//       !address ||
//       !imageFile
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing details",
//       });
//     }

//     // Validate email
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid email",
//       });
//     }

//     // Validate password strength
//     if (password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a strong password",
//       });
//     }

//     // Hashing the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Uploading the image to Cloudinary
//     const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
//       resource_type: "image",
//     });
//     const imageUrl = imageUpload.secure_url;

//     // Preparing doctor data
//     const doctorData = {
//       name,
//       email,
//       image: imageUrl,
//       password: hashedPassword,
//       speciality,
//       degree,
//       experience,
//       about,
//       fees,
//       address: JSON.parse(address),
//       available,
//       date: Date.now(),
//     };

//     // Saving new doctor to the database
//     const newDoctor = new doctorModel(doctorData);
//     await newDoctor.save();

//     res.status(201).json({ success: true, message: "Doctor added" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // API for admin login
// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign({ email }, process.env.JWT_SECRET); // Removed expire time
//       return res
//         .status(200)
//         .json({ success: true, message: "Admin logged in", token });
//     } else {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export { addDoctor, loginAdmin };

// import validator from "validator";
// import bcrypt from "bcrypt";
// import { v2 as cloudinary } from "cloudinary";
// import doctorModel from "../models/doctorModel.js";
// import jwt from "jsonwebtoken";
// import appointmentModel from "../models/appointmentModel.js";
// const handleError = (res, error) => {
//   console.error(error); // Log the error for debugging
//   res
//     .status(500)
//     .json({
//       success: false,
//       message: "An error occurred",
//       error: error.message,
//     });
// };

// // Function to add a doctor
// const addDoctor = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       speciality,
//       degree,
//       experience,
//       about,
//       available,
//       fees,
//       address,
//     } = req.body;

//     const imageFile = req.file;

//     // Check for missing details
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !speciality ||
//       !degree ||
//       !experience ||
//       !about ||
//       !fees ||
//       !address ||
//       !imageFile
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing details",
//       });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid email",
//       });
//     }

//     // Validate password strength
//     if (password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a strong password",
//       });
//     }

//     // Hashing the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Uploading the image to Cloudinary
//     const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
//       resource_type: "image",
//     });
//     const imageUrl = imageUpload.secure_url;

//     // Preparing doctor data
//     const doctorData = {
//       name,
//       email,
//       image: imageUrl,
//       password: hashedPassword,
//       speciality,
//       degree,
//       experience,
//       about,
//       fees,
//       address: JSON.parse(address),
//       available,
//       date: Date.now(),
//     };

//     // Saving new doctor to the database
//     const newDoctor = new doctorModel(doctorData);
//     await newDoctor.save();

//     res.status(201).json({ success: true, message: "Doctor added" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // API for admin login
// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if admin credentials match
//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign(email + password, process.env.JWT_SECRET);
//       return res.status(200).json({
//         success: true,
//         message: "Admin logged in",
//         token,
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// //api to get all doctors list for admin panel

// const allDoctors = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({}).select("-password");
//     res.json({ success: true, doctors });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //API to get all appointments list

// const appointmentsAdmin = async (req, res) => {
//   try {
//     const appointments = await appointmentModel.find({});
//     res.json({ success: true, appointments });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const appointmentCancel = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     // Assuming userId comes from req.user (after user authentication middleware)
//     const userId = req.user._id;

//     const appointmentData = await appointmentModel.findById(appointmentId);

//     // Check if the appointment exists
//     if (!appointmentData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Appointment not found" });
//     }

//     // Verify user
//     if (appointmentData.userId.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Unauthorized action" });
//     }

//     // Update appointment to mark it as cancelled
//     await appointmentModel.findByIdAndUpdate(appointmentId, {
//       cancelled: true,
//     });

//     // Release doctor slot
//     const { docId, slotDate, slotTime } = appointmentData;
//     const doctorData = await doctorModel.findById(docId);

//     // Ensure slots_booked exists and has the specific date
//     if (
//       doctorData &&
//       doctorData.slots_booked &&
//       doctorData.slots_booked[slotDate]
//     ) {
//       let slots_booked = doctorData.slots_booked;
//       slots_booked[slotDate] = slots_booked[slotDate].filter(
//         (e) => e !== slotTime
//       );

//       await doctorModel.findByIdAndUpdate(docId, { slots_booked });
//     }

//     res.status(200).json({ success: true, message: "Appointment canceled" });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export {
//   addDoctor,
//   appointmentCancel,
//   loginAdmin,
//   allDoctors,
//   appointmentsAdmin,
// };
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const handleError = (res, error) => {
  console.error(error); // Log the error for debugging
  res.status(500).json({
    success: false,
    message: "An error occurred",
    error: error.message,
  });
};

// Function to add a doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // Check for missing details
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Uploading the image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Preparing doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      available,
      date: Date.now(),
    };

    // Saving new doctor to the database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(201).json({ success: true, message: "Doctor added" });
  } catch (error) {
    handleError(res, error);
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin credentials match
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "Admin logged in",
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    handleError(res, error);
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    handleError(res, error);
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body; // Corrected destructuring assignment
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Update the appointment status to cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Releasing the doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    // Remove the slot time from the booked slots
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    // Update the doctor's booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Respond to the client
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error cancelling appointment", error });
  }
};

//api to get dashboard data
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error cancelling appointment", error });
  }
};
export {
  addDoctor,
  appointmentCancel,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  adminDashboard,
};
