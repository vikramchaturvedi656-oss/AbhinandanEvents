import React from "react";

const Contact = () => {
  return (
    <div className="px-4 py-10 text-white sm:px-6 sm:py-14">

      <h1 className="mb-10 text-center text-3xl font-bold sm:text-4xl">Contact Us</h1>

      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-8">

        <input className="input" placeholder="Your Name" />
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Phone Number" />

        <textarea
          className="input h-32"
          placeholder="Your Message"
        ></textarea>

        <button className="w-full rounded-lg bg-pink-500 px-6 py-3 hover:bg-pink-600">
          Send Message
        </button>

      </div>

    </div>
  );
};

export default Contact;
