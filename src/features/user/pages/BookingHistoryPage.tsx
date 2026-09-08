import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Warehouse,
  Wrench,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Car,
} from "lucide-react";
import { useMyBookings } from "../hooks/useMyBookings";
import { Navbar } from "../components/Navbar";

import { useAuth } from "../hooks/useAuth";

const PAGE_SIZE = 8;
// how many numbered page buttons to show before collapsing into "..."
const MAX_PAGE_BUTTONS = 4;

const STATUS_TABS = [
  { label: "All", value: undefined },
  { label: "Upcoming", value: "confirmed" },
  { label: "Ongoing", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/history" },
];

// Maps a booking status to a badge style + display label.
// Adjust the keys here if your backend's status vocabulary differs.
const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-500/15 text-emerald-400" },
  "in-progress": { label: "Ongoing", className: "bg-cyan-500/15 text-cyan-400" },
  confirmed: { label: "Upcoming", className: "bg-blue-500/15 text-blue-400" },
  pending_payment: { label: "Payment Pending", className: "bg-orange-500/15 text-orange-400" },
  cancelled: { label: "Cancelled", className: "bg-red-500/15 text-red-400" },
  failed_slot_unavailable: { label: "Slot Unavailable", className: "bg-red-500/15 text-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? { label: status, className: "bg-slate-500/15 text-slate-400" };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const { logoutuser} = useAuth()
  const { data, isLoading } = useMyBookings(page, PAGE_SIZE, statusFilter, search || undefined);
  const bookings = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  
  const pageNumbers = (): (number | "...")[] => {
    if (totalPages <= MAX_PAGE_BUTTONS + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#060a14" }}>
      <Navbar links={navLinks} userInitials="AK" userName="Arun Kumar" userEmail="arun@email.com" notifications={[]} onLogout={logoutuser} />

      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          Booking History
        </h1>
        <p className="mt-1 text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          View and manage your service bookings.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by vehicle or service..."
            className="flex-1 min-w-[220px] rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none"
          />
          <div className="flex gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  statusFilter === tab.value
                    ? "bg-cyan-500 text-black"
                    : "border border-white/10 text-slate-400 hover:border-white/25"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {isLoading && <p className="text-slate-500">Loading…</p>}
          {!isLoading && bookings.length === 0 && (
            <p className="text-slate-500 py-10 text-center">No bookings found.</p>
          )}

          {bookings.map((b: any) => {
            const isCompleted = b.status === "completed";
            const isPendingPayment = b.status === "pending_payment";
            const isOngoing = b.status === "in-progress";

            return (
              <div
                key={b.id}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#0a0f1e] p-4"
              >
                {/* Vehicle image — falls back to an icon tile if the API doesn't return one */}
                <div className="h-[104px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-white/5">
                  {b.vehiclePhotoUrl ? (
                    <img
                      src={b.vehiclePhotoUrl}
                      alt={b.vehicleRegistrationNumber}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <Car size={28} />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-base font-semibold text-white">
                          {b.vehicleModel ?? b.vehicleRegistrationNumber}
                        </p>
                        <p className="text-xs text-slate-500">{b.vehicleRegistrationNumber}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
                      <InfoItem icon={Warehouse} label="Garage" value={b.garageName} />
                      <InfoItem icon={Wrench} label="Service" value={b.categoryName} />
                      {isOngoing && b.estimatedCompletion ? (
                        <InfoItem icon={Clock} label="Est. Completion" value={b.estimatedCompletion} />
                      ) : (
                        <InfoItem
                          icon={Calendar}
                          label="Date & Time"
                          value={`${b.schedule?.date} · ${b.schedule?.slotStartingTime}`}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {isCompleted && b.invoiceNumber ? (
                      <span className="text-xs text-slate-600">Invoice No: #{b.invoiceNumber}</span>
                    ) : isPendingPayment && b.advancePayment ? (
                      <span className="text-sm font-semibold text-cyan-400">
                        Total: ₹{b.advancePayment}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">{b.visitType}</span>
                    )}

                    <div className="flex gap-2">
                      {isCompleted && (
                        <>
                          <button
                            onClick={() => navigate(`/booking/${b.id}/concern`)}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-white/25"
                          >
                            Raise Concern
                          </button>
                          {b.invoiceNumber && (
                            <button
                              onClick={() => navigate(`/booking/${b.id}/invoice`)}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-white/25"
                            >
                              Download Invoice
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/details/${b.id}`)}
                        className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-cyan-400"
                      >
                        View Details
                      </button>
                      {isPendingPayment && (
                        <button
                          onClick={() => navigate(`/booking/${b.id}/pay`)}
                          className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-cyan-400"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-slate-600">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-cyan-500 text-black"
                      : "border border-white/10 text-slate-400 hover:border-white/25"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}