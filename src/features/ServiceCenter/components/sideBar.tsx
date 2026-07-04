// src/components/Sidebar.tsx
// Fully reusable sidebar — pass activePage + onNavigate as props

//import { PageKey } from "../types";

import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
import type { PageKey } from "../types/index";
import { useNavigate } from "react-router-dom";


// ── Nav item type ─────────────────────────────────────────────────────────────
interface NavItem {
  key:   PageKey;
  label: string;
  icon:  React.ReactNode;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const BookingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
  </svg>
);
const SlotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const ConcernIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const GarageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const MechanicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const ServiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);
const EarningsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"
      fill="url(#sb)" stroke="url(#sb)" strokeWidth="0.5" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sb" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/><stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ── Nav items config ──────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard",      icon: <DashboardIcon /> },
  { key: "bookings",  label: "Bookings",        icon: <BookingsIcon /> },
  { key: "slot",      label: "Slot",            icon: <SlotIcon /> },
  { key: "concern",   label: "Concern Request", icon: <ConcernIcon /> },
  { key: "garage",    label: "Garage",          icon: <GarageIcon /> },
  { key: "mechanic",  label: "Mechanic",        icon: <MechanicIcon /> },
  { key: "service",   label: "Service",         icon: <ServiceIcon /> },
  { key: "earnings",  label: "Earnings",        icon: <EarningsIcon /> },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar({

  // activePage,
  // onNavigate,
  collapsed = false,
  onToggle,
}: SidebarProps) {
    const navigate = useNavigate();
    const {logoutServiceCenter} = useServiceCenterAuth()
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? "68px" : "220px",
        background: "linear-gradient(180deg, #0a0f1e 0%, #080c18 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Logo ───────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-4 border-b"
        style={{
          height: "60px",
          borderColor: "rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(6,182,212,0.1))",
            border: "1px solid rgba(59,130,246,0.35)",
          }}
        >
          <BoltIcon />
        </div>
        {!collapsed && (
          <span
            className="text-white font-extrabold tracking-tight text-[15px] whitespace-nowrap"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Moto<span style={{ color: "#06b6d4" }}>cline</span>
          </span>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-md transition-colors flex-shrink-0"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {collapsed
              ? <><path d="M9 18l6-6-6-6"/><path d="M3 18l6-6-6-6"/></>
              : <><path d="M15 18l-6-6 6-6"/><path d="M21 18l-6-6 6-6"/></>
            }
          </svg>
        </button>
      </div>

      {/* ── Nav label ──────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-2">
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            Main Menu
          </span>
        </div>
      )}

      {/* ── Nav items ──────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2" style={{ scrollbarWidth: "none" }}>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            // const isActive = activePage === item.key;
            const isActive = false;
            return (
              <li key={item.key}>
                <button
                 onClick={() => {
  navigate(`/service-center/${item.key}`);
}}
                  title={collapsed ? item.label : undefined}
                  className="w-full flex items-center gap-3 rounded-xl transition-all duration-200 group relative"
                  style={{
                    height: "42px",
                    padding: collapsed ? "0 0 0 14px" : "0 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    paddingLeft: collapsed ? "0" : "12px",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(6,182,212,0.08))"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(59,130,246,0.28)"
                      : "1px solid transparent",
                    color: isActive ? "#60a5fa" : "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)";
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                      style={{ width: "3px", height: "22px", background: "linear-gradient(180deg,#3b82f6,#06b6d4)" }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ marginLeft: collapsed ? "auto" : "8px", marginRight: collapsed ? "auto" : "0" }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {!collapsed && (
                    <span className="text-[13.5px] font-medium whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <span
                      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-white text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                      style={{
                        background: "rgba(15,22,40,0.95)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
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

      {/* ── Bottom: user + logout ───────────────────────────────── */}
      <div
        className="px-3 pb-4 pt-3 flex flex-col gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* User info */}
        {!collapsed && (
          <div
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", fontFamily: "'Syne',sans-serif", color: "#fff" }}
            >
              SC
            </div>
            <div className="min-w-0">
              <div className="text-white text-[12.5px] font-semibold truncate" style={{ fontFamily: "'DM Sans',sans-serif" }}>Service Center</div>
              <div className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>admin@motocline.com</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
        onClick={logoutServiceCenter}
          className="w-full flex items-center gap-2.5 rounded-xl transition-colors"
          style={{
            height: "38px",
            padding: collapsed ? "0" : "0 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Sans',sans-serif",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.07)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
        >
          <LogoutIcon />
          {!collapsed && <span className="text-[13px] font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
}