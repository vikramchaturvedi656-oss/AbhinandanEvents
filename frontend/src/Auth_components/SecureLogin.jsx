import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import { getDashboardPath } from "../utils/session";

function SecureLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginType: "Client",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("ae_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(getDashboardPath(user.role));
      }
    } catch {
      localStorage.removeItem("ae_user");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

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
      const payload = {
        ...formData,
        role: formData.loginType,
      };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      const user = data.user || data;

      if (!user?.email) {
        setError("Invalid user data received from server.");
        return;
      }

      localStorage.setItem("ae_user", JSON.stringify(user));

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      window.dispatchEvent(new Event("userLogin"));
      navigate(getDashboardPath(user.role));
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1e293b] p-10 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Login to Abhinandan Events
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input w-full"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="input w-full"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <select
            className="input w-full"
            name="loginType"
            value={formData.loginType}
            onChange={handleChange}
          >
            <option value="Client">Client</option>
            <option value="Vendor">Vendor</option>
            <option value="Admin">Admin</option>
          </select>

          <p className="text-xs text-slate-400">
            Admin login works only for the approved admin email accounts seeded on
            the server.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SecureLogin;
