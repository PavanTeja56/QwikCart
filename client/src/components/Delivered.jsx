import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Delivered() {
  const [productId, setProductId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOtp = async () => {
    if (!productId) {
      toast.error("Please enter product ID");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/delivery-otp", {
        productId,
      });

      if (res.data.message === "OTP sent to canteen") {
        toast.success("✅ OTP sent to canteen email!");
        setOtpSent(true);
      } else {
        toast.error("❌ Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !productId) {
      toast.error("Please enter OTP and Product ID");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/verify-otp", {
        productId,
        otp,
      });

      if (res.data.success) {
        toast.success("✅ Order marked as Delivered!");
      } else {
        toast.error("❌ Invalid OTP or expired");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while verifying OTP");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>

      <label className="block mb-2 font-medium">Product ID:</label>
      <input
        type="text"
        placeholder="Enter product ID"
        className="border p-2 w-full mb-4 rounded"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      {!otpSent && (
        <button
          onClick={handleSendOtp}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full mb-4"
        >
          Send OTP to Canteen
        </button>
      )}

      {otpSent && (
        <>
          <label className="block mb-2 font-medium">Enter OTP:</label>
          <input
            type="number"
            placeholder="Enter OTP here"
            className="border p-2 w-full mb-4 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={handleVerifyOtp}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

export default Delivered;
