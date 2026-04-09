import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaChartLine,
  FaComments,
  FaGlobe,
  FaLightbulb,
  FaMobileAlt,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaWallet,
} from "react-icons/fa";
import PlannerMarketplaceSection from "../components/PlannerMarketplaceSection";
import eventCategories from "../data/eventCategories";

const stats = [
  {
    value: "35%",
    label: "Planning time saved when everything is centralized (research)",
  },
  {
    value: "87%",
    label: "Users rate transparent pricing as the top priority",
  },
  {
    value: "92%",
    label: "Rely on verified reviews before booking a vendor",
  },
];

const pillars = [
  {
    title: "Centralized planning",
    copy: "One workspace to discover venues, catering, decor, photography, entertainment, transport, and more, without juggling tabs and chats.",
  },
  {
    title: "Transparent by default",
    copy: "Upfront packages, availability, and costs keep budgets on track and remove last-minute surprises.",
  },
  {
    title: "Guided coordination",
    copy: "Structured booking statuses, reminders, and a shared event calendar cut manual follow-ups and miscommunication.",
  },
  {
    title: "Local and accessible",
    copy: "Gives local providers a digital storefront and helps every budget find quality options without compromise.",
  },
];

const features = [
  {
    icon: <FaSearch className="text-xl text-amber-400" />,
    title: "Curated vendor discovery",
    copy: "Filter by city, budget, date, and event type, then compare side-by-side with portfolios and real photos.",
  },
  {
    icon: <FaShieldAlt className="text-xl text-emerald-400" />,
    title: "Verified profiles and reviews",
    copy: "Identity checks, work samples, and verified booking reviews ensure trust where 92% of users look first.",
  },
  {
    icon: <FaCalendarCheck className="text-xl text-sky-400" />,
    title: "Booking and coordination",
    copy: "Automated status tracking, reminders, and shared timelines reduce miscommunication by 43% (research).",
  },
  {
    icon: <FaWallet className="text-xl text-rose-400" />,
    title: "Budget clarity",
    copy: "Upfront package breakdowns, expense tracking, and add-on visibility keep spending predictable.",
  },
  {
    icon: <FaChartLine className="text-xl text-indigo-400" />,
    title: "Dashboards and analytics",
    copy: "Clients see booking progress while vendors see demand, conversion, and revenue insights.",
  },
  {
    icon: <FaComments className="text-xl text-lime-300" />,
    title: "Communication hub",
    copy: "Message vendors, share inspiration, and keep quote threads and documents in one searchable place.",
  },
];

const roadmap = [
  {
    icon: <FaMobileAlt className="text-amber-400" />,
    title: "Mobile apps (iOS and Android)",
    copy: "React Native build for push updates, on-the-go approvals, and quick photo uploads.",
  },
  {
    icon: <FaComments className="text-emerald-400" />,
    title: "Real-time chat",
    copy: "Group conversations, file sharing, and read receipts to shrink response times.",
  },
  {
    icon: <FaLightbulb className="text-rose-400" />,
    title: "AI planning assistant",
    copy: "24/7 answers, vendor suggestions, and checklist guidance tailored to your event type.",
  },
  {
    icon: <FaWallet className="text-indigo-300" />,
    title: "Payments and escrow",
    copy: "Secure deposits, milestone releases, receipts, and multi-method payments in one flow.",
  },
  {
    icon: <FaChartLine className="text-sky-300" />,
    title: "Advanced analytics",
    copy: "Conversion, spend, and performance insights for both organizers and vendors.",
  },
  {
    icon: <FaGlobe className="text-lime-300" />,
    title: "Virtual and hybrid experiences",
    copy: "Live streaming hooks and virtual venue tours to keep remote guests fully included.",
  },
];

const testimonials = [
  {
    quote:
      "Centralized vendor discovery plus transparent pricing meant no late surprises. We locked decor, catering, and photography in a single evening.",
    name: "Ananya Sharma - wedding client",
  },
  {
    quote:
      "The shared event calendar and automated reminders cut follow-up emails by half for our annual sales summit.",
    name: "Rahul Verma - corporate planner",
  },
  {
    quote:
      "As a local decorator, verified reviews and feature placements doubled my qualified inquiries in two months.",
    name: "Priya Kapoor - vendor partner",
  },
];

