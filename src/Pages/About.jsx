import React from "react";

const About = () => {
  return (
    <div className="text-white p-10">

      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

      <p className="text-center max-w-3xl mx-auto mb-10 text-gray-300">
        Abhinandan Events is a professional event planning platform that helps
        people organize weddings, birthday parties, corporate events and many
        other celebrations with trusted planners, decorators and vendors.
        Our mission is to make every event memorable and stress-free.
      </p>

      {/* TEAM SECTION */}

      <h2 className="text-3xl font-semibold text-center mb-10">
        Meet Our Team
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {/* CEO */}

        <div className="bg-[#1e293b] p-6 rounded-xl text-center hover:scale-105 transition">

          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />

          <h2 className="text-xl font-bold">Shivam Singh</h2>

          <p className="text-pink-400">Founder & CEO</p>

          <p className="text-gray-400 text-sm mt-2">
            Visionary behind Abhinandan Events, focused on building a
            modern event planning platform.
          </p>

        </div>

        {/* Event Manager */}

        <div className="bg-[#1e293b] p-6 rounded-xl text-center hover:scale-105 transition">

          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />

          <h2 className="text-xl font-bold">Ananya Sharma</h2>

          <p className="text-pink-400">Event Director</p>

          <p className="text-gray-400 text-sm mt-2">
            Expert in organizing weddings, corporate events and
            large-scale celebrations.
          </p>

        </div>

        {/* Creative Head */}

        <div className="bg-[#1e293b] p-6 rounded-xl text-center hover:scale-105 transition">

          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />

          <h2 className="text-xl font-bold">Rahul Verma</h2>

          <p className="text-pink-400">Creative Head</p>

          <p className="text-gray-400 text-sm mt-2">
            Designs event themes, decorations and creative concepts
            for unforgettable experiences.
          </p>

        </div>

      </div>

    </div>
  );
};

export default About;