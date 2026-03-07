import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
    </div>
  );
};

export default Loader;