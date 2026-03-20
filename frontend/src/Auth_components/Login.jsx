import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginType: "Client" // 🔥 default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      redirectUser(user.role);
    }
  }, []);

  const redirectUser = (role) => {
    if (role === "Admin") navigate("/admin-dashboard");
    else if (role === "Vendor") navigate("/planner-dashboard");
    else navigate("/client-dashboard");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 VALIDATION
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          loginType: formData.loginType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // 🔥 STORE AUTH DATA
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 REDIRECT BASED ON ROLE
      redirectUser(data.user.role);

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] p-10 rounded-xl w-[420px]">

        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Login to Abhinandan Events
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* 🔥 ROLE SELECT (default selected) */}
          <select
            className="input"
            name="loginType"
            value={formData.loginType}
            onChange={handleChange}
          >
            <option value="Client">Client</option>
            <option value="Vendor">Vendor</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 py-3 rounded-lg text-white font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-gray-400 mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-400">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;