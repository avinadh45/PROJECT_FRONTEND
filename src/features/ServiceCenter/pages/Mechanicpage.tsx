// // src/pages/MechanicPage.tsx
// // Matches screenshot exactly — Add New Mechanic form + Mechanic List with block/unblock
// // Uses same design tokens: #060a14 bg, #3b82f6 brand blue, #06b6d4 cyan, Syne + DM Sans

import { useState, useMemo,useEffect } from "react";
// import { useServiceCenterAuth } from "../../hooks/useServiceCenterAuth";
import type { MechanicResponse } from "../../Mechanic/interface/Mechanic";
 import { useMechanicAuth } from "../../Mechanic/hooks/useMechanicAuth";
 import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
// ── Types ─────────────────────────────────────────────────────────────────────
type MechanicUI = {
  id: string;
  name: string;
  email: string;
  status: string;
  joined: string;
  jobs: number;
};
// ── Icons ─────────────────────────────────────────────────────────────────────
const AddUserIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#aui)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="aui" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

const NameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EyeOpen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const TeamIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const ChevLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);

const ChevRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const PAGE_SIZE = 5;

// ── Helper: initials avatar ───────────────────────────────────────────────────
function Avatar({ name, blocked }: { name: string; blocked: boolean }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px] flex-shrink-0"
      style={{
        background: blocked
          ? "rgba(239,68,68,0.12)"
          : "linear-gradient(135deg,rgba(59,130,246,0.22),rgba(6,182,212,0.14))",
        border: blocked
          ? "1px solid rgba(239,68,68,0.25)"
          : "1px solid rgba(59,130,246,0.3)",
        color: blocked ? "#f87171" : "#60a5fa",
        fontFamily: "'Syne',sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MechanicPage() {
 
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [focusedF,  setFocused]   = useState<"name" | "email" | "pass" | null>(null);
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError,  setFormError]  = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [confirm, setConfirm] = useState<{ id: string; name: string; action: "block" | "unblock" } | null>(null);

  const { getMechanic, addMechanic, loading } = useMechanicAuth();
  const { block} = useServiceCenterAuth()
  const [totalPages, setTotalPages] = useState(1);
  const [mechanics, setMechanics] = useState<MechanicUI[]>([]);

const fetchMechanics = async (searchTerm: string = "") => {
  try {
    const response = await getMechanic(page, PAGE_SIZE, searchTerm);
    setTotalPages(response.totalPages);
    const mapped = response.data.map((m: MechanicResponse) => ({
      id: m.id,
      name: m.name || m.email.split("@")[0],
      email: m.email,
      status: m.isBlocked ? "blocked" : "active",
      joined: new Date().toLocaleDateString(),
      jobs: 0,
    }));
    setMechanics(mapped);
  } catch (error) {
    console.error("Failed to fetch mechanics", error);
  }
};
 useEffect(() => {
  fetchMechanics(search);
}, [page, search]);

  // Filtered + paginated
// const filtered = useMemo(() =>
//   mechanics.filter(m =>
//     m.name.toLowerCase().includes(
//       search.toLowerCase()
//     ) ||

//     m.email.toLowerCase().includes(
//       search.toLowerCase()
//     )
//   ),
//   [mechanics, search]
// );

const activeCount = mechanics.filter(
  m => m.status === "active"
).length;

  // const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // const activeCount = mechanics.filter(m => m.status === "active").length;

  // Open confirm dialog
  const toggleStatus = (id: string) => {
    const mechanic = mechanics.find(m => m.id === id);
    if (!mechanic) return;
    setConfirm({
      id,
      name: mechanic.name,
      action: mechanic.status === "active" ? "block" : "unblock",
    });
  };

  // Confirmed block/unblock
  const confirmToggle = async () => {
    if (!confirm) return;
    try {
      const response = await block(confirm.id);
      setMechanics(prev =>
        prev.map(m =>
          m.id === confirm.id
            ? { ...m, status: response.data.isBlocked ? "blocked" : "active" }
            : m
        )
      );
    } catch (error) {
      console.log("Failed to block/unblock mechanic", error);
    } finally {
      setConfirm(null);
    }
  };

  // Submit new mechanic
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setFormError("Both email and password are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (mechanics.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      setFormError("A mechanic with this email already exists.");
      return;
    }

    setSubmitting(true);
    
    try {
      const newMechanic = await addMechanic({ name, email, password });

      setMechanics(prev => [
        ...prev,
        {
          id: (newMechanic as any)._id || newMechanic.id || Date.now(),
          name: newMechanic.name || name,
          email: newMechanic.email || email,
          status: newMechanic.isBlocked ? "blocked" : "active",
          joined: new Date().toLocaleDateString(),
          jobs: 0
        }
      ]);

      setName("");
      setEmail("");
      setPassword("");

      setFormSuccess(`Mechanic account created for ${email}`);
      setTimeout(() => setFormSuccess(""), 4000);

    } catch (err: any) {
      setFormError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create mechanic. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field: "name" | "email" | "pass"): React.CSSProperties => ({
    width: "100%",
    height: "46px",
    borderRadius: "10px",
    background: focusedF === field ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.04)",
    border: focusedF === field
      ? "1px solid rgba(59,130,246,0.6)"
      : "1px solid rgba(255,255,255,0.1)",
    boxShadow: focusedF === field ? "0 0 0 3px rgba(59,130,246,0.09)" : "none",
    color: "#fff",
    fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif",
    paddingLeft: "40px",
    paddingRight: field === "pass" ? "42px" : "14px",
    outline: "none",
    transition: "all 0.18s",
  });

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: "#060a14", minHeight: "calc(100vh - 60px)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ── Add Mechanic Form Card ─────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            background: "linear-gradient(145deg,rgba(12,18,36,0.96),rgba(8,12,24,0.98))",
            border: "1px solid rgba(59,130,246,0.18)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
            animation: "fadeUp .45s ease both",
          }}
        >
          {/* Top gradient line */}
          <div style={{ height: "3px", background: "linear-gradient(90deg,#3b82f6,#06b6d4,transparent)" }} />

          <div className="px-8 py-8">
            {/* Icon + heading */}
            <div className="flex flex-col items-center mb-7">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.09))",
                  border: "1px solid rgba(59,130,246,0.28)",
                  boxShadow: "0 0 32px rgba(59,130,246,0.15)",
                }}
              >
                <AddUserIcon />
              </div>
              <h2
                className="text-white font-extrabold text-[22px] tracking-tight mb-1.5"
                style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.4px" }}
              >
                Add New Mechanic
              </h2>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13.5px", fontFamily: "'DM Sans',sans-serif" }}>
                Provide login credentials for the new mechanic.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate}>

              {/* Error */}
              {formError && (
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4"
                  style={{ background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "#f87171", fontFamily: "'DM Sans',sans-serif" }}>{formError}</span>
                </div>
              )}

              {/* Success */}
              {formSuccess && (
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4"
                  style={{ background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "#34d399", fontFamily: "'DM Sans',sans-serif" }}>{formSuccess}</span>
                </div>
              )}

              {/* Name */}
              <div className="mb-4">
                <label
                  className="block mb-2"
                  style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,0.42)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.28)" }}>
                    <NameIcon />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setFormError(""); }}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Mechanic full name"
                    style={inputStyle("name")}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  className="block mb-2"
                  style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,0.42)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.28)" }}>
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setFormError(""); }}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="mechanic@email.com"
                    style={inputStyle("email")}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label
                  className="block mb-2"
                  style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,0.42)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.28)" }}>
                    <LockIcon />
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setFormError(""); }}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    style={inputStyle("pass")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", color: showPass ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.28)", padding: "2px" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = showPass ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.28)")}
                  >
                    {showPass ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {/* Info banner */}
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6"
                style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.2)" }}
              >
                <span className="flex-shrink-0 mt-0.5"><InfoIcon /></span>
                <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.65 }}>
                  New accounts are automatically assigned the <span style={{ color: "#06b6d4", fontWeight: 600 }}>Mechanic Role</span> and will have access to assigned service tickets and slot management.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl font-bold transition-all duration-200"
                style={{
                  height: "50px",
                  background: submitting ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg,#1d4ed8,#0891b2)",
                  border: "none",
                  color: "#fff",
                  fontSize: "14px",
                  letterSpacing: "0.04em",
                  fontFamily: "'Syne',sans-serif",
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 4px 20px rgba(59,130,246,0.38), 0 0 0 1px rgba(59,130,246,0.2)",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Mechanic
                    <ArrowRight />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* ── Mechanic List ──────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg,rgba(12,18,36,0.96),rgba(8,12,24,0.98))",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            animation: "fadeUp .5s ease 80ms both",
          }}
        >
          {/* List header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2.5">
              <TeamIcon />
              <span
                className="text-white font-bold text-[16px]"
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                Mechanic List
              </span>
            </div>
            <span
              className="flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.25)",
                color: "#06b6d4",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#06b6d4", animation: "pulseDot 2s infinite" }}
              />
              {activeCount} Active Member{activeCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Search */}
          <div className="px-6 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5"
              style={{
                height: "40px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent outline-none flex-1 text-white"
                style={{ fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "16px", lineHeight: 1 }}
                >×</button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Mechanic", "Access Status", "Jobs Done", "Joined", "Actions"].map(h => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mechanics.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontSize: "13.5px" }}>
                      No mechanics found{search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                ) : (
                  mechanics.map((m, i) => (
                    <tr
                      key={m.id}
                      className="transition-colors"
                      style={{
                        borderBottom: i < mechanics.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        animation: `fadeUp .4s ease ${i * 50}ms both`,
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                    >
                      {/* Mechanic */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.name} blocked={m.status === "blocked"} />
                          <div>
                            <div
                              className="font-semibold text-[13.5px]"
                              style={{ color: m.status === "blocked" ? "rgba(255,255,255,0.45)" : "#fff", fontFamily: "'DM Sans',sans-serif" }}
                            >
                              {m.name}
                            </div>
                            <div className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans',sans-serif" }}>
                              {m.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wider"
                          style={{
                            background: m.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            border: `1px solid ${m.status === "active" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                            color: m.status === "active" ? "#34d399" : "#f87171",
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{
                              background: m.status === "active" ? "#34d399" : "#f87171",
                              animation: m.status === "active" ? "pulseDot 2s infinite" : "none",
                            }}
                          />
                          {m.status === "active" ? "Active" : "Blocked"}
                        </span>
                      </td>

                      {/* Jobs */}
                      <td className="px-6 py-4">
                        <span
                          className="text-[13.5px] font-semibold"
                          style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Syne',sans-serif" }}
                        >
                          {m.jobs}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans',sans-serif" }}>
                          {m.joined}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(m.id)}
                          className="text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200"
                          style={{
                            background: m.status === "active"
                              ? "rgba(239,68,68,0.08)"
                              : "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.12))",
                            border: m.status === "active"
                              ? "1px solid rgba(239,68,68,0.25)"
                              : "1px solid rgba(6,182,212,0.35)",
                            color: m.status === "active" ? "#f87171" : "#06b6d4",
                            cursor: "pointer",
                            letterSpacing: "0.06em",
                            fontFamily: "'Syne',sans-serif",
                            minWidth: "108px",
                          }}
                          onMouseEnter={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            if (m.status === "active") {
                              btn.style.background = "rgba(239,68,68,0.16)";
                              btn.style.borderColor = "rgba(239,68,68,0.4)";
                            } else {
                              btn.style.background = "rgba(6,182,212,0.18)";
                            }
                          }}
                          onMouseLeave={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            if (m.status === "active") {
                              btn.style.background = "rgba(239,68,68,0.08)";
                              btn.style.borderColor = "rgba(239,68,68,0.25)";
                            } else {
                              btn.style.background = "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.12))";
                            }
                          }}
                        >
                          {m.status === "active" ? "Block Access" : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer: count + pagination */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif" }}>
              Showing {mechanics.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, mechanics.length)} of {mechanics.length}
            </span>

            {/* Pagination */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                <ChevLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className="w-8 h-8 rounded-lg text-[13px] font-semibold transition-all"
                  style={{
                    background: pg === page
                      ? "linear-gradient(135deg,#1d4ed8,#0891b2)"
                      : "rgba(255,255,255,0.04)",
                    border: pg === page
                      ? "1px solid rgba(59,130,246,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: pg === page ? "#fff" : "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                    boxShadow: pg === page ? "0 2px 8px rgba(59,130,246,0.35)" : "none",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                <ChevRight />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Confirm Modal ──────────────────────────────────────── */}
      {confirm && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
          }}
          onClick={() => setConfirm(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0c1220",
              border: "1px solid rgba(59,130,246,0.28)",
              borderRadius: "16px",
              padding: "2rem 2rem 1.5rem",
              width: "340px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              animation: "fadeUp .2s ease both",
            }}
          >
            {/* Icon */}
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px", margin: "0 auto 1rem",
              background: confirm.action === "block" ? "rgba(239,68,68,0.12)" : "rgba(6,182,212,0.1)",
              border: `1px solid ${confirm.action === "block" ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {confirm.action === "block" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4M12 15v2"/>
                </svg>
              )}
            </div>

            {/* Title */}
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", textAlign: "center", margin: "0 0 6px" }}>
              {confirm.action === "block" ? "Block Access" : "Unblock Access"}
            </p>

            {/* Body */}
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", textAlign: "center", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              Are you sure you want to {confirm.action}{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>{confirm.name}</span>?{" "}
              {confirm.action === "block"
                ? "They will lose access immediately."
                : "They will regain full access."}
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setConfirm(null)}
                style={{
                  flex: 1, height: "40px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif",
                  fontSize: "13px", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                style={{
                  flex: 1, height: "40px", borderRadius: "10px",
                  background: confirm.action === "block" ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.12)",
                  border: `1px solid ${confirm.action === "block" ? "rgba(239,68,68,0.4)" : "rgba(6,182,212,0.4)"}`,
                  color: confirm.action === "block" ? "#f87171" : "#06b6d4",
                  fontFamily: "'Syne',sans-serif", fontSize: "13px",
                  fontWeight: 700, cursor: "pointer",
                }}
              >
                {confirm.action === "block" ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}