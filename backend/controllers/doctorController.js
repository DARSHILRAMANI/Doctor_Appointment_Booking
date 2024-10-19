import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from "nodemailer"; // Use import instead of require
import crypto from "crypto"; // Import once
import dotenv from "dotenv";

dotenv.config();

// Change Doctor Availability
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    // Check if docId is provided
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(docId);

    // Check if doctor exists
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Doctor List
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Doctor's Appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Mark Appointment as Completed
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({
        success: false,
        message: "Appointment marking failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel Appointment
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({
        success: false,
        message: "Appointment cancellation failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//dashboard for doctor

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    // Await the result of the query first
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0;
    let patients = [];

    // Calculate earnings and gather unique patient IDs
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }

      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    // Prepare dashboard data
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api ro get doctor profile for doctor panel

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to updateData

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    const updatedData = await doctorModel.findByIdAndUpdate(
      docId,
      { fees, address, available },
      { new: true }
    );

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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

    // Find the user
    const user = await doctorModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate OTP and save it
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

    // Send OTP email
    await sendOtpEmail(email, otp);
    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    handleError(res, error);
  }
};

// API to reset password using OTP
const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // Validate OTP
    const storedData = otpStore[email];
    if (!storedData || storedData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > storedData.expires) {
      delete otpStore[email]; // Remove expired OTP
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await doctorModel.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email];

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile,
  resetPasswordWithOtp,
  sendForgotPasswordOtp,
};

// import doctorModel from "../models/doctorModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import appointmentModel from "../models/appointmentModel.js";
// import { body, validationResult } from "express-validator";

// // Change Doctor Availability
// const changeAvailability = async (req, res) => {
//   try {
//     const { docId } = req.body;

//     // Check if docId is provided
//     if (!docId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Doctor ID is required" });
//     }

//     const docData = await doctorModel.findById(docId);

//     // Check if doctor exists
//     if (!docData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor not found" });
//     }

//     await doctorModel.findByIdAndUpdate(docId, {
//       available: !docData.available,
//     });

//     res.json({ success: true, message: "Availability Changed" });
//   } catch (error) {
//     console.error("Error changing availability:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Get Doctor List
// const doctorList = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({}).select(["-password", "-email"]);
//     res.json({ success: true, doctors });
//   } catch (error) {
//     console.error("Error fetching doctor list:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Doctor Login
// const loginDoctor = async (req, res) => {
//   try {
//     await body("email").isEmail().run(req);
//     await body("password").notEmpty().run(req);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     const doctor = await doctorModel.findOne({ email });

//     if (!doctor) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, doctor.password);
//     if (isMatch) {
//       const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
//       res.status(200).json({ success: true, token });
//     } else {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Get Doctor's Appointments
// // const appointmentsDoctor = async (req, res) => {
// //   try {
// //     const { docId } = req.body;
// //     const appointments = await appointmentModel
// //       .find({ docId })
// //       .select("amount is Completed userId");

// //     res.json({ success: true, appointments });
// //   } catch (error) {
// //     console.error("Error fetching appointments:", error);
// //     res.status(500).json({ success: false, message: "Internal server error" });
// //   }
// // };
// const appointmentsDoctor = async (req, res) => {
//   try {
//     const { docId } = req.body;

//     // Check if docId is provided
//     if (!docId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Doctor ID is required." });
//     }

//     // Fetch appointments for the doctor
//     const appointments = await appointmentModel
//       .find({ docId })
//       .select("amount isCompleted userId");

//     // Check if appointments were found
//     if (appointments.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No appointments found." });
//     }

//     // Return successful response with appointments
//     res.json({ success: true, appointments });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Mark Appointment as Completed
// const appointmentComplete = async (req, res) => {
//   try {
//     const { docId, appointmentId } = req.body;
//     const appointmentData = await appointmentModel.findById(appointmentId);

//     if (appointmentData && appointmentData.docId === docId) {
//       await appointmentModel.findByIdAndUpdate(appointmentId, {
//         isCompleted: true,
//       });
//       return res.json({ success: true, message: "Appointment completed" });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Appointment marking failed",
//       });
//     }
//   } catch (error) {
//     console.error("Error completing appointment:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Cancel Appointment
// const appointmentCancel = async (req, res) => {
//   try {
//     const { docId, appointmentId } = req.body;
//     const appointmentData = await appointmentModel.findById(appointmentId);

//     if (appointmentData && appointmentData.docId === docId) {
//       await appointmentModel.findByIdAndUpdate(appointmentId, {
//         cancelled: true,
//       });
//       return res.json({ success: true, message: "Appointment cancelled" });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Appointment cancellation failed",
//       });
//     }
//   } catch (error) {
//     console.error("Error cancelling appointment:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // Dashboard for Doctor
// const doctorDashboard = async (req, res) => {
//   try {
//     const { docId } = req.body;

//     const appointments = await appointmentModel.find({ docId });
//     let earnings = 0;
//     let patients = [];

//     appointments.forEach((item) => {
//       if (item.isCompleted || item.payment) {
//         earnings += item.amount;
//       }

//       if (!patients.includes(item.userId)) {
//         patients.push(item.userId);
//       }
//     });

//     // Prepare dashboard data
//     const dashData = {
//       earnings,
//       appointments: appointments.length,
//       patients: patients.length,
//       latestAppointments: appointments.reverse().slice(0, 5),
//     };

//     res.json({ success: true, dashData });
//   } catch (error) {
//     console.error("Error fetching doctor dashboard:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // API to get doctor profile for doctor panel
// const doctorProfile = async (req, res) => {
//   try {
//     const { docId } = req.body;
//     const profileData = await doctorModel.findById(docId).select("-password");

//     if (!profileData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Profile not found" });
//     }

//     res.json({ success: true, profileData });
//   } catch (error) {
//     console.error("Error fetching doctor profile:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // API to update doctor data
// const updateDoctorProfile = async (req, res) => {
//   try {
//     const { docId, fees, address, available } = req.body;

//     const updatedData = await doctorModel.findByIdAndUpdate(
//       docId,
//       { fees, address, available },
//       { new: true }
//     );

//     if (!updatedData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor not found" });
//     }

//     res.json({ success: true, message: "Profile Updated" });
//   } catch (error) {
//     console.error("Error updating doctor profile:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export {
//   changeAvailability,
//   doctorList,
//   loginDoctor,
//   appointmentsDoctor,
//   appointmentCancel,
//   appointmentComplete,
//   doctorDashboard,
//   updateDoctorProfile,
//   doctorProfile,
// };
