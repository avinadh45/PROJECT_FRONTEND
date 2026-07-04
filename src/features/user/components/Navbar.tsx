import { useState, useEffect, useRef } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface Notification {
  text: string;
  time: string;
  unread: boolean;
}

interface NavbarProps {
  links: NavLink[];
  userInitials: string;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  notifications?: Notification[];
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > threshold); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function Navbar({
  links,
  userInitials,
  userName,
  userEmail,
  onLogout,
  notifications = [],
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled(8);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setAvatarOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "border-b border-blue-500/30 bg-[rgba(7,12,28,0.97)] shadow-[0_2px_32px_rgba(0,0,0,0.6)]"
          : "border-b border-transparent bg-[rgba(7,12,28,0.5)]"
      }`}
    >
      <div
        className={`w-full px-6 lg:px-10 flex items-center justify-between gap-4 transition-[height] duration-300 ${
          scrolled ? "h-14" : "h-[68px]"
        }`}
      >
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2 no-underline flex-shrink-0">
          <div
            className="w-7 h-7 rounded-[5px] flex items-center justify-center font-syne font-black text-sm text-white transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}
          >
            M
          </div>
          <span className="font-syne font-extrabold text-[15px] text-white tracking-tight">
            Moto<span className="text-blue-500">cline</span>
          </span>
        </a>

        {/* Center links */}
        <div className="hidden md:flex justify-center items-center gap-[clamp(16px,2.2vw,32px)]">
  {links.map((l) => (
    <a
      key={l.label}
      href={l.href}
      className="group relative text-white/65 hover:text-white text-[12.5px] font-medium tracking-wide no-underline transition-colors duration-200 py-1"
    >
      {l.label}
      <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  ))}
</div>
        {/* Right: notif + avatar */}
        <div className="hidden md:flex items-center gap-3">

          {/* Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen((p) => !p); setAvatarOpen(false); }}
              className="relative w-9 h-9 rounded-lg border border-white/15 bg-white/[0.05] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
            >
              <BellIcon />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 inline-flex">
                  <span className="absolute inline-flex h-[7px] w-[7px] rounded-full bg-red-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-[rgba(7,12,28,1)]" />
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-72 bg-[#0d1428] border border-blue-500/25 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-syne font-bold text-white text-[13px]">Notifications</span>
                  <span className="text-[11px] text-blue-400 cursor-pointer hover:text-blue-300">
                    Mark all read
                  </span>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-white/30 text-[12px] text-center py-4">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="flex gap-3 py-2.5 border-b border-white/[0.05] last:border-0 last:pb-0"
                    >
                      <div className={`w-[7px] h-[7px] rounded-full mt-1 flex-shrink-0 ${n.unread ? "bg-blue-500" : "bg-white/20"}`} />
                      <div>
                        <p className="text-[12px] text-white/75 leading-[1.5]">{n.text}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => { setAvatarOpen((p) => !p); setNotifOpen(false); }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold font-syne border-2 border-blue-500/40 hover:border-blue-400/70 transition-all duration-200 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
              style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}
            >
              {userInitials}
            </button>

            {avatarOpen && (
              <div className="absolute right-0 top-11 w-48 bg-[#0d1428] border border-blue-500/25 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] p-2 z-50">
                <div className="px-3 py-2.5 border-b border-white/[0.07] mb-1">
                  <p className="text-[13px] font-semibold text-white">{userName}</p>
                  <p className="text-[11px] text-white/35 mt-0.5">{userEmail}</p>
                </div>
                {[
                  { label: "My Profile", danger: false },
                  { label: "Settings", danger: false },
                  { label: "Log Out", danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { if (item.label === "Log Out") onLogout(); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-colors duration-200 ${
                      item.danger
                        ? "text-red-400 hover:bg-red-500/10 mt-1 border-t border-white/[0.07] pt-2"
                        : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 flex items-center justify-center border border-white/20 rounded text-white hover:bg-white/10 transition-colors duration-200"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 pb-5 pt-3 border-t border-blue-500/20 bg-[rgba(7,12,28,0.98)]">
          {links.map((l) => (
  <a
    key={l.label}
    href={l.href}
    className="text-white/80 hover:text-white text-[15px] no-underline transition-colors duration-200"
  >
    {l.label}
  </a>
))}
          <button
            onClick={onLogout}
            className="w-fit px-5 py-2 rounded border border-red-500/30 bg-red-500/[0.08] text-red-400 font-syne text-[13px] hover:bg-red-500/20 transition-colors duration-200"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}