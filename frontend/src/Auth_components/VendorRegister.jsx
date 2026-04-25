import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ORIGIN } from "../utils/config";

function VendorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    service: "",
    country: "India",
    state: "",
    city: "",
    gender: "",
    idCard: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔥 Handle file upload with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // File size check (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB.");
      return;
    }

    // Allowed types
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, or PDF files are allowed.");
      return;
    }

    setFormData({ ...formData, idCard: file });
    setError("");
  };

  // 🔥 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔥 VALIDATION
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.businessName ||
      !formData.service ||
      !formData.state ||
      !formData.city ||
      !formData.gender
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!formData.idCard) {
      setError("Please upload an identity card.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      // Append all fields
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      const res = await fetch(
        `${API_ORIGIN}/api/vendor/register`,
        {
          method: "POST",
          body: payload
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Vendor registered successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 sm:p-10">

        <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Vendor Registration
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input className="input" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />

          <input className="input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

          <input className="input" type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />

          <input className="input" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />

          <select className="input" name="service" value={formData.service} onChange={handleChange} required>
            <option value="">Select Event Service</option>
            <option value="Photographer">Photographer</option>
            <option value="Decorator">Decorator</option>
            <option value="Caterer">Caterer</option>
            <option value="DJ">DJ</option>
            <option value="Wedding Planner">Wedding Planner</option>
          </select>

          <select className="input" name="country" value={formData.country} onChange={handleChange}>
            <option value="India">India</option>
            <option value="Nepal">Nepal</option>
            <option value="USA">USA</option>
          </select>

          <select className="input" name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select State</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>

          <input className="input" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />

          <select className="input" name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* 🔥 FILE UPLOAD */}
          <div className="mb-3">
            <label className="text-sm text-gray-400">
              Upload Identity Card (JPG, PNG, PDF | Max 2MB)
            </label>
            <input
              type="file"
              className="input"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register as Vendor"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default VendorRegister;
