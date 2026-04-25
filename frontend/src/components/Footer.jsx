import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 pt-12 pb-6">

      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-10">

        {/* Company Info */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            Abhinandan Events
          </h2>

          <p className="text-sm leading-6">
            Your trusted platform for planning weddings, birthdays,
            corporate events and private parties with the best vendors.
          </p>
        </div>

        {/* Quick Links */}

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Vendor */}

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Vendors
          </h3>

          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Wedding Planner</li>
            <li className="hover:text-white cursor-pointer">Catering</li>
            <li className="hover:text-white cursor-pointer">Photography</li>
            <li className="hover:text-white cursor-pointer">DJ Services</li>
          </ul>
        </div>

        {/* Contact */}

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Contact
          </h3>

          <div className="space-y-3">

            <p className="flex items-center gap-2">
              <FaPhone /> +91 7321948905
            </p>

            <p className="flex items-center gap-2">
              <FaEnvelope /> altamashmalik369@gmail.com
            </p>

          </div>

          {/* Social Icons */}

          <div className="flex gap-4 mt-5 text-xl">

            <FaFacebook className="cursor-pointer hover:text-white" />
            <FaInstagram className="cursor-pointer hover:text-white" />
            <FaTwitter className="cursor-pointer hover:text-white" />

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">

        © 2026 Abhinandan Events. All Rights Reserved.

      </div>

    </footer>
  );
};

export default Footer;