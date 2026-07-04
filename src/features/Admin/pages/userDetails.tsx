import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hook/useAdminAuth";
 
// ── Types ─────────────────────────────────────────────────────────────────────
type UserStatus = "Active" | "Blocked" | "Inactive";
 
interface UserData {
  id: string;
  name: string;
  avatar: string;       // initials
  avatarColor: string;
  phone: string;
  email: string;
  joinedOn: string;
  status: UserStatus;
  bookings: number;
  location: string;
  lastActive: string;
}
 
// No mock user
// ── Props ─────────────────────────────────────────────────────────────────────
interface UserProfileProps {
  userId?: string;
  onBack?: () => void;
}
 
// ── Block Confirmation Modal ───────────────────────────────────────────────────
function BlockModal({
  userName,
  isBlocked,
  onConfirm,
  onCancel,
}: {
  userName: string;
  isBlocked: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.18s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 400,
          background: "linear-gradient(160deg, #0f1a14 0%, #0a1410 100%)",
          border: `1px solid ${isBlocked ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.25)"}`,
          borderRadius: 18,
          padding: "32px 28px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "scaleIn 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: "0 auto 20px",
          background: isBlocked ? "rgba(16,185,129,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${isBlocked ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.25)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {isBlocked ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          )}
        </div>
 
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "-0.3px" }}>
          {isBlocked ? "Unblock User?" : "Block User?"}
        </h3>
        <p style={{ margin: "0 0 28px", fontSize: 13.5, color: "rgba(255,255,255,0.42)", textAlign: "center", lineHeight: 1.6 }}>
          {isBlocked
            ? <>Are you sure you want to unblock <strong style={{ color: "#fff" }}>{userName}</strong>? They will regain access to the platform.</>
            : <>Are you sure you want to block <strong style={{ color: "#fff" }}>{userName}</strong>? They will lose access to the platform immediately.</>
          }
        </p>
 
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "12px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none",
              background: isBlocked
                ? "linear-gradient(135deg,#059669,#10b981)"
                : "linear-gradient(135deg,#dc2626,#f87171)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: isBlocked
                ? "0 4px 16px rgba(16,185,129,0.3)"
                : "0 4px 16px rgba(248,113,113,0.3)",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; }}
          >
            {isBlocked ? "Yes, Unblock" : "Yes, Block"}
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ── Info Field ────────────────────────────────────────────────────────────────
function InfoField({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{
      padding: "18px 20px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}>
      <p style={{ margin: "0 0 6px", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: accent || "#fff", letterSpacing: "0.01em" }}>
        {value}
      </p>
    </div>
  );
}
 
// ── Main Component ────────────────────────────────────────────────────────────
export default function UserProfile({ onBack }: UserProfileProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { UsersDetails, selectedUser, loading, error,Blockuser } = useAdminAuth();
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    console.log("selectedUser state:", selectedUser);
    console.log("error state:", error);
  }, [selectedUser, error]);

  useEffect(() => {
    if (id) {
      UsersDetails(id);
    }
    setTimeout(() => setMounted(true), 40);
  }, [id]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
        Error loading profile: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
        Loading profile...
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
        User not found.
      </div>
    );
  }

  const user: UserData = {
    id: selectedUser.id,
    name: selectedUser.name,
    avatar: selectedUser.name?.charAt(0).toUpperCase() || "U",
    avatarColor: "#10b981",
    phone: selectedUser.phoneNumber || "N/A",
    email: selectedUser.email,
    joinedOn: selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A",
    status: selectedUser.isBlocked ? "Blocked" : "Active",
    bookings: 0,
    location: "N/A",
    lastActive: "N/A"
  };

  const isBlocked = user.status === "Blocked";
 
  const handleBlockToggle = () => setShowBlockModal(true);
 
const handleConfirm = async () => {
  try {
    if (!user?.id) return;

    await Blockuser(user.id); 

    setShowBlockModal(false);

    setToast({
      msg: isBlocked ? "User unblocked successfully" : "User blocked successfully",
      type: isBlocked ? "success" : "error"
    });

  } catch (error) {
    console.error(error);
  }
};
 
  const STATUS_MAP: Record<UserStatus, { color: string; bg: string; border: string; dot: string }> = {
    Active:   { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  dot: "#10b981" },
    Blocked:  { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", dot: "#f87171" },
    Inactive: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)",  dot: "#94a3b8" },
  };
  const st = STATUS_MAP[user.status];
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Syne:wght@700;800&display=swap');
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }
        * { box-sizing: border-box; }
      `}</style>
 
      <div style={{
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
        padding: "32px",
      }}>
 
        {/* ── Toast ── */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 24, zIndex: 400,
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 18px", borderRadius: 10,
            background: toast.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)",
            border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.35)" : "rgba(248,113,113,0.35)"}`,
            color: toast.type === "success" ? "#10b981" : "#f87171",
            fontSize: 13.5, fontWeight: 600,
            boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
            animation: "slideDown 0.25s ease",
          }}>
            {toast.type === "success"
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            }
            {toast.msg}
          </div>
        )}
 
        {/* ── Page Header ── */}
        <div style={{
          marginBottom: 24,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px", fontFamily: "'Syne', sans-serif" }}>
            User Profile
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            View and manage user details and access.
          </p>
        </div>
 
        {/* ── Profile Hero Card ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(14,22,18,0.97) 0%, rgba(10,16,14,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "24px 26px",
          marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
          flexWrap: "wrap",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease 0.06s, transform 0.4s ease 0.06s",
        }}>
          {/* Left — avatar + identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Avatar with online dot */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: `linear-gradient(135deg, ${user.avatarColor}44, ${user.avatarColor}22)`,
                border: `2.5px solid ${user.avatarColor}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800, color: user.avatarColor,
                letterSpacing: "0.04em", fontFamily: "'Syne',sans-serif",
                boxShadow: `0 0 24px ${user.avatarColor}28`,
              }}>{user.avatar}</div>
              {/* Status dot */}
              <div style={{
                position: "absolute", bottom: 3, right: 3,
                width: 14, height: 14, borderRadius: "50%",
                background: st.dot,
                border: "2.5px solid #0d1117",
                boxShadow: `0 0 8px ${st.dot}`,
              }} />
            </div>
 
            {/* Name + status + ID */}
            <div>
              <h2 style={{ margin: "0 0 5px", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", fontFamily: "'Syne',sans-serif" }}>
                {user.name}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {/* Status badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 20,
                  background: st.bg, border: `1px solid ${st.border}`,
                  color: st.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                  {user.status} Status
                </span>
                {/* User ID */}
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                  User ID: <strong style={{ color: "rgba(255,255,255,0.55)" }}>{user.id}</strong>
                </span>
              </div>
            </div>
          </div>
 
          {/* Right — action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Block / Unblock */}
            <button
              onClick={handleBlockToggle}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: 9,
                border: isBlocked ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(248,113,113,0.4)",
                background: isBlocked ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
                color: isBlocked ? "#10b981" : "#f87171",
                fontSize: 13.5, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; }}
            >
              {isBlocked ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              )}
              {isBlocked ? "Unblock" : "Block"}
            </button>
 
            {/* Back */}
            <button
              onClick={() => onBack ? onBack() : navigate(-1)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: 9, border: "none",
                background: "linear-gradient(135deg,#059669,#10b981)",
                color: "#fff", fontSize: 13.5, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
          </div>
        </div>
 
        {/* ── Personal Information ── */}
        <div style={{
          background: "linear-gradient(160deg, rgba(14,22,18,0.97) 0%, rgba(10,16,14,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "26px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease 0.12s, transform 0.4s ease 0.12s",
        }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Personal Information
              </h3>
            </div>
          </div>
 
          {/* Grid — 2 columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InfoField label="Name"              value={user.name} />
            <InfoField label="Phone Number"      value={user.phone} />
            <InfoField label="Email Address"     value={user.email} />
            <InfoField label="Joined On"         value={user.joinedOn} />
            <InfoField
              label="Current Status"
              value={user.status}
              accent={st.color}
            />
            <InfoField label="Number of Bookings" value={`${user.bookings} Booking${user.bookings !== 1 ? "s" : ""}`} />
          </div>
        </div>
 
        {/* ── Activity Card ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
          marginTop: 20,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease 0.18s, transform 0.4s ease 0.18s",
        }}>
          {/* Last Active */}
          {/* <div style={{
            background: "linear-gradient(135deg, rgba(14,22,18,0.97) 0%, rgba(10,16,14,0.99) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "20px 22px",
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, flexShrink: 0,
              background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.09em", textTransform: "uppercase" }}>Last Active</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{user.lastActive}</p>
            </div>
          </div> */}
 
          {/* Location */}
          {/* <div style={{
            background: "linear-gradient(135deg, rgba(14,22,18,0.97) 0%, rgba(10,16,14,0.99) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "20px 22px",
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, flexShrink: 0,
              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.09em", textTransform: "uppercase" }}>Location</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{user.location}</p>
            </div>
          </div> */}
        </div>
 
        {/* ── Block Modal ── */}
        {showBlockModal && (
          <BlockModal
            userName={user.name}
            isBlocked={isBlocked}
            onConfirm={handleConfirm}
            onCancel={() => setShowBlockModal(false)}
          />
        )}
      </div>
    </>
  );
}
