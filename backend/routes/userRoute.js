// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   getProfile,
//   updateProfile,
//   bookAppointment,
//   listAppointment,
//   cancelAppointment,
//   sendForgotPasswordOtp,
//   resetPasswordWithOtp,
//   sendWelcomeEmail,
//   processPayment,
// } from "../controllers/userController.js";
// import authUser from "../middlewares/authUser.js";
// import upload from "../middlewares/multer.js";
// import appointmentModel from "../models/appointmentModel.js";

// const userRouter = express.Router();

// // User Authentication
// userRouter.post("/register", registerUser);
// userRouter.post("/login", loginUser);
// userRouter.get("/get-profile", authUser, getProfile);
// userRouter.post(
//   "/update-profile",
//   upload.single("image"),
//   authUser,
//   updateProfile
// );

// // Appointment Management
// userRouter.post("/book-appointment", authUser, bookAppointment);
// userRouter.get("/appointments", authUser, listAppointment);
// userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// // Payment Confirmation
// userRouter.post("/confirm-payment", async (req, res) => {
//   const { appointmentId, paymentId } = req.body;
//   try {
//     // Fetch the appointment using the appointmentId
//     const appointment = await appointmentModel.findById(appointmentId);

//     if (!appointment) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Appointment not found" });
//     }

//     // Mark the appointment as paid
//     appointment.payment = true;
//     appointment.paymentId = paymentId;
//     await appointment.save();

//     res.json({
//       success: true,
//       message: "Payment confirmed and appointment marked as paid",
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// });
// userRouter.post("/forgot-password/send-otp", sendForgotPasswordOtp);
// userRouter.post("/forgot-password/reset", resetPasswordWithOtp);
// userRouter.post("/send-welcome-email", sendWelcomeEmail);
// userRouter.post("/send-payment-email", processPayment);

// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// userRouter.post("/send-receipt", upload.single("file"), async (req, res) => {
//   const { email } = req.body; // Ensure you're passing the email
//   const filePath = req.file.path;

//   // Create a Nodemailer transporter
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // Use your email service
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // Email options
//   const mailOptions = {
//     from: "yy-email@gmail.com",
//     to: email,
//     subject: "Payment Receipt",
//     text: "Thank you for your payment! Please find your receipt attached.",
//     attachments: [
//       {
//         path: filePath,
//       },
//     ],
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.json({ success: true });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ success: false, message: "Failed to send email." });
//   } finally {
//     // Clean up the uploaded file
//     fs.unlinkSync(filePath);
//   }
// });

// export default userRouter;
import express from "express";
import {
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
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js"; // Use the upload from multer.js
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from "nodemailer"; // Import nodemailer here
import fs from "fs"; // Import fs for file operations
import dotenv from "dotenv"; // Use import for dotenv

dotenv.config(); // Initialize dotenv

const userRouter = express.Router();

// User Authentication
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);

// Appointment Management
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// Payment Confirmation
userRouter.post("/confirm-payment", async (req, res) => {
  const { appointmentId, paymentId } = req.body;
  try {
    // Fetch the appointment using the appointmentId
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Mark the appointment as paid
    appointment.payment = true;
    appointment.paymentId = paymentId;
    await appointment.save();

    res.json({
      success: true,
      message: "Payment confirmed and appointment marked as paid",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// Password Management
userRouter.post("/forgot-password/send-otp", sendForgotPasswordOtp);
userRouter.post("/forgot-password/reset", resetPasswordWithOtp);
userRouter.post("/send-welcome-email", sendWelcomeEmail);
userRouter.post("/send-payment-email", processPayment);

// Receipt Sending
userRouter.post("/send-receipt", async (req, res) => {
  const { email, receipt } = req.body; // Retrieve the email and receipt text from the request body
  console.log("Email:", email);
  console.log("Receipt:", receipt);

  if (!email || !receipt) {
    return res
      .status(400)
      .json({ success: false, message: "Email or receipt is missing." });
  }

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use your environment variable for sender email
    to: email,
    subject: "Payment Receipt",
    text: receipt || "Thank you for your payment!", // Use the receipt text or a default message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message, // Include the error message for debugging
    });
  }
});

// Set up multer for file uploads
// import multer from "multer";
// const fileUpload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// // Define the send-receipt route
// userRouter.post(
//   "/send-receipt",
//   fileUpload.single("receipt"),
//   async (req, res) => {
//     const { email } = req.body; // Retrieve the email from the request body
//     const receiptFile = req.file; // Get the uploaded file from req.file

//     console.log("Email:", email);
//     console.log("Receipt File:", receiptFile);

//     // Validate input
//     if (!email || !receiptFile) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email or receipt is missing." });
//     }

//     // Create a Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // Use your email service
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Use your environment variable for sender email
//       to: email,
//       subject: "Payment Receipt",
//       text: "Thank you for your payment!", // Default message
//       attachments: [
//         {
//           filename: receiptFile.originalname, // Use the original filename of the uploaded file
//           path: receiptFile.path, // Path to the uploaded file
//         },
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);

//       // Optional: You can delete the file after sending the email to clean up the server
//       // fs.unlinkSync(receiptFile.path);

//       res.json({ success: true, message: "Email sent successfully." });
//     } catch (error) {
//       console.error("Error sending email:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send email.",
//         error: error.message, // Include the error message for debugging
//       });
//     }
//   }
// );

export default userRouter;
