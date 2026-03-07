import React from "react";

const Services = () => {
  return (
    <div className="text-white p-10">

      <h1 className="text-4xl font-bold text-center mb-10">Our Services</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#1f1f1f] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-3">Wedding Planning</h2>
          <p>Complete wedding management and decoration.</p>
        </div>

        <div className="bg-[#1f1f1f] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-3">Birthday Parties</h2>
          <p>Theme based birthday celebrations.</p>
        </div>

        <div className="bg-[#1f1f1f] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-3">Corporate Events</h2>
          <p>Professional company events.</p>
        </div>

      </div>

    </div>
  );
};

export default Services;