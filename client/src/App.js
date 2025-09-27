import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import HomePage from './components/HomePage';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookie from 'js-cookie';
import MyAccounts from "./components/MyAccounts";
import { useEffect } from "react";
import ForgetPassword from "./components/ForgetPassword";
import AdminPage from "./components/AdminPage";
import AllitemsPage from "./components/AllitemsPage";
import SearchResult from "./components/SearchResult";
import ItemView from "./components/ItemView";
import CartPage from "./components/CartPage";
import PlaceOrder from "./components/PlaceOrder";
import Orders from "./components/Orders";
import Delivered from "./components/Delivered";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  //updating cookie after evry login with evry 1sec check
  const [cookieVal, setCookieVal] = useState(Cookie.get('email'))
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCookie = Cookie.get('email')
      if (updatedCookie !== cookieVal) {
        setCookieVal(updatedCookie);
      }
    }, 1000)
    return () => { clearInterval(interval) }
  }, [cookieVal])

    useEffect(() => {
  const fetchCartItems = async () => {
    const email = Cookie.get('email');
    if (!email) return;

    try {
      const res = await axios.get(`http://localhost:8000/getCart?email=${email}`);
      setCartItems(res.data.items); 
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  fetchCartItems();
}, [cookieVal]);


  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>

          <Route path='/' element={<HomePage />}></Route>
          <Route path='/forgot-password' element={<ForgetPassword />}></Route>
          {cookieVal !== undefined && cookieVal != 'admin@gmail.com' && <Route path='/MyAccounts' element={<MyAccounts />}></Route>}
          <Route path='/AdminPage' element={<AdminPage />}></Route>
          {cookieVal === undefined && <Route path='/' element={<HomePage />}></Route>}
          <Route path='/SignUp' element={<SignUp />}></Route>
          <Route path='/pageChange' element={<AllitemsPage />}></Route>
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/product/:id" element={<ItemView />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/place-order" element={
            <PlaceOrder
              cartItems={cartItems}
              totalAmount={calculateTotal(cartItems)}
              onOrderPlaced={() => setCartItems([])}
            />
          } />
          <Route path="/Orders" element={<Orders />} />
          {/* <Route path="Orders/Delivered" element={<Delivered/>}/> */}
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}
export default App;