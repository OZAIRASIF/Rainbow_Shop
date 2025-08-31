"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "@/styles/CheckoutPage.css";

export default function CheckoutPage() {
  const [billing, setBilling] = useState({
    full_name: "",
    address: "",
    city: "",
    zipcode: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        billing_info: {
          full_name: String(billing.full_name),
          address: String(billing.address),
          city: String(billing.city),
          zipcode: String(billing.zipcode),
        },
      };

      // ✅ send cookie automatically
      await axios.post("/api/checkout", payload, { withCredentials: true });

      setMessage("Order placed successfully!");
      setBilling({ full_name: "", address: "", city: "", zipcode: "" });
    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.status === 401) setMessage("Please login to checkout.");
      else setMessage("Checkout failed.");
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <h2>Checkout</h2>
      <form onSubmit={handleCheckout} className="checkout-form">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={billing.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={billing.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={billing.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="zipcode"
          placeholder="Zip Code"
          value={billing.zipcode}
          onChange={handleChange}
          required
        />
        <button type="submit">Confirm & Buy</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
