function VendorRegister() {
  return (

    <div className="min-h-screen bg-black text-white flex justify-center items-center">

      <div className="bg-zinc-900 p-10 rounded-xl w-[420px]">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Vendor Registration
        </h2>

        <form>

          <input className="input" placeholder="Full Name" />

          <input className="input" placeholder="Email" />

          <input className="input" placeholder="Phone Number" />

          <input className="input" placeholder="Business Name" />

          <select className="input">
            <option>Select Event Service</option>
            <option>Photographer</option>
            <option>Decorator</option>
            <option>Caterer</option>
            <option>DJ</option>
            <option>Wedding Planner</option>
          </select>

          <select className="input">
            <option>Select Country</option>
            <option>India</option>
            <option>Nepal</option>
            <option>USA</option>
          </select>

          <select className="input">
            <option>Select State</option>
            <option>Uttar Pradesh</option>
            <option>Delhi</option>
            <option>Maharashtra</option>
          </select>

          <input className="input" placeholder="City" />

          <select className="input">
            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <div className="mb-3">
            <label className="text-sm text-gray-400">
              Upload Identity Card
            </label>

            <input type="file" className="input" />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg mt-3">
            Register as Vendor
          </button>

        </form>

      </div>

    </div>
  );
}

export default VendorRegister;