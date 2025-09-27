import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookie from 'js-cookie';

function MyAccounts() {
  const cookieVal = Cookie.get('email');
  const navigate = useNavigate();
  const [Name, setName] = useState('');

  useEffect(() => {
    if (cookieVal) {
      setName(cookieVal.split('@')[0]);
    }
  }, [cookieVal]);

  const logOut = () => {
    Cookie.remove('email');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 px-6 py-12">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 text-center">
        <h1 className="text-2xl font-bold text-orange-700 mb-2">Hello 👋, {Name}</h1>
        <p className="text-gray-600 mb-6">Your email: <span className="font-medium">{cookieVal}</span></p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/Orders" className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-4 rounded-lg shadow-md transition duration-300 text-sm font-semibold flex flex-col items-center">
            <i className="fa-solid fa-box text-xl mb-2"></i>
            Your Orders
          </Link>
          <Link to="/Cart" className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-4 rounded-lg shadow-md transition duration-300 text-sm font-semibold flex flex-col items-center">
            <i className="fa-solid fa-cart-plus text-xl mb-2"></i>
            Your Cart
          </Link>
        </div>

        <button
          onClick={logOut}
          className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-md text-sm transition duration-300"
        >
          <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default MyAccounts;
