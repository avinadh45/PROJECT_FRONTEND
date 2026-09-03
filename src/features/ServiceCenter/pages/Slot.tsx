// src/pages/SlotManagementPage.tsx
import { useState, useEffect, useMemo } from "react";
import type { AvailabilityFormData } from "../interface/serviceCenter";
import { GetMyProfile } from "../services/ServiceCenterService";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
import { useSlotManagement } from "../hooks/useSlotManagement";


interface Slot {
  time: string;
  maxBooking: number;
  bookedCount: number;
  status: "available" | "full" | "blocked";
}


function to12Hour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WORKING_DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOT_DURATION_OPTIONS = [
  { label: "30 Min", value: 30 },
  { label: "1 Hour", value: 60 },
  { label: "2 Hours", value: 120 },
];

function buildCalendarGrid(monthCursor: Date): (Date | null)[] {
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

function areAvailabilityFormsEqual(a: AvailabilityFormData, b: AvailabilityFormData): boolean {
  return (
    a.slotDuration === b.slotDuration &&
    a.maxBookingsPerSlot === b.maxBookingsPerSlot &&
    a.workingHours.start === b.workingHours.start &&
    a.workingHours.end === b.workingHours.end &&
    a.workingDays.length === b.workingDays.length &&
    a.workingDays.every((d) => b.workingDays.includes(d))
  );
}

// ─────────────────────────────────────────────────────────────
// Status badge
// ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Slot["status"] }) {
  const styles: Record<Slot["status"], string> = {
    available: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
    full: "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/30",
    blocked: "bg-slate-500/10 text-slate-400 ring-1 ring-inset ring-slate-500/30",
  };
  const labels: Record<Slot["status"], string> = {
    available: "Available",
    full: "Fully Booked",
    blocked: "Blocked",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {labels[status]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// ConfigCard — editable availability settings
// ─────────────────────────────────────────────────────────────

function ConfigCard({
  availability,
  onSave,
}: {
  availability: AvailabilityFormData;
  onSave: (data: AvailabilityFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<AvailabilityFormData>(availability);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setForm(availability);
  }, [availability]);

  const hasChanges = !areAvailabilityFormsEqual(form, availability);

  const toggleDay = (day: string) => {
    setForm((prev) => {
      const isSelected = prev.workingDays.includes(day);
      const nextDays = isSelected ? prev.workingDays.filter((d) => d !== day) : [...prev.workingDays, day];
      return { ...prev, workingDays: nextDays };
    });
  };

  const validate = (data: AvailabilityFormData): string[] => {
    const errs: string[] = [];
    if (data.workingDays.length === 0) errs.push("Select at least one working day.");
    if (data.workingHours.start >= data.workingHours.end) errs.push('"From" time must be before "To" time.');
    if (data.maxBookingsPerSlot < 1) errs.push("Capacity must be at least 1 vehicle.");
    return errs;
  };

  const handleSave = async () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const adjustCapacity = (delta: number) => {
    setForm((prev) => ({ ...prev, maxBookingsPerSlot: Math.min(20, Math.max(1, prev.maxBookingsPerSlot + delta)) }));
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] p-6" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          Basic Configuration
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <span className="block text-[11px] uppercase tracking-wide text-slate-500 mb-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Working Days
          </span>
          <div className="flex flex-wrap gap-2">
            {WORKING_DAYS_ORDER.map((day) => {
              const selected = form.workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="h-9 w-9 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: selected ? "linear-gradient(135deg, #3b82f6, #06b6d4)" : "transparent",
                    color: selected ? "#fff" : "rgba(255,255,255,0.45)",
                    border: selected ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {day.slice(0, 1)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="block text-[11px] uppercase tracking-wide text-slate-500 mb-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Working Hours
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                From
              </label>
              <input
                type="time"
                value={form.workingHours.start}
                onChange={(e) => setForm((prev) => ({ ...prev, workingHours: { ...prev.workingHours, start: e.target.value } }))}
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                To
              </label>
              <input
                type="time"
                value={form.workingHours.end}
                onChange={(e) => setForm((prev) => ({ ...prev, workingHours: { ...prev.workingHours, end: e.target.value } }))}
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
              />
            </div>
          </div>
        </div>

        <div>
          <span className="block text-[11px] uppercase tracking-wide text-slate-500 mb-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Slot Duration
          </span>
          <div className="flex flex-wrap gap-2">
            {SLOT_DURATION_OPTIONS.map((opt) => {
              const selected = form.slotDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, slotDuration: opt.value }))}
                  className="rounded-lg px-3.5 py-2 text-xs font-semibold transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: selected ? "linear-gradient(135deg, #3b82f6, #06b6d4)" : "transparent",
                    color: selected ? "#fff" : "rgba(255,255,255,0.45)",
                    border: selected ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="block text-[11px] uppercase tracking-wide text-slate-500 mb-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Parallel Vehicle Capacity
          </span>
          <div className="flex items-center justify-between rounded-lg px-3 py-1.5 w-fit" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button type="button" onClick={() => adjustCapacity(-1)} disabled={form.maxBookingsPerSlot <= 1} className="h-7 w-7 flex items-center justify-center rounded-md text-slate-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              −
            </button>
            <span className="px-4 text-sm font-medium text-slate-100 min-w-[92px] text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {form.maxBookingsPerSlot} Vehicle{form.maxBookingsPerSlot > 1 ? "s" : ""}
            </span>
            <button type="button" onClick={() => adjustCapacity(1)} disabled={form.maxBookingsPerSlot >= 20} className="h-7 w-7 flex items-center justify-center rounded-md text-slate-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              +
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="rounded-lg px-3.5 py-2.5 space-y-1" style={{ backgroundColor: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
            {errors.map((err) => (
              <p key={err} className="text-xs text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {err}
              </p>
            ))}
          </div>
        )}

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
          >
            {saving && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}



function CalendarCard({
  monthCursor,
  setMonthCursor,
  selectedDate,
  onSelectDate,
}: {
  monthCursor: Date;
  setMonthCursor: (d: Date) => void;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
}) {
  const cells = useMemo(() => buildCalendarGrid(monthCursor), [monthCursor]);
  const today = new Date();

  const goPrevMonth = () => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1));
  const goNextMonth = () => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1));

  return (
    <div className="rounded-2xl border border-white/[0.06] p-6" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          {MONTH_LABELS[monthCursor.getMonth()]} {monthCursor.getFullYear()}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={goPrevMonth} aria-label="Previous month" className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            ‹
          </button>
          <button onClick={goNextMonth} aria-label="Next month" className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={`${w}-${i}`} className="text-center text-[11px] font-medium text-slate-500 py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={idx} className="aspect-square" />;
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors relative ${isSelected ? "text-white font-semibold" : "text-slate-300 hover:bg-white/[0.06]"}`}
              style={{ fontFamily: "'DM Sans', sans-serif", background: isSelected ? "linear-gradient(135deg, #3b82f6, #06b6d4)" : "transparent" }}
            >
              {date.getDate()}
              {isToday && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full" style={{ backgroundColor: "#06b6d4" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}


function SlotBreakdownTable({
  selectedDate,
  loading,
  slots,
  onBlockSlot,
  onUnblockSlot,
}: {
  selectedDate: Date | null;
  loading: boolean;
  slots: Slot[] | null;
  onBlockSlot: (time: string) => void;
  onUnblockSlot: (time: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] p-6" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Daily Slot Breakdown
          </h2>
          {selectedDate && (
            <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Available — open slot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Full — at capacity
          </span>
        </div>
      </div>

      {!selectedDate && (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Select a date on the calendar to view its slot breakdown.
          </p>
        </div>
      )}

      {selectedDate && loading && (
        <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-white/10 animate-spin" style={{ borderTopColor: "#06b6d4" }} />
          <p className="text-sm text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Loading slots…
          </p>
        </div>
      )}

      {selectedDate && !loading && slots && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/[0.06]">
                <th className="py-3 pr-4 font-medium">Time Slot</th>
                <th className="py-3 pr-4 font-medium">Booked</th>
                <th className="py-3 pr-4 font-medium">Capacity</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No slots generated for this date.
                  </td>
                </tr>
              )}

              {slots.map((slot) => (
                <tr key={slot.time} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4 text-slate-100 font-medium">
                    {to12Hour(slot.time)} – {to12Hour(addMinutes(slot.time, 60))}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300">{slot.bookedCount}</td>
                  <td className="py-3.5 pr-4 text-slate-300">{slot.maxBooking}</td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={slot.status} />
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    {slot.status === "blocked" ? (
                      <button onClick={() => onUnblockSlot(slot.time)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30 hover:bg-emerald-500/10 transition-colors">
                        Unblock
                      </button>
                    ) : (
                      <button onClick={() => onBlockSlot(slot.time)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/[0.06] transition-colors">
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



export default function SlotManagementPage() {
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [monthCursor, setMonthCursor] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { updateAvailability } = useServiceCenterAuth();

  useEffect(() => {
    GetMyProfile()
      .then((data) => setServiceCenter(data))
      .catch(() => setServiceCenter(null))
      .finally(() => setProfileLoading(false));
  }, []);

  const serviceCenterId = serviceCenter?._id ?? "";
  const availability: AvailabilityFormData = {
    workingDays: serviceCenter?.availability?.workingDays ?? [],
    workingHours: serviceCenter?.availability?.workingHours ?? { start: "09:00", end: "18:00" },
    slotDuration: serviceCenter?.availability?.slotDuration ?? 60,
    maxBookingsPerSlot: serviceCenter?.availability?.maxBookingsPerSlot ?? 1,
  };

  const handleSaveAvailability = async (data: AvailabilityFormData) => {
    try {
      await updateAvailability(data);
      const refreshed = await GetMyProfile();
      setServiceCenter(refreshed);
    } catch {
     
    }
  };

  const { slots, loading, fetchSlot, block, unBlockSlot } = useSlotManagement(serviceCenterId);

  useEffect(() => {
    if (!selectedDate || !serviceCenterId) return;
    fetchSlot(toDateKey(selectedDate));
  }, [selectedDate, fetchSlot, serviceCenterId]);

  const handleSelectDate = (date: Date) => setSelectedDate(date);

  const handleBlockSlot = async (time: string) => {
    if (!selectedDate) return;
    try {
      await block(toDateKey(selectedDate), time);
    } catch (error) {
     
    }
  };

  const handleUnblockSlot = async (time: string) => {
    if (!selectedDate) return;
    try {
      await unBlockSlot(toDateKey(selectedDate), time);
    } catch (error) {
     
    }
  };

  if (profileLoading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!serviceCenter) {
    return <div className="text-white p-6">Please log in to manage slots.</div>;
  }

  return (
    <div className="min-h-screen w-full px-6 py-8" style={{ backgroundColor: "#060a14" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            Slot Management
          </h1>
          <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            View and manage daily slot availability for your service center.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ConfigCard availability={availability} onSave={handleSaveAvailability} />
          <CalendarCard monthCursor={monthCursor} setMonthCursor={setMonthCursor} selectedDate={selectedDate} onSelectDate={handleSelectDate} />
        </div>

        <SlotBreakdownTable
          selectedDate={selectedDate}
          loading={loading}
          slots={slots}
          onBlockSlot={handleBlockSlot}
          onUnblockSlot={handleUnblockSlot}
        />
      </div>
    </div>
  );
}