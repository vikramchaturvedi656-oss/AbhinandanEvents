import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Load user on page load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("ae_user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      setUser(JSON.parse(storedUser));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // ⛔ Prevent rendering before user loads
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] flex justify-center items-center px-4">
      <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl shadow-xl text-white">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2 className="text-xl font-semibold mt-3">{user.name || "User"}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

        {/* DETAILS */}
        <div className="space-y-4">

          {/* ROLE */}
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400 text-sm">Role</span>
            <span className="font-medium text-pink-400">{user.role}</span>
          </div>

          {/* COMMON FIELDS */}
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400 text-sm">User ID</span>
            <span className="font-medium text-sm">{user._id || "N/A"}</span>
          </div>

          {/* 🔥 VENDOR SECTION */}
          {user.role === "Vendor" && (
            <>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 text-sm">Business Name</span>
                <span className="font-medium">{user.businessName || "N/A"}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 text-sm">Services</span>
                <span className="font-medium">{user.services || "N/A"}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 text-sm">Location</span>
                <span className="font-medium">{user.location || "N/A"}</span>
              </div>
            </>
          )}

          {/* 🔥 ADMIN SECTION */}
          {user.role === "Admin" && (
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Access Level</span>
              <span className="font-medium text-green-400">Full Access</span>
            </div>
          )}

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-col gap-3">

          <button
            onClick={() => navigate("/")}
            className="w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Back to Home
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("ae_user");
              localStorage.removeItem("token");
              window.dispatchEvent(new Event("userLogin"));
              navigate("/login");
            }}
            className="w-full border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500/10 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;