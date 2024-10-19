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
import upload from "../middlewares/multer.js";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

userRouter.post("/confirm-payment", async (req, res) => {
  const { appointmentId, paymentId } = req.body;
  try {
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

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

userRouter.post("/forgot-password/send-otp", sendForgotPasswordOtp);
userRouter.post("/forgot-password/reset", resetPasswordWithOtp);
userRouter.post("/send-welcome-email", sendWelcomeEmail);
userRouter.post("/send-payment-email", processPayment);

userRouter.post("/send-receipt", async (req, res) => {
  const { email, receipt } = req.body;
  console.log("Email:", email);
  console.log("Receipt:", receipt);

  if (!email || !receipt) {
    return res
      .status(400)
      .json({ success: false, message: "Email or receipt is missing." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Payment Receipt",
    text: receipt || "Thank you for your payment!",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message,
    });
  }
});

export default userRouter;
