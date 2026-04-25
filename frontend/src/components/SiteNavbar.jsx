import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { authApi } from "../utils/api";
import {
  clearStoredUser,
  getDashboardPath,
  getStoredUser,
  saveStoredUser,
} from "../utils/session";

function SiteNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("userLogin", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userLogin", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      try {
        const { data } = await authApi.getCurrentUser();

        if (!isMounted) {
          return;
        }

        saveStoredUser(data.user);
        setUser(data.user);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error.response?.status === 401) {
          clearStoredUser();
          setUser(null);
        }
      }
    };

    hydrateUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredUser();
      setUser(null);
      setMenuOpen(false);
      navigate("/");
    }
  };

  const dashboardPath = user ? getDashboardPath(user.role) : "/dashboard";
  const navLinkClass = (path) =>
    location.pathname === path
      ? "text-amber-200"
      : "text-slate-200/80 hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="min-w-0 text-left"
          >
            <div className="text-[10px] uppercase tracking-[0.24em] text-amber-300 sm:text-xs sm:tracking-[0.3em]">
              Event Planning Platform
            </div>
            <div className="text-lg font-semibold text-white sm:text-xl">Abhinandan Events</div>
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white sm:gap-3 sm:px-3"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-semibold text-slate-950 sm:h-9 sm:w-9">
                    {user?.name?.[0]?.toUpperCase() || "G"}
                  </span>
                )}
                <span className="hidden text-left sm:block">
                  <span className="block font-medium">
                    {user?.name || "Guest access"}
                  </span>
                  <span className="block text-xs text-slate-300">
                    {user?.role || "Browse and book"}
                  </span>
                </span>
                <FaChevronDown
                  className={`text-xs transition ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl shadow-black/40">
                  {user ? (
                    <>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-slate-300">{user.email}</div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] text-amber-300">
                          {user.role}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-sm">
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-slate-100 hover:bg-white/5"
                        >
                          Profile
                        </Link>
                        <Link
                          to={dashboardPath}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-slate-100 hover:bg-white/5"
                        >
                          Open dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full rounded-xl px-3 py-2 text-left text-rose-300 hover:bg-rose-500/10"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300">
                        Sign in to track bookings, access your dashboard, and manage
                        planner requests.
                      </p>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl bg-amber-400 px-3 py-2 text-center font-semibold text-slate-950"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl border border-white/10 px-3 py-2 text-center text-white"
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-white md:hidden"
              aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <nav className="mt-4 hidden items-center gap-5 text-sm md:flex">
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link to="/marketplace" className={navLinkClass("/marketplace")}>
            Planner Booking
          </Link>
          <Link to="/about" className={navLinkClass("/about")}>
            About
          </Link>
          <Link to="/contact" className={navLinkClass("/contact")}>
            Contact
          </Link>
          {user && (
            <Link to={dashboardPath} className={navLinkClass(dashboardPath)}>
              {user.role === "Admin" ? "Admin Panel" : "Dashboard"}
            </Link>
          )}
        </nav>

        {mobileNavOpen && (
          <nav className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm md:hidden">
            <Link to="/" className={`rounded-xl px-3 py-2 ${navLinkClass("/")}`}>
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`rounded-xl px-3 py-2 ${navLinkClass("/marketplace")}`}
            >
              Planner Booking
            </Link>
            <Link to="/about" className={`rounded-xl px-3 py-2 ${navLinkClass("/about")}`}>
              About
            </Link>
            <Link
              to="/contact"
              className={`rounded-xl px-3 py-2 ${navLinkClass("/contact")}`}
            >
              Contact
            </Link>
            {user && (
              <Link
                to={dashboardPath}
                className={`rounded-xl px-3 py-2 ${navLinkClass(dashboardPath)}`}
              >
                {user.role === "Admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default SiteNavbar;
