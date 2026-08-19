import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/sidebar";
import AdminTopbar from "../components/topbar";
import type { AdminPageKey } from "../types";

const PAGE_META: Record<AdminPageKey, { title: string; subtitle: string }> = {
  dashboard:             { title: "Dashboard",           subtitle: "Platform overview & analytics" },
  "garage-verification": { title: "Garage Verification", subtitle: "Review pending garage applications" },
  garage:                { title: "Garage Management",   subtitle: "All registered garages" },
  users:                 { title: "Users",               subtitle: "Platform user accounts" },
  earnings:              { title: "Earnings",             subtitle: "Revenue & financial metrics" },
  bookings:              { title: "Bookings",             subtitle: "All service bookings" },
  category:              { title: "Category",             subtitle: "Service category management" },
  subscription:          { title: "Subscription",         subtitle: "Plans & memberships" },
  concern:               { title: "Concern Management",   subtitle: "User & garage reports" },
  profile:               { title: "Admin Profile",        subtitle: "Account settings" },
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageKey = location.pathname.split("/").pop() as AdminPageKey;
  const meta = PAGE_META[pageKey] ?? PAGE_META.dashboard;

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        activePage={pageKey}
        onNavigate={(path) => navigate(path)}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar title={meta.title} subtitle={meta.subtitle} />
        <Outlet />
      </div>
    </div>
  );
}