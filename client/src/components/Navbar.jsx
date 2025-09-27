import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';

function Navbar() {
  const cookieVal = Cookie.get('email');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleCookie = (e) => {
    if (!cookieVal) {
      e.preventDefault();
      toast.error('Please login to continue');
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
    } else {
      toast.error('Please enter a query to search');
    }
  };

  return (
    <div className="bg-orange-100 shadow-md px-6 py-3 flex items-center justify-between flex-wrap" id='navbar'>
      {/* Logo */}
      <div className="flex items-center space-x-3">
        {/* <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" /> */}
        <Link to={cookieVal ? '/pageChange' : ''} className="text-orange-700 font-bold text-xl hover:text-orange-900">
          <i className="fa-solid fa-house"></i>
        </Link>
      </div>

      {/* Delivery Info */}
      <div className="hidden sm:flex flex-col text-gray-700 text-sm mx-3">
        <p className="font-medium">Delivery within</p>
        <div className="flex items-center space-x-1 text-orange-600">
          <i className="fa-solid fa-location-dot"></i>
          <p>Aditya University</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={searchSubmit} className="flex items-center w-full sm:w-auto bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm focus-within:ring-2 ring-orange-400">
        <input
          type="text"
          placeholder="Search your food"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none flex-grow px-2 py-1 bg-transparent text-gray-700"
        />
        <button type="submit" className="text-orange-600 hover:text-orange-800">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      {/* Nav Links */}
      <div className="flex items-center space-x-6 text-sm text-orange-700 font-medium mt-3 sm:mt-0">
        <Link to={cookieVal ? '/Orders' : ''} className="hover:text-orange-900 transition duration-200">
          Orders
        </Link>

        <Link
          to={cookieVal === 'settys.venkataramana@gmail.com' ? '/AdminPage' : '/MyAccounts'}
          onClick={handleCookie}
          className="hover:text-orange-900 transition duration-200"
        >
          Account/Login
        </Link>

        <Link to="/cart" className="text-orange-600 text-xl hover:text-orange-900">
          <i className="fa-solid fa-cart-plus"></i>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
