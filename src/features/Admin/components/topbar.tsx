// src/components/AdminTopbar.tsx
import { useState, useRef, useEffect } from "react";
import { useAdminAuth } from "../hook/useAdminAuth";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
}

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  const { logoutAdmin } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: "56px",
        padding: "0 28px",
        // Same gradient direction + stops as AdminSidebar, no transparency/blur
        background: "linear-gradient(180deg, #0d1510 0%, #0a120e 100%)",
        borderBottom: "1px solid rgba(16,185,129,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div>
        <h1
          className="text-white font-extrabold text-[18px] tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans',sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Bell — same hover language as sidebar nav items */}
        <button
          className="relative flex items-center justify-center rounded-xl transition-colors"
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(16,185,129,0.08)";
            e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          <BellIcon />
          <span
            className="absolute rounded-full"
            style={{
              top: "8px",
              right: "8px",
              width: "7px",
              height: "7px",
              background: "#10b981",
              border: "2px solid #0a120e",
              animation: "pulseDot 2s infinite",
            }}
          />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.08)" }} />

        {/* Account menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl transition-all"
            style={{
              padding: "4px 8px 4px 4px",
              background: menuOpen ? "rgba(16,185,129,0.1)" : "transparent",
              border: `1px solid ${menuOpen ? "rgba(16,185,129,0.28)" : "transparent"}`,
              cursor: "pointer",
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg font-bold flex-shrink-0"
              style={{
                width: "34px",
                height: "34px",
                background: "linear-gradient(135deg,#10b981,#06b6d4)",
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
                color: "#fff",
              }}
            >
              AD
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                transform: menuOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.15s ease",
              }}
            >
              <ChevronDownIcon />
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 rounded-xl overflow-hidden"
              style={{
                width: "190px",
                background: "linear-gradient(180deg, #0d1510 0%, #0a120e 100%)",
                border: "1px solid rgba(16,185,129,0.18)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div className="px-3.5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color: "#fff", fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  Admin
                </p>
                <p style={{ color: "rgba(255,255,255,0.32)", fontSize: "11px" }}>admin@motocline.com</p>
              </div>

              <button
                className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 transition-colors"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <UserIcon /> Profile settings
              </button>

              <button
                onClick={logoutAdmin}
                className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 transition-colors"
                style={{ color: "rgba(239,68,68,0.75)", fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                  e.currentTarget.style.color = "#f87171";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(239,68,68,0.75)";
                }}
              >
                <LogoutIcon /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}