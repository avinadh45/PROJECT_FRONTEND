// src/pages/Dashboard.tsx

import { useState } from "react";

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label:     string;
  value:     string;
  change:    string;
  positive:  boolean;
  accentColor: string;
  icon:      React.ReactNode;
  delay?:    number;
}

function StatCard({ label, value, change, positive, accentColor, icon, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        background: "linear-gradient(145deg, rgba(14,20,40,0.9), rgba(10,15,30,0.95))",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        animation: `fadeUp .5s ease ${delay}ms both`,
        minHeight: "130px",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}44`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}22`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[12.5px] font-medium" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}33`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div
          className="text-white font-extrabold tracking-tight mb-2"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", letterSpacing: "-0.5px" }}
        >
          {value}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-0.5 rounded-full flex-1"
            style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
          />
          <span
            className="text-[11.5px] font-medium"
            style={{ color: positive ? "#34d399" : "#f87171", fontFamily: "'DM Sans',sans-serif" }}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Mini SVG line chart ───────────────────────────────────────────────────────
const CHART_DATA = {
  Today: [40, 55, 45, 60, 50, 65, 58],
  Week:  [30, 45, 55, 48, 62, 58, 75, 80],
  Month: [20, 35, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90],
};
const DAYS = {
  Today: ["00:00","04:00","08:00","12:00","16:00","20:00","24:00"],
  Week:  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun",""],
  Month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

function LineChart({ period }: { period: keyof typeof CHART_DATA }) {
  const data  = CHART_DATA[period];
  const days  = DAYS[period];
  const W     = 580;
  const H     = 180;
  const pad   = { t: 20, r: 20, b: 30, l: 30 };
  const iW    = W - pad.l - pad.r;
  const iH    = H - pad.t - pad.b;
  const min   = Math.min(...data) - 10;
  const max   = Math.max(...data) + 10;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * iW,
    y: pad.t + iH - ((v - min) / (max - min)) * iH,
  }));

  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = lineD + ` L${pts[pts.length-1].x.toFixed(1)},${(pad.t+iH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t+iH).toFixed(1)} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => ({
    y:   pad.t + iH * (1 - pct),
    val: Math.round(min + (max - min) * pct),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "180px", overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02"/>
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {gridLines.map(g => (
        <g key={g.y}>
          <line x1={pad.l} y1={g.y} x2={pad.l + iW} y2={g.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <text x={pad.l - 6} y={g.y + 4} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="9">
            {g.val}
          </text>
        </g>
      ))}

      {days.slice(0, data.length).map((d, i) => (
        <text
          key={i}
          x={pad.l + (i / (data.length - 1)) * iW}
          y={H - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="10"
        >
          {d}
        </text>
      ))}

      {pts.map((p, i) => (
        <line key={i} x1={p.x} y1={pad.t} x2={p.x} y2={pad.t + iH}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}

      <path d={areaD} fill="url(#areaGrad)"/>
      <path d={lineD} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"/>

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#080c18" stroke="url(#lineGrad)" strokeWidth="2"/>
          <circle cx={p.x} cy={p.y} r="2" fill="#3b82f6"/>
        </g>
      ))}
    </svg>
  );
}

// ── Recent bookings table ─────────────────────────────────────────────────────
const BOOKINGS = [
  { id: "#B1042", customer: "Rahul Sharma",  service: "Oil Change",       status: "Completed",  amount: "₹850",  date: "Today, 09:30" },
  { id: "#B1041", customer: "Priya Nair",    service: "Tyre Replacement", status: "Ongoing",    amount: "₹2,400",date: "Today, 08:15" },
  { id: "#B1040", customer: "Ankit Verma",   service: "Engine Checkup",   status: "Pending",    amount: "₹1,200",date: "Yesterday" },
  { id: "#B1039", customer: "Sneha Kumar",   service: "Brake Service",    status: "Completed",  amount: "₹1,800",date: "Yesterday" },
  { id: "#B1038", customer: "Arjun Mehta",   service: "AC Repair",        status: "Cancelled",  amount: "₹3,500",date: "2 days ago" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Completed:  { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
  Ongoing:    { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
  Pending:    { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
  Cancelled:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
};

// ── Placeholder overlay — shown over dummy sections ───────────────────────────
function ComingSoonOverlay({ label = "Live data coming soon" }: { label?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(6,10,20,0.55)",
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
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* lock icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState<"Today" | "Week" | "Month">("Week");

  // TODO: replace with real API data
  const STATS = [
    {
      label: "Total Requests", value: "128", change: "+12% vs last week",
      positive: true, accentColor: "#3b82f6",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    },
    {
      label: "Ongoing Jobs", value: "42", change: "+5 since yesterday",
      positive: true, accentColor: "#f59e0b",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    },
    {
      label: "Completed", value: "856", change: "+38 this week",
      positive: true, accentColor: "#10b981",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>,
    },
    {
      label: "Total Earnings", value: "₹12,450", change: "+8.2% vs last week",
      positive: true, accentColor: "#06b6d4",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ background: "#060a14" }}>

      {/* ── Stat cards — blurred (dummy) ───────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STATS.map((s, i) => (
          <div key={s.label} style={{ position: "relative", borderRadius: "1rem" }}>
            <StatCard {...s} delay={i * 80} />
            <ComingSoonOverlay label="No data yet" />
          </div>
        ))}
      </div>

      {/* ── Chart + Quick stats — blurred (dummy) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">

        {/* Chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            position: "relative",
            background: "linear-gradient(145deg,rgba(14,20,40,0.9),rgba(10,15,30,0.95))",
            border: "1px solid rgba(255,255,255,0.07)",
            animation: "fadeUp .5s ease 320ms both",
          }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne',sans-serif" }}>Growth</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
                {period === "Today" ? "Hourly revenue" : period === "Week" ? "Weekly revenue visualization" : "Monthly revenue"}
              </p>
            </div>
            <div
              className="flex rounded-xl overflow-hidden p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["Today","Week","Month"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    background: period === p ? "linear-gradient(135deg,#1d4ed8,#3b82f6)" : "transparent",
                    color: period === p ? "#fff" : "rgba(255,255,255,0.4)",
                    border: "none", cursor: "pointer",
                    boxShadow: period === p ? "0 2px 8px rgba(59,130,246,0.4)" : "none",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <LineChart period={period} />
          <ComingSoonOverlay label="Connect API to view live chart" />
        </div>

        {/* Right stats */}
        <div className="flex flex-col gap-4">
          {[
            { label: "Avg. Service Time", value: "2.4 hrs",  sub: "Per vehicle", color: "#3b82f6", pct: 72 },
            { label: "Customer Satisfaction", value: "4.8/5", sub: "Based on 120 reviews", color: "#10b981", pct: 96 },
            { label: "Mechanic Utilization", value: "86%",   sub: "6 of 7 active today", color: "#f59e0b", pct: 86 },
          ].map((item, i) => (
            <div
              key={item.label}
              className="rounded-2xl p-4 flex-1"
              style={{
                position: "relative",
                background: "linear-gradient(145deg,rgba(14,20,40,0.9),rgba(10,15,30,0.95))",
                border: "1px solid rgba(255,255,255,0.07)",
                animation: `fadeUp .5s ease ${400 + i * 80}ms both`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne',sans-serif" }}>{item.value}</span>
              </div>
              <div className="h-1.5 rounded-full mb-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}99)` }}
                />
              </div>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{item.sub}</span>
              <ComingSoonOverlay label="No data yet" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Bookings — blurred (dummy) ──────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          position: "relative",
          background: "linear-gradient(145deg,rgba(14,20,40,0.9),rgba(10,15,30,0.95))",
          border: "1px solid rgba(255,255,255,0.07)",
          animation: "fadeUp .5s ease 560ms both",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h3 className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne',sans-serif" }}>Recent Bookings</h3>
            <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Last 5 service requests</p>
          </div>
          <button
            className="text-[12.5px] font-medium px-4 py-1.5 rounded-lg transition-colors"
            style={{
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
              color: "#60a5fa", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.1)"; }}
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Booking ID","Customer","Service","Status","Amount","Date"].map(h => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-[11.5px] font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((b, i) => (
                <tr
                  key={b.id}
                  className="transition-colors"
                  style={{ borderBottom: i < BOOKINGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  <td className="px-6 py-3.5">
                    <span className="text-[13px] font-semibold" style={{ color: "#60a5fa", fontFamily: "'DM Sans',sans-serif" }}>{b.id}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif" }}>{b.customer}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif" }}>{b.service}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold"
                      style={{ background: STATUS_STYLE[b.status].bg, color: STATUS_STYLE[b.status].color, fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Syne',sans-serif" }}>{b.amount}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>{b.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Blur overlay over entire bookings table */}
        <ComingSoonOverlay label="Connect bookings API" />
      </div>

    </div>
  );
}