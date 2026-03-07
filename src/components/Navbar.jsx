import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#0f172a] text-white px-10 py-4 flex justify-between items-center shadow-md">

      {/* Logo */}

      <h1 className="text-2xl font-bold text-pink-500">
        Abhinandan Events
      </h1>

      {/* Menu */}

      <div className="flex gap-6 items-center">

        <Link to="/" className="hover:text-pink-400">
          Home
        </Link>

        <Link to="/about" className="hover:text-pink-400">
          About
        </Link>

        <Link to="/contact" className="hover:text-pink-400">
          Contact
        </Link>

        <Link to="/vendor-register" className="hover:text-pink-400">
          Vendor Register
        </Link>

        <Link
          to="/login"
          className="bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Login
        </Link>

      </div>

    </nav>
  );
};

export default Navbar;