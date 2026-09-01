import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Warehouse,
  Truck,
  CalendarX2,
  CalendarRange,
  CalendarCheck,
  Wrench,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "failed_slot_unavailable";

type PaymentStatus = "paid" | "pending";
type VisitType = "drive-in" | "pickup-drop";

interface AdvancePayment {
  status: PaymentStatus;
  amount?: number;
}

interface Booking {
  id: string;
  vehicle: {
    registrationNumber: string;
    ownerName: string;
    type?: string;
  };
  service: {
    category: string;
  };
  visitType: VisitType;
  scheduledAt: string; 
  mechanicAssigned: boolean;
  mechanicName?: string;
  advancePayment: AdvancePayment;
  status: BookingStatus;
}

interface BookingStats {
  total: number;
  awaitingStart: number; 
  ongoing: number; 
  completed: number;
  cancelled: number; 
}

type StatusFilter =
  | "all"
  | "confirmed"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "pending_payment";

type DateRangeFilter = "today" | "week" | "month" | null;

interface BookingFilters {
  search: string;
  dateRange: DateRangeFilter;
  status: StatusFilter;
  vehicleType: string | null;
  visitType: VisitType | null;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 8;

const DEFAULT_FILTERS: BookingFilters = {
  search: "",
  dateRange: null,
  status: "all",
  vehicleType: null,
  visitType: null,
};

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "assigned", label: "Assigned" },
  { value: "in-progress", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pending_payment", label: "Payment Pending" },
];

const DATE_TABS: { value: Exclude<DateRangeFilter, null>; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const VEHICLE_TYPES = ["2-Wheeler", "Hatchback", "Sedan", "SUV", "Commercial"];

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  pending_payment: {
    label: "Payment Pending",
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-cyan-400",
    text: "text-cyan-300",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  assigned: {
    label: "Assigned",
    dot: "bg-blue-400",
    text: "text-blue-300",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  "in-progress": {
    label: "Ongoing",
    dot: "bg-cyan-400",
    text: "text-cyan-300",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    text: "text-red-300",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  failed_slot_unavailable: {
    label: "Failed",
    dot: "bg-red-400",
    text: "text-red-300",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  paid: {
    label: "Paid",
    className: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  },
};

const TABLE_COLUMNS = [
  "Vehicle",
  "Service",
  "Visit Type",
  "Date & Time",
  "Assigned Mechanic",
  "Payment",
  "Status",
  "Action",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

function isWithinRange(iso: string, range: DateRangeFilter) {
  if (!range) return true;
  const now = new Date();
  const d = new Date(iso);
  if (range === "today") {
    return d.toDateString() === now.toDateString();
  }
  if (range === "week") {
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    return d >= now && d.getTime() - now.getTime() <= weekMs;
  }
  if (range === "month") {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  return true;
}

function matchesStatusFilter(booking: Booking, status: StatusFilter) {
  if (status === "all") return true;
  if (status === "pending_payment") return booking.status === "pending_payment";
  return booking.status === status;
}

function deriveBookingStats(bookings: Booking[]): BookingStats {
  return {
    total: bookings.length,
    awaitingStart: bookings.filter((b) => b.status === "confirmed" || b.status === "assigned")
      .length,
    ongoing: bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter(
      (b) => b.status === "cancelled" || b.status === "failed_slot_unavailable"
    ).length,
  };
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  accent: "gradient" | "cyan" | "green" | "red" | "amber";
}

const ACCENT_CLASSES: Record<StatCardProps["accent"], { circle: string; border: string }> = {
  gradient: {
    circle: "bg-gradient-to-br from-blue-500 to-cyan-500",
    border: "border-l-2 border-l-cyan-400",
  },
  cyan: {
    circle: "bg-cyan-400/15 text-cyan-300",
    border: "border-l-2 border-l-cyan-400",
  },
  green: {
    circle: "bg-emerald-400/15 text-emerald-300",
    border: "border-l-2 border-l-emerald-400",
  },
  red: {
    circle: "bg-red-400/15 text-red-300",
    border: "border-l-2 border-l-red-400",
  },
  amber: {
    circle: "bg-amber-400/15 text-amber-300",
    border: "border-l-2 border-l-amber-400",
  },
};

function StatCard({ icon: Icon, label, count, accent }: StatCardProps) {
  const cls = ACCENT_CLASSES[accent];
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4 ${cls.border}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${cls.circle}`}>
        <Icon className={accent === "gradient" ? "h-5 w-5 text-white" : "h-5 w-5"} />
      </div>
      <div className="min-w-0">
        <p className="font-['Syne'] text-2xl font-bold leading-none text-white">{count}</p>
        <p className="mt-1.5 truncate text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function BookingStatsRow({ stats }: { stats: BookingStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={CalendarRange} label="Total Bookings" count={stats.total} accent="gradient" />
      <StatCard
        icon={CalendarCheck}
        label="Confirmed / Awaiting Start"
        count={stats.awaitingStart}
        accent="cyan"
      />
      <StatCard icon={Wrench} label="Ongoing" count={stats.ongoing} accent="cyan" />
      <StatCard icon={CheckCircle2} label="Completed" count={stats.completed} accent="green" />
      <StatCard icon={XCircle} label="Cancelled" count={stats.cancelled} accent="red" />
    </div>
  );
}

interface BookingFiltersBarProps {
  filters: BookingFilters;
  onChange: (filters: BookingFilters) => void;
}

function BookingFiltersBar({ filters, onChange }: BookingFiltersBarProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  const activeMoreFilterCount = (filters.vehicleType ? 1 : 0) + (filters.visitType ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Search + date range + more filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by customer name, vehicle registration, or service category"
            className="w-full rounded-lg border border-white/10 bg-[#0a0f1e] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/10 bg-[#0a0f1e] p-1">
            {DATE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() =>
                  onChange({
                    ...filters,
                    dateRange: filters.dateRange === tab.value ? null : tab.value,
                  })
                }
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filters.dateRange === tab.value
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPanelOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              panelOpen || activeMoreFilterCount > 0
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-[#0a0f1e] text-slate-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            More Filters
            {activeMoreFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-semibold text-[#060a14]">
                {activeMoreFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Status filter row */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange({ ...filters, status: tab.value })}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filters.status === tab.value
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* More filters panel */}
      {panelOpen && (
        <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-['Syne'] text-sm font-semibold text-white">More Filters</p>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-slate-500 hover:text-white"
              aria-label="Close filters panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">Vehicle Type</p>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      onChange({
                        ...filters,
                        vehicleType: filters.vehicleType === type ? null : type,
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      filters.vehicleType === type
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">Visit Type</p>
              <div className="flex flex-wrap gap-2">
                {(["drive-in", "pickup-drop"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      onChange({
                        ...filters,
                        visitType: filters.visitType === type ? null : type,
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      filters.visitType === type
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {type === "drive-in" ? "Drive-in" : "Pickup & Drop"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {TABLE_COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3.5">
          <div className="h-3.5 w-full max-w-[110px] animate-pulse rounded bg-white/5" />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
        <CalendarX2 className="h-6 w-6 text-slate-500" />
      </div>
      <div>
        <p className="font-['Syne'] text-sm font-semibold text-white">No bookings yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Bookings matching your filters will show up here.
        </p>
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  onView,
}: {
  booking: Booking;
  onView: (bookingId: string) => void;
}) {
  const { date, time } = formatDateTime(booking.scheduledAt);
  const dimmed = booking.status === "cancelled" || booking.status === "failed_slot_unavailable";

  return (
    <tr className={`transition-colors hover:bg-white/[0.02] ${dimmed ? "opacity-45" : ""}`}>
      <td className="whitespace-nowrap px-4 py-3.5">
        <p className="font-semibold text-white">{booking.vehicle.registrationNumber}</p>
        <p className="text-xs text-slate-500">{booking.vehicle.ownerName}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-slate-300">{booking.service.category}</td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-slate-300">
          {booking.visitType === "drive-in" ? (
            <Warehouse className="h-4 w-4 text-slate-500" />
          ) : (
            <Truck className="h-4 w-4 text-slate-500" />
          )}
          {booking.visitType === "drive-in" ? "Drive-in" : "Pickup & Drop"}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <p className="text-slate-300">{date}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        {booking.mechanicAssigned ? (
          <span className="text-slate-300">{booking.mechanicName}</span>
        ) : (
          <span className="text-slate-500">Unassigned</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <PaymentBadge status={booking.advancePayment.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={booking.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <button
          onClick={() => onView(booking.id)}
          className="rounded-lg border border-cyan-400/40 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-400/10"
        >
          View
        </button>
      </td>
    </tr>
  );
}

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onView: (bookingId: string) => void;
}

function BookingsTable({ bookings, isLoading, onView }: BookingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0f1e]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              {TABLE_COLUMNS.map((col) => (
                <th key={col} className="whitespace-nowrap px-4 py-3 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!isLoading &&
              bookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} onView={onView} />
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && bookings.length === 0 && <EmptyState />}
    </div>
  );
}

interface BookingsPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function BookingsPagination({ page, pageSize, total, onPageChange }: BookingsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
      <p className="text-sm text-slate-500">
        Showing {start}–{end} of {total} bookings
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-sm text-slate-600">…</span>}
              <button
                onClick={() => onPageChange(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mock data — replace with the real bookings API call                 */
/* ------------------------------------------------------------------ */

async function fetchBookings(): Promise<Booking[]> {
  await new Promise((r) => setTimeout(r, 600));
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      id: "1",
      vehicle: { registrationNumber: "KL-07-AB-2345", ownerName: "Arjun Nair", type: "Sedan" },
      service: { category: "General Service" },
      visitType: "drive-in",
      scheduledAt: new Date(now + day).toISOString(),
      mechanicAssigned: true,
      mechanicName: "Rahul K.",
      advancePayment: { status: "paid" },
      status: "confirmed",
    },
    {
      id: "2",
      vehicle: { registrationNumber: "KL-09-CD-7788", ownerName: "Meera Menon", type: "Hatchback" },
      service: { category: "Brake Inspection" },
      visitType: "pickup-drop",
      scheduledAt: new Date(now + 2 * day).toISOString(),
      mechanicAssigned: false,
      advancePayment: { status: "pending" },
      status: "pending_payment",
    },
    {
      id: "3",
      vehicle: { registrationNumber: "KL-11-EF-1122", ownerName: "Sanjay Pillai", type: "SUV" },
      service: { category: "AC Repair" },
      visitType: "drive-in",
      scheduledAt: new Date(now).toISOString(),
      mechanicAssigned: true,
      mechanicName: "Vishnu S.",
      advancePayment: { status: "paid" },
      status: "in-progress",
    },
    {
      id: "4",
      vehicle: { registrationNumber: "KL-05-GH-4433", ownerName: "Divya Krishnan", type: "Sedan" },
      service: { category: "Full Body Wash" },
      visitType: "drive-in",
      scheduledAt: new Date(now - 3 * day).toISOString(),
      mechanicAssigned: true,
      mechanicName: "Rahul K.",
      advancePayment: { status: "paid" },
      status: "completed",
    },
    {
      id: "5",
      vehicle: { registrationNumber: "KL-14-IJ-9900", ownerName: "Fahad Rasheed", type: "2-Wheeler" },
      service: { category: "Engine Diagnostics" },
      visitType: "pickup-drop",
      scheduledAt: new Date(now - day).toISOString(),
      mechanicAssigned: false,
      advancePayment: { status: "paid" },
      status: "cancelled",
    },
    {
      id: "6",
      vehicle: { registrationNumber: "KL-03-KL-5566", ownerName: "Anjali Suresh", type: "Hatchback" },
      service: { category: "Tyre Replacement" },
      visitType: "drive-in",
      scheduledAt: new Date(now + 3 * day).toISOString(),
      mechanicAssigned: true,
      mechanicName: "Nithin P.",
      advancePayment: { status: "paid" },
      status: "assigned",
    },
    {
      id: "7",
      vehicle: { registrationNumber: "KL-02-MN-3311", ownerName: "Rohit Varma", type: "Commercial" },
      service: { category: "Slot Rescheduled" },
      visitType: "pickup-drop",
      scheduledAt: new Date(now - 2 * day).toISOString(),
      mechanicAssigned: false,
      advancePayment: { status: "pending" },
      status: "failed_slot_unavailable",
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function BookingsListPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BookingFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    // Replace with the real bookings API call, e.g.:
    // const res = await api.get<Booking[]>("/service-center/bookings");
    fetchBookings()
      .then((data) => {
        if (!cancelled) setBookings(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (q) {
        const haystack = `${b.vehicle.registrationNumber} ${b.vehicle.ownerName} ${b.service.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (!matchesStatusFilter(b, filters.status)) return false;
      if (!isWithinRange(b.scheduledAt, filters.dateRange)) return false;
      if (filters.vehicleType && b.vehicle.type !== filters.vehicleType) return false;
      if (filters.visitType && b.visitType !== filters.visitType) return false;
      return true;
    });
  }, [bookings, filters]);

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, page]);

  const stats = useMemo(() => deriveBookingStats(bookings), [bookings]);

  function handleFiltersChange(next: BookingFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#060a14] px-6 py-8">
      <header className="mb-6">
        <h1 className="font-['Syne'] text-2xl font-bold text-white">Bookings</h1>
        <p className="mt-1 font-['DM_Sans'] text-sm text-slate-400">
          Manage all repair bookings and scheduled maintenance.
        </p>
      </header>

      <div className="space-y-6">
        <BookingStatsRow stats={stats} />

        <BookingFiltersBar filters={filters} onChange={handleFiltersChange} />

        <BookingsTable
          bookings={paginatedBookings}
          isLoading={isLoading}
          onView={(id) => navigate(`/bookings/${id}`)}
        />

        {!isLoading && filteredBookings.length > 0 && (
          <BookingsPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filteredBookings.length}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}