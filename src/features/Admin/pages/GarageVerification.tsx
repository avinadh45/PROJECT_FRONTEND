import { useState, useEffect } from "react";
import { useAdminAuth } from "../hook/useAdminAuth";
import { useNavigate } from "react-router-dom";
// ── Types ──────────────────────────────────────────────────────────────────
type StatusType = "Approved" | "Pending" | "Rejected";
type FilterTab  = "Today" | "Week" | "Month";
type StatusFilter = "All Status" | StatusType;

interface GarageEntry {
  id: string;

  name: string;

  ownerName: string;

  email: string;

  phoneNumber: string;

  verificationStatus: string;

  createdAt?: Date;

  isBlocked?: boolean;
}



const PAGE_SIZE = 5;

// ── Icons ──────────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const ChevDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const ChevLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const ChevRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const XIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── FadeIn wrapper (same pattern as CategoryPage) ──────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
    }}>
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function GarageVerificationPage() {
  const [activeTab,    setActiveTab]    = useState<FilterTab>("Today");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [page,         setPage]         = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search,       setSearch]       = useState("");
const {FetchverifyServicecenter,serviceCenters,error} = useAdminAuth()
const navigate = useNavigate();
 const filtered =  (serviceCenters ?? []).filter((e) => {

  const matchSearch =
    e.name.toLowerCase().includes(
      search.toLowerCase()
    ) ||

    e.ownerName.toLowerCase().includes(
      search.toLowerCase()
    ) ||

    e.email.toLowerCase().includes(
      search.toLowerCase()
    );

  return matchSearch;
});

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total:serviceCenters.length,
    pending:serviceCenters.length
  };
useEffect(() => {
  FetchverifyServicecenter();
}, []);
console.log("serviceCenters:", serviceCenters); 
console.log("filtered:", filtered); 
  const handleStatusFilter = (s: StatusFilter) => {
    setStatusFilter(s);
    setDropdownOpen(false);
    setPage(1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.55)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .vrow:hover { background: rgba(16,185,129,0.025) !important; }
        .vtab-btn:hover { color: rgba(255,255,255,0.7) !important; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }
      `}</style>

      <div style={{
        background: "#080e0a",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        overflowY: "auto",
      }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 24px" }}>

          {/* ── Header ── */}
          <FadeIn delay={0}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                {/* Title block */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "12px",
                    background: "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.08))",
                    border: "1px solid rgba(16,185,129,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#10b981",
                  }}>
                    <ShieldIcon />
                  </div>
                  <div>
                    <h1 style={{
                      margin: 0, fontSize: "20px", fontWeight: 800,
                      color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px",
                    }}>
                      Garage Verification
                    </h1>
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "rgba(255,255,255,0.35)" }}>
                      Review and manage service center registration requests
                    </p>
                  </div>
                </div>

                {/* Live approved badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 14px", borderRadius: "100px",
                  background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                  color: "#10b981", fontSize: "12px", fontWeight: 600,
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#10b981", display: "inline-block",
                    animation: "pulseDot 2s infinite",
                  }} />
                  {stats.pending} Approved
                </div>
              </div>

              {/* Stat pills — same style as CategoryPage */}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {[
                  { label: "Total Applications", value: stats.total,    color: "rgba(255,255,255,0.55)" },
                //   { label: "Approved",            value: stats.approved, color: "#34d399" },
                  { label: "Pending",             value: stats.pending,  color: "rgba(251,191,36,0.85)" },
                //   { label: "Rejected",            value: stats.rejected, color: "rgba(248,113,113,0.85)" },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: "9px 16px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>
                      {s.value}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── Table Card ── */}
          <FadeIn delay={80}>
            <div style={{
              borderRadius: "16px", overflow: "hidden",
              background: "linear-gradient(160deg,#0d1a10,#090e0b)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            }}>
              {/* Top accent line */}
              <div style={{ height: "2px", background: "linear-gradient(90deg,#10b981 0%,#06b6d4 60%,transparent 100%)" }} />

              {/* Toolbar */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.055)",
              }}>
                {/* Filter tabs — Today / Week / Month */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "2px",
                  padding: "3px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  {(["Today", "Week", "Month"] as FilterTab[]).map(tab => (
                    <button
                      key={tab}
                      className="vtab-btn"
                      onClick={() => { setActiveTab(tab); setPage(1); }}
                      style={{
                        padding: "6px 16px", borderRadius: "7px", border: "none", cursor: "pointer",
                        fontSize: "12.5px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                        background: activeTab === tab
                          ? "linear-gradient(135deg,#059669,#10b981)"
                          : "transparent",
                        color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.35)",
                        boxShadow: activeTab === tab ? "0 2px 8px rgba(16,185,129,0.28)" : "none",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Right side: search + status dropdown */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                  {/* Search */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    height: "36px", padding: "0 12px", borderRadius: "10px", width: "190px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.28)",
                  }}>
                    <SearchIcon />
                    <input
                      type="text" value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search..."
                      style={{
                        flex: 1, background: "transparent", border: "none",
                        color: "#fff", fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                    {search && (
                      <button
                        onClick={() => { setSearch(""); setPage(1); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, display: "flex" }}
                      >
                        <XIcon />
                      </button>
                    )}
                  </div>

                  {/* Status dropdown — same style as CategoryPage inputs */}
                  <div style={{ position: "relative" }}>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.28)", marginRight: "6px" }}>Status:</span>
                    <button
                      onClick={() => setDropdownOpen(o => !o)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        height: "36px", padding: "0 12px", borderRadius: "10px",
                        background: dropdownOpen ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)",
                        border: dropdownOpen ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        color: "#fff", fontSize: "12.5px", fontWeight: 500,
                        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                        minWidth: "120px", transition: "all 0.15s",
                      }}
                    >
                      <span style={{
                        width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                        background: statusFilter === "All Status"
                          ? "rgba(255,255,255,0.3)"
                          : statusFilter === "Approved" ? "#10b981"
                          : statusFilter === "Pending"  ? "#fbbf24"
                          : "#f87171",
                      }} />
                      {statusFilter}
                      <span style={{
                        marginLeft: "auto", color: "rgba(255,255,255,0.3)",
                        transform: dropdownOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                        display: "flex",
                      }}>
                        <ChevDown />
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div style={{
                        position: "absolute", right: 0, top: "calc(100% + 6px)",
                        background: "linear-gradient(160deg,#0d1a10,#090e0b)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px", overflow: "hidden", zIndex: 50,
                        width: "150px",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
                      }}>
                        {(["All Status", "Approved", "Pending", "Rejected"] as StatusFilter[]).map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleStatusFilter(opt)}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: "9px",
                              padding: "10px 14px", background: statusFilter === opt ? "rgba(16,185,129,0.07)" : "transparent",
                              border: "none", cursor: "pointer",
                              color: opt === "All Status"
                                ? "rgba(255,255,255,0.45)"
                                : opt === "Approved" ? "#34d399"
                                : opt === "Pending"  ? "rgba(251,191,36,0.85)"
                                : "rgba(248,113,113,0.85)",
                              fontSize: "12.5px", fontWeight: 500,
                              fontFamily: "'DM Sans', sans-serif", transition: "background 0.12s",
                              textAlign: "left",
                            }}
                            onMouseEnter={e => { if (statusFilter !== opt) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={e => { if (statusFilter !== opt) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                          >
                            <span style={{
                              width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                              background: opt === "All Status"
                                ? "rgba(255,255,255,0.3)"
                                : opt === "Approved" ? "#10b981"
                                : opt === "Pending"  ? "#fbbf24"
                                : "#f87171",
                            }} />
                            {opt}
                            {statusFilter === opt && (
                              <svg style={{ marginLeft: "auto" }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Column headers */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr 1fr 1.3fr 1fr 110px",
                padding: "10px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.045)",
                background: "rgba(255,255,255,0.015)",
              }}>
                {["Garage Name", "Owner", "City", "Applied On", "Status", "Action"].map((h, i) => (
                  <span key={h} style={{
                    fontSize: "10px", fontWeight: 700,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    textAlign: i === 5 ? "right" : "left",
                  }}>
                    {h}
                  </span>
                ))}
              </div>

            {/* Rows */}
{paginated.length === 0 ? (
  <div
    style={{
      padding: "56px 0",
      textAlign: "center",
      color: "rgba(255,255,255,0.22)",
      fontSize: "13px",
    }}
  >
    No results found
    {search ? ` for "${search}"` : ""}.
  </div>
) : (
  paginated.map((entry, i) => (
    <GarageRow
      key={entry.id}
      entry={entry}
      idx={i}
      isLast={i === paginated.length - 1}
    />
  ))
)}

              {/* Footer / Pagination */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.045)",
                background: "rgba(255,255,255,0.01)",
              }}>
                <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.25)" }}>
                  Showing{" "}
                  <strong style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                    {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                  </strong>
                  {" "}to{" "}
                  <strong style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                    {Math.min(page * PAGE_SIZE, filtered.length)}
                  </strong>
                  {" "}of{" "}
                  <strong style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                    {filtered.length}
                  </strong>
                  {" "}entries
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "6px 12px", borderRadius: "8px",
                      fontSize: "12px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      color: page === 1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)",
                      cursor: page === 1 ? "not-allowed" : "pointer", transition: "all 0.15s",
                    }}
                  >
                    <ChevLeft /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px", border: "none",
                        fontSize: "12.5px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer", transition: "all 0.15s",
                        background: pg === page
                          ? "linear-gradient(135deg,#059669,#10b981)"
                          : "rgba(255,255,255,0.03)",
                        boxShadow: pg === page ? "0 2px 8px rgba(16,185,129,0.25)" : "none",
                        color: pg === page ? "#fff" : "rgba(255,255,255,0.42)",
                        ...(pg !== page && { border: "1px solid rgba(255,255,255,0.08)" }),
                      }}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "6px 12px", borderRadius: "8px",
                      fontSize: "12px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      color: page === totalPages ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)",
                      cursor: page === totalPages ? "not-allowed" : "pointer", transition: "all 0.15s",
                    }}
                  >
                    Next <ChevRight />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </>
  );
}

// ── Table Row ──────────────────────────────────────────────────────────────
function GarageRow({ entry, idx, isLast }: { entry: GarageEntry; idx: number; isLast: boolean }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

const statusStyle = {
  approved: {
    bg: "rgba(16,185,129,0.09)",
    border: "rgba(16,185,129,0.22)",
    color: "#34d399",
    dot: "#34d399",
  },

  pending: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.22)",
    color: "rgba(251,191,36,0.9)",
    dot: "#fbbf24",
  },

  rejected: {
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.2)",
    color: "rgba(248,113,113,0.85)",
    dot: "#f87171",
  },

}[entry.verificationStatus as
  "approved" |
  "pending" |
  "rejected"];

  return (
    <div
      className="vrow"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2.2fr 1fr 1fr 1.3fr 1fr 110px",
        padding: "0 24px", height: "58px", alignItems: "center",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.038)",
        transition: "background 0.15s",
        animation: `fadeUp .35s ease ${idx * 40}ms both`,
      }}
    >
      {/* Garage Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)",
          fontSize: "10px", fontWeight: 700, color: "#10b981",
          fontFamily: "'Syne', sans-serif", letterSpacing: "0.03em",
        }}>
         {entry.name
  .split(" ")
  .map(word => word[0])
  .join("")
  .slice(0,2)}
        </div>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#e8f5ee", fontFamily: "'DM Sans', sans-serif" }}>
          {entry.name}
        </span>
      </div>

      {/* Owner */}
      <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>{entry.ownerName}</span>

      {/* City */}
      <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>{entry.email}</span>

      {/* Applied On */}
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans', sans-serif" }}>
        {new Date(entry.createdAt || "").toLocaleDateString()}
      </span>

      {/* Status badge */}
      <div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "3px 10px", borderRadius: "100px",
          fontSize: "11px", fontWeight: 600,
          background: statusStyle.bg,
          border: `1px solid ${statusStyle.border}`,
          color: statusStyle.color,
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: statusStyle.dot, display: "inline-block",
            animation: entry.verificationStatus === "approved" ? "pulseDot 2s infinite" : "none",
          }} />
          {entry.verificationStatus}
        </span>
      </div>

      {/* Action */}
      <div style={{ textAlign: "right" }}>
        <button
  onClick={() =>
    navigate(
      `/admin/garage-verification/${entry.id}`
    )
  }
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "11.5px",
    fontWeight: 600,
    fontFamily: "DM Sans, sans-serif",
    background: hovered
      ? "rgba(16,185,129,0.14)"
      : "rgba(16,185,129,0.07)",
    border: hovered
      ? "1px solid rgba(16,185,129,0.35)"
      : "1px solid rgba(16,185,129,0.18)",
    color: hovered
      ? "#34d399"
      : "#10b981",
    transition: "all 0.15s",
  }}
>
  View Details
  <ArrowRight />
</button>
      </div>
    </div>
  );
}