"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/Auth.css"; // adjust path if needed

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password validation (min 8 chars + special char)
    const regex = /^(?=.*[!@#$%^&*]).{8,}$/;
    if (!regex.test(newPassword)) {
      setMessage("Password must be at least 8 characters and contain one special character.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });

      alert("✅ " + (res.data.msg || "Password reset successful!"));
      router.push("/login"); // ✅ redirect in Next.js
    } catch (err) {
      setMessage(err.response?.data?.detail || "❌ Password reset failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Reset Password</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
