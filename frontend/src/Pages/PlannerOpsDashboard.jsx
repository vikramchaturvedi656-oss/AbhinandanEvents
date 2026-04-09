import { useEffect, useState } from "react";
import { FaCalendarCheck, FaClock, FaUserTie } from "react-icons/fa";
import { bookingApi, plannerApi } from "../utils/api";
import { formatEventDateTime, formatWorkingDays } from "../utils/formatters";

function PlannerOpsDashboard() {
  const [planners, setPlanners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOps = async () => {
      try {
        const [plannerResponse, bookingResponse] = await Promise.all([
          plannerApi.list({ location: "Noida" }),
          bookingApi.list({ status: "Confirmed" }),
        ]);
        setPlanners(plannerResponse.data.planners);
        setBookings(bookingResponse.data.bookings);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load planner operations.");
      }
    };

    loadOps();
  }, []);

  const plannerBookings = (plannerId) =>
    bookings.filter((booking) => booking.plannerId?._id === plannerId || booking.plannerId === plannerId).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Planner Operations</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Planner service board</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        A quick operational view of active planners, their working hours, teams, and upcoming confirmed jobs.
      </p>

      {error && <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {planners.map((planner) => (
          <article key={planner._id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-300">{planner.specialization}</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">{planner.name}</h2>
            <p className="mt-3 text-sm text-slate-300">{planner.summary}</p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="inline-flex items-center gap-2 text-white">
                  <FaClock className="text-amber-300" />
                  Working hours
                </div>
                <div className="mt-2">{planner.availability?.startHour} - {planner.availability?.endHour}</div>
                <div className="mt-1 text-slate-400">{formatWorkingDays(planner.availability?.workingDays)}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="inline-flex items-center gap-2 text-white">
                  <FaUserTie className="text-amber-300" />
                  Team
                </div>
                <div className="mt-2">{planner.assignedTeam?.join(", ") || "No staff assigned"}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="inline-flex items-center gap-2 text-white">
                  <FaCalendarCheck className="text-amber-300" />
                  Upcoming jobs
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">{plannerBookings(planner._id).length}</div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {plannerBookings(planner._id).map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-200">
                  <div className="font-semibold text-white">{booking.eventType}</div>
                  <div className="mt-1">{formatEventDateTime(booking.eventDate, booking.eventTime)}</div>
                  <div className="mt-1 text-slate-400">{booking.venue}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PlannerOpsDashboard;
