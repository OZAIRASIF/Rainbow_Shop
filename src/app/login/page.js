"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/Auth.css";
import Head from "next/head"

// export const metadata = {
//   title: "Rainbow Shop — Login",
//   description: "Login to My Store",
// };

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/login", formData, {
        withCredentials: true, // crucial for sending/receiving cookie
      });

      if (res.status === 200) {
        router.push("/products"); // client-side redirect
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <>
    <Head>
      <title>Rainbow Shop — Login</title>
      <meta name="description" content="Login to Rainbow Shop" />
    </Head>

    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-footer">
          Don’t have an account? <Link href="/signup">Signup</Link>
        </p>
        <p className="auth-footer">
          Forgot password? <Link href="/forgot-password">Reset here</Link>
        </p>
      </div>
    </div>
  </>
);
}
