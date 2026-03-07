import React from "react";

const Admindashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-gray-900 p-6 rounded">
          Total Users
        </div>

        <div className="bg-gray-900 p-6 rounded">
          Total Vendors
        </div>

        <div className="bg-gray-900 p-6 rounded">
          Total Bookings
        </div>

        <div className="bg-gray-900 p-6 rounded">
          Approve Vendors
        </div>

      </div>

    </div>
  );
};

export default Admindashboard;