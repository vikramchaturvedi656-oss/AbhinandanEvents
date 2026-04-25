import React from "react";

const Services = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 sm:py-14">

      <h1 className="mb-10 text-center text-3xl font-bold sm:text-4xl">Our Services</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-xl bg-[#1f1f1f] p-6">
          <h2 className="text-xl font-bold mb-3">Wedding Planning</h2>
          <p>Complete wedding management and decoration.</p>
        </div>

        <div className="rounded-xl bg-[#1f1f1f] p-6">
          <h2 className="text-xl font-bold mb-3">Birthday Parties</h2>
          <p>Theme based birthday celebrations.</p>
        </div>

        <div className="rounded-xl bg-[#1f1f1f] p-6">
          <h2 className="text-xl font-bold mb-3">Corporate Events</h2>
          <p>Professional company events.</p>
        </div>

      </div>

    </div>
  );
};

export default Services;
