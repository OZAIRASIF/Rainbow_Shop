"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext"; // adjust path to your context
import "@/styles/Navbar.css";
import axios from "axios"; // ✅ add this

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuth();

 const handleLogout = async () => {
  await axios.post("/api/auth/logout", {}, { withCredentials: true });
  window.location.href = "/login";
};

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">My Store</h2>
      </div>
      <div className="navbar-right">
        <Link href="/products" className="nav-link">Products</Link>
        <Link href="/cart" className="nav-link">Cart</Link>
        <Link href="/checkout" className="nav-link">Checkout</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
