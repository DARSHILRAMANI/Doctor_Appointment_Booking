import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const { token, backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password/send-otp`,
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || resetPassword.length < 8) {
      toast.error(
        "Please enter valid OTP and a new password with at least 8 characters"
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password/reset`,
        {
          email,
          otp,
          newPassword: resetPassword,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful!");
        setIsForgotPassword(false);
        setOtpSent(false);
        setState("Login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("OTP is Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async () => {
    try {
      const message = `Best wishes from Precipto, ${name}! We are excited to have you on board.`;

      await axios.post(`${backendUrl}/api/user/send-welcome-email`, {
        email,
        message,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      toast.error("Failed to send welcome email.");
    }
  };

  const onsubmitHandler = async (event) => {
    event.preventDefault();

    if (isForgotPassword) {
      if (!otpSent) {
        handleForgotPassword();
      } else {
        handleResetPassword();
      }
      return;
    }

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let response;
      if (state === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          password,
          email,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          toast.success("Sign up successful!");

          await sendWelcomeEmail();

          window.location.reload();
        } else {
          toast.error(response.data.message);
        }
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          password,
          email,
        });
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          toast.success("Login successful!");
          window.location.reload();
          window.location.reload();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onsubmitHandler}
        className="flex flex-col justify-center items-start p-6 w-full max-w-md border rounded-xl text-zinc-600 text-sm shadow-lg space-y-4"
      >
        <div className="flex flex-col gap-3 items-center justify-center w-full">
          <p className="text-2xl font-semibold">
            {isForgotPassword
              ? otpSent
                ? "Verify OTP"
                : "Forgot Password"
              : state === "Sign Up"
              ? "Create Account"
              : "Login"}
          </p>
          <p className="text-center">
            {isForgotPassword
              ? otpSent
                ? "Enter the OTP sent to your email"
                : "Reset your password"
              : `Please ${
                  state === "Sign Up" ? "sign up" : "login"
                } to book an appointment`}
          </p>
          {!isForgotPassword && state === "Sign Up" && (
            <div className="w-full">
              <label htmlFor="fullName" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {isForgotPassword && (
          <>
            {!otpSent ? (
              <div className="w-full">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="bg-primary w-full py-2 rounded-md text-white hover:bg-primary-dark focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <label htmlFor="otp" className="block text-sm font-medium">
                    OTP
                  </label>
                  <input
                    id="otp"
                    className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    type="password"
                    onChange={(e) => setResetPassword(e.target.value)}
                    value={resetPassword}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="bg-primary w-full py-2 rounded-md text-white hover:bg-primary-dark focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </>
            )}
          </>
        )}

        {!isForgotPassword && (
          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
        )}

        <div className="flex flex-col gap-3 items-center justify-center w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary w-full py-2 rounded-md text-white hover:bg-primary-dark focus:outline-none disabled:opacity-50"
          >
            {isLoading
              ? state === "Sign Up"
                ? "Signing Up..."
                : "Logging In..."
              : state === "Sign Up"
              ? "Sign Up"
              : "Login"}
          </button>
          <button
            type="button"
            onClick={() => {
              setState((prev) => (prev === "Sign Up" ? "Login" : "Sign Up"));
              setName("");
              setEmail("");
              setPassword("");
              setIsForgotPassword(false);
              setOtpSent(false);
              setOtp("");
              setResetPassword("");
            }}
            className="text-sm text-primary focus:outline-none"
          >
            {state === "Sign Up"
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsForgotPassword((prev) => !prev);
              setName("");
              setEmail("");
              setPassword("");
              setOtpSent(false);
              setOtp("");
              setResetPassword("");
            }}
            className="text-sm text-primary focus:outline-none"
          >
            {isForgotPassword ? "Back to Login" : "Forgot Password?"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
