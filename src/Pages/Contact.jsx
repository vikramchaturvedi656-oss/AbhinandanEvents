import React from "react";

const Contact = () => {
  return (
    <div className="text-white p-10">

      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

      <div className="max-w-xl mx-auto">

        <input className="input" placeholder="Your Name" />
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Phone Number" />

        <textarea
          className="input h-32"
          placeholder="Your Message"
        ></textarea>

        <button className="bg-pink-500 px-6 py-3 rounded-lg w-full hover:bg-pink-600">
          Send Message
        </button>

      </div>

    </div>
  );
};

export default Contact;