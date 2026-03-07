import React from "react";

const Plannerdashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-3xl font-bold mb-6">
        Vendor Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-gray-900 p-6 rounded">
          Event Requests
        </div>

        <div className="bg-gray-900 p-6 rounded">
          Manage Services
        </div>

        <div className="bg-gray-900 p-6 rounded">
          Earnings
        </div>

      </div>

    </div>
  );
};

export default Plannerdashboard;