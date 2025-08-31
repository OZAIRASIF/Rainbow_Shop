"use client";

import { useState } from "react";
import axios from "axios";
import "@/styles/Auth.css"; // adjust if your css path is different

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.msg || "OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP & reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      setMessage(res.data.msg || "Password reset successful!");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error resetting password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn">Reset Password</button>
          </form>
        )}

        <p className="auth-message">{message}</p>
      </div>
    </div>
  );
}
