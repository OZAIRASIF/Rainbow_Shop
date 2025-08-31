"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "@/styles/CartPage.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    try {
      // ✅ send HTTP-only cookie automatically
      const res = await axios.get("/api/cart", { withCredentials: true });
      setCartItems(res.data.items || []);
      if ((res.data.items || []).length === 0) setMessage("No items in cart");
      else setMessage("");
    } catch (err) {
      setMessage("Please login to view your cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.post(
        "/api/cart/remove",
        { product_id: productId, quantity: 1 },
        { withCredentials: true }
      );
      setCartItems(cartItems.filter((item) => item.product_id !== productId));
      if (cartItems.length === 1) setMessage("No items in cart");
    } catch (err) {
      setMessage("Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.-]+/g, ""));
    return acc + cleanPrice * (item.quantity || 1);
  }, 0);

  return (
    <div className="cart-page">
      <Navbar />
      <h2>Your Cart</h2>
      {message && <p>{message}</p>}

      {cartItems.length > 0 && (
        <div className="cart-list">
          {cartItems.map((item, index) => (
            <div key={item.product_id || index} className="cart-item">
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>
                Total: $
                {parseFloat(item.price.toString().replace(/[^0-9.-]+/g, "")) *
                  (item.quantity || 1)}
              </p>
              <button onClick={() => handleRemove(item.product_id)}>Remove</button>
            </div>
          ))}
          <h3 className="cart-total">Cart Total: ${totalPrice.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}
