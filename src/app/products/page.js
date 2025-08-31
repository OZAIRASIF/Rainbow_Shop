"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "@/styles/ProductsPage.css";

function ProductCard({ product, onAddToCart }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const nextImg = () =>
    setImgIndex((prev) => (prev + 1) % product.images.length);
  const prevImg = () =>
    setImgIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  const handleQuantityChange = (delta) =>
    setQuantity((prev) => Math.max(1, prev + delta));

  return (
    <div className="product-card">
      <div className="image-slider">
        <button className="arrow-btn" onClick={prevImg}>◀</button>
        <img
          src={product.images[imgIndex]}
          alt={product.name}
          onClick={() => window.open(product.product_url, "_blank")}
        />
        <button className="arrow-btn" onClick={nextImg}>▶</button>
      </div>
      <h3 onClick={() => window.open(product.product_url, "_blank")}>
        {product.name}
      </h3>
      <p className="price">{product.price}</p>
      <p className="desc">{product.description}</p>

      <div className="product-actions">
        <div className="quantity-selector">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
        <button
          className="add-btn"
          onClick={() => onAddToCart({ ...product, quantity })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState({ visible: false, message: "", product: null });
  const router = useRouter();

  // Fetch products after component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products", { withCredentials: true });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        "/api/cart/add",
        { product_id: product._id, quantity: product.quantity || 1 },
        { withCredentials: true } // sends HTTP-only cookie automatically
      );

      setPopup({ visible: true, message: `${product.name} added to cart`, product });
    } catch (err) {
      setPopup({ visible: true, message: "Failed to add to cart", product: null });
    }
  };

const handleLogout = async () => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    // Redirect to login page
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  return (
    <div className="products-page">
      <Navbar />
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {/* Popup for cart actions */}
      {popup.visible && (
        <div className="cart-popup">
          <p>{popup.message}</p>
          <div className="popup-buttons">
            <button onClick={() => setPopup({ ...popup, visible: false })}>OK</button>
            {popup.product && (
              <button onClick={() => router.push("/cart")}>Go to Cart</button>
            )}
          </div>
        </div>
      )}

      {/* <button className="logout-btn" onClick={handleLogout}>Logout</button> */}
    </div>
  );
}
