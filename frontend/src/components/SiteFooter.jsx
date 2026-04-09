import { Link } from "react-router-dom";

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Abhinandan Events
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Explore the restored home page and book trusted event planners in one place.
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Browse event cards, verify live slot availability, confirm bookings,
            and manage every appointment from one connected platform.
          </p>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="font-semibold text-white">Quick links</div>
          <Link to="/" className="block hover:text-white">
            Home
          </Link>
          <Link to="/marketplace" className="block hover:text-white">
            Planner booking
          </Link>
          <Link to="/client-dashboard" className="block hover:text-white">
            User dashboard
          </Link>
          <Link to="/admin-dashboard" className="block hover:text-white">
            Admin panel
          </Link>
          <Link to="/contact" className="block hover:text-white">
            Contact
          </Link>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="font-semibold text-white">Support</div>
          <p>Noida Sector 18 service desk</p>
          <p>support@abhinandanevents.com</p>
          <p>+91 98765 43210</p>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
            Live booking checks backed by the database
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
