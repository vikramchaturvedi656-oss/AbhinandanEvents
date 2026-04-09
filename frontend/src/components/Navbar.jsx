import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaCalendarCheck,
  FaUserPlus,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ USER STATE (MATCH LOGIN KEY)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ae_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ✅ SYNC USER (LOGIN / LOGOUT / OTHER TAB)
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("ae_user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("userLogin", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userLogin", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // ✅ CLOSE DROPDOWN (OUTSIDE CLICK + ESC)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("ae_user");
    localStorage.removeItem("token");

    setUser(null);
    setDropdownOpen(false);

    // 🔥 trigger sync (same tab)
    window.dispatchEvent(new Event("userLogin"));

    navigate("/");
  };

  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "?";

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0f172a] text-white px-10 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* LOGO */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-pink-500 cursor-pointer"
      >
        Abhinandan Events
      </h1>

      {/* MENU */}
      <div className="flex gap-6 items-center">

        <Link to="/" className={isActive("/") ? "text-pink-400" : "hover:text-pink-400"}>
          Home
        </Link>
        <Link to="/about" className={isActive("/about") ? "text-pink-400" : "hover:text-pink-400"}>
          About
        </Link>
        <Link to="/contact" className={isActive("/contact") ? "text-pink-400" : "hover:text-pink-400"}>
          Contact
        </Link>
        <Link to="/vendor-register" className="hover:text-pink-400">
          Vendor Register
        </Link>

        {/* 🔽 DROPDOWN */}
        <div className="relative" ref={dropdownRef}>

          {/* BUTTON */}
          {user ? (
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-pink-500 flex items-center justify-center font-bold">
                {firstLetter}
              </div>
              <FaChevronDown
                className={`text-xs transition ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2"
            >
              Sign In
              <FaChevronDown
                className={`text-xs transition ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {/* DROPDOWN MENU */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] rounded-xl shadow-lg border border-white/10">

              {/* USER INFO */}
              {user && (
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              )}

              <ul className="py-1">

                {user ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/5"
                      >
                        <FaUser /> Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/5"
                      >
                        <FaCalendarCheck /> My Events
                      </Link>
                    </li>

                    <li className="border-t border-white/10 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/5"
                      >
                        <FaUser /> Login
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/signup"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/5"
                      >
                        <FaUserPlus /> Sign Up
                      </Link>
                    </li>
                  </>
                )}

              </ul>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;