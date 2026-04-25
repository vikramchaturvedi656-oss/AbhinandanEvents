import React from "react";

const About = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 sm:py-14">

      <h1 className="mb-6 text-center text-3xl font-bold sm:text-4xl">About Us</h1>

      <p className="mx-auto mb-10 max-w-3xl text-center text-sm text-gray-300 sm:text-base">
        Abhinandan Events is a professional event planning platform that helps
        people organize weddings, birthday parties, corporate events and many
        other celebrations with trusted planners, decorators and vendors.
        Our mission is to make every event memorable and stress-free.
      </p>

      {/* TEAM SECTION */}

      <h2 className="mb-10 text-center text-2xl font-semibold sm:text-3xl">
        Meet Our Team
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {/* CEO */}

        <div className="rounded-xl bg-[#1e293b] p-6 text-center transition hover:scale-105">

          <img
            src="https://avatars.githubusercontent.com/u/166223452?s=400&u=fac6caef71d18d34f5799d8deacb7e77059152de&v=4"
            className="mx-auto mb-4 h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
          />

          <h2 className="text-xl font-bold">Altamash Malik</h2>

          <p className="text-pink-400">Founder & CEO</p>

          <p className="text-gray-400 text-sm mt-2">
            Visionary behind Abhinandan Events, focused on building a
            modern event planning platform.
          </p>

        </div>

        {/* Event Manager */}

        <div className="rounded-xl bg-[#1e293b] p-6 text-center transition hover:scale-105">

          <img
            src="https://avatars.githubusercontent.com/u/230208633?v=4"
            className="mx-auto mb-4 h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
          />

          <h2 className="text-xl font-bold">Vikram Kumar Chaturvedi</h2>

          <p className="text-pink-400">Event Director</p>

          <p className="text-gray-400 text-sm mt-2">
            Expert in organizing weddings, corporate events and
            large-scale celebrations.
          </p>

        </div>

      </div>

    </div>
  );
};

export default About;
