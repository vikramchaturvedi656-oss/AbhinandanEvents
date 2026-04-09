import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import SiteNavbar from "./components/SiteNavbar";
import SiteFooter from "./components/SiteFooter";
import MainHome from "./Pages/MainHome";
import MarketplaceHome from "./Pages/MarketplaceHome";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import EventDetail from "./Pages/EventDetail";
import UserProfile from "./Pages/UserProfile";
import Login from "./Auth_components/SecureLogin";
import Signup from "./Auth_components/SecureSignup";
import VendorRegister from "./Auth_components/VendorRegister";
import UserDashboard from "./Pages/UserDashboard";
import PlannerOpsDashboard from "./Pages/PlannerOpsDashboard";
import AdminControlPanel from "./Pages/AdminControlPanel";
import { getDashboardPath, getStoredUser } from "./utils/session";

function DashboardRedirect() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPath(user.role)} replace />;
}

function AdminRoute() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <AdminControlPanel />;
}

function App() {
  return (
    <Router>
      <SiteNavbar />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/marketplace" element={<MarketplaceHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/client-dashboard" element={<UserDashboard />} />
          <Route path="/planner-dashboard" element={<PlannerOpsDashboard />} />
          <Route path="/admin-dashboard" element={<AdminRoute />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <SiteFooter />
    </Router>
  );
}

export default App;
