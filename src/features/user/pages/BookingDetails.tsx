import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Check,
  Clock,
  MapPin,
  Phone,
  Mail,
  Car,
  Calendar,
  ArrowLeft,
  XCircle,
  ImageOff,
  Wrench,
  StickyNote,
  AlertTriangle,
  X,
} from "lucide-react";
// Reuse the existing shared header — do not rebuild it.
import { Navbar } from "../components/Navbar";
import { useUserBookingDetails } from "../hooks/useMyBookings";
import type { UserBookingDetail } from "../interface/bookingInterface";
import PickUpMapView from "../../../shared/components/PickUpMapView";
import { useAuth } from "../hooks/useAuth";
import { cancelBooking } from "../service/AuthService";
import { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
/* ------------------------------------------------------------------ */
/*  NOTE: this Navbar renders fixed at the top (it sits over the page  */
/*  rather than pushing it down), so every page that uses it needs a   */
/*  top offset on its content equal to the navbar's real height. If    */
/*  your Navbar is ~72px tall, `pt-24` below is a safe match with some */
/*  breathing room — adjust the value if your navbar is taller/shorter.*/
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/my-bookings" },
];

type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "failed_slot_unavailable";

type VisitType = "drive-in" | "pickup-drop";

/* ------------------------------------------------------------------ */
/*  Status → stepper mapping                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  { key: "confirmed", label: "Pick Up / Confirmed" },
  { key: "assigned", label: "Job Card Created" },
  { key: "in-progress", label: "Repair in Progress" },
  { key: "completed", label: "Completed" },
] as const;

const TERMINAL_STATUSES: BookingStatus[] = ["cancelled", "failed_slot_unavailable"];

function stepIndexForStatus(status: BookingStatus): number {
  switch (status) {
    case "pending_payment":
      return -1;
    case "confirmed":
      return 0;
    case "assigned":
      return 1;
    case "in-progress":
      return 2;
    case "completed":
      return 3;
    default:
      return -1;
  }
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                             */
/* ------------------------------------------------------------------ */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
      {children}
    </h2>
  );
}

function VisitTypeBadge({ visitType }: { visitType: VisitType }) {
  const label = visitType === "drive-in" ? "Drive-in" : "Pickup & Drop";
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {label}
    </span>
  );
}

// Consistent icon-tile row used across Garage/Slot cards
function InfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-white/70">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
        <Icon className="h-4 w-4" />
      </div>
      <span className="pt-1.5 leading-snug">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirm Modal (replaces window.confirm)                           */
/* ------------------------------------------------------------------ */

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  isLoading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 shadow-2xl">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-white/40 hover:text-white/70 disabled:opacity-30"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-sm text-white/50">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            Never mind
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Cancelling…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Progress Stepper                                           */
/* ------------------------------------------------------------------ */

function StatusStepper({ status }: { status: BookingStatus }) {
  if (TERMINAL_STATUSES.includes(status)) {
    return (
      <Card className="flex items-center gap-3 border-red-500/20 bg-red-500/5">
        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
        <p className="text-sm font-medium text-red-300">
          {status === "cancelled"
            ? "This booking was cancelled."
            : "This booking failed — the selected slot became unavailable."}
        </p>
      </Card>
    );
  }

  const activeIndex = stepIndexForStatus(status);

  return (
    <Card>
      <div className="flex items-start">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isFuture = index > activeIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.key} className={`flex flex-1 items-center ${isLast ? "flex-none" : ""}`}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted
                      ? "border-cyan-400 bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                      : isActive
                      ? "border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                      : "border-white/15 bg-transparent text-white/30",
                  ].join(" ")}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={[
                    "max-w-[90px] text-center text-[11px] leading-tight",
                    isFuture ? "text-white/30" : isActive ? "text-white" : "text-white/60",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={[
                    "mx-2 mt-[-20px] h-0.5 flex-1 rounded",
                    isCompleted ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-white/10",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Summary                                                   */
/* ------------------------------------------------------------------ */

function ServiceSummaryCard({ booking }: { booking: UserBookingDetail }) {
  return (
    <Card className="hover:border-white/15">
      <SectionTitle>Service Summary</SectionTitle>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {booking.vehiclePhotoUrl ? (
            <img src={booking.vehiclePhotoUrl} alt={booking.vehicleModel} className="h-full w-full object-cover" />
          ) : (
            <Car className="h-8 w-8 text-white/30" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-base font-semibold text-white">
            {booking.vehicleBrand} {booking.vehicleModel}
          </p>
          <p className="text-sm text-white/50">
            {booking.vehicleRegistrationNumber || "Registration number not available"}
          </p>
          <p className="text-sm text-white/50">{booking.categoryName}</p>
        </div>
        <VisitTypeBadge visitType={booking.visitType} />
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Garage Information                                                */
/* ------------------------------------------------------------------ */

function GarageInformationCard({ booking }: { booking: UserBookingDetail }) {
  const { pickupLocation, visitType, garageAddress } = booking;

  return (
    <Card className="flex flex-col">
      <SectionTitle>Garage Information</SectionTitle>
      <p className="mb-4 text-base font-semibold text-white">{booking.garageName}</p>

      <div className="space-y-3">
        {visitType === "drive-in" && garageAddress && (
          <InfoRow icon={MapPin}>{garageAddress}</InfoRow>
        )}

        {visitType === "pickup-drop" && pickupLocation?.formatedAddress && (
          <InfoRow icon={MapPin}>{pickupLocation.formatedAddress}</InfoRow>
        )}

        <InfoRow icon={Phone}>{booking.garagePhone || "Phone not available"}</InfoRow>
        <InfoRow icon={Mail}>{booking.garageEmail || "Email not available"}</InfoRow>
      </div>

      {visitType === "pickup-drop" && pickupLocation && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <PickUpMapView lat={pickupLocation.coordinates[1]} lng={pickupLocation.coordinates[0]} />
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Booking Info (slot + mechanic + notes — replaces the sparse       */
/*  SlotCard so the right column doesn't sit mostly empty next to     */
/*  the taller Garage card once the map is shown)                     */
/* ------------------------------------------------------------------ */

function BookingInfoCard({ booking }: { booking: UserBookingDetail }) {
  return (
    <Card className="flex flex-col">
      <SectionTitle>Booking Info</SectionTitle>

      <div className="space-y-3">
        <InfoRow icon={Calendar}>{booking.schedule?.date || "Date not available"}</InfoRow>
        <InfoRow icon={Clock}>
          {booking.schedule
            ? `${booking.schedule.slotStartingTime} - ${booking.schedule.slotEndingTime}`
            : "Time not available"}
        </InfoRow>
        <InfoRow icon={Wrench}>
          {booking.mechanicName ? (
            <>
              Mechanic assigned: <span className="text-white">{booking.mechanicName}</span>
            </>
          ) : (
            "Mechanic not assigned yet"
          )}
        </InfoRow>
      </div>

      {booking.additionalInfo && (
        <div className="mt-5 border-t border-white/5 pt-4">
          <div className="flex items-start gap-3 text-sm text-white/60">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
              <StickyNote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Notes at booking</p>
              <p className="pt-1 leading-snug text-white/70">{booking.additionalInfo}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Job Card / Service Items                                          */
/* ------------------------------------------------------------------ */

function JobCardSection({ job }: { job: UserBookingDetail["job"] }) {
  const hasItems = !!job && job.description.length > 0;

  return (
    <Card>
      <SectionTitle>Job Card</SectionTitle>

      {!hasItems ? (
        <p className="text-sm text-white/50">
          Diagnosis not started yet — details will appear here once the garage begins inspection.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            <span className="font-medium text-white">Reported Issue: </span>
            {job.reportedIssue}
          </p>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-white/50">
                  <th className="p-3 font-medium">Issue Found</th>
                  <th className="p-3 font-medium">Spare Part</th>
                  <th className="p-3 font-medium">Qty</th>
                  <th className="p-3 font-medium">Est. Time</th>
                  <th className="p-3 text-right font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {job.description.map((item) => (
                  <tr key={item.jobItemsId} className="border-b border-white/5 text-white/80 last:border-0">
                    <td className="p-3">{item.issueFound}</td>
                    <td className="p-3 text-white/60">{item.spareParts}</td>
                    <td className="p-3 text-white/60">{item.sparePartQty}</td>
                    <td className="p-3 text-white/60">{item.estimatedTime}</td>
                    <td className="p-3 text-right">
                      ₹{(item.initalCost * item.sparePartQty).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white/[0.02]">
                  <td className="p-3 font-semibold text-white" colSpan={4}>
                    Subtotal Estimated
                  </td>
                  <td className="p-3 text-right font-semibold text-white">
                    ₹{job.estimatedCost.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Completion Proof                                                  */
/* ------------------------------------------------------------------ */

function CompletionProofSection({ proof }: { proof: UserBookingDetail["proof"] }) {
  return (
    <Card>
      <SectionTitle>Completion Proof</SectionTitle>
      {proof ? (
        <div className="space-y-2">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <img src={proof.imageUrl} alt="Completion proof" className="max-h-96 w-full object-cover" />
          </div>
          <p className="text-xs text-white/50">Uploaded {proof.uploadedAt}</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-white/50">
          <ImageOff className="h-4 w-4" />
          No completion photo uploaded.
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge (used in the sidebar summary)                        */
/* ------------------------------------------------------------------ */

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  pending_payment: { label: "Payment Pending", className: "bg-orange-500/15 text-orange-400" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/15 text-blue-400" },
  assigned: { label: "Job Card Created", className: "bg-blue-500/15 text-blue-400" },
  "in-progress": { label: "In Progress", className: "bg-cyan-500/15 text-cyan-400" },
  completed: { label: "Completed", className: "bg-emerald-500/15 text-emerald-400" },
  cancelled: { label: "Cancelled", className: "bg-red-500/15 text-red-400" },
  failed_slot_unavailable: { label: "Slot Unavailable", className: "bg-red-500/15 text-red-400" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const s = STATUS_BADGE[status];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar — booking summary + actions, sticky alongside the         */
/*  scrolling content. This is what actually fills the right-hand     */
/*  space instead of leaving it blank next to a narrow center column. */
/* ------------------------------------------------------------------ */

function SummarySidebar({
  booking,
  onReschedule,
  onCancel,
  onBookAgain,
}: {
  booking: UserBookingDetail;
  onReschedule: () => void;
  onCancel: () => void;
  onBookAgain: () => void;
}) {
  const { status } = booking;

  return (
    <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
      <Card>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/40">
            #{booking.id.slice(-8).toUpperCase()}
          </span>
          <StatusBadge status={status} />
        </div>

        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="text-base font-semibold text-white">
            {booking.vehicleBrand} {booking.vehicleModel}
          </p>
          <p className="text-sm text-white/50">{booking.vehicleRegistrationNumber}</p>
        </div>

        <div className="mt-4 space-y-2.5 border-t border-white/5 pt-4 text-sm text-white/70">
          <div className="flex justify-between">
            <span className="text-white/40">Garage</span>
            <span className="text-right">{booking.garageName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Service</span>
            <span className="text-right">{booking.categoryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Date</span>
            <span className="text-right">{booking.schedule?.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Time</span>
            <span className="text-right">{booking.schedule?.slotStartingTime}</span>
          </div>
          {booking.job?.estimatedCost != null && (
            <div className="flex justify-between border-t border-white/5 pt-2.5 font-medium text-white">
              <span className="font-normal text-white/40">Estimated Cost</span>
              <span>₹{booking.job.estimatedCost.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <SectionTitle>Actions</SectionTitle>
        <ActionButtons
          status={status}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onBookAgain={onBookAgain}
        />
      </Card>
    </div>
  );
}

function ActionButtons({
  status,
  onReschedule,
  onCancel,
  onBookAgain,
}: {
  status: BookingStatus;
  onReschedule: () => void;
  onCancel: () => void;
  onBookAgain: () => void;
}) {
  if (TERMINAL_STATUSES.includes(status)) {
    return (
      <p className="text-sm text-white/40">
        {status === "cancelled"
          ? "This booking was cancelled."
          : "This booking could not be completed — the slot became unavailable."}
      </p>
    );
  }

  if (status === "completed") {
    return (
      <button
        onClick={onBookAgain}
        className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Book Again
      </button>
    );
  }

  if (status === "in-progress") {
    return <p className="text-sm text-white/40">Your vehicle is currently being worked on.</p>;
  }

  // pending_payment | confirmed | assigned
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onReschedule}
        className="w-full rounded-xl border border-white/20 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
      >
        Reschedule Booking
      </button>
      <button
        onClick={onCancel}
        className="w-full rounded-xl border border-red-500/40 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
      >
        Cancel Booking
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { logoutuser } = useAuth();
  const queryclient = useQueryClient();
  const { data: booking, isLoading, isError } = useUserBookingDetails(bookingId as string);

  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleReschedule = () => {
    navigate(`/booking/${bookingId}/reschedule`);
  };

  const handleCancel = async () => {
    if (!bookingId) return;
    setIsCancelling(true);
    try {
     await cancelBooking(bookingId)
     queryclient.invalidateQueries({queryKey:["user-booking-detail",bookingId]})
      
    } catch(err) {
      console.error("Faild to cancel booking ",err);
      
    } finally {
      setIsCancelling(false);
      setCancelModalOpen(false);
    }
  };

  const handleBookAgain = () => {
    if (booking) navigate(`/book?vehicle=${booking.vehicleRegistrationNumber}`);
  };

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Navbar
        links={navLinks}
        userInitials="AK"
        userName="Arun Kumar"
        userEmail="arun@email.com"
        notifications={[]}
        onLogout={logoutuser}
      />

     
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
          </div>
        )}

        {!isLoading && (isError || !booking) && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg font-medium text-white/70">Booking not found</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        )}

        {!isLoading && booking && (
          <>
            {/* Page header */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Booking Details</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main content */}
              <div className="space-y-6 lg:col-span-2">
                <StatusStepper status={booking.status} />
                <ServiceSummaryCard booking={booking} />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <GarageInformationCard booking={booking} />
                  <BookingInfoCard booking={booking} />
                </div>
                <Card>
  <SectionTitle>Payment</SectionTitle>

  <div className="flex items-center justify-between">
    <div>
      <p className="text-lg font-semibold text-white">
        ₹{booking.advancePayment.amount}
      </p>

      <p className="text-xs text-white/40">
        Advance payment
      </p>
    </div>

    {booking.advancePayment.status === "refunded" && (
      <div className="text-right">
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
          Refunded
        </span>

        {booking.advancePayment.refundedAt && (
          <p className="mt-2 text-xs text-white/40">
            Refunded on{" "}
            {new Date(
              booking.advancePayment.refundedAt
            ).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    )}
  </div>
</Card>

                <JobCardSection job={booking.job} />

                {booking.status === "completed" && <CompletionProofSection proof={booking.proof} />}
              </div>

             
              <div className="lg:col-span-1">
                <SummarySidebar
                  booking={booking}
                  onReschedule={handleReschedule}
                  onCancel={() => setCancelModalOpen(true)}
                  onBookAgain={handleBookAgain}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        open={isCancelModalOpen}
        title="Cancel this booking?"
        description="This can't be undone. Your slot will be released and any advance payment will be handled as per the cancellation policy."
        confirmLabel="Yes, cancel booking"
        onConfirm={handleCancel}
        onClose={() => setCancelModalOpen(false)}
        isLoading={isCancelling}
      />
    </div>
  );
}