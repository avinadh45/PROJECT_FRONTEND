import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useUserBookingDetails } from "../hooks/useMyBookings";
import { useSlots } from "../queries/useSlots";
import { rescheduleBooking } from "../service/AuthService";
import type { TimeSlot } from "../interface/bookingInterface";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const RESCHEDULE_CUTOFF_HOURS = 5;

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(monthCursor: Date): (Date | null)[] {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatShortDate(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-10 text-center">
      <p className="text-sm text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {message}
      </p>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
      <p className="text-sm text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {message}
      </p>
    </div>
  );
}

function Calendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const cells = buildMonthGrid(visibleMonth);
  const monthLabel = visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-4">
      <div className="mx-auto max-w-xs">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
            className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
            className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 text-center">
          {WEEKDAY_LABELS.map((d, i) => (
            <span key={i} className="text-[10px] font-medium tracking-wide text-slate-500">
              {d[0]}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 justify-items-center gap-y-1.5">
          {cells.map((date, idx) => {
            if (!date) return <div key={idx} className="h-8 w-8" />;
            const disabled = date < today;
            const selected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(date)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-red-400/50"
                    : selected
                    ? "text-white"
                    : isToday
                    ? "border border-blue-400/60 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
                style={selected ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" } : undefined}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimeSlots({
  selectedDate,
  slots,
  isLoadingSlots,
  selectedSlotId,
  onSelectSlot,
}: {
  selectedDate: Date | null;
  slots: TimeSlot[];
  isLoadingSlots: boolean;
  selectedSlotId: string | null;
  onSelectSlot: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-5">
      <p className="mb-4 text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
        {selectedDate
          ? `Available Time Slots for ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
          : "Available Time Slots"}
      </p>

      {!selectedDate ? (
        <EmptyState message="Pick a date on the calendar to view time slots." />
      ) : isLoadingSlots ? (
        <LoadingState message="Loading available slots…" />
      ) : slots.length === 0 ? (
        <EmptyState message="No slots available for this date." />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {slots.map((slot) => {
            const isDisabled = slot.status !== "available";
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectSlot(slot.id)}
                className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                  isDisabled
                    ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600 line-through"
                    : isSelected
                    ? "border-transparent text-white"
                    : "border-white/10 text-slate-300 hover:border-white/25"
                }`}
                style={isSelected && !isDisabled ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" } : undefined}
                title={slot.status === "full" ? "Fully booked" : slot.status === "blocked" ? "Blocked by garage" : undefined}
              >
                {slot.startTime}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RescheduleBookingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading: isLoadingBooking } = useUserBookingDetails(bookingId!);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotFilter = booking && selectedDate ? { serviceCenterId: booking.serviceCenterId, date: toDateKey(selectedDate) } : null;

  const { data: slots, isLoading: isLoadingSlots } = useSlots(slotFilter);

  if (isLoadingBooking) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Loading…</div>;
  }
  if (!booking) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Booking not found.</div>;
  }

  const slotDateTime = new Date(`${booking.schedule.date}T${booking.schedule.slotStartingTime}:00`);
  const hoursUntilSlot = (slotDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  const withinCutoff = hoursUntilSlot <= RESCHEDULE_CUTOFF_HOURS;

  if (withinCutoff) {
    return (
      <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-white/70 text-lg font-medium">
          This booking can no longer be rescheduled — it's too close to the scheduled time.
        </p>
        <button onClick={() => navigate(-1)} className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:bg-white/5">
          Go Back
        </button>
      </div>
    );
  }

  const selectedSlot = slots?.find((s: TimeSlot) => s.id === selectedSlotId);
  const isSameAsCurrent =
    selectedDate && toDateKey(selectedDate) === booking.schedule.date && selectedSlotId === booking.schedule.slotStartingTime;

  const canConfirm = !!selectedDate && !!selectedSlot && !isSameAsCurrent;

  async function handleConfirm() {
    if (!canConfirm || !selectedSlot || !selectedDate) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await rescheduleBooking(bookingId!, {
        date: toDateKey(selectedDate),
        slotStartingTime: selectedSlot.startTime,
        slotEndingTime: selectedSlot.endTime,
      });
      queryClient.invalidateQueries({ queryKey: ["user-booking-detail", bookingId] });
      navigate(`/details/${booking?.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not reschedule. Please try another slot.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full pb-16" style={{ background: "#060a14" }}>
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <h1 className="text-2xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          Reschedule Your Booking
        </h1>
        <p className="mt-1 text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Select a new date and time for your service appointment.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: calendar + time slots */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <Calendar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedSlotId(null); }} />
            <TimeSlots
              selectedDate={selectedDate}
              slots={slots ?? []}
              isLoadingSlots={isLoadingSlots}
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          {/* Right: summary, actions, policy */}
          <div className="flex flex-col gap-6 lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-5">
              <p className="mb-3 text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Reschedule Summary
              </p>
              <div className="flex items-start gap-2.5 rounded-xl border border-blue-400/20 bg-blue-500/[0.08] p-3.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <p className="text-sm leading-relaxed text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Your booking will be moved from{" "}
                  <span className="text-white">
                    {formatShortDate(booking.schedule.date)}, {booking.schedule.slotStartingTime}–{booking.schedule.slotEndingTime}
                  </span>{" "}
                  to{" "}
                  {selectedDate && selectedSlot ? (
                    <span className="text-white">
                      {formatShortDate(toDateKey(selectedDate))}, {selectedSlot.startTime}–{selectedSlot.endTime}
                    </span>
                  ) : (
                    <span className="text-slate-500">a new date &amp; time.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={!canConfirm || isSubmitting}
                onClick={handleConfirm}
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                {isSubmitting ? "Rescheduling…" : "Confirm Reschedule"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/details/${booking.id}`)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 text-sm font-semibold text-white/80 hover:bg-white/5"
              >
                Back to Booking Details
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-5">
              <p className="mb-2 text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Rescheduling Policy
              </p>
              <p className="text-xs leading-relaxed text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Rescheduling is free up to {RESCHEDULE_CUTOFF_HOURS} hours before your original appointment. Changes
                within {RESCHEDULE_CUTOFF_HOURS} hours may not be permitted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}