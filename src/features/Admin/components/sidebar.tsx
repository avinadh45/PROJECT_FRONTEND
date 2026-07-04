// src/components/AdminSidebar.tsx
// Reusable sidebar — pass activePage + onNavigate
// Green (#10b981) accent, dark bg, active highlight with left bar

import type { AdminPageKey } from "../types/index";
import { useAdminAuth } from "../hook/useAdminAuth";
interface NavItem {
  key:   AdminPageKey;
  label: string;
  icon:  React.ReactNode;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);
const GarageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const EarningsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v2m0 8v2m-4-7h2a2 2 0 004 0h2"/>
  </svg>
);
const BookingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
  </svg>
);
const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const SubscriptionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const ConcernIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"
      fill="url(#sb2)" stroke="url(#sb2)" strokeWidth="0.5" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sb2" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10b981"/><stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);
const ChevronIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {collapsed
      ? <><path d="M9 18l6-6-6-6"/><path d="M3 18l6-6-6-6"/></>
      : <><path d="M15 18l-6-6 6-6"/><path d="M21 18l-6-6 6-6"/></>
    }
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard",           label: "Dashboard",            icon: <HomeIcon /> },
  { key: "garage-verification", label: "Garage Verification",  icon: <ShieldCheckIcon /> },
  { key: "garage",              label: "Garage",               icon: <GarageIcon /> },
  { key: "users",               label: "Users",                icon: <UsersIcon /> },
  { key: "earnings",            label: "Earnings",             icon: <EarningsIcon /> },
  { key: "bookings",            label: "Bookings",             icon: <BookingsIcon /> },
  { key: "category",            label: "Category",             icon: <CategoryIcon /> },
  { key: "subscription",        label: "Subscription",         icon: <SubscriptionIcon /> },
  { key: "concern",             label: "Concern Management",   icon: <ConcernIcon /> },
  { key: "profile",             label: "Profile",              icon: <ProfileIcon /> },
];

interface AdminSidebarProps {
  activePage: AdminPageKey;
  onNavigate: (page: AdminPageKey) => void;
  collapsed?: boolean;
  onToggle?:  () => void;
  onLogout?:  () => void;
}

export default function AdminSidebar({
  activePage,
  onNavigate,
  collapsed = false,
  onToggle,
  //onLogout,
}: AdminSidebarProps) {
  const {logoutAdmin} = useAdminAuth()
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? "64px" : "200px",
        background: "linear-gradient(180deg, #0d1510 0%, #0a120e 100%)",
        borderRight: "1px solid rgba(16,185,129,0.1)",
        boxShadow: "4px 0 20px rgba(0,0,0,0.4)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 flex-shrink-0"
        style={{ height: "56px", borderBottom: "1px solid rgba(16,185,129,0.08)" }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.1))",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <BoltIcon />
        </div>
        {!collapsed && (
          <span
            className="font-extrabold text-[15px] text-white tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}
          >
            Moto<span style={{ color: "#10b981" }}>cline</span>
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto flex-shrink-0 transition-colors"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", padding: "2px" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
        >
          <ChevronIcon collapsed={collapsed} />
        </button>
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1.5">
          <span style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
            Navigation
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-1" style={{ scrollbarWidth: "none" }}>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = activePage === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => onNavigate(item.key)}
                  title={collapsed ? item.label : undefined}
                  className="w-full flex items-center gap-2.5 rounded-xl relative group transition-all duration-200"
                  style={{
                    height: "40px",
                    padding: collapsed ? "0" : "0 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive
                      ? "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.08))"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(16,185,129,0.28)"
                      : "1px solid transparent",
                    color: isActive ? "#10b981" : "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.07)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.78)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
                    }
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                      style={{ width: "3px", height: "20px", background: "linear-gradient(180deg,#10b981,#06b6d4)" }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ marginLeft: collapsed ? "auto" : "6px", marginRight: collapsed ? "auto" : "0" }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {!collapsed && (
                    <span
                      className="text-[12.5px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <span
                      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-white text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                      style={{
                        background: "rgba(13,21,16,0.96)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-2.5 pb-4 pt-2" style={{ borderTop: "1px solid rgba(16,185,129,0.08)" }}>
        <button
          onClick={logoutAdmin}
          className="w-full flex items-center gap-2.5 rounded-xl transition-all duration-200"
          style={{
            height: "40px",
            padding: collapsed ? "0" : "0 10px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(239,68,68,0.55)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,0.55)";
          }}
        >
          <span className="flex items-center justify-center flex-shrink-0"
            style={{ marginLeft: collapsed ? "auto" : "6px", marginRight: collapsed ? "auto" : "0" }}>
            <LogoutIcon />
          </span>
          {!collapsed && (
            <span className="text-[12.5px] font-medium" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}