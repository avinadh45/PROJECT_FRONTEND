// src/pages/AdminDashboard.tsx
import { useState } from "react";

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label:  string;
  value:  string;
  change: string;
  pos:    boolean;
  color:  string;
  icon:   React.ReactNode;
  delay?: number;
}

function StatCard({ label, value, change, pos, color, icon, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 cursor-default hover:-translate-y-1"
      style={{
        background: "linear-gradient(145deg,rgba(13,20,16,0.9),rgba(10,15,12,0.95))",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        minHeight: "120px",
        animation: `fadeUp .5s ease ${delay}ms both`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${color}33`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div
          className="font-extrabold tracking-tight text-white mb-2"
          style={{ fontFamily: "'Syne',sans-serif", fontSize: "26px", letterSpacing: "-0.5px" }}
        >
          {value}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 flex-1 rounded-full" style={{ background: `linear-gradient(90deg,${color},transparent)` }}/>
          <span style={{ fontSize: "11px", fontWeight: 500, color: pos ? "#34d399" : "#f87171", fontFamily: "'DM Sans',sans-serif" }}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SVG Line chart ────────────────────────────────────────────────────────────
const CHART_DATA = {
  Today: [120, 180, 145, 210, 175, 230, 195],
  Week:  [85,  130, 145, 120, 168, 155, 190, 210],
  Month: [60,  95,  80,  130, 115, 155, 140, 178, 165, 200, 185, 220],
};
const LABELS = {
  Today: ["00:00","04:00","08:00","12:00","16:00","20:00","24:00"],
  Week:  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun",""],
  Month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

function SalesChart({ period }: { period: keyof typeof CHART_DATA }) {
  const data   = CHART_DATA[period];
  const labels = LABELS[period];
  const W = 660, H = 200;
  const pL = 36, pR = 20, pT = 16, pB = 32;
  const iW = W - pL - pR;
  const iH = H - pT - pB;
  const min = Math.min(...data) - 20;
  const max = Math.max(...data) + 20;

  const pts = data.map((v, i) => ({
    x: pL + (i / (data.length - 1)) * iW,
    y: pT + iH - ((v - min) / (max - min)) * iH,
  }));

  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = lineD + ` L${pts[pts.length-1].x.toFixed(1)},${(pT+iH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pT+iH).toFixed(1)} Z`;
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map(p => ({ y: pT + iH * (1 - p), v: Math.round(min + (max - min) * p) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "200px", overflow: "visible" }}>
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02"/>
        </linearGradient>
        <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {gridYs.map(g => (
        <g key={g.y}>
          <line x1={pL} y1={g.y} x2={pL+iW} y2={g.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <text x={pL-5} y={g.y+4} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="DM Sans,sans-serif">{g.v}</text>
        </g>
      ))}
      {pts.map((p, i) => (
        <line key={i} x1={p.x} y1={pT} x2={p.x} y2={pT+iH} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
      {labels.slice(0, data.length).map((l, i) => (
        <text key={i} x={pL + (i/(data.length-1))*iW} y={H-6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="DM Sans,sans-serif">{l}</text>
      ))}
      <path d={areaD} fill="url(#areaG)"/>
      <path d={lineD} fill="none" stroke="url(#lineG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineGlow)"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0a120e" stroke="url(#lineG)" strokeWidth="2"/>
          <circle cx={p.x} cy={p.y} r="1.8" fill="#10b981"/>
        </g>
      ))}
    </svg>
  );
}

// ── Garage verification card ──────────────────────────────────────────────────
interface VerifCardProps { label: string; count: string; sub: string; color: string; delay?: number; }
function VerifCard({ label, count, sub, color, delay = 0 }: VerifCardProps) {
  return (
    <div
      className="flex-1 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        animation: `fadeUp .45s ease ${delay}ms both`,
        minWidth: 0,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${color}35`}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"}
    >
      <p style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span className="font-extrabold" style={{ fontFamily: "'Syne',sans-serif", fontSize: "32px", letterSpacing: "-1px", color }}>
          {count.padStart(2, "0")}
        </span>
        <span className="mb-1.5" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
          {sub}
        </span>
      </div>
    </div>
  );
}

// ── Blur overlay ──────────────────────────────────────────────────────────────
function ComingSoonOverlay({ label = "Live data coming soon" }: { label?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(10,18,14,0.55)",
        borderRadius: "inherit",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(16,185,129,0.12)",
          border: "1px solid rgba(16,185,129,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [period, setPeriod] = useState<"Today" | "Week" | "Month">("Week");

  const STATS: StatCardProps[] = [
    {
      label: "Total Users", value: "12,000", change: "+8.2% this month", pos: true, color: "#10b981",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      label: "Total Garages", value: "750", change: "+24 new this week", pos: true, color: "#06b6d4",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    },
    {
      label: "Total Bookings", value: "5,000", change: "+12.5% vs last week", pos: true, color: "#f59e0b",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01"/></svg>,
    },
    {
      label: "Total Revenue", value: "₹4.2M", change: "+18.3% this month", pos: true, color: "#8b5cf6",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-7h2a2 2 0 004 0h2"/></svg>,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-7" style={{ background: "#0a120e" }}>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <div key={s.label} style={{ position: "relative", borderRadius: "1rem" }}>
            <StatCard {...s} delay={i * 70} />
            <ComingSoonOverlay label="No data yet" />
          </div>
        ))}
      </div>

      {/* ── Chart + right mini-stats ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        {/* Chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            position: "relative",
            background: "linear-gradient(145deg,rgba(13,20,16,0.9),rgba(10,15,12,0.95))",
            border: "1px solid rgba(255,255,255,0.07)",
            animation: "fadeUp .5s ease 280ms both",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-[14.5px]" style={{ fontFamily: "'Syne',sans-serif" }}>Sales Details</h3>
              <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
                {period === "Week" ? "Weekly revenue visualization" : period === "Today" ? "Today's revenue by hour" : "Monthly trend"}
              </p>
            </div>
            <div className="flex rounded-xl overflow-hidden p-0.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(["Today","Week","Month"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="text-[11.5px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    background: period === p ? "linear-gradient(135deg,#059669,#10b981)" : "transparent",
                    color: period === p ? "#fff" : "rgba(255,255,255,0.4)",
                    border: "none", cursor: "pointer",
                    boxShadow: period === p ? "0 2px 8px rgba(16,185,129,0.35)" : "none",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <SalesChart period={period} />
          <ComingSoonOverlay label="Connect API to view live chart" />
        </div>

        {/* Right: quick stats */}
        <div className="flex flex-col gap-4">
          {[
            { label: "Active Garages",    val: "680",    pct: 90, color: "#10b981", sub: "of 750 total" },
            { label: "Pending Approvals", val: "06",     pct: 40, color: "#f59e0b", sub: "awaiting review" },
            { label: "Monthly Growth",    val: "+18.3%", pct: 73, color: "#8b5cf6", sub: "vs last month" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex-1 rounded-2xl p-4"
              style={{
                position: "relative",
                background: "linear-gradient(145deg,rgba(13,20,16,0.9),rgba(10,15,12,0.95))",
                border: "1px solid rgba(255,255,255,0.07)",
                animation: `fadeUp .5s ease ${360 + i * 80}ms both`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                <span className="font-bold text-white" style={{ fontFamily: "'Syne',sans-serif", fontSize: "15px" }}>{item.val}</span>
              </div>
              <div className="h-1.5 rounded-full mb-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.pct}%`, background: `linear-gradient(90deg,${item.color},${item.color}88)` }}/>
              </div>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif" }}>{item.sub}</span>
              <ComingSoonOverlay label="No data yet" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Garage Verification ────────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{
          position: "relative",
          background: "linear-gradient(145deg,rgba(13,20,16,0.9),rgba(10,15,12,0.95))",
          border: "1px solid rgba(255,255,255,0.07)",
          animation: "fadeUp .5s ease 520ms both",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white text-[14.5px]" style={{ fontFamily: "'Syne',sans-serif" }}>Garage Verification Status</h3>
            <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
              Real-time verification pipeline overview
            </p>
          </div>
          <button
            className="text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg,#059669,#10b981)",
              border: "none", color: "#fff",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: "0.07em", cursor: "pointer",
              boxShadow: "0 2px 12px rgba(16,185,129,0.3)",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
          >
            View All
          </button>
        </div>

        {/* Verif cards */}
        <div className="flex flex-col sm:flex-row gap-4">
          <VerifCard label="Pending Requests"  count="6" sub="Requests" color="#f59e0b" delay={0}/>
          <VerifCard label="Approved Garages"  count="8" sub="Active"   color="#10b981" delay={80}/>
          <VerifCard label="Rejected Requests" count="4" sub="Closed"   color="#f87171" delay={160}/>
        </div>

        {/* Recent table */}
        <div className="mt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "18px" }}>
          <p style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px", fontFamily: "'DM Sans',sans-serif" }}>
            Recent Applications
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Garage Name","Owner","Location","Submitted","Status"].map(h => (
                    <th key={h} className="text-left pb-3 pr-4" style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans',sans-serif" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "AutoFix Hub",     owner: "Rajesh K.", loc: "Chennai",   date: "Today",      status: "pending" },
                  { name: "QuickCare Pro",   owner: "Anita S.",  loc: "Bangalore", date: "Yesterday",  status: "approved" },
                  { name: "MotoService+",    owner: "Vikram P.", loc: "Mumbai",    date: "2 days ago", status: "rejected" },
                  { name: "Elite Wheels",    owner: "Sunita R.", loc: "Delhi",     date: "3 days ago", status: "approved" },
                  { name: "GearMaster Inc.", owner: "Arjun M.",  loc: "Pune",      date: "4 days ago", status: "pending" },
                ].map((row, i) => {
                  const sc = {
                    pending:  { bg: "rgba(245,158,11,0.12)", c: "#fbbf24" },
                    approved: { bg: "rgba(16,185,129,0.12)", c: "#34d399" },
                    rejected: { bg: "rgba(239,68,68,0.12)",  c: "#f87171" },
                  }[row.status] as { bg: string; c: string };
                  return (
                    <tr
                      key={i}
                      className="transition-colors"
                      style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                    >
                      <td className="py-3 pr-4"><span className="text-[13px] font-semibold text-white" style={{ fontFamily: "'DM Sans',sans-serif" }}>{row.name}</span></td>
                      <td className="py-3 pr-4"><span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif" }}>{row.owner}</span></td>
                      <td className="py-3 pr-4"><span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>{row.loc}</span></td>
                      <td className="py-3 pr-4"><span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{row.date}</span></td>
                      <td className="py-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize"
                          style={{ background: sc.bg, color: sc.c, fontFamily: "'DM Sans',sans-serif", border: `1px solid ${sc.c}30` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.c }}/>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blur entire verification section */}
        <ComingSoonOverlay label="Connect verification API" />
      </div>

    </div>
  );
}