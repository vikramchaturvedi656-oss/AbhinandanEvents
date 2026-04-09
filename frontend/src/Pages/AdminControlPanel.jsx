import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { adminApi, bookingApi, plannerApi } from "../utils/api";
import { formatEventDateTime } from "../utils/formatters";

const days = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

function AdminControlPanel() {
  const [overview, setOverview] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [eventRequestNotes, setEventRequestNotes] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [passwordDrafts, setPasswordDrafts] = useState({});

  const loadOverview = async () => {
    try {
      const response = await adminApi.getOverview();
      setOverview(response.data);
      setDrafts(
        response.data.planners.reduce((accumulator, planner) => {
          accumulator[planner._id] = {
            acceptingBookings: planner.availability?.acceptingBookings ?? true,
            startHour: planner.availability?.startHour || "10:00",
            endHour: planner.availability?.endHour || "19:00",
            workingDays: planner.availability?.workingDays || [],
          };
          return accumulator;
        }, {})
      );
      setEventRequestNotes(
        (response.data.eventRequests || []).reduce((accumulator, request) => {
          accumulator[request._id] = request.adminNotes || "";
          return accumulator;
        }, {})
      );
      setPasswordDrafts(
        (response.data.admins || []).reduce((accumulator, admin) => {
          accumulator[admin._id] = "";
          return accumulator;
        }, {})
      );
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load admin overview.");
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const updateDraft = (plannerId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [plannerId]: { ...current[plannerId], [field]: value },
    }));
  };

  const toggleDay = (plannerId, day) => {
    const currentDays = drafts[plannerId]?.workingDays || [];
    const nextDays = currentDays.includes(day)
      ? currentDays.filter((value) => value !== day)
      : [...currentDays, day].sort((first, second) => first - second);
    updateDraft(plannerId, "workingDays", nextDays);
  };

  const savePlanner = async (plannerId) => {
    setBusyId(plannerId);
    setNotice("");
    try {
      await plannerApi.updateAvailability(plannerId, drafts[plannerId]);
      await loadOverview();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Unable to update planner schedule.");
    } finally {
      setBusyId("");
    }
  };

  const updateStatus = async (bookingId, status) => {
    setBusyId(bookingId);
    setNotice("");
    try {
      await bookingApi.updateStatus(bookingId, status);
      await loadOverview();
    } catch (statusError) {
      setError(statusError.response?.data?.message || "Unable to update booking status.");
    } finally {
      setBusyId("");
    }
  };

  const updateEventRequestStatus = async (requestId, status) => {
    setBusyId(requestId);
    setNotice("");
    try {
      await adminApi.updateEventRequestStatus(requestId, {
        status,
        adminNotes: eventRequestNotes[requestId] || "",
      });
      await loadOverview();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update event request.");
    } finally {
      setBusyId("");
    }
  };

  const handleAdminFieldChange = (field) => (event) => {
    setAdminForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const createAdmin = async (event) => {
    event.preventDefault();
    setBusyId("create-admin");
    setError("");

    try {
      await adminApi.createAdmin(adminForm);
      setNotice(`Admin created successfully for ${adminForm.email}.`);
      setAdminForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
      await loadOverview();
    } catch (createError) {
      setError(createError.response?.data?.message || "Unable to create the admin account.");
    } finally {
      setBusyId("");
    }
  };

  const updateAdminPassword = async (adminId) => {
    setBusyId(`password-${adminId}`);
    setError("");

    try {
      await adminApi.updateAdminPassword(adminId, {
        password: passwordDrafts[adminId],
      });
      setNotice("Admin password updated successfully.");
      setPasswordDrafts((current) => ({
        ...current,
        [adminId]: "",
      }));
      await loadOverview();
    } catch (passwordError) {
      setError(
        passwordError.response?.data?.message ||
          "Unable to update the admin password."
      );
    } finally {
      setBusyId("");
    }
  };

  const conflicts = overview?.bookings?.filter((booking) => booking.hasConflict) || [];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin Panel</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Central booking control</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        View every booking, update statuses, manage planner availability, monitor overlap alerts, and control admin access.
      </p>

      {error && <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
      {notice && <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{notice}</div>}

      {overview && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["Users", overview.stats.totalUsers],
              ["Admins", overview.stats.totalAdmins],
              ["Planners", overview.stats.totalPlanners],
              ["Bookings", overview.stats.totalBookings],
              ["Event Requests", overview.stats.totalEventRequests],
              ["Confirmed", overview.stats.confirmedBookings],
              ["Pending", overview.stats.pendingBookings],
              ["Pending Event Requests", overview.stats.pendingEventRequests],
              ["Conflicts", overview.stats.totalConflicts],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-slate-400">{label}</div>
                <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-semibold text-white">Conflict monitor</h2>
            <div className="mt-4 text-sm text-slate-300">
              {conflicts.length === 0
                ? "No overlapping appointments detected."
                : `${conflicts.length} overlapping appointments detected.`}
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-semibold text-white">Create admin</h2>
              <p className="mt-2 text-sm text-slate-300">
                Add a new admin account and store its password directly in MongoDB.
              </p>

              <form onSubmit={createAdmin} className="mt-5 space-y-4">
                <input
                  required
                  value={adminForm.name}
                  onChange={handleAdminFieldChange("name")}
                  placeholder="Admin name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
                <input
                  required
                  type="email"
                  value={adminForm.email}
                  onChange={handleAdminFieldChange("email")}
                  placeholder="Admin email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
                <input
                  required
                  value={adminForm.phone}
                  onChange={handleAdminFieldChange("phone")}
                  placeholder="Admin phone"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
                <input
                  required
                  type="password"
                  value={adminForm.password}
                  onChange={handleAdminFieldChange("password")}
                  placeholder="Temporary password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={busyId === "create-admin"}
                  className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950"
                >
                  {busyId === "create-admin" ? "Creating admin..." : "Create admin"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-semibold text-white">Admin accounts</h2>
              <div className="mt-5 space-y-4">
                {overview.admins?.map((admin) => (
                  <article key={admin._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                          {admin.isActive ? "Active admin" : "Inactive admin"}
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-white">{admin.name}</h3>
                        <p className="mt-2 text-sm text-slate-300">
                          {admin.email} | {admin.phone}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Permissions: {(admin.permissions || []).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row">
                      <input
                        type="password"
                        value={passwordDrafts[admin._id] || ""}
                        onChange={(event) =>
                          setPasswordDrafts((current) => ({
                            ...current,
                            [admin._id]: event.target.value,
                          }))
                        }
                        placeholder="Set new password"
                        className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateAdminPassword(admin._id)}
                        disabled={busyId === `password-${admin._id}`}
                        className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950"
                      >
                        {busyId === `password-${admin._id}` ? "Updating..." : "Update password"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-semibold text-white">Event booking requests</h2>
              <div className="mt-5 space-y-4">
                {overview.eventRequests?.length ? (
                  overview.eventRequests.map((request) => (
                    <article key={request._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
                            {request.eventName}
                          </div>
                          <h3 className="mt-2 text-xl font-semibold text-white">
                            {request.selectedPackage?.name} | {request.selectedPackage?.price}
                          </h3>
                          <p className="mt-2 text-sm text-slate-300">
                            {request.customer?.fullName} | {request.customer?.emailAddress}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {request.eventDate} | {request.eventTime} | {request.eventLocation}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Guests: {request.guestCount} | Budget: {request.budgetRange} | Duration: {request.durationMinutes} min
                          </p>
                          <p className="mt-1 text-sm text-amber-200">
                            {request.assignmentStatus === "Assigned"
                              ? `Assigned to ${request.assignedPlannerName} (${request.assignedPlannerLocation})`
                              : "No nearby planner was auto-assigned"}
                          </p>
                          {request.assignmentNotes && (
                            <p className="mt-1 text-sm text-slate-400">{request.assignmentNotes}</p>
                          )}
                          {request.specialRequirements && (
                            <p className="mt-2 text-sm text-slate-300">
                              {request.specialRequirements}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={request.status} />
                      </div>

                      <textarea
                        rows="3"
                        value={eventRequestNotes[request._id] || ""}
                        onChange={(event) =>
                          setEventRequestNotes((current) => ({
                            ...current,
                            [request._id]: event.target.value,
                          }))
                        }
                        placeholder="Admin notes"
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                      />

                      <select
                        value={request.status}
                        disabled={busyId === request._id}
                        onChange={(event) =>
                          updateEventRequestStatus(request._id, event.target.value)
                        }
                        className="mt-4 rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                    No event booking requests yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-semibold text-white">All bookings</h2>
              <div className="mt-5 space-y-4">
                {overview.bookings.map((booking) => (
                  <article key={booking._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-amber-300">{booking.eventType}</div>
                        <h3 className="mt-2 text-xl font-semibold text-white">{booking.plannerName}</h3>
                        <p className="mt-2 text-sm text-slate-300">
                          {booking.customer?.fullName} | {booking.customer?.emailAddress}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {formatEventDateTime(booking.eventDate, booking.eventTime)} | {booking.venue}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <select
                      value={booking.status}
                      disabled={busyId === booking._id}
                      onChange={(event) => updateStatus(booking._id, event.target.value)}
                      className="mt-4 rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 xl:col-span-2">
              <h2 className="text-2xl font-semibold text-white">Planner schedules</h2>
              <div className="mt-5 space-y-5">
                {overview.planners.map((planner) => (
                  <article key={planner._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-xs uppercase tracking-[0.25em] text-amber-300">{planner.specialization}</div>
                    <h3 className="mt-2 text-xl font-semibold text-white">{planner.name}</h3>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input type="time" value={drafts[planner._id]?.startHour || "10:00"} onChange={(event) => updateDraft(planner._id, "startHour", event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                      <input type="time" value={drafts[planner._id]?.endHour || "19:00"} onChange={(event) => updateDraft(planner._id, "endHour", event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                    </div>

                    <label className="mt-4 flex items-center gap-2 text-sm text-slate-200">
                      <input type="checkbox" checked={drafts[planner._id]?.acceptingBookings || false} onChange={(event) => updateDraft(planner._id, "acceptingBookings", event.target.checked)} />
                      Accept new bookings
                    </label>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {days.map((day) => (
                        <button
                          key={`${planner._id}-${day.value}`}
                          type="button"
                          onClick={() => toggleDay(planner._id, day.value)}
                          className={`rounded-full border px-3 py-2 text-xs ${
                            drafts[planner._id]?.workingDays?.includes(day.value)
                              ? "border-amber-400 bg-amber-400/10 text-amber-100"
                              : "border-white/10 bg-slate-950 text-slate-300"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => savePlanner(planner._id)}
                      disabled={busyId === planner._id}
                      className="mt-4 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                      Save schedule
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminControlPanel;
