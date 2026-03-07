import React from "react";

const Clientdashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-3xl font-bold mb-6">
        Client Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-gray-900 p-6 rounded">
          Book Event
        </div>

        <div className="bg-gray-900 p-6 rounded">
          My Bookings
        </div>

        <div className="bg-gray-900 p-6 rounded">
          Saved Vendors
        </div>

      </div>

    </div>
  );
};

export default Clientdashboard;