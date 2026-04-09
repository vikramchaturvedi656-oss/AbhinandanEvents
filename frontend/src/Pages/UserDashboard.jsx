import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaMapMarkerAlt, FaPhoneAlt, FaUserTie } from "react-icons/fa";
import StatusBadge from "../components/StatusBadge";
import { bookingApi } from "../utils/api";
import { formatEventDateTime } from "../utils/formatters";
import { getStoredUser } from "../utils/session";

function UserDashboard() {
  const [user, setUser] = useState(() => getStoredUser());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener("userLogin", syncUser);
    return () => window.removeEventListener("userLogin", syncUser);
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await bookingApi.list({
          email: user.email,
          userId: user.id || user._id,
        });
        setBookings(response.data.bookings);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.email, user?.id, user?._id]);

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">User Dashboard</h1>
          <p className="mt-3 text-slate-300">Login to view your booked appointments.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">User Dashboard</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Booked appointments</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        Review planner contact details, event timing, venue, booking status, and assigned staff.
      </p>

      {error && <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
      {loading && <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading bookings...</div>}
      {!loading && bookings.length === 0 && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-slate-300">No bookings yet.</p>
          <Link to="/" className="mt-5 inline-flex rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            Browse planners
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-5">
        {bookings.map((booking) => (
          <article key={booking._id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-amber-300">{booking.eventType}</div>
                <h2 className="mt-2 text-2xl font-semibold text-white">{booking.plannerName}</h2>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <FaCalendarCheck className="text-amber-300" />
                    {formatEventDateTime(booking.eventDate, booking.eventTime)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaMapMarkerAlt className="text-amber-300" />
                    {booking.venue}
                  </span>
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="text-slate-400">Planner contact</div>
                <div className="mt-2 text-white">{booking.plannerContact?.email}</div>
                <div className="mt-1 inline-flex items-center gap-2">
                  <FaPhoneAlt className="text-amber-300" />
                  {booking.plannerContact?.phone}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="text-slate-400">Guest count and budget</div>
                <div className="mt-2 text-white">{booking.guestCount} guests</div>
                <div className="mt-1 text-slate-200">{booking.budgetRange}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="text-slate-400">Assigned team</div>
                <div className="mt-2 inline-flex items-center gap-2 text-white">
                  <FaUserTie className="text-amber-300" />
                  {booking.assignedStaff?.length ? booking.assignedStaff.join(", ") : "To be assigned"}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UserDashboard;
