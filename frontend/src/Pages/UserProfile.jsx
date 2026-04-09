import { Link, useNavigate } from "react-router-dom";
import { clearStoredUser, getDashboardPath, getStoredUser } from "../utils/session";

function UserProfile() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Profile</h1>
          <p className="mt-3 text-slate-300">Login to view your account details.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-300">Profile</div>
            <h1 className="mt-2 text-4xl font-semibold text-white">{user.name}</h1>
            <p className="mt-3 text-slate-300">{user.email}</p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl font-semibold text-slate-950">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Role</div>
            <div className="mt-2 text-2xl font-semibold text-white">{user.role}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Phone</div>
            <div className="mt-2 text-2xl font-semibold text-white">{user.phone || "Not added"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">User ID</div>
            <div className="mt-2 text-sm font-semibold text-white">{user.id || user._id || "Unavailable"}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={getDashboardPath(user.role)} className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            Open dashboard
          </Link>
          <Link to="/" className="rounded-full border border-white/10 px-5 py-3 text-slate-100">
            Browse planners
          </Link>
          <button
            type="button"
            onClick={() => {
              clearStoredUser();
              navigate("/login");
            }}
            className="rounded-full border border-rose-400/30 px-5 py-3 text-rose-200"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
