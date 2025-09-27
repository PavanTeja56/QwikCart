import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate,Link  } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const email = Cookie.get('email');
      if (!email) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/getOrders?email=${email}`);
        if (res.data.success) setOrders(res.data.orders);
      } catch (error) {
        toast.error("Failed to load orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-12 bg-orange-400 rounded"></div>
          <div className="w-3 h-12 bg-orange-500 rounded"></div>
          <div className="w-3 h-12 bg-orange-600 rounded"></div>
          <div className="w-3 h-12 bg-orange-500 rounded"></div>
          <div className="w-3 h-12 bg-orange-400 rounded"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-center text-gray-500 text-xl mt-10">No orders found.</div>;
  }

  const formatAddress = (address) => {
    if (!address) return "Address not available";
    return `${address.name}, ${address.addressLine}, ${address.city}, ${address.state} ${address.pincode}`;
  };


  const cancelOrder = async (orderId) => {
  try {
    const res = await axios.post('http://localhost:8000/cancelOrder', { orderId });
    if (res.data.success) {
      toast.success("Order cancelled!");
      // Refresh orders list after cancellation
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } else {
      toast.error(res.data.message || "Failed to cancel order");
    }
  } catch (err) {
    console.error("❌ Error cancelling order:", err);
    toast.error("Something went wrong");
  }
};


  const deliveredOrder = async (orderId) => {
  try {
    const res = await axios.post('http://localhost:8000/deliveredOrder', { orderId });
    if (res.data.success) {
      toast.success("Order deliverd confirmed!");
      // Refresh orders list after cancellation
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: "Delivered" } : order
        )
      );
    } else {
      toast.error(res.data.message || "Failed to confirm order");
    }
  } catch (err) {
    console.error("❌ Error delivering order:", err);
    toast.error("Something went wrong");
  }
};



  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-orange-50 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-700 mb-8 text-center">Your Order History</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white shadow-lg rounded-xl p-6 mb-8 transition-transform hover:scale-[1.01]"
        >
          {/* Order Header */}
          <div className="mb-4">
            <p className="text-sm text-gray-700"><strong>Order ID:</strong> {order._id.toString().slice(-8).toUpperCase()}</p>
            <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-700"><strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
          </div>

          {/* Order Items */}
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div
                key={`${order._id}-${item.productId}`}
                className="flex flex-wrap items-center py-4 gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                  onError={(e) => { e.target.src = '/placeholder-product-image.png'; }}
                />
                <div className="flex-1">
                  <h3
                    className="font-semibold text-lg text-orange-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-700">Price: ₹{item.price?.toFixed(2)}</p>
                  <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-700">Subtotal: ₹{(item.price * item.quantity)?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="mt-4 bg-orange-100 p-3 rounded-md text-sm text-gray-800">
            <strong>Delivery Address:</strong> {formatAddress(order.deliveryAddress)}
            {order.deliveryAddress?.phone && <span>, Phone: {order.deliveryAddress.phone}</span>}
          </div>

            <div className=" className="mt-4 flex justify-end gap-4>
              <p style={{color:order.status==="Delivered" ? 'green' : order.status==="Cancelled" ?'red' : 'orange'}}>status:{order.status}</p>
              
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transitio mt-2"
         onClick={() => deliveredOrder(order._id)}
        
         disabled={order.status==="Delivered" || order.status==="Cancelled"}
        >Delivered</button>

        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition ml-10 mt-2"
        onClick={() => cancelOrder(order._id)}
        
        disabled={order.status==="Delivered" || order.status==="Cancelled"}
        >Cancelled</button>
      </div>

        </div>
      ))}
      
      
    </div>
  );
}

export default Orders;
