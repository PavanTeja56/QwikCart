import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const email = Cookie.get('email');
      try {
        const res = await axios.get(`http://localhost:8000/getCart?email=${email}`);
        if (res.data.success) setCartItems(res.data.items);
      } catch {
        toast.error("Load failed");
      }finally{
      setLoading(false);
    }
    };
    fetch();
  }, []);

  const updateQty = async (productId, newQty) => {
    const email = Cookie.get('email');
    try {
      const res = await axios.post(`http://localhost:8000/updateCartItem`, {
        userEmail: email,
        productId,
        quantity: newQty
      });
      if (res.data.success) setCartItems(res.data.items);
    } catch {
      toast.error("Update failed");
    }
  };

  const removeItem = async (productId) => {
    const email = Cookie.get('email');
    try {
      const res = await axios.post(`http://localhost:8000/removeCartItem`, {
        userEmail: email,
        productId
      });
      if (res.data.success) setCartItems(res.data.items);
    } catch {
      toast.error("Remove failed");
    }
    
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if(loading){
    return <div className="cart-empty">
    <div className="loader">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
    </div>;
  }
  if (cartItems.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-list">
        {cartItems.map(item => (
          <div key={item.productId} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-image" onClick={()=>navigate(`/product/${item.productId}`)}/>
            <div className="cart-details">
              <h3 className="cart-name" onClick={()=>navigate(`/product/${item.productId}`)}>{item.name}</h3>
              <p className="cart-price">₹{item.price}</p>
              <div className="cart-qty-controls">
                <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="qty-btn">−</button>
                <span className="qty-display">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="qty-btn">+</button>
              </div>
              <button onClick={() => removeItem(item.productId)} className="remove-btn">Remove</button>
              <p className="cart-subtotal">Subtotal: ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <h3 className="cart-total">Total: ₹{total}</h3>
        <button
          className="cart-checkout"
          onClick={() => navigate('/place-order', {
            state: {
              cartItems,
              totalAmount: total
            }
          })}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;

