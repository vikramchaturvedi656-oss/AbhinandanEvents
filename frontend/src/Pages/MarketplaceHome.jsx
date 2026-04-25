import { Link } from "react-router-dom";
import PlannerMarketplaceSection from "../components/PlannerMarketplaceSection";

function MarketplaceHome() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Planner Marketplace
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Discover planners, check live availability, and confirm bookings in
            one flow.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This page keeps the newer booking experience as a focused standalone
            view, while the home page now includes the restored sections too.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/"
              className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950"
            >
              Back to home
            </Link>
            <Link
              to="/signup"
              className="rounded-full border border-white/10 px-5 py-3 text-slate-100"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      <PlannerMarketplaceSection />
    </div>
  );
}

export default MarketplaceHome;
