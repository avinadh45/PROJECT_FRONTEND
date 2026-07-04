// Usage: <AdminLayout><GarageList /></AdminLayout>
 
import { useState, useEffect } from "react";
import { useAdminAuth } from "../hook/useAdminAuth";
import { useNavigate } from "react-router-dom";
 
// ── Types ─────────────────────────────────────────────────────────────────────
type GarageStatus = "Active" | "Inactive" | "Suspended" | "Pending";
 
const STATUS_STYLE: Record<GarageStatus, { color: string; bg: string; border: string }> = {
  Active:    { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" },
  Inactive:  { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
  Suspended: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  Pending:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
};
 
const AVATAR_COLORS = [
  { bg: "rgba(16,185,129,0.15)",  color: "#10b981" },
  { bg: "rgba(34,211,238,0.15)",  color: "#22d3ee" },
  { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24" },
  { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
  { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  { bg: "rgba(52,211,153,0.15)",  color: "#34d399" },
];

const GRID = "minmax(180px,2fr) 130px minmax(160px,1.6fr) 110px 100px 80px";
 
// ── Sub-components ────────────────────────────────────────────────────────────
function GarageAvatar({ initials, index }: { initials: string; index: number }) {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9,
      background: c.bg, border: `1px solid ${c.color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 800, color: c.color,
      flexShrink: 0, letterSpacing: "0.05em",
    }}>{initials}</div>
  );
}
 
function StatusBadge({ status }: { status: GarageStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, fontSize: 11.5, fontWeight: 600,
      whiteSpace: "nowrap", width: "fit-content",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block", flexShrink: 0 }} />
      {status}
    </span>
  );
}
 
// ── Main Component ────────────────────────────────────────────────────────────
export default function GarageList() {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<GarageStatus | "All">("All");
  const [page,         setPage]         = useState(1);
  const [mounted,      setMounted]      = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { fetchServiceCenters, serviceCenters, totalPages } = useAdminAuth();
 
  useEffect(() => { 
    setTimeout(() => setMounted(true), 40); 
    fetchServiceCenters(page, 5,search);
  }, [page,search]);
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .gl-row:hover { background: rgba(16,185,129,0.04) !important; }
        .gl-view:hover { background: rgba(16,185,129,0.18) !important; box-shadow: 0 0 14px rgba(16,185,129,0.2) !important; }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.22); }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 4px; }
      `}</style>
 
      <div style={{
        minHeight: "100vh",
        background: "#080e0b",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
        padding: "32px 32px 48px",
      }}>

        {/* ── Page Header ── */}
        <div style={{
          marginBottom: 26,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px", fontFamily: "'Syne', sans-serif" }}>
            Garage
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.35)" }}>
            Manage all registered garages and service centers.
          </p>
        </div>

        {/* ── Search + Filter ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease 0.07s, transform 0.4s ease 0.07s",
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 10,
            height: 42, borderRadius: 9, padding: "0 14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by garage name, owner or city..."
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 13.5, fontFamily: "inherit" }}
            />
            {search && (
              <button onClick={() =>{ setSearch("");setPage(1)}} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, fontSize: 18, lineHeight: 1 }}>×</button>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 42, padding: "0 16px", borderRadius: 9,
                background: statusFilter !== "All" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${statusFilter !== "All" ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.09)"}`,
                color: statusFilter !== "All" ? "#10b981" : "rgba(255,255,255,0.58)",
                fontSize: 13.5, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.18s", whiteSpace: "nowrap",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              {statusFilter === "All" ? "Filter by Status" : statusFilter}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                background: "#0d1a12", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, overflow: "hidden", minWidth: 175,
                boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
                animation: "scaleIn 0.15s ease",
              }}>
                {(["All", "Active", "Inactive", "Suspended", "Pending"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setDropdownOpen(false); setPage(1); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "10px 14px", border: "none",
                      background: statusFilter === s ? "rgba(16,185,129,0.08)" : "transparent",
                      color: statusFilter === s ? "#10b981" : "rgba(255,255,255,0.62)",
                      fontSize: 13.5, fontWeight: statusFilter === s ? 600 : 400,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (statusFilter !== s) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (statusFilter !== s) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {s !== "All" && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_STYLE[s as GarageStatus].color, display: "inline-block", flexShrink: 0 }} />
                    )}
                    {s}
                    {statusFilter === s && (
                      <svg style={{ marginLeft: "auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
 
        {/* ── Table ── */}
        <div style={{
          background: "rgba(16,185,129,0.03)",
          border: "1px solid rgba(16,185,129,0.1)",
          borderRadius: 14, overflow: "hidden",
          overflowX: "auto",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.4s ease 0.13s, transform 0.4s ease 0.13s",
        }}>

          {/* ── Table Header ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: GRID,
            minWidth: 780,
            padding: "12px 24px",
            gap: 8,
            background: "rgba(16,185,129,0.05)",
            borderBottom: "1px solid rgba(16,185,129,0.1)",
            alignItems: "center",
          }}>
            {["GARAGE NAME", "PHONE", "EMAIL", "JOINED ON", "STATUS", "ACTION"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: "0.09em" }}>{h}</span>
            ))}
          </div>
 
          {/* ── Rows ── */}
          {!serviceCenters || serviceCenters.length === 0 ? (
            <div style={{ padding: "52px 24px", textAlign: "center", color: "rgba(255,255,255,0.22)", fontSize: 14 }}>
              No garages available.
            </div>
          ) : (
            serviceCenters.map((garage, i) => (
              <div
                key={garage.id}
                className="gl-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: GRID,
                  minWidth: 780,
                  padding: "14px 24px",
                  gap: 8,
                  borderBottom: "1px solid rgba(16,185,129,0.07)",
                  alignItems: "center",
                  transition: "background 0.18s",
                  cursor: "default",
                }}
              >
                {/* Garage Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                  <GarageAvatar initials={garage.name.substring(0, 2).toUpperCase()} index={i} />
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: "#fff",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {garage.name}
                  </span>
                </div>
 
                {/* Phone */}
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {garage.phoneNumber || "N/A"}
                </span>
 
                {/* Email */}
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {garage.email}
                </span>
 
                {/* Joined On */}
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)" }}>N/A</span>
 
                {/* Status */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StatusBadge status={garage.isBlocked ? "Suspended" : "Active"} />
                </div>
 
                {/* Action */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => navigate(`/admin/garage/${garage.id}`)}
                    className="gl-view"
                    style={{
                      padding: "6px 14px", borderRadius: 7,
                      border: "1px solid rgba(16,185,129,0.35)",
                      background: "rgba(16,185,129,0.08)",
                      color: "#10b981", fontSize: 12.5, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "background 0.18s, box-shadow 0.18s",
                      whiteSpace: "nowrap",
                    }}
                  >View</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 18,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.4s ease 0.18s",
        }}>
          {/* Page info */}
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>
            Page {page} of {totalPages}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{
                width: 32, height: 32, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                color: page === 1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)",
                cursor: page === 1 ? "not-allowed" : "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { if (page !== 1) (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} style={{
                    width: 32, height: 32, display: "flex", alignItems: "center",
                    justifyContent: "center", color: "rgba(255,255,255,0.22)", fontSize: 13,
                  }}>…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    style={{
                      width: 32, height: 32, borderRadius: 7,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: page === item
                        ? "1px solid rgba(16,185,129,0.5)"
                        : "1px solid rgba(255,255,255,0.09)",
                      background: page === item
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(255,255,255,0.04)",
                      color: page === item ? "#10b981" : "rgba(255,255,255,0.55)",
                      fontSize: 13, fontWeight: page === item ? 700 : 400,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={e => { if (page !== item) (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.12)"; }}
                    onMouseLeave={e => { if (page !== item) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    {item}
                  </button>
                )
              )
            }

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{
                width: 32, height: 32, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                color: page === totalPages ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { if (page !== totalPages) (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
 
      {/* Dropdown backdrop */}
      {dropdownOpen && (
        <div onClick={() => setDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      )}
    </>
  );
}