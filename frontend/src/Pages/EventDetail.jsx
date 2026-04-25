import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardCheck,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import eventCategories from "../data/eventCategories";
import { eventApi, eventRequestApi } from "../utils/api";
import { getStoredUser } from "../utils/session";

const initialForm = (user, event, selectedPackage) => ({
  fullName: user?.name || "",
  contactNumber: user?.phone || "",
  emailAddress: user?.email || "",
  eventDate: "",
  eventTime: "",
  eventLocation: "",
  guestCount: "",
  budgetRange: selectedPackage?.price || "",
  specialRequirements: "",
  durationMinutes: 180,
});

const initialNearbyState = {
  loading: false,
  error: "",
  requestedLocation: "",
  assignedPlanner: null,
  nearbyPlanners: [],
};

function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fallbackEvent = eventCategories.find((item) => item.slug === slug);
  const [user, setUser] = useState(() => getStoredUser());
  const [event, setEvent] = useState(fallbackEvent || null);
  const [selectedPackage, setSelectedPackage] = useState(
    fallbackEvent?.packages?.[0] || null
  );
  const [formData, setFormData] = useState(() =>
    initialForm(user, fallbackEvent, fallbackEvent?.packages?.[0] || null)
  );
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [nearbyState, setNearbyState] = useState(initialNearbyState);
  const [activePlannerId, setActivePlannerId] = useState("");
  const formTouchedRef = useRef(false);

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
    formTouchedRef.current = false;

    const loadEvent = async () => {
      setLoadingEvent(true);

      try {
        const response = await eventApi.getBySlug(slug);
        const nextEvent = response.data.event;
        const nextDefaultPackage = nextEvent?.packages?.[0] || null;
        setEvent(nextEvent);
        setSelectedPackage((current) => {
          if (!formTouchedRef.current) {
            return nextDefaultPackage;
          }

          const matchingPackage = nextEvent?.packages?.find(
            (pkg) => pkg.name === current?.name
          );

          return matchingPackage || nextDefaultPackage;
        });
        setFormData((current) =>
          formTouchedRef.current
            ? current
            : initialForm(user, nextEvent, nextDefaultPackage)
        );
      } catch (error) {
        if (!fallbackEvent) {
          setEvent(null);
        }
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [fallbackEvent, slug]);

  useEffect(() => {
    const locationValue = formData.eventLocation.trim();

    if (!event?.slug || locationValue.length < 3) {
      setNearbyState(initialNearbyState);
      return undefined;
    }

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setNearbyState((current) => ({
        ...current,
        loading: true,
        error: "",
      }));

      try {
        const response = await eventRequestApi.previewAssignment({
          eventSlug: event.slug,
          eventLocation: locationValue,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          durationMinutes: Number(formData.durationMinutes),
        });

        if (isCancelled) {
          return;
        }

        setNearbyState({
          loading: false,
          error: "",
          requestedLocation:
            response.data.requestedLocation?.resolved || locationValue,
          assignedPlanner: response.data.assignedPlanner || null,
          nearbyPlanners: response.data.nearbyPlanners || [],
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setNearbyState({
          loading: false,
          error:
            error.response?.data?.message ||
            "Unable to load nearby vendors for this location.",
          requestedLocation: locationValue,
          assignedPlanner: null,
          nearbyPlanners: [],
        });
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    event?.slug,
    formData.durationMinutes,
    formData.eventDate,
    formData.eventLocation,
    formData.eventTime,
  ]);

  useEffect(() => {
    const firstPlannerId =
      nearbyState.assignedPlanner?._id || nearbyState.nearbyPlanners[0]?._id || "";
    setActivePlannerId(firstPlannerId);
  }, [nearbyState.assignedPlanner, nearbyState.nearbyPlanners]);

  if (loadingEvent && !event) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 text-center text-slate-50 flex flex-col items-center justify-center">
        <h1 className="mb-3 text-3xl font-bold">Loading event details...</h1>
        <p className="text-slate-300">Fetching the event data from MongoDB.</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 text-center text-slate-50 flex flex-col items-center justify-center">
        <h1 className="mb-3 text-3xl font-bold">Event not found</h1>
        <p className="mb-6 text-slate-300">
          We couldn't find that event type. Please explore our categories.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const handleFieldChange = (field) => (eventValue) => {
    formTouchedRef.current = true;
    setFormData((current) => ({
      ...current,
      [field]: eventValue.target.value,
    }));
    setStatus({ type: "", message: "" });
  };

  const handlePackageChange = (pkg) => {
    formTouchedRef.current = true;
    const previousPackagePrice = selectedPackage?.price || "";
    setSelectedPackage(pkg);
    setFormData((current) => ({
      ...current,
      budgetRange:
        !current.budgetRange || current.budgetRange === previousPackagePrice
          ? pkg.price
          : current.budgetRange,
    }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const response = await eventRequestApi.create({
        userId: user?.id || user?._id,
        eventSlug: event.slug,
        selectedPackage,
        ...formData,
      });

      setStatus({
        type: "success",
        message: response.data.assignedPlanner
          ? `${response.data.message} Assigned planner: ${response.data.assignedPlanner.name}.`
          : response.data.message,
      });
      formTouchedRef.current = false;
      setFormData(initialForm(user, event, selectedPackage));
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to submit the event booking request right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeNearbyPlanner =
    nearbyState.nearbyPlanners.find((planner) => planner._id === activePlannerId) ||
    nearbyState.assignedPlanner ||
    nearbyState.nearbyPlanners[0] ||
    null;

  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-900" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
            Event Details
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">{event.name}</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-200/90 sm:text-lg">{event.desc}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#event-booking-form"
              className="rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 px-6 py-3 font-semibold shadow-lg shadow-rose-900/30 transition hover:-translate-y-[2px]"
            >
              Book this event
            </a>
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold transition hover:border-amber-400 hover:text-amber-200"
            >
              Go back
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Packages", `${event.packages.length} curated options`],
              ["Approval", "Stored for admin review"],
              ["Nearby match", "Location-based vendor assignment"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  {label}
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
              <h2 className="mb-3 text-2xl font-semibold">Highlights</h2>
              <ul className="space-y-3 text-sm text-slate-200/90">
                {event.highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <FaCalendarAlt className="text-amber-300" />,
                  title: "Plan the date",
                  copy: "Choose your target date and we will route it for admin review.",
                },
                {
                  icon: <FaUsers className="text-amber-300" />,
                  title: "Share guest count",
                  copy: "Tell us the expected crowd size so approvals and planning stay accurate.",
                },
                {
                  icon: <FaClipboardCheck className="text-amber-300" />,
                  title: "Get approved",
                  copy: "Your request is matched with nearby vendors before admin approval.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                >
                  <div className="inline-flex rounded-full bg-white/5 p-3">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
                </div>
              ))}
            </div>

            <div
              id="event-booking-form"
              className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/30 sm:p-6"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
                    Book This Event
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    Send your booking request for admin approval
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    Nearby vendors are searched from your event location and the
                    selected event type before the booking is assigned.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  Selected package:{" "}
                  <span className="font-semibold text-amber-200">
                    {selectedPackage?.name}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={formData.fullName}
                    onChange={handleFieldChange("fullName")}
                    placeholder="Full Name"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    value={formData.contactNumber}
                    onChange={handleFieldChange("contactNumber")}
                    placeholder="Phone Number"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleFieldChange("emailAddress")}
                    placeholder="Email Address"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    type="date"
                    value={formData.eventDate}
                    onChange={handleFieldChange("eventDate")}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    type="time"
                    value={formData.eventTime}
                    onChange={handleFieldChange("eventTime")}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <select
                    value={formData.durationMinutes}
                    onChange={handleFieldChange("durationMinutes")}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  >
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={360}>6 hours</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={formData.eventLocation}
                    onChange={handleFieldChange("eventLocation")}
                    placeholder="Event Venue / City"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    min="1"
                    type="number"
                    value={formData.guestCount}
                    onChange={handleFieldChange("guestCount")}
                    placeholder="Estimated Guest Count"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </div>

                <input
                  required
                  value={formData.budgetRange}
                  onChange={handleFieldChange("budgetRange")}
                  placeholder="Budget Range"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />

                <textarea
                  rows="4"
                  value={formData.specialRequirements}
                  onChange={handleFieldChange("specialRequirements")}
                  placeholder="Special requirements, theme, timings, services needed..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />

                <button
                  type="submit"
                  disabled={loading || !selectedPackage}
                  className="w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
                >
                  {loading ? "Sending request..." : "Submit for admin approval"}
                </button>
              </form>

              {status.message && (
                <div
                  className={`mt-4 rounded-2xl border p-4 text-sm ${
                    status.type === "success"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-400/30 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
              <h3 className="mb-4 text-xl font-semibold">Choose your package</h3>
              <div className="space-y-4">
                {event.packages.map((pkg) => {
                  const isSelected = selectedPackage?.name === pkg.name;

                  return (
                    <button
                      key={pkg.name}
                      type="button"
                      onClick={() => handlePackageChange(pkg)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-white/10 bg-slate-950/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{pkg.name}</p>
                        <p className="font-semibold text-amber-300">{pkg.price}</p>
                      </div>
                      <ul className="mt-3 space-y-2 text-xs text-slate-200/80">
                        {pkg.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {isSelected && (
                        <div className="mt-4 inline-flex items-center gap-2 text-sm text-amber-200">
                          <FaCheckCircle />
                          Selected for booking form
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white">Nearby vendors</h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Enter the event location to preview nearby vendors for this event.
                  </p>
                </div>
                {nearbyState.loading && (
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                    Searching
                  </span>
                )}
              </div>

              {nearbyState.error && (
                <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                  {nearbyState.error}
                </div>
              )}

              {!nearbyState.error && activeNearbyPlanner && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">
                      Recommended assignment
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">
                      {nearbyState.assignedPlanner?.name || activeNearbyPlanner.name}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-200">
                      <span className="inline-flex items-center gap-2">
                        <FaMapMarkerAlt className="text-amber-300" />
                        {nearbyState.requestedLocation || formData.eventLocation}
                      </span>
                      {typeof activeNearbyPlanner.distanceKm === "number" && (
                        <span className="inline-flex items-center gap-2">
                          <FaClock className="text-amber-300" />
                          Approx. {activeNearbyPlanner.distanceKm} km away
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      {activeNearbyPlanner.available === true
                        ? "This vendor is currently available for your selected slot."
                        : activeNearbyPlanner.availabilityReason}
                    </p>
                  </div>

                  {activeNearbyPlanner.mapEmbedUrl && (
                    <iframe
                      title={`Nearby vendor map for ${activeNearbyPlanner.name}`}
                      src={activeNearbyPlanner.mapEmbedUrl}
                      loading="lazy"
                      className="h-72 w-full rounded-2xl border border-white/10"
                    />
                  )}

                  <div className="space-y-3">
                    {nearbyState.nearbyPlanners.map((planner) => (
                      <button
                        key={planner._id}
                        type="button"
                        onClick={() => setActivePlannerId(planner._id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          activePlannerId === planner._id
                            ? "border-amber-400 bg-amber-400/10"
                            : "border-white/10 bg-slate-950/60"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold text-white">
                              {planner.name}
                            </div>
                            <div className="mt-1 text-sm text-amber-200">
                              {planner.specialization}
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-slate-100">
                            <FaStar className="text-amber-300" />
                            {planner.rating?.toFixed?.(1) || planner.rating}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <FaMapMarkerAlt className="text-amber-300" />
                            {[planner.sector, planner.location].filter(Boolean).join(", ")}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <FaPhoneAlt className="text-amber-300" />
                            {planner.contact?.phone}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-300">{planner.summary}</p>
                        <p className="mt-3 text-sm text-slate-200">
                          {typeof planner.distanceKm === "number"
                            ? `Approx. ${planner.distanceKm} km away`
                            : "Matched by event location and service area"}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {planner.available === true
                            ? "Available for the selected slot"
                            : planner.availabilityReason}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!nearbyState.loading &&
                !nearbyState.error &&
                !activeNearbyPlanner &&
                !formData.eventLocation.trim() && (
                  <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
                    Add a venue or city to see nearby vendors and the live map.
                  </div>
                )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
              <h4 className="mb-3 font-semibold">Approval flow</h4>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex gap-3">
                    <FaCheckCircle className="mt-1 text-amber-300" />
                    <span>Your event request is saved in MongoDB immediately.</span>
                  </div>
                <div className="flex gap-3">
                  <FaMapMarkerAlt className="mt-1 text-amber-300" />
                  <span>Nearby vendors are ranked from your location and event type.</span>
                </div>
                <div className="flex gap-3">
                  <FaClipboardCheck className="mt-1 text-amber-300" />
                  <span>Available vendors are auto-assigned first, then admin approves or rejects the request.</span>
                </div>
                </div>
              </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
              <h4 className="mb-3 font-semibold">Looking for something else?</h4>
              <div className="space-y-2 text-sm">
                {eventCategories
                  .filter((item) => item.slug !== event.slug)
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      to={`/events/${item.slug}`}
                      className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 transition hover:border-amber-300"
                    >
                      <span>{item.name}</span>
                      <span className="text-xs text-amber-300">View</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventDetail;
