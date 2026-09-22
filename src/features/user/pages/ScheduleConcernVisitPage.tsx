import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useConcernDetail } from "../../ServiceCenter/hooks/useConcerns";
import { useSlots } from "../queries/useSlots";
import { scheduleConcernVisit } from "../service/AuthService"
import type { TimeSlot } from "../interface/bookingInterface";
import { useUserConcernDetails } from "../queries/useConcern";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

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

function DateTimeSelector({
  selectedDate,
  onSelectDate,
  slots,
  isLoadingSlots,
  selectedSlotId,
  onSelectSlot,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  slots: TimeSlot[];
  isLoadingSlots: boolean;
  selectedSlotId: string | null;
  onSelectSlot: (id: string) => void;
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-4 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
            className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
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

        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_LABELS.map((d, i) => (
            <span key={i} className="text-[11px] font-medium text-slate-500">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, idx) => {
            if (!date) return <div key={idx} />;
            const disabled = date < today;
            const selected = isSameDay(date, selectedDate);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(date)}
                className={`aspect-square rounded-lg text-xs font-medium transition-colors ${
                  disabled ? "cursor-not-allowed text-slate-700" : selected ? "text-white" : "text-slate-300 hover:bg-white/5"
                }`}
                style={selected ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" } : undefined}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-4 lg:col-span-3">
        <p className="mb-3 text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
            : "Select a date"}
        </p>

        {!selectedDate ? (
          <EmptyState message="Pick a date on the calendar to view time slots." />
        ) : isLoadingSlots ? (
          <LoadingState message="Loading available slots…" />
        ) : slots.length === 0 ? (
          <EmptyState message="No slots available for this date." />
        ) : (
          <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
            {slots.map((slot) => {
              const isDisabled = slot.status !== "available";
              const isSelected = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectSlot(slot.id)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
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
    </div>
  );
}

export default function ScheduleConcernVisitPage() {
  const { concernId } = useParams<{ concernId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: concern, isLoading: isLoadingConcern } = useUserConcernDetails(concernId!);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoadingConcern) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Loading…</div>;
  }
  if (!concern) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Concern not found.</div>;
  }
  if (concern.status !== "approved") {
    return (
      <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-white/70 text-lg font-medium">
          This concern isn't approved for scheduling yet.
        </p>
        <button onClick={() => navigate(-1)} className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:bg-white/5">
          Go Back
        </button>
      </div>
    );
  }

  // Note: concern.serviceCenterId isn't currently on ConcernDetail — needs adding
  // to the DTO/mapper if not already present, since useSlots requires it.
  const slotFilter =
    selectedDate ? { serviceCenterId: (concern as any).serviceCenterId, date: toDateKey(selectedDate) } : null;

  const { data: slots, isLoading: isLoadingSlots } = useSlots(slotFilter);

  const selectedSlot = slots?.find((s: TimeSlot) => s.id === selectedSlotId);
  const canConfirm = !!selectedDate && !!selectedSlot;

  async function handleConfirm() {
    if (!canConfirm || !selectedSlot || !selectedDate || !concernId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await scheduleConcernVisit(concernId, toDateKey(selectedDate), selectedSlot.startTime, selectedSlot.endTime);
      queryClient.invalidateQueries({ queryKey: ["user-concern-detail", concernId] });
       navigate(`/concerns/${concernId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not schedule visit. Please try another slot.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full pb-32" style={{ background: "#060a14" }}>
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <h1 className="text-2xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          Schedule Your Visit
        </h1>
        <p className="mt-1 text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Your concern "{concern.issueTitle}" was approved — pick a time for the garage to take another look.
        </p>

        <div className="mt-8">
          <DateTimeSelector
            selectedDate={selectedDate}
            onSelectDate={(d) => { setSelectedDate(d); setSelectedSlotId(null); }}
            slots={slots ?? []}
            isLoadingSlots={isLoadingSlots}
            selectedSlotId={selectedSlotId}
            onSelectSlot={setSelectedSlotId}
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-[#060a14]/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <button
            type="button"
            disabled={!canConfirm || isSubmitting}
            onClick={handleConfirm}
            className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
          >
            {isSubmitting ? "Scheduling…" : "Confirm Visit"}
          </button>
        </div>
      </div>
    </div>
  );
}
