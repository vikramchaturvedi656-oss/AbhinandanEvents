import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import eventCategories from "../data/eventCategories";
import { bookingApi, plannerApi } from "../utils/api";
import { formatWorkingDays } from "../utils/formatters";
import { getStoredUser } from "../utils/session";

const budgets = [
  "INR 25K - 50K",
  "INR 50K - 1L",
  "INR 1L - 3L",
  "INR 3L - 8L",
  "INR 8L+",
];

const initialForm = (user) => ({
  fullName: user?.name || "",
  contactNumber: user?.phone || "",
  emailAddress: user?.email || "",
  eventType: "",
  eventDate: "",
  eventTime: "",
  venue: "",
  guestCount: "",
  budgetRange: "",
  specialRequirements: "",
  durationMinutes: 180,
});

function PlannerMarketplaceSection({ id = "planner-marketplace" }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [planners, setPlanners] = useState([]);
  const [selectedPlanner, setSelectedPlanner] = useState(null);
  const [formData, setFormData] = useState(() => initialForm(getStoredUser()));
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [availabilityKey, setAvailabilityKey] = useState("");

  const eventTypes = useMemo(
    () =>
      Array.from(
        new Set(
          [...eventCategories.map((item) => item.name), ...planners.map((item) => item.specialization)].filter(Boolean)
        )
      ),
    [planners]
  );

  const currentKey = `${selectedPlanner?._id || ""}|${formData.eventDate}|${formData.eventTime}|${formData.durationMinutes}`;

  useEffect(() => {
    const syncUser = () => {
      const nextUser = getStoredUser();
      setUser(nextUser);
      setFormData((current) => ({
        ...current,
        fullName: current.fullName || nextUser?.name || "",
        contactNumber: current.contactNumber || nextUser?.phone || "",
        emailAddress: current.emailAddress || nextUser?.email || "",
      }));
    };

    window.addEventListener("userLogin", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userLogin", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    const loadPlanners = async () => {
      setLoading(true);

      try {
        const response = await plannerApi.list({
          search: search.trim(),
          specialization,
          location: locationFilter.trim(),
        });

        setPlanners(response.data.planners || []);
        setError("");
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load planners.");
      } finally {
        setLoading(false);
      }
    };

    loadPlanners();
  }, [locationFilter, search, specialization]);

  useEffect(() => {
    if (!planners.length) {
      setSelectedPlanner(null);
      return;
    }

    const selectedStillVisible = planners.some(
      (planner) => planner._id === selectedPlanner?._id
    );

    if (!selectedStillVisible) {
      setSelectedPlanner(planners[0]);
      setFormData((current) => ({
        ...current,
        eventType: current.eventType || planners[0].specialization,
      }));
    }
  }, [planners, selectedPlanner]);

  const resetStatus = () => {
    setMessage("");
    setError("");
    setAlternatives([]);
    setAvailabilityKey("");
  };

  const handleField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    resetStatus();
  };

  const selectPlanner = (planner) => {
    setSelectedPlanner(planner);
    resetStatus();
    setFormData((current) => ({
      ...current,
      eventType: current.eventType || planner.specialization,
    }));
  };

  const checkAvailability = async () => {
    if (!selectedPlanner || !formData.eventDate || !formData.eventTime) {
      setError("Select a planner, date, and time first.");
      return false;
    }

    try {
      setError("");
      setMessage("");

      const response = await bookingApi.checkAvailability({
        plannerId: selectedPlanner._id,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        durationMinutes: Number(formData.durationMinutes),
      });

      setMessage(response.data.message);
      setAlternatives(response.data.alternativeSlots || []);
      setAvailabilityKey(response.data.available ? currentKey : "");
      return response.data.available;
    } catch (availabilityError) {
      setError(
        availabilityError.response?.data?.message || "Availability check failed."
      );
      return false;
    }
  };

  const submitBooking = async (event) => {
    event.preventDefault();

    if (!selectedPlanner) {
      setError("Select a planner card before confirming a booking.");
      return;
    }

    if (availabilityKey !== currentKey) {
      const available = await checkAvailability();
      if (!available) return;
    }

    try {
      setError("");
      setMessage("");

      const response = await bookingApi.create({
        plannerId: selectedPlanner._id,
        userId: user?.id || user?._id,
        ...formData,
        guestCount: Number(formData.guestCount),
      });

      setMessage(response.data.message);
      setFormData({
        ...initialForm(user),
        eventType: selectedPlanner.specialization,
      });
      setAlternatives([]);
      setAvailabilityKey("");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message || "Booking could not be confirmed."
      );
      setAlternatives(submitError.response?.data?.alternativeSlots || []);
    }
  };

  return (
    <section id={id} className="bg-slate-900/40 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
              Planner Marketplace
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Book trusted planners with visible cards and live availability checks.
            </h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              The updated planner booking flow is still here. Browse cards,
              filter by service or city, then check the database before
              confirming your slot.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            Event cards above help you explore categories. Planner cards here
            help you book the right team.
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 md:grid-cols-3">
              <label className="md:col-span-2">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-300">
                  Search
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                  <FaSearch className="text-amber-300" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search planners, sectors, or services"
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
              </label>

              <label>
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-300">
                  City
                </span>
                <input
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  placeholder="Noida, Delhi, Gurgaon..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                />
              </label>

              <label className="md:col-span-3">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-300">
                  Event Type
                </span>
                <select
                  value={specialization}
                  onChange={(event) => setSpecialization(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                >
                  <option value="">All specializations</option>
                  {eventTypes.map((option) => (
                    <option key={option} value={option} className="bg-slate-900">
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {loading && (
                <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
                  Loading planner cards...
                </div>
              )}

              {!loading &&
                planners.map((planner) => (
                  <button
                    key={planner._id}
                    type="button"
                    onClick={() => selectPlanner(planner)}
                    className={`overflow-hidden rounded-[1.75rem] border text-left transition hover:-translate-y-1 ${
                      selectedPlanner?._id === planner._id
                        ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-900/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <img
                      src={planner.image}
                      alt={planner.name}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {planner.name}
                          </h3>
                          <p className="mt-1 text-sm text-amber-200">
                            {planner.specialization}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-slate-100">
                          <FaStar className="text-amber-300" />
                          {planner.rating?.toFixed(1)}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-slate-300">
                        {planner.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-200">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
                          <FaMapMarkerAlt className="text-amber-300" />
                          {planner.location}, {planner.sector}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
                          <FaClock className="text-amber-300" />
                          {planner.startingPrice}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {planner.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                        <span className="inline-flex items-center gap-2">
                          <FaCalendarCheck className="text-amber-300" />
                          {planner.availability?.acceptingBookings
                            ? `${formatWorkingDays(
                                planner.availability?.workingDays
                              )} | ${planner.availability?.startHour}-${planner.availability?.endHour}`
                            : "Currently unavailable"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}

              {!loading && planners.length === 0 && (
                <div className="md:col-span-2 rounded-[2rem] border border-dashed border-white/15 bg-slate-950/40 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    No planner cards matched these filters.
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Try clearing the city or event type filter. You can also
                    jump into one of the event categories below to keep exploring.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setLocationFilter("");
                        setSpecialization("");
                        resetStatus();
                      }}
                      className="rounded-full bg-amber-400 px-4 py-2 font-semibold text-slate-950"
                    >
                      Clear filters
                    </button>
                    {eventCategories.slice(0, 3).map((category) => (
                      <Link
                        key={category.slug}
                        to={`/events/${category.slug}`}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6">
              <h3 className="text-2xl font-semibold text-white">
                {selectedPlanner ? selectedPlanner.name : "Select a planner card"}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Fill the booking form, run the availability check, and then
                confirm the appointment.
              </p>

              {selectedPlanner ? (
                <>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    <div className="font-medium text-amber-200">
                      {selectedPlanner.specialization}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <span className="inline-flex items-center gap-2">
                        <FaMapMarkerAlt className="text-amber-300" />
                        {selectedPlanner.location}, {selectedPlanner.sector}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <FaPhoneAlt className="text-amber-300" />
                        {selectedPlanner.contact?.phone}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={submitBooking} className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        required
                        value={formData.fullName}
                        onChange={(event) =>
                          handleField("fullName", event.target.value)
                        }
                        placeholder="Full Name"
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      />
                      <input
                        required
                        value={formData.contactNumber}
                        onChange={(event) =>
                          handleField("contactNumber", event.target.value)
                        }
                        placeholder="Contact Number"
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        required
                        type="email"
                        value={formData.emailAddress}
                        onChange={(event) =>
                          handleField("emailAddress", event.target.value)
                        }
                        placeholder="Email Address"
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      />
                      <select
                        required
                        value={formData.eventType}
                        onChange={(event) =>
                          handleField("eventType", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      >
                        <option value="">Event Type</option>
                        {eventTypes.map((option) => (
                          <option key={option} value={option} className="bg-slate-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <input
                        required
                        type="date"
                        value={formData.eventDate}
                        onChange={(event) =>
                          handleField("eventDate", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      />
                      <input
                        required
                        type="time"
                        value={formData.eventTime}
                        onChange={(event) =>
                          handleField("eventTime", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      />
                      <select
                        value={formData.durationMinutes}
                        onChange={(event) =>
                          handleField("durationMinutes", Number(event.target.value))
                        }
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      >
                        <option value={120}>2 hours</option>
                        <option value={180}>3 hours</option>
                        <option value={240}>4 hours</option>
                        <option value={360}>6 hours</option>
                      </select>
                    </div>

                    <input
                      required
                      value={formData.venue}
                      onChange={(event) => handleField("venue", event.target.value)}
                      placeholder="Event Venue / Location"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        required
                        min="1"
                        type="number"
                        value={formData.guestCount}
                        onChange={(event) =>
                          handleField("guestCount", event.target.value)
                        }
                        placeholder="Estimated Guest Count"
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      />
                      <select
                        required
                        value={formData.budgetRange}
                        onChange={(event) =>
                          handleField("budgetRange", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                      >
                        <option value="">Budget Range</option>
                        {budgets.map((option) => (
                          <option key={option} value={option} className="bg-slate-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      required
                      rows="4"
                      value={formData.specialRequirements}
                      onChange={(event) =>
                        handleField("specialRequirements", event.target.value)
                      }
                      placeholder="Special Requirements or Notes"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={checkAvailability}
                        className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 font-semibold text-amber-100"
                      >
                        Check DB availability
                      </button>
                      <button
                        type="submit"
                        className="rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950"
                      >
                        Confirm booking
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">
                  Pick any planner card on the left to open the booking form.
                </div>
              )}

              {message && (
                <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                  {error}
                </div>
              )}

              {alternatives.length > 0 && (
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">
                    Alternative slots
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alternatives.map((slot) => (
                      <button
                        key={`${slot.date}-${slot.time}`}
                        type="button"
                        onClick={() => {
                          handleField("eventDate", slot.date);
                          handleField("eventTime", slot.time);
                        }}
                        className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-100"
                      >
                        {slot.date} | {slot.time}-{slot.endsAt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlannerMarketplaceSection;
