// src/pages/AdminPlaceholder.tsx
import type { AdminPageKey } from '../types/index';

const META: Record<AdminPageKey, { title: string; desc: string; color: string; icon: React.ReactNode }> = {
  dashboard:           { title: "", desc: "", color: "#10b981", icon: null },
  "garage-verification": {
    title: "Garage Verification", color: "#10b981",
    desc: "Review and approve incoming garage registration requests.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  },
  garage: {
    title: "Garage Management", color: "#06b6d4",
    desc: "Manage all registered garages, their details and status.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  },
  users: {
    title: "User Management", color: "#8b5cf6",
    desc: "View, manage and moderate platform user accounts.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  earnings: {
    title: "Earnings", color: "#f59e0b",
    desc: "Track revenue, commissions and financial performance.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-7h2a2 2 0 004 0h2"/></svg>,
  },
  bookings: {
    title: "Bookings", color: "#10b981",
    desc: "View all service bookings across the platform.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  },
  category: {
    title: "Category", color: "#ec4899",
    desc: "Manage service categories available on the platform.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  subscription: {
    title: "Subscription", color: "#06b6d4",
    desc: "Manage subscription plans and user memberships.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  concern: {
    title: "Concern Management", color: "#f59e0b",
    desc: "Handle and resolve reported concerns from users and garages.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
  profile: {
    title: "Admin Profile", color: "#10b981",
    desc: "Manage your admin account details and preferences.",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
};

export default function AdminPlaceholder({ page }: { page: AdminPageKey }) {
  const m = META[page];
  return (
    <div
      className="flex-1 flex items-center justify-center p-8"
      style={{ background: "#0a120e", minHeight: "calc(100vh - 56px)" }}
    >
      <div className="flex flex-col items-center text-center max-w-sm" style={{ animation: "fadeUp .4s ease both" }}>
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: `${m.color}15`, border: `1px solid ${m.color}30`, color: m.color, boxShadow: `0 0 40px ${m.color}15` }}
        >
          {m.icon}
        </div>
        <h2 className="text-white font-extrabold text-2xl mb-3 tracking-tight" style={{ fontFamily: "'Syne',sans-serif" }}>
          {m.title}
        </h2>
        <p className="text-[13.5px] leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans',sans-serif" }}>
          {m.desc}
        </p>
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold"
          style={{ background: `${m.color}12`, border: `1px solid ${m.color}28`, color: m.color, fontFamily: "'DM Sans',sans-serif" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color, animation: "pulseDot 2s infinite" }}/>
          Coming soon
        </span>
      </div>
    </div>
  );
}