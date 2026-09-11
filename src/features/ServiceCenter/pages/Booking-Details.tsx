import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Car,
  User,
  MapPin,
  Wrench,
  ClipboardList,
  ImageOff,
  CheckCircle2,
  Circle,
  CreditCard,
} from "lucide-react";
import { useServiceCenterBookingDetail } from "../hooks/useServiceCenterBookingDetail";
import type { ServiceCenterBookingDetail } from "../interface/bookingInterface";
import  PickUpMapView from "../../../shared/components/PickUpMapView"
import { useQueryClient } from "@tanstack/react-query";
import { markBookingRefunded } from "../services/ServiceCenterService";

export type BookingStatus =
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "pending_payment"
  | "failed_slot_unavailable";

interface StatusTimelineEntry {
  status: string;
  updatedBy?: { id: string; name?: string } | "system" | null;
  timestamp: string;
}

interface PaymentInfo {
  advanceAmount: number;
  status: "pending" | "paid" | "failed" | "refund_due" | "refunded";
  paidAt?: string | null;
   refundedAt?: string;
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}


const STATUS_META: Record<BookingStatus, { label: string; classes: string }> = {
  assigned: {
    label: "Assigned",
    classes: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  "in-progress": {
    label: "In Progress",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  completed: {
    label: "Completed",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-500/10 text-red-400 border-red-500/30",
  },
  pending_payment: {
    label: "Pending Payment",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  failed_slot_unavailable: {
    label: "Slot Unavailable",
    classes: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

const COMPLETED_OR_LATER: BookingStatus[] = ["completed", "cancelled"];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0a0f1e] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

// ---------------------------------------------------------------------------
// Shared card shell
// ---------------------------------------------------------------------------

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-[Syne] text-lg font-semibold text-white mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    classes: "bg-white/5 text-white/70 border-white/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium font-[DM_Sans] ${meta.classes}`}
    >
      {meta.label}
    </span>
  );
}



function StatusTimelineSection({ entries }: { entries: StatusTimelineEntry[] }) {
  if (!entries || entries.length === 0) {
    return <p className="font-[DM_Sans] text-sm text-white/40">No status history yet.</p>;
  }

  const lastIndex = entries.length - 1;

  return (
    <ol className="relative ml-2 space-y-6 border-l border-white/10 pl-6">
      {entries.map((entry, idx) => {
        const isLatest = idx === lastIndex;
        const who =
          entry.updatedBy === "system" || entry.updatedBy == null
            ? "System"
            : entry.updatedBy.name ?? entry.updatedBy.id;
        const label = STATUS_META[entry.status as BookingStatus]?.label ?? entry.status;

        return (
          <li key={`${entry.status}-${entry.timestamp}-${idx}`} className="relative">
            <span
              className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ${
                isLatest
                  ? "bg-gradient-to-br from-blue-500 to-cyan-400 ring-4 ring-cyan-400/20"
                  : "bg-cyan-500/80"
              }`}
            >
              {isLatest ? (
                <CheckCircle2 className="h-4 w-4 text-white" />
              ) : (
                <Circle className="h-2 w-2 fill-white text-white" />
              )}
            </span>
            <p className={`font-[DM_Sans] text-sm font-medium ${isLatest ? "text-cyan-300" : "text-white/80"}`}>
              {label}
            </p>
            <p className="font-[DM_Sans] text-xs text-white/40">
              {who} · {formatDateTime(entry.timestamp)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

type JobDetail = NonNullable<ServiceCenterBookingDetail["job"]>;

function JobCardSummary({ job }: { job?: JobDetail | null }) {
  if (!job || job.description.length === 0) {
    return <p className="font-[DM_Sans] text-sm text-white/40">No diagnosis added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <p className="mb-2 text-sm text-white/60">{job.reportedIssue}</p>
      <table className="w-full min-w-[480px] font-[DM_Sans] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-white/40">
            <th className="py-2 pr-3 font-normal">#</th>
            <th className="py-2 pr-3 font-normal">Issue / Part</th>
            <th className="py-2 pr-3 font-normal">Qty</th>
            <th className="py-2 pr-3 font-normal">Est. Time</th>
            <th className="py-2 pr-3 font-normal">Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {job.description.map((item, idx) => (
            <tr key={item.jobItemsId} className="border-b border-white/5 text-white/80">
              <td className="py-2 pr-3 text-white/40">{idx + 1}</td>
              <td className="py-2 pr-3">
                {item.issueFound} — {item.spareParts}
              </td>
              <td className="py-2 pr-3">{item.sparePartQty}</td>
              <td className="py-2 pr-3">{item.estimatedTime}</td>
              <td className="py-2 pr-3">{formatCurrency(item.initalCost * item.sparePartQty)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-white">
            <td className="py-2 pr-3" colSpan={3} />
            <td className="py-2 pr-3 font-medium">{job.estimatedTime}</td>
            <td className="py-2 pr-3 font-semibold text-cyan-400">{formatCurrency(job.estimatedCost)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentInfo["status"] }) {
  const map = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    failed: "bg-red-500/10 text-red-400 border-red-500/30",
    refund_due: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    refunded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  } as const;
  const labelMap = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    refund_due: "Refund Due",
    refunded: "Refunded",
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium font-[DM_Sans] ${map[status]}`}>
      {labelMap[status]}
    </span>
  );
}



export default function ServiceCenterBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const queryclient = useQueryClient()
  const [isMarkingRefunded, SetIsMarkingRefund] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  async function handleMarkRefunded(){
    SetIsMarkingRefund(true)
    try {
      await markBookingRefunded(bookingId!)
      queryclient.invalidateQueries({queryKey:["service-center-booking-detail",bookingId]})
      setIsConfirmOpen(false)
    } catch (err) {
      console.error("Failed to mark as refund",err);
    }finally{
      SetIsMarkingRefund(false)
    }

  }

  const { data: booking, isLoading, isError } = useServiceCenterBookingDetail(bookingId!);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
          <p className="font-[DM_Sans] text-sm text-white/40">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-[Syne] text-lg text-white/70">Booking not found</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 font-[DM_Sans] text-sm text-white/70 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    );
  }

  const showPickupSection = booking.visitType === "pickup-drop" && !!booking.pickupLocation;
  const showProofSection = COMPLETED_OR_LATER.includes(booking.status);

return (
    <div className="pb-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pt-6 sm:px-6">
        {/* Back + status row — replaces the old page-owned sticky header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <StatusPill status={booking.status} />
        </div>

        {/* Vehicle & customer summary */}
        <Card title="Vehicle & Customer" icon={<Car className="h-5 w-5 text-cyan-400" />}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#060a14]">
              {booking.vehiclePhotoUrl ? (
                <img
                  src={booking.vehiclePhotoUrl}
                  alt={booking.vehicleRegistrationNumber}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Car className="h-8 w-8 text-white/20" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <p className="font-[Syne] text-lg font-bold text-white">{booking.vehicleRegistrationNumber}</p>
                <p className="font-[DM_Sans] text-sm text-white/50">
                  {booking.vehicleType} · {booking.vehicleBrand} {booking.vehicleModel}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[DM_Sans] text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-white/40" />
                  {booking.customerName}
                </span>
                <a href={`tel:${booking.customerPhone}`} className="flex items-center gap-1.5 text-cyan-400 hover:underline">
                  <Phone className="h-3.5 w-3.5" />
                  {booking.customerPhone}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[DM_Sans] text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-white/40" />
                  {booking.categoryName}
                </span>
                <span>
                  {formatDate(booking.schedule.date)} · {booking.schedule.slotStartingTime}
                </span>
              </div>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 px-3 py-1 font-[DM_Sans] text-xs font-medium text-cyan-300">
                {booking.visitType === "pickup-drop" ? "Pickup & Drop" : "Drive-in"}
              </span>
            </div>
          </div>
        </Card>

        {/* Pickup location — pickup-drop only */}
        {showPickupSection && booking.pickupLocation && (
          <Card title="Pickup Location" icon={<MapPin className="h-5 w-5 text-cyan-400" />}>
            <p className="font-[DM_Sans] text-sm text-white/70">{booking.pickupLocation.formatedAddress}</p>
            <PickUpMapView lat={booking.pickupLocation.coordinates[1]} lng={booking.pickupLocation.coordinates[0]} />
          </Card>
        )}

        {/* Reported issue */}
        <Card title="Reported Issue" icon={<ClipboardList className="h-5 w-5 text-cyan-400" />}>
          {booking.additionalInfo ? (
            <blockquote className="border-l-2 border-cyan-500/40 pl-4 font-[DM_Sans] text-sm italic text-white/60">
              "{booking.additionalInfo}"
            </blockquote>
          ) : (
            <p className="font-[DM_Sans] text-sm text-white/40">No additional details provided by customer</p>
          )}
        </Card>

        {/* Assigned mechanic */}
        <Card title="Assigned Mechanic" icon={<User className="h-5 w-5 text-cyan-400" />}>
          {booking.mechanicName ? (
            <p className="font-[DM_Sans] text-sm text-white/80">{booking.mechanicName}</p>
          ) : (
            <p className="font-[DM_Sans] text-sm text-white/40">Not yet assigned</p>
          )}
        </Card>

        <Card title="Status Timeline">
          <StatusTimelineSection
            entries={booking.statusTimeline.map((e) => ({
              status: e.status,
              updatedBy: e.updatedBy === "system" ? ("system" as const) : { id: e.updatedBy, name: e.updatedBy },
              timestamp: e.at,
            }))}
          />
        </Card>

        <Card title="Job Card Summary" icon={<Wrench className="h-5 w-5 text-cyan-400" />}>
          <JobCardSummary job={booking.job} />
        </Card>

        {showProofSection && (
          <Card title="Completion Proof">
            {booking.proof ? (
              <div>
                <img
                  src={booking.proof.imageUrl}
                  alt="Completion proof"
                  className="w-full max-w-md rounded-xl border border-white/10 object-cover"
                />
                <p className="mt-2 font-[DM_Sans] text-xs text-white/40">
                  Uploaded {formatDateTime(booking.proof.uploadedAt)}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-[DM_Sans] text-sm text-white/40">
                <ImageOff className="h-4 w-4" />
                No completion proof uploaded yet
              </div>
            )}
          </Card>
        )}

        {/* Payment */}
        <Card title="Payment" icon={<CreditCard className="h-5 w-5 text-cyan-400" />}>
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="font-[Syne] text-lg font-semibold text-white">
        {formatCurrency(booking.advancePayment.amount)}
      </p>
      <p className="font-[DM_Sans] text-xs text-white/40">Advance payment</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <PaymentStatusBadge status={booking.advancePayment.status} />
      {booking.advancePayment.paidAt && (
        <span className="font-[DM_Sans] text-xs text-white/40">
          Paid {formatDateTime(booking.advancePayment.paidAt)}
        </span>
      )}
      {booking.advancePayment.status === "refunded" && booking.advancePayment.refundedAt && (
        <span className="font-[DM_Sans] text-xs text-emerald-400">
          Refunded {formatDateTime(booking.advancePayment.refundedAt)}
        </span>
      )}
    </div>
  </div>

  {booking.advancePayment.status === "refund_due" && (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
      <p className="font-[DM_Sans] text-sm text-amber-300">
        Refund owed — ₹{booking.advancePayment.amount}
      </p>
      <button
        onClick={()=> setIsConfirmOpen(true)}
        disabled={isMarkingRefunded}
        className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1.5 font-[DM_Sans] text-xs font-semibold text-white disabled:opacity-50"
      >
        {isMarkingRefunded ? "Processing…" : "Process Refund"}
      </button>
    </div>
  )}
</Card>
<ConfirmDialog
  open={isConfirmOpen}
  title="Confirm refund"
  description="Confirm you have already processed this refund via the Razorpay dashboard. This action cannot be undone."
  confirmLabel="Mark as Refunded"
  isLoading={isMarkingRefunded}
  onConfirm={handleMarkRefunded}
  onCancel={() => setIsConfirmOpen(false)}
/>
      </div>
    </div>
  );
}