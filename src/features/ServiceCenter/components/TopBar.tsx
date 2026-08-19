
interface TopbarProps {
  title:    string;
  subtitle?: string;
}

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header
      className="flex items-center justify-between px-8 flex-shrink-0"
      style={{
        height: "60px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,12,24,0.8)",
        backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 20,
      }}
    >
      {/* Left */}
      <div>
        <h1
          className="text-white font-extrabold text-[20px] leading-tight tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-xl px-3"
          style={{
            height: "36px", width: "200px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          <SearchIcon />
          <input
            placeholder="Search…"
            className="bg-transparent outline-none text-[13px] text-white w-full"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          />
        </div>

        {/* Bell */}
        <button
          className="relative flex items-center justify-center rounded-xl transition-colors"
          style={{
            width: "36px", height: "36px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; }}
        >
          <BellIcon />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 rounded-full"
            style={{ width: "7px", height: "7px", background: "#3b82f6", border: "2px solid #080c18" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-xl font-bold text-sm cursor-pointer"
          style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
            fontFamily: "'Syne',sans-serif", color: "#fff",
            fontSize: "12px",
          }}
        >
          SC
        </div>
      </div>
    </header>
  );
}