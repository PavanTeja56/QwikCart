import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || {};
  const email = Cookie.get("email");

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [pay,setPay]=useState(0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty");
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!address.name || !address.addressLine || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/placeOrder", {
        userEmail: email,
        items: cartItems,
        deliveryAddress: address,
        totalAmount,
        payment:pay
      });

      if (res.data.success) {
        toast.success("Ordered successfully!");
        navigate("/orders");
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong!");
    }
  };

  // 👉 Mapping field names to placeholder labels
  const fieldLabels = {
    name: "Full Name",
    phone: "Phone Number",
    addressLine: "Block Name",   
    city: "Room number",
    state: "Floor number",
    pincode: "nearby address"
  };

  return (
    <div className="order-form-container">
      <h2 className="form-title">Delivery Address</h2>
      <div className="form-fields">
        {Object.keys(fieldLabels).map((field) => (
          <input
            key={field}
            name={field}
            value={address[field]}
            type="text"
            onChange={handleChange}
            placeholder={fieldLabels[field]}
            className="form-input"
            required
          />
        ))}
        
        
        <div>
          <label htmlFor="payment" required>Select payment option:</label>
          <div className="flex gap-4 mt-2">
            <label>
              <input type="radio" name="payment" value="COD" onClick={()=>{setPay(1)}}d/> COD
            </label>
            <label>
              <input type="radio" name="payment" value="UPI" disabled onClick={()=>{setPay(0)}} /> UPI
            </label>
          </div>
        </div>

        <button onClick={handlePlaceOrder} className="place-order-button">Place Order</button>
      </div>
    </div>
  );
}

export default PlaceOrder;