function MainHome() {
  const [requestData, setRequestData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    city: "",
    date: "",
    budget: "",
    notes: "",
  });
  const [formStatus, setFormStatus] = useState("");

  const handleInputChange = (field) => (event) =>
    setRequestData((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSelectService = (service) => {
    setRequestData((prev) => ({ ...prev, eventType: service }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormStatus(
      `Thanks! We received your request for ${
        requestData.eventType || "an event"
      }. Expect a response within one business day.`
    );
    setRequestData((prev) => ({
      name: "",
      email: "",
      phone: "",
      eventType: prev.eventType,
      city: "",
      date: "",
      budget: "",
      notes: "",
    }));
  };

  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=80"
            alt="Event planning backdrop"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-900" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-300">
            Abhinandan Events | Home + Marketplace Combined
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Centralized, transparent event planning with the full homepage and
            the newer booking experience together.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-200/90">
            Explore event cards, compare planners, request services, and keep
            the updated live-booking flow on the same home page.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#planner-marketplace"
              className="rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 px-6 py-3 font-semibold shadow-lg shadow-rose-900/30 transition hover:-translate-y-[2px]"
            >
              Explore planner cards
            </a>
            <Link
              to="/signup"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold transition hover:border-amber-400 hover:text-amber-200"
            >
              Plan my event
            </Link>
            <Link
              to="/vendor-register"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold transition hover:border-amber-400 hover:text-amber-200"
            >
              List my business
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <p className="text-3xl font-bold text-amber-300">{item.value}</p>
                <p className="text-sm text-slate-200/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Why organizers choose us</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
            Restored homepage sections
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
            >
              <h3 className="mb-3 text-xl font-semibold text-amber-200">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-200/80">{pillar.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
                Platform
              </p>
              <h2 className="mt-2 text-3xl font-bold">Built-in capabilities</h2>
              <p className="mt-2 max-w-3xl text-slate-200/80">
                Vendor discovery, booking, budgeting, and communication live in
                the same flow with the home content restored.
              </p>
            </div>
            <div className="text-sm text-slate-300">
              Research-backed focus on transparency, centralization, automation,
              and accessibility.
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/25"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/5 p-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-200/80">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
              Coverage
            </p>
            <h2 className="mt-2 text-3xl font-bold">Events we excel at</h2>
            <p className="mt-2 text-slate-200/80">
              Event cards are back on the home page so users can browse before
              booking.
            </p>
          </div>
          <a href="#planner-marketplace" className="text-sm text-amber-200 underline">
            Jump to planner booking
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/events/${category.slug}`}
              className="group"
              onClick={() => handleSelectService(category.name)}
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30 transition group-hover:-translate-y-1">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <FaStar className="text-amber-300" />
                  </div>
                  <p className="mt-2 text-sm text-slate-200/80">
                    {category.desc}
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-200/80">
                    {category.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg border border-amber-300/60 px-4 py-2 text-center font-semibold text-amber-200 transition hover:bg-amber-500 hover:text-slate-900">
                    View details and request
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PlannerMarketplaceSection />

      <section id="request-form" className="border-y border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
                Request
              </p>
              <h2 className="mt-2 text-3xl font-bold">Tell us about your event</h2>
              <p className="mt-2 text-slate-200/80">
                Share your details and we will respond with a curated vendor
                shortlist, transparent packages, and a coordinated timeline.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4 rounded-xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/25"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder="Full name"
                    value={requestData.name}
                    onChange={handleInputChange("name")}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={requestData.email}
                    onChange={handleInputChange("email")}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={requestData.phone}
                    onChange={handleInputChange("phone")}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                  />
                  <select
                    required
                    value={requestData.eventType}
                    onChange={handleInputChange("eventType")}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">Select event type</option>
                    {eventCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="date"
                    value={requestData.date}
                    onChange={handleInputChange("date")}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="City / venue preference"
                    value={requestData.city}
                    onChange={handleInputChange("city")}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Budget range (e.g., INR 50K - 1L)"
                  value={requestData.budget}
                  onChange={handleInputChange("budget")}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                />

                <textarea
                  rows={4}
                  placeholder="Notes: guest count, theme, must-have vendors, timelines..."
                  value={requestData.notes}
                  onChange={handleInputChange("notes")}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-50 focus:border-amber-400 focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600 py-3 font-semibold shadow-lg shadow-rose-900/30 transition hover:-translate-y-[1px]"
                >
                  Send request
                </button>

                {formStatus && <p className="text-sm text-emerald-300">{formStatus}</p>}
              </form>
            </div>

            <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-black/25">
              <h3 className="text-xl font-semibold">What happens next</h3>
              <ul className="space-y-3 text-sm text-slate-200/90">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <span>We align on your budget, timeline, and must-haves.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <span>
                    Within 24 hours you get a vendor shortlist with transparent
                    packages.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <span>
                    We coordinate confirmations, reminders, and a shared event
                    calendar.
                  </span>
                </li>
              </ul>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-bold text-amber-300">24h</p>
                  <p className="text-xs text-slate-200/80">Shortlist turnaround</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-bold text-amber-300">Transparent</p>
                  <p className="text-xs text-slate-200/80">
                    Upfront pricing and packages
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
                <p className="text-sm text-slate-100">
                  Prefer a human walkthrough? Mention it in notes and we will
                  schedule a call or video demo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">Roadmap highlights</h2>
            <span className="text-xs text-slate-300">
              Upcoming releases prioritized by user feedback
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/25"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/5 p-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-200/80">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold">What our community says</h2>
          <span className="text-sm text-slate-300">
            Verified after completed bookings
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
            >
              <p className="text-sm leading-relaxed text-slate-100">{item.quote}</p>
              <p className="mt-4 font-semibold text-amber-200">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600 text-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to plan without the chaos?
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-lg">
            Join Abhinandan Events to centralize vendor discovery, pricing
            clarity, coordination, and live planner booking.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-900"
            >
              Create client account
            </Link>
            <Link
              to="/vendor-register"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Become a vendor partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainHome;
