// pages/admin/UserList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hook/useAdminAuth";

type UserStatus = "Active" | "Inactive" | "Suspended";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isBlocked?: boolean;
  createdAt?: string;
}

const PER_PAGE = 5;

const STATUS_STYLE: Record<UserStatus, { color: string; bg: string; border: string }> = {
  Active:    { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" },
  Inactive:  { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
  Suspended: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
};

const AVATAR_COLORS = [
  { bg: "rgba(16,185,129,0.18)", color: "#10b981" },
  { bg: "rgba(34,211,238,0.18)", color: "#22d3ee" },
  { bg: "rgba(251,191,36,0.18)", color: "#fbbf24" },
  { bg: "rgba(167,139,250,0.18)",color: "#a78bfa" },
  { bg: "rgba(248,113,113,0.18)",color: "#f87171" },
  { bg: "rgba(52,211,153,0.18)", color: "#34d399" },
];

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(target / 50);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(cur);
    }, 28);
    return () => clearInterval(t);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

function Avatar({ initials, index }: { initials: string; index: number }) {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%",
      background: c.bg, border: `1px solid ${c.color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, color: c.color,
      flexShrink: 0, letterSpacing: "0.04em",
    }}>{initials}</div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {status}
    </span>
  );
}

export default function UserList() {
  const [totalPages, setTotalPages] = useState(1);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [page,         setPage]         = useState(1);
  const [mounted,      setMounted]      = useState(false);
 // const [rowsVisible,  setRowsVisible]  = useState<boolean[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { users, usersList, loading } = useAdminAuth();
  const navigate = useNavigate();

useEffect(() => {
  setMounted(true);
  usersList(search);
}, [page, search]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes rowSlide { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }
        .ul-row:hover { background: rgba(16,185,129,0.04) !important; }
        .ul-action  { transition: background 0.18s, box-shadow 0.18s; }
        .ul-pgbtn:hover:not(:disabled) { background: rgba(16,185,129,0.12) !important; color: #10b981 !important; border-color: rgba(16,185,129,0.4) !important; }
        .ul-filter:hover { background: rgba(255,255,255,0.07) !important; }
        .ul-statcard:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.45) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0b1610",          /* ← changed from #0d1117 */
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
        padding: "32px 32px 48px",
      }}>

        {/* ── Page Header ── */}
        <div style={{
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px" }}>
            Users
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.38)" }}>
            Oversee your platform members and their access levels.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.45s ease 0.07s, transform 0.45s ease 0.07s",
        }}>
          {/* Total Users */}
          <div className="ul-statcard" style={{
            background: "linear-gradient(135deg, #132218 0%, #0e1c12 100%)",   /* ← changed */
            border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 14, padding: "22px 24px",
            display: "flex", alignItems: "center", gap: 18,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            cursor: "default",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 13,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Total Users
              </p>
              <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.5px" }}>
                <Counter target={users.length} />
              </p>
            </div>
          </div>

          {/* Active Now */}
          <div className="ul-statcard" style={{
            background: "linear-gradient(135deg, #111f18 0%, #0c1813 100%)",   /* ← changed */
            border: "1px solid rgba(16,185,129,0.14)",                          /* ← changed */
            borderRadius: 14, padding: "22px 24px",
            display: "flex", alignItems: "center", gap: 18,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            cursor: "default",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 13,
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Active Now
              </p>
              <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.5px" }}>
                <Counter target={users.filter(u => !u.isBlocked).length} />
              </p>
            </div>
          </div>
        </div>

        {/* ── Search + Filter Row ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.45s ease 0.12s, transform 0.45s ease 0.12s",
        }}>
          {/* Search */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 10,
            height: 42, borderRadius: 9, padding: "0 14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by garage name, owner or city..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#fff", fontSize: 13.5, fontFamily: "inherit",
              }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Filter by Status dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 42, padding: "0 16px", borderRadius: 9,
                background: statusFilter !== "All" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${statusFilter !== "All" ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.09)"}`,
                color: statusFilter !== "All" ? "#10b981" : "rgba(255,255,255,0.6)",
                fontSize: 13.5, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.18s",
              }}
            >
              {statusFilter === "All" ? "Filter by Status" : statusFilter}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                background: "#132218",                           /* ← changed from #1a2330 */
                border: "1px solid rgba(16,185,129,0.18)",       /* ← changed */
                borderRadius: 10, overflow: "hidden", minWidth: 170,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                animation: "scaleIn 0.15s ease",
              }}>
                {(["All", "Active", "Inactive", "Suspended"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setDropdownOpen(false); setPage(1); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "10px 14px", border: "none",
                      background: statusFilter === s ? "rgba(16,185,129,0.1)" : "transparent",
                      color: statusFilter === s ? "#10b981" : "rgba(255,255,255,0.65)",
                      fontSize: 13.5, fontWeight: statusFilter === s ? 600 : 400,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (statusFilter !== s) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { if (statusFilter !== s) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {s !== "All" && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_STYLE[s as UserStatus].color, display: "inline-block", flexShrink: 0 }} />
                    )}
                    {s}
                    {statusFilter === s && (
                      <svg style={{ marginLeft: "auto" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{
          background: "#0f1c13",                                /* ← changed from rgba(255,255,255,0.02) */
          border: "1px solid rgba(16,185,129,0.14)",            /* ← changed from rgba(255,255,255,0.07) */
          borderRadius: 14, overflow: "hidden",
          overflowX: "auto",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.45s ease 0.17s, transform 0.45s ease 0.17s",
        }}>
          {/* Table Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "220px 140px 1fr 130px 110px 120px",
            minWidth: 860,
            padding: "12px 24px",
            background: "rgba(16,185,129,0.04)",               /* ← changed from rgba(255,255,255,0.025) */
            borderBottom: "1px solid rgba(16,185,129,0.1)",     /* ← changed from rgba(255,255,255,0.06) */
            alignItems: "center",
          }}>
            {["NAME", "PHONE NUMBER", "EMAIL ADDRESS", "JOINED ON", "STATUS", "ACTION"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: "0.09em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {users.length === 0 ? (
            <div style={{ padding: "52px 20px", textAlign: "center", color: "rgba(255,255,255,0.22)", fontSize: 14 }}>
              No users match your search.
            </div>
          ) : (
            users.map((user, i) => (
              <div
                key={user.id}
                className="ul-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 140px 1fr 130px 110px 120px",
                  minWidth: 860,
                  padding: "13px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  alignItems: "center",
                  transition: "background 0.18s",
                  cursor: "default",
                }}
              >
                {/* Name + Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <Avatar initials={user.name?.charAt(0).toUpperCase() || "U"} index={i} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{user.name}</span>
                </div>

                {/* Phone */}
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)" }}>{user.phoneNumber || "N/A"}</span>

                {/* Email */}
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)" }}>{user.email}</span>

                {/* Joined */}
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>

                {/* Status */}
                <StatusBadge status={user.isBlocked ? "Suspended" : "Active"} />

                {/* Action */}
                <button
                  className="ul-action"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  style={{
                    padding: "6px 16px", borderRadius: 7,
                    border: "1px solid rgba(16,185,129,0.35)",
                    background: "rgba(16,185,129,0.08)",
                    color: "#10b981", fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.18s, box-shadow 0.18s",
                    width: "fit-content", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.18)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 14px rgba(16,185,129,0.2)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  View Profile
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
   {/* ── Pagination ── */}
<div style={{
  display: "flex", alignItems: "center", justifyContent: "space-between",
  marginTop: 18,
  opacity: mounted ? 1 : 0,
  transition: "opacity 0.45s ease 0.22s",
}}>
  {/* Page info */}
  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
    Page {page} of {totalPages}
  </span>

  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
    {/* Prev */}
    <button
      className="ul-pgbtn"
      disabled={page === 1}
      onClick={() => setPage(p => p - 1)}
      style={{
        width: 32, height: 32, borderRadius: 7,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.09)",
        background: "rgba(255,255,255,0.04)",
        color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
        cursor: page === 1 ? "not-allowed" : "pointer",
        transition: "all 0.18s",
      }}
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
            justifyContent: "center", color: "rgba(255,255,255,0.25)", fontSize: 13,
          }}>…</span>
        ) : (
          <button
            key={item}
            className="ul-pgbtn"
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
          >
            {item}
          </button>
        )
      )
    }

    {/* Next */}
    <button
      className="ul-pgbtn"
      disabled={page === totalPages}
      onClick={() => setPage(p => p + 1)}
      style={{
        width: 32, height: 32, borderRadius: 7,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.09)",
        background: "rgba(255,255,255,0.04)",
        color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
        cursor: page === totalPages ? "not-allowed" : "pointer",
        transition: "all 0.18s",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>
</div>

        {/* Click-outside to close filter dropdown */}
        {dropdownOpen && (
          <div
            onClick={() => setDropdownOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
          />
        )}
      </div>
    </>
  );
}