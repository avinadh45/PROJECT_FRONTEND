// pages/admin/GarageDetails.tsx
// Usage: <AdminLayout><GarageDetails garageId={id} onBack={() => navigate(-1)} /></AdminLayout>
// Sidebar is handled by AdminLayout — not included here.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminAuth } from '../hook/useAdminAuth';
// ── Types ─────────────────────────────────────────────────────────────────────
type GarageStatus = "Active" | "Blocked" | "Pending" | "Inactive";

interface GarageData {
  id: string;
  name: string;
  initials: string;
  ownerName: string;
  phone: string;
  email: string;
  memberSince: string;
  status: GarageStatus;
  isVerified: boolean;
  // ── Location fields (commented — uncomment when needed) ──
  // location: string;
  // lat: number;
  // lng: number;
}

// Mock data removed in favor of dynamic API data

// ── Props ─────────────────────────────────────────────────────────────────────
interface GarageDetailsProps {
  garageId?: string;
  onBack?: () => void;
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<GarageStatus, { color: string; bg: string; border: string; glow: string }> = {
  Active:   { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  glow: "rgba(16,185,129,0.25)" },
  Blocked:  { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", glow: "rgba(248,113,113,0.25)" },
  Pending:  { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  glow: "rgba(251,191,36,0.25)" },
  Inactive: { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)", glow: "rgba(148,163,184,0.15)" },
};

// ── Block Confirmation Modal ───────────────────────────────────────────────────
function BlockModal({ garageName, isBlocked, onConfirm, onCancel }: {
  garageName: string; isBlocked: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "gd-fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 420,
        background: "linear-gradient(160deg, #0f1a14 0%, #0a1410 100%)",
        border: `1px solid ${isBlocked ? "rgba(16,185,129,0.3)" : "rgba(248,113,113,0.3)"}`,
        borderRadius: 20, padding: "36px 30px",
        boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
        animation: "gd-scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: "0 auto 22px",
          background: isBlocked ? "rgba(16,185,129,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${isBlocked ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.25)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 24px ${isBlocked ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)"}`,
        }}>
          {isBlocked ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          )}
        </div>
        <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#fff", textAlign: "center", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.3px" }}>
          {isBlocked ? "Unblock Garage?" : "Block Garage?"}
        </h3>
        <p style={{ margin: "0 0 28px", fontSize: 13.5, color: "rgba(255,255,255,0.42)", textAlign: "center", lineHeight: 1.7 }}>
          {isBlocked
            ? <><strong style={{ color: "#fff" }}>{garageName}</strong> will regain full access and can accept bookings.</>
            : <><strong style={{ color: "#fff" }}>{garageName}</strong> will be suspended and lose access immediately.</>
          }
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: "13px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
          >Cancel</button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: "13px", borderRadius: 10, border: "none", background: isBlocked ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#dc2626,#f87171)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: isBlocked ? "0 4px 18px rgba(16,185,129,0.35)" : "0 4px 18px rgba(248,113,113,0.35)", transition: "all 0.18s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
          >{isBlocked ? "Yes, Unblock" : "Yes, Block"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Info Field ────────────────────────────────────────────────────────────────
function InfoField({ label, value, icon, accent, vis, delay = 0 }: {
  label: string; value: string; icon: React.ReactNode; accent?: string; vis: boolean; delay?: number;
}) {
  return (
    <div style={{
      padding: "20px 22px",
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12,
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(10px)",
      transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
    }}>
      <p style={{ margin: "0 0 8px", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: accent || "rgba(255,255,255,0.38)", flexShrink: 0 }}>{icon}</span>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: accent || "#e2e8f0" }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GarageDetails({ onBack }: GarageDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { serviceCenterDetails, selectedServiceCenter, loading, error, serviceCenterblock } = useAdminAuth();

  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (id) {
      serviceCenterDetails(id);
    }
    setTimeout(() => setMounted(true), 50);
  }, [id]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
        Error loading details: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
        Loading details...
      </div>
    );
  }

  if (!selectedServiceCenter) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
        Service Center not found.
      </div>
    );
  }

  const garage: GarageData = {
    id: selectedServiceCenter.id,
    name: selectedServiceCenter.name,
    initials: selectedServiceCenter.name?.substring(0, 2).toUpperCase() || "SC",
    ownerName: selectedServiceCenter.ownerName || "N/A",
    phone: selectedServiceCenter.phoneNumber || "N/A",
    email: selectedServiceCenter.email,
   memberSince: selectedServiceCenter.createdAt
  ? new Date(selectedServiceCenter.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  : "N/A",
    status: selectedServiceCenter.isBlocked ? "Blocked" : "Active",
    isVerified: true,
  };

  const isBlocked = garage.status === "Blocked";
  const cfg = STATUS_CFG[garage.status];

  const handleConfirm = async () => {
    try {
      if (!garage?.id) return;
      await serviceCenterblock(garage.id);
      setShowModal(false);
      setToast({
        msg: isBlocked ? "Garage has been unblocked." : "Garage has been blocked.",
        type: isBlocked ? "success" : "error"
      });
      setTimeout(() => setToast(null), 3200);
    } catch (error) {
      console.error(error);
    }
  };

  // SVG icons reused across fields
  const icons = {
    user:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    phone:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.05 3.4 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>,
    calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    mail:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    // location: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes gd-fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes gd-scaleIn   { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes gd-slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:none} }
        @keyframes gd-pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.55)} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans',sans-serif", color: "#e2e8f0", padding: "32px" }}>

        {/* ── Toast ── */}
        {toast && (
          <div style={{
            position: "fixed", top: 22, right: 26, zIndex: 400,
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 18px", borderRadius: 11,
            background: toast.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)",
            border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.4)" : "rgba(248,113,113,0.4)"}`,
            color: toast.type === "success" ? "#10b981" : "#f87171",
            fontSize: 13.5, fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            animation: "gd-slideDown 0.25s ease",
            backdropFilter: "blur(12px)",
          }}>
            {toast.type === "success"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            }
            {toast.msg}
          </div>
        )}

        {/* ── Breadcrumb ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          <button onClick={() => onBack ? onBack() : navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "inherit", transition: "color 0.18s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#10b981")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Garage Management
          </button>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{garage.name}</span>
        </div>

        {/* ── Hero Card ── */}
        <div style={{
          background: "linear-gradient(145deg,rgba(14,22,18,0.97) 0%,rgba(10,16,14,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18, padding: "26px 28px",
          marginBottom: 18,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(18px)",
          transition: "opacity 0.45s ease 0.05s, transform 0.45s ease 0.05s",
          position: "relative", overflow: "hidden",
        }}>
          {/* Top accent line — color changes with status */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color}22, transparent)`, transition: "background 0.5s" }} />

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: `linear-gradient(135deg,${cfg.color}33,${cfg.color}18)`,
                border: `2px solid ${cfg.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 800, color: cfg.color,
                letterSpacing: "0.05em", fontFamily: "'Syne',sans-serif",
                boxShadow: `0 0 28px ${cfg.glow}`,
                transition: "all 0.4s",
              }}>{garage.initials}</div>
              <div style={{
                position: "absolute", bottom: -3, right: -3,
                width: 16, height: 16, borderRadius: "50%",
                background: cfg.color, border: "3px solid #0d1117",
                boxShadow: `0 0 10px ${cfg.glow}`,
                animation: garage.status === "Active" ? "gd-pulse 2.5s infinite" : "none",
                transition: "background 0.4s",
              }} />
            </div>

            {/* Name + badges */}
            <div>
              <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", fontFamily: "'Syne',sans-serif" }}>
                {garage.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 12px", borderRadius: 20,
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  color: cfg.color, fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  transition: "all 0.4s",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
                  {garage.status}
                </span>
                {garage.isVerified && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 12px", borderRadius: 20,
                    background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                    color: "#22d3ee", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    Verified Vendor
                  </span>
                )}
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                  ID: <strong style={{ color: "rgba(255,255,255,0.5)" }}>{garage.id}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowModal(true)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 20px", borderRadius: 10,
              border: isBlocked ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(248,113,113,0.4)",
              background: isBlocked ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
              color: isBlocked ? "#10b981" : "#f87171",
              fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.15)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              {isBlocked ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              )}
              {isBlocked ? "Unblock Garage" : "Block Garage"}
            </button>

            <button onClick={() => onBack ? onBack() : navigate(-1)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 20px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#059669,#10b981)",
              color: "#fff", fontSize: 13.5, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 18px rgba(16,185,129,0.32)", transition: "all 0.18s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
          </div>
        </div>

        {/* ── Garage Information Card ── */}
        <div style={{
          background: "linear-gradient(160deg,rgba(14,22,18,0.97) 0%,rgba(10,16,14,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18, padding: "28px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(18px)",
          transition: "opacity 0.45s ease 0.12s, transform 0.45s ease 0.12s",
        }}>
          {/* Section heading */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16,185,129,0.12)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Garage Information</h2>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Registered service center details</p>
            </div>
          </div>

          {/* Info grid — 2 columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            <InfoField label="Owner Name"    value={garage.ownerName}    vis={mounted} delay={150} accent="rgba(255,255,255,0.85)" icon={icons.user} />

            {/* ── Location field (commented — uncomment when needed) ──
            <InfoField label="Location" value={garage.location} vis={mounted} delay={190} accent="#fbbf24" icon={icons.location} />
            */}

            <InfoField label="Phone Number"  value={garage.phone}        vis={mounted} delay={190} accent="#22d3ee"  icon={icons.phone} />
            <InfoField label="Member Since"  value={garage.memberSince}  vis={mounted} delay={230} accent="#a78bfa"  icon={icons.calendar} />
            <InfoField label="Email Address" value={garage.email}        vis={mounted} delay={270} accent="#10b981"  icon={icons.mail} />

            {/* Operational Status */}
            <div style={{
              padding: "20px 22px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(10px)",
              transition: "opacity 0.4s ease 310ms, transform 0.4s ease 310ms",
            }}>
              <p style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Operational Status
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 13px", borderRadius: 20,
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  color: cfg.color, fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  transition: "all 0.4s",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block", animation: garage.status === "Active" ? "gd-pulse 2.5s infinite" : "none" }} />
                  {garage.status}
                </span>
                {garage.isVerified && (
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Verified Vendor</span>
                )}
              </div>
            </div>

          </div>

          {/* ── Service Area Map section (commented — uncomment when needed) ──
          <div style={{ marginTop: 24 }}>
            <p style={{ margin: "0 0 12px", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Service Area Map
            </p>
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", height: 220 }}>
              Replace with your map component:
              <MapContainer center={[garage.lat, garage.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[garage.lat, garage.lng]}>
                  <Popup>{garage.name} Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          */}

        </div>
      </div>

      {/* ── Block Modal ── */}
      {showModal && (
        <BlockModal
          garageName={garage.name}
          isBlocked={isBlocked}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}