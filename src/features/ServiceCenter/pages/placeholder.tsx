// src/pages/PlaceholderPage.tsx
// Generic placeholder for pages not yet built — shows icon, title, CTA

import type { PageKey } from "../types/index";

interface PlaceholderPageProps { page: PageKey }

const PAGE_META: Record<PageKey, { title: string; desc: string; color: string; icon: React.ReactNode }> = {
  dashboard: { title: "", desc: "", color: "#3b82f6", icon: null },
  bookings:  {
    title: "Bookings", desc: "Manage all service bookings — view, approve, and track customer appointments.",
    color: "#3b82f6",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
  },
  slot: {
    title: "Slot Management", desc: "Configure and manage available time slots for service appointments.",
    color: "#f59e0b",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  },
  concern: {
    title: "Concern Requests", desc: "Review and respond to customer concerns and support tickets.",
    color: "#ec4899",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
  garage: {
    title: "Garage", desc: "Manage your garage details, bays, equipment, and capacity settings.",
    color: "#06b6d4",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  },
  mechanic: {
    title: "Mechanic", desc: "Manage your team of mechanics — track assignments and performance.",
    color: "#8b5cf6",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  service: {
    title: "Services", desc: "Define and manage the services your garage offers with pricing and duration.",
    color: "#10b981",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  },
  earnings: {
    title: "Earnings", desc: "Track your revenue, invoices, and financial performance over time.",
    color: "#f59e0b",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  },
};

export default function PlaceholderPage({ page }: PlaceholderPageProps) {
  const meta = PAGE_META[page];
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8"
      style={{ background: "#060a14", minHeight: "calc(100vh - 60px)" }}
    >
      <div
        className="flex flex-col items-center text-center max-w-sm"
        style={{ animation: "fadeUp .45s ease both" }}
      >
        {/* Icon box */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `${meta.color}18`,
            border: `1px solid ${meta.color}33`,
            color: meta.color,
            boxShadow: `0 0 40px ${meta.color}18`,
          }}
        >
          {meta.icon}
        </div>

        <h2
          className="text-white font-extrabold text-2xl mb-3 tracking-tight"
          style={{ fontFamily: "'Syne',sans-serif" }}
        >
          {meta.title}
        </h2>
        <p
          className="text-[14px] leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}
        >
          {meta.desc}
        </p>

        {/* Coming soon badge */}
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold"
          style={{
            background: `${meta.color}12`,
            border: `1px solid ${meta.color}30`,
            color: meta.color,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: meta.color, animation: "pulseDot 2s infinite" }}
          />
          Coming soon
        </span>
      </div>
    </div>
  );
}