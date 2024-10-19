import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  // Handle sending OTP
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/forgot-password/send-otp`,
        { email }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (!otp || newPassword.length < 8) {
      toast.error(
        "Please enter a valid OTP and a new password with at least 8 characters"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/forgot-password/reset`,
        { email, otp, newPassword }
      );

      if (response.data.success) {
        toast.success("Password reset successful! Please login.");
        resetForgotPasswordStates();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  const resetForgotPasswordStates = () => {
    setIsForgotPassword(false);
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        // Admin login API call
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin login successful");
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        // Doctor login logic
        if (isForgotPassword) {
          if (!otpSent) {
            handleForgotPassword();
          } else {
            handleResetPassword();
          }
          return;
        }
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor login successful");
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const switchLoginMode = (mode) => {
    setState(mode);
    resetForgotPasswordStates();
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        {!isForgotPassword && (
          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>
        )}
        {isForgotPassword && otpSent && (
          <>
            <div className="w-full">
              <p>OTP</p>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>New Password</p>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                required
              />
            </div>
          </>
        )}
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          {isForgotPassword
            ? otpSent
              ? "Reset Password"
              : "Send OTP"
            : "Login"}
        </button>
        {state === "Doctor" && !isForgotPassword && (
          <p
            className="text-primary underline cursor-pointer text-sm"
            onClick={() => setIsForgotPassword(true)}
          >
            Forgot Password?
          </p>
        )}
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => switchLoginMode("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => switchLoginMode("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
