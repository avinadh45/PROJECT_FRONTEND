// // src/App.tsx
// import { useState } from "react";
// import AdminSidebar from "../../components/admin/sidebar";
// import AdminTopbar  from "../../components/admin/topbar";
// import AdminDashboard from "../../pages/admin/Dashboard";
// import AdminPlaceholder from "../../pages/admin/placeholder";
// import type { AdminPageKey } from "../../types/Admin/index";

// const PAGE_META: Record<AdminPageKey, { title: string; subtitle: string }> = {
//   dashboard:             { title: "Dashboard",             subtitle: "Platform overview & analytics" },
//   "garage-verification": { title: "Garage Verification",   subtitle: "Review pending garage applications" },
//   garage:                { title: "Garage Management",     subtitle: "All registered garages" },
//   users:                 { title: "Users",                 subtitle: "Platform user accounts" },
//   earnings:              { title: "Earnings",              subtitle: "Revenue & financial metrics" },
//   bookings:              { title: "Bookings",              subtitle: "All service bookings" },
//   category:              { title: "Category",              subtitle: "Service category management" },
//   subscription:          { title: "Subscription",          subtitle: "Plans & memberships" },
//   concern:               { title: "Concern Management",    subtitle: "User & garage reports" },
//   profile:               { title: "Admin Profile",         subtitle: "Account settings" },
// };

// export default function App() {
//   const [page,      setPage]      = useState<AdminPageKey>("dashboard");
//   const [collapsed, setCollapsed] = useState(false);
//   const meta = PAGE_META[page];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
//         *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
//         html, body, #root { height:100%; background:#0a120e; -webkit-font-smoothing:antialiased; }
//         ::-webkit-scrollbar { width:5px; height:5px; }
//         ::-webkit-scrollbar-track { background:transparent; }
//         ::-webkit-scrollbar-thumb { background:rgba(16,185,129,.3); border-radius:3px; }
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.5)} }
//       `}</style>

//       <div className="flex h-screen overflow-hidden">
//         {/* ── Reusable Sidebar ── */}
//         <AdminSidebar
//           activePage={page}
//           onNavigate={setPage}
//           collapsed={collapsed}
//           onToggle={() => setCollapsed(c => !c)}
//           onLogout={() => alert("Logging out…")}
//         />

//         {/* ── Main ── */}
//         <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//           <AdminTopbar title={meta.title} subtitle={meta.subtitle} />
//           {page === "dashboard"
//             ? <AdminDashboard />
//             : <AdminPlaceholder page={page} />
//           }
//         </div>
//       </div>
//     </>
//   );
// }

import { useNavigate, useLocation } from "react-router-dom"


import type { AdminPageKey } from "../types";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from '../components/sidebar';
import AdminTopbar from "../components/topbar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
const navigate = useNavigate()
const location = useLocation()
  return (
    <div className="flex h-screen overflow-hidden">

      <AdminSidebar
       activePage={location.pathname.split("/").pop() as AdminPageKey}
       onNavigate={(path) => navigate(path)}
       collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar title="Dashboard" subtitle="Platform overview & analytics" />

        <Outlet />

      </div>

    </div>
  );
}