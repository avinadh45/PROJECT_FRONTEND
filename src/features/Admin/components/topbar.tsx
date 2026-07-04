// src/components/AdminTopbar.tsx

interface AdminTopbarProps {
  title:    string;
  subtitle?: string;
}

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: "56px",
        padding: "0 28px",
        borderBottom: "1px solid rgba(16,185,129,0.08)",
        background: "rgba(10,18,14,0.85)",
        backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 20,
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
        {/* Bell */}
        <button
          className="relative flex items-center justify-center rounded-xl transition-colors"
          style={{
            width: "36px", height: "36px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <BellIcon />
          <span
            className="absolute rounded-full"
            style={{
              top: "8px", right: "8px",
              width: "7px", height: "7px",
              background: "#10b981",
              border: "2px solid #0a120e",
              animation: "pulseDot 2s infinite",
            }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-xl font-bold cursor-pointer"
          style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg,#10b981,#06b6d4)",
            fontFamily: "'Syne',sans-serif",
            fontSize: "12px", color: "#fff",
          }}
        >
          AD
        </div>
      </div>
    </header>
  );
}