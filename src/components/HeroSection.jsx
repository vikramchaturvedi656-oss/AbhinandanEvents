const HeroSection = () => {
  return (
    <div
      className="h-[80vh] flex items-center justify-center text-white text-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1519741497674-611481863552)",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-black/60 p-10 rounded-xl">
        <h1 className="text-5xl font-bold mb-4">
          Plan Your Dream Event
        </h1>

        <p className="mb-6">
          Find the best planners and vendors for your special moments
        </p>

        <button className="bg-pink-500 px-6 py-3 rounded-lg">
          Explore Events
        </button>
      </div>
    </div>
  );
};

export default HeroSection;