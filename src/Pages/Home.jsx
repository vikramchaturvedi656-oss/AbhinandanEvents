import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Home = () => {
  return (
    <div className="text-white bg-[#0f172a]">

      {/* HERO SECTION */}
<section
  className="h-screen flex items-center justify-center text-center"
  style={{
    backgroundImage:
      "url(https://images.unsplash.com/photo-1505236858219-8359eb29e329)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
      >
        <div className="bg-black/70 p-12 rounded-xl max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">
            Plan Your Dream Event
          </h1>

          <p className="text-lg text-gray-300 mb-8">
            Find the best planners, vendors and venues for weddings,
            birthdays, corporate events and more.
          </p>

          <Link to="/signup">
            <button className="bg-pink-500 px-8 py-3 rounded-lg hover:bg-pink-600 text-lg">
              Signup
            </button>
          </Link>
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="py-20 px-10">

        <h2 className="text-4xl font-bold text-center mb-14">
          Explore Event Categories
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">

          <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552"
              className="h-40 w-full object-cover"
            />
            <h3 className="p-4 text-center font-semibold">Wedding</h3>
          </div>

          <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3"
              className="h-40 w-full object-cover"
            />
            <h3 className="p-4 text-center font-semibold">Birthday</h3>
          </div>

          <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
              className="h-40 w-full object-cover"
            />
            <h3 className="p-4 text-center font-semibold">Corporate</h3>
          </div>

          <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
              className="h-40 w-full object-cover"
            />
            <h3 className="p-4 text-center font-semibold">Concert</h3>
          </div>

          <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce"
              className="h-40 w-full object-cover"
            />
            <h3 className="p-4 text-center font-semibold">Private Party</h3>
          </div>

        </div>

      </section>

      {/* FEATURED VENDORS */}

      <section className="bg-[#1e293b] py-20 px-10">

        <h2 className="text-4xl font-bold text-center mb-14">
          Featured Vendors
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Vendor 1 */}
          <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1505236858219-8359eb29e329"
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold">Royal Wedding Planners</h3>
              <p className="text-gray-400 text-sm">Wedding Planner</p>
              <p className="text-gray-400 text-sm">8 Years Experience</p>

              <div className="flex items-center gap-2 mt-2">
                <FaStar className="text-yellow-400" />
                4.8
              </div>

              <button className="mt-4 w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
                Book Vendor
              </button>
            </div>
          </div>

          {/* Vendor 2 */}

          <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033"
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold">Elite Catering</h3>
              <p className="text-gray-400 text-sm">Catering Service</p>
              <p className="text-gray-400 text-sm">10 Years Experience</p>

              <div className="flex items-center gap-2 mt-2">
                <FaStar className="text-yellow-400" />
                4.6
              </div>

              <button className="mt-4 w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
                Book Vendor
              </button>
            </div>
          </div>

          {/* Vendor 3 */}

          <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold">Moments Photography</h3>
              <p className="text-gray-400 text-sm">Photography</p>
              <p className="text-gray-400 text-sm">5 Years Experience</p>

              <div className="flex items-center gap-2 mt-2">
                <FaStar className="text-yellow-400" />
                4.9
              </div>

              <button className="mt-4 w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
                Book Vendor
              </button>
            </div>
          </div>

          {/* Vendor 4 */}

          <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754"
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold">DJ Night Beats</h3>
              <p className="text-gray-400 text-sm">DJ Services</p>
              <p className="text-gray-400 text-sm">7 Years Experience</p>

              <div className="flex items-center gap-2 mt-2">
                <FaStar className="text-yellow-400" />
                4.7
              </div>

              <button className="mt-4 w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
                Book Vendor
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* TESTIMONIALS */}

      <section className="py-20 px-10">

        <h2 className="text-4xl font-bold text-center mb-14">
          What Our Clients Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-[#1e293b] p-6 rounded-xl">
            <p className="text-gray-300 mb-4">
              Abhinandan Events planned my wedding perfectly.
              Everything was organized beautifully.
            </p>
            <h4 className="font-semibold">Ananya Sharma</h4>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-xl">
            <p className="text-gray-300 mb-4">
              Great vendors and amazing event management.
              Highly recommended platform.
            </p>
            <h4 className="font-semibold">Rahul Verma</h4>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-xl">
            <p className="text-gray-300 mb-4">
              Our corporate event was handled professionally.
              Fantastic experience.
            </p>
            <h4 className="font-semibold">Priya Kapoor</h4>
          </div>

        </div>

      </section>

      {/* CTA SECTION */}

      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-20 text-center">

        <h2 className="text-4xl font-bold mb-6">
          Ready to Plan Your Event?
        </h2>

        <p className="mb-8 text-lg">
          Join Abhinandan Events and connect with the best planners and vendors.
        </p>

        <Link to="/signup">
          <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105">
            Create Account
          </button>
        </Link>

      </section>

    </div>
  );
};

export default Home;