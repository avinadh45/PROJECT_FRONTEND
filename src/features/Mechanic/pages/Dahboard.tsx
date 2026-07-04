import { useState, useEffect, useRef } from "react";


/* ─── Types ─────────────────────────────────────────────────── */
type Status = "Completed" | "Ongoing" | "Cancelled" | "Pending";
interface Booking {
  id: number;
  vehicle: string;
  owner: string;
  service: string;
  date: string;
  time: string;
  status: Status;
}

/* ─── Mock Data ──────────────────────────────────────────────── */
const ALL_BOOKINGS: Booking[] = [
  { id: 1, vehicle: "KL 8 UD 1322", owner: "Arjun Menon",    service: "Brake Check",       date: "Mar 15, 2026", time: "10:30 AM", status: "Completed" },
  { id: 2, vehicle: "KL 39 JD 8569",owner: "Priya Nair",     service: "Tyre Replacement",  date: "Feb 12, 2026", time: "02:15 PM", status: "Ongoing" },
  { id: 3, vehicle: "KL 75 AB 2311", owner: "Rahul Das",      service: "Oil Change",        date: "Feb 10, 2026", time: "09:00 AM", status: "Completed" },
  { id: 4, vehicle: "KL 7 NM 4888",  owner: "Sneha Pillai",  service: "Brake Check",       date: "Feb 9, 2026",  time: "03:45 PM", status: "Cancelled" },
  { id: 5, vehicle: "KL 04 CJ 7721", owner: "Rohan Varma",   service: "AC Service",        date: "Mar 1, 2026",  time: "11:00 AM", status: "Pending" },
  { id: 6, vehicle: "KL 22 BX 9910", owner: "Ananya Krishnan",service: "Full Service",     date: "Mar 3, 2026",  time: "08:30 AM", status: "Completed" },
  { id: 7, vehicle: "KL 11 PQ 3345", owner: "Vijay Kumar",   service: "Engine Repair",     date: "Mar 5, 2026",  time: "01:00 PM", status: "Ongoing" },
  { id: 8, vehicle: "KL 55 RT 6612", owner: "Meena Suresh",  service: "Tyre Rotation",     date: "Mar 6, 2026",  time: "04:15 PM", status: "Pending" },
  { id: 9, vehicle: "KL 88 DL 4423", owner: "Arun Babu",     service: "Brake Check",       date: "Mar 7, 2026",  time: "10:00 AM", status: "Cancelled" },
  { id: 10,vehicle: "KL 33 MN 2200", owner: "Lakshmi Raj",   service: "Oil Change",        date: "Mar 8, 2026",  time: "09:45 AM", status: "Completed" },
  { id: 11,vehicle: "KL 66 SB 8811", owner: "Deepak Nambiar",service: "AC Service",        date: "Mar 10, 2026", time: "03:00 PM", status: "Ongoing" },
  { id: 12,vehicle: "KL 14 VT 5500", owner: "Geetha Mohan",  service: "Full Service",      date: "Mar 12, 2026", time: "11:30 AM", status: "Pending" },
];

const PER_PAGE = 4;

/* ─── Status config ──────────────────────────────────────────── */
const STATUS_CONFIG: Record<Status, { color: string; bg: string; dot: string; glow: string }> = {
  Completed: { color: "#34d399", bg: "rgba(52,211,153,0.1)",  dot: "#34d399", glow: "rgba(52,211,153,0.3)" },
  Ongoing:   { color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  dot: "#22d3ee", glow: "rgba(34,211,238,0.3)" },
  Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.1)", dot: "#f87171", glow: "rgba(248,113,113,0.3)" },
  Pending:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  dot: "#fbbf24", glow: "rgba(251,191,36,0.3)" },
};

/* ─── Stat SVG Icons ─────────────────────────────────────────── */
const IconCalendar = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="3"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="8" cy="15" r="0.5" fill={color}/><circle cx="12" cy="15" r="0.5" fill={color}/><circle cx="16" cy="15" r="0.5" fill={color}/>
  </svg>
);

const IconCheckCircle = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconRefresh = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconXCircle = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

/* ─── Summary stats ──────────────────────────────────────────── */
const STATS = [
  { label: "Total Bookings", value: 68, Icon: IconCalendar,   color: "#22d3ee", bg: "rgba(34,211,238,0.1)"  },
  { label: "Completed",      value: 41, Icon: IconCheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.1)"  },
  { label: "Ongoing",        value: 12, Icon: IconRefresh,     color: "#22d3ee", bg: "rgba(34,211,238,0.1)"  },
  { label: "Cancelled",      value: 9,  Icon: IconXCircle,     color: "#f87171", bg: "rgba(248,113,113,0.1)" },
];

/* ─── Animated counter ───────────────────────────────────────── */
function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function BookingsDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"Today" | "Week" | "Month">("Today");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [rowVisible, setRowVisible] = useState<boolean[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const filtered = ALL_BOOKINGS.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = b.vehicle.toLowerCase().includes(q) || b.owner.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    setRowVisible([]);
    const timers = paginated.map((_, i) =>
      setTimeout(() => setRowVisible(v => { const n = [...v]; n[i] = true; return n; }), i * 80)
    );
    return () => timers.forEach(clearTimeout);
  }, [page, search, statusFilter]);

  const selectedBooking = ALL_BOOKINGS.find(b => b.id === viewId);


  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1a 0%, #0d1520 50%, #0a1018 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeSlideDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:none; } }
        @keyframes fadeSlideUp   { from { opacity:0; transform:translateY(16px);  } to { opacity:1; transform:none; } }
        @keyframes fadeIn        { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse         { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes shimmer       { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes scaleIn       { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        .row-hover:hover { background: rgba(34,211,238,0.04) !important; transform: translateX(3px); }
        .btn-view:hover  { background: rgba(34,211,238,0.18) !important; box-shadow: 0 0 16px rgba(34,211,238,0.2) !important; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4) !important; }
        .filter-pill:hover { background: rgba(255,255,255,0.08) !important; }
        .page-btn:hover  { background: rgba(34,211,238,0.15) !important; color: #22d3ee !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 10px; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 64,
        background: "rgba(10,15,26,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(34,211,238,0.08)",
        position: "sticky", top: 0, zIndex: 100,
        animation: mounted ? "fadeSlideDown 0.5s ease" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #22d3ee, #0891b2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: "#000",
            boxShadow: "0 4px 12px rgba(34,211,238,0.35)",
          }}>M</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>
            Moto<span style={{ color: "#22d3ee" }}>Cline</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Notification bell */}
          <div style={{
            position: "relative", width: 38, height: 38, borderRadius: 10,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#f87171", border: "1.5px solid #0a0f1a", animation: "pulse 2s infinite" }} />
          </div>
          {/* Avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, #22d3ee, #0891b2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 14, color: "#000",
            boxShadow: "0 0 0 2px rgba(34,211,238,0.3)",
            cursor: "pointer",
          }}>SC</div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── Header ── */}
        <div style={{
          marginBottom: 32,
          animation: mounted ? "fadeSlideDown 0.5s ease 0.1s both" : "none",
        }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            Bookings
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.38)" }}>
            Manage all repair bookings and scheduled maintenance.
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
          marginBottom: 32,
          animation: mounted ? "fadeSlideUp 0.5s ease 0.15s both" : "none",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-card" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "20px 22px",
              transition: "all 0.3s ease",
              cursor: "default",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: s.bg,
                  border: `1px solid ${s.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 12px ${s.color}18`,
                }}>
                  <s.Icon color={s.color} />
                </div>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                <Counter target={s.value} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5, fontWeight: 500, letterSpacing: "0.03em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Controls Row ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap",
          animation: mounted ? "fadeSlideUp 0.5s ease 0.2s both" : "none",
        }}>
          {/* Search */}
          <div style={{
            flex: 1, minWidth: 240, position: "relative",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, display: "flex", alignItems: "center",
          }}>
            <svg style={{ position: "absolute", left: 14, opacity: 0.35 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by vehicle, customer or service..."
              style={{
                width: "100%", padding: "11px 14px 11px 40px",
                background: "transparent", border: "none", outline: "none",
                color: "#fff", fontSize: 13.5, fontFamily: "inherit",
              }}
            />
          </div>

          {/* Time filters */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, overflow: "hidden",
          }}>
            {(["Today", "Week", "Month"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "9px 18px", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                background: filter === f ? "linear-gradient(90deg,#0891b2,#22d3ee)" : "transparent",
                color: filter === f ? "#000" : "rgba(255,255,255,0.45)",
                transition: "all 0.2s",
                boxShadow: filter === f ? "0 0 16px rgba(34,211,238,0.3)" : "none",
              }}>{f}</button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["All", "Completed", "Ongoing", "Cancelled", "Pending"] as const).map(s => {
              const active = statusFilter === s;
              const cfg = s !== "All" ? STATUS_CONFIG[s as Status] : null;
              return (
                <button key={s} className="filter-pill" onClick={() => { setStatusFilter(s); setPage(1); }} style={{
                  padding: "7px 14px", borderRadius: 8, border: `1px solid ${active && cfg ? cfg.color : "rgba(255,255,255,0.09)"}`,
                  background: active && cfg ? cfg.bg : "rgba(255,255,255,0.04)",
                  color: active && cfg ? cfg.color : active ? "#22d3ee" : "rgba(255,255,255,0.45)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}>{s}</button>
              );
            })}
          </div>

          {/* More Filters btn */}
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 16px", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            More Filters
          </button>
        </div>

        {/* ── Table ── */}
        <div ref={tableRef} style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden",
          animation: mounted ? "fadeSlideUp 0.5s ease 0.25s both" : "none",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.6fr 1.5fr 1.3fr 1fr",
            padding: "13px 24px",
            background: "rgba(34,211,238,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {["VEHICLE", "SERVICE", "DATE & TIME", "STATUS", "ACTION"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
              No bookings found.
            </div>
          ) : paginated.map((b, i) => {
            const cfg = STATUS_CONFIG[b.status];
            const visible = rowVisible[i];
            return (
              <div
                key={b.id}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.6fr 1.5fr 1.3fr 1fr",
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  alignItems: "center",
                  transition: "all 0.25s ease",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(8px)",
                  cursor: "default",
                }}
              >
                {/* Vehicle */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: "#fff", letterSpacing: "0.03em" }}>{b.vehicle}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{b.owner}</div>
                </div>

                {/* Service */}
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{b.service}</div>

                {/* Date & Time */}
                <div>
                  <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{b.date}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{b.time}</div>
                </div>

                {/* Status badge */}
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 12px", borderRadius: 20,
                    background: cfg.bg,
                    border: `1px solid ${cfg.color}33`,
                    color: cfg.color, fontSize: 12, fontWeight: 700,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 6px ${cfg.glow}`, display: "inline-block", animation: b.status === "Ongoing" ? "pulse 1.5s infinite" : "none" }} />
                    {b.status}
                  </span>
                </div>

                {/* Action */}
                <div>
                  <button className="btn-view" onClick={() => setViewId(b.id)} style={{
                    padding: "7px 18px", borderRadius: 8,
                    border: "1px solid rgba(34,211,238,0.35)",
                    background: "rgba(34,211,238,0.08)",
                    color: "#22d3ee", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}>View</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 20,
          animation: mounted ? "fadeSlideUp 0.5s ease 0.3s both" : "none",
        }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} bookings
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
              width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.04)", color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
              cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", fontFamily: "inherit",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className="page-btn" onClick={() => setPage(p)} style={{
                width: 34, height: 34, borderRadius: 8, fontWeight: 700, fontSize: 13,
                border: `1px solid ${page === p ? "#22d3ee" : "rgba(255,255,255,0.09)"}`,
                background: page === p ? "linear-gradient(135deg,#0891b2,#22d3ee)" : "rgba(255,255,255,0.04)",
                color: page === p ? "#000" : "rgba(255,255,255,0.55)",
                cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                boxShadow: page === p ? "0 0 16px rgba(34,211,238,0.3)" : "none",
              }}>{p}</button>
            ))}

            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
              width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.04)", color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
              cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", fontFamily: "inherit",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── View Modal ── */}
      {viewId && selectedBooking && (
        <div onClick={() => setViewId(null)} style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "linear-gradient(145deg,#0d1520,#111827)",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: 20, padding: "32px",
            width: "100%", maxWidth: 420,
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,211,238,0.08) inset",
            animation: "scaleIn 0.25s ease",
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff" }}>Booking Details</h2>
              <button onClick={() => setViewId(null)} style={{
                width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            {/* Status banner */}
            {(() => {
              const cfg = STATUS_CONFIG[selectedBooking.status];
              return (
                <div style={{
                  padding: "12px 16px", borderRadius: 10, marginBottom: 20,
                  background: cfg.bg, border: `1px solid ${cfg.color}44`,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 8px ${cfg.glow}`, display: "inline-block" }} />
                  <span style={{ color: cfg.color, fontWeight: 700, fontSize: 14 }}>{selectedBooking.status}</span>
                </div>
              );
            })()}

            {/* Detail rows */}
            {[
              { label: "Vehicle", value: selectedBooking.vehicle },
              { label: "Customer", value: selectedBooking.owner },
              { label: "Service", value: selectedBooking.service },
              { label: "Date", value: selectedBooking.date },
              { label: "Time", value: selectedBooking.time },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setViewId(null)} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}>Close</button>
              <button style={{
                flex: 1, padding: "12px", borderRadius: 10,
                border: "none", background: "linear-gradient(90deg,#0891b2,#22d3ee)",
                color: "#000", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(34,211,238,0.3)",
              }}>Edit Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}