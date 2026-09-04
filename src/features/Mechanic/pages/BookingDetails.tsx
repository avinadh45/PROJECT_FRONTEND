import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Quote,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Car,
} from "lucide-react";
import { useMechanicBookingDetails } from "../hooks/useMechanicBookingDetail";

/* ────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

type BookingStatus = "Assigned" | "In Progress" | "Completed";

interface DiagnosisItem {
  id: string;
  issueFound: string;
  sparePart?: string;
  quantity?: number;
  estimatedTime: string;
  estimatedCost: number;
}

/* ────────────────────────────────────────────────────────────────────────
 * Status config
 * ──────────────────────────────────────────────────────────────────────── */

const STATUS_ORDER: BookingStatus[] = ["Assigned", "In Progress", "Completed"];

const STATUS_STYLES: Record<BookingStatus, { text: string; bg: string; ring: string; dot: string }> = {
  Assigned: { text: "text-cyan-300", bg: "bg-cyan-400/10", ring: "ring-cyan-400/30", dot: "bg-cyan-400" },
  "In Progress": { text: "text-blue-300", bg: "bg-blue-400/10", ring: "ring-blue-400/30", dot: "bg-blue-400" },
  Completed: { text: "text-emerald-300", bg: "bg-emerald-400/10", ring: "ring-emerald-400/30", dot: "bg-emerald-400" },
};

/* ────────────────────────────────────────────────────────────────────────
 * Small building blocks
 * ──────────────────────────────────────────────────────────────────────── */

function SectionCard({
  title,
  subtitle,
  children,
  className = "",
  action,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0a0f1e] p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-syne text-base font-semibold text-white">{title}</h2>}
            {subtitle && <p className="mt-0.5 font-dm-sans text-xs text-white/50">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-dm-sans text-xs font-medium text-white/50">{label}</span>
      {children}
    </label>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-[#060a14] px-3 py-2 font-dm-sans text-sm text-white placeholder:text-white/30 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30";

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function MechanicJobCardPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data: booking, isLoading } = useMechanicBookingDetails(bookingId as string);
  const navigate = useNavigate();

  const [items, setItems] = useState<DiagnosisItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    issueFound: "",
    sparePart: "",
    quantity: "",
    estimatedTime: "",
    estimatedCost: "",
  };
  const [form, setForm] = useState(emptyForm);

  const [status, setStatus] = useState<BookingStatus | null>(null);
  const [isSavingItems, setIsSavingItems] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const canAddItem = form.issueFound.trim().length > 0 && form.estimatedTime.trim().length > 0;

  function toDisplayStatus(raw: string): BookingStatus {
    const map: Record<string, BookingStatus> = {
      assigned: "Assigned",
      "in-progress": "In Progress",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return map[raw.toLowerCase()] ?? "Assigned";
  }

  useEffect(() => {
    if (booking) setStatus(toDisplayStatus(booking.status));
  }, [booking]);

  useEffect(() => {
    if (booking?.job?.description) {
      setItems(
        booking.job.description.map((d) => ({
          id: d.jobItemsId,
          issueFound: d.issueFound,
          sparePart: d.spareParts || undefined,
          quantity: d.sparePartQty || undefined,
          estimatedTime: d.estimatedTime,
          estimatedCost: d.initalCost,
        }))
      );
    }
  }, [booking]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleAddOrUpdateItem() {
    if (!canAddItem) return;

    const nextItem: DiagnosisItem = {
      id: editingId ?? crypto.randomUUID(),
      issueFound: form.issueFound.trim(),
      sparePart: form.sparePart.trim() || undefined,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      estimatedTime: form.estimatedTime.trim(),
      estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : 0,
    };

    setItems((prev) =>
      editingId ? prev.map((it) => (it.id === editingId ? nextItem : it)) : [...prev, nextItem]
    );
    resetForm();
  }

  function handleEditItem(item: DiagnosisItem) {
    setEditingId(item.id);
    setForm({
      issueFound: item.issueFound,
      sparePart: item.sparePart ?? "",
      quantity: item.quantity?.toString() ?? "",
      estimatedTime: item.estimatedTime,
      estimatedCost: item.estimatedCost ? item.estimatedCost.toString() : "",
    });
  }

  function handleRemoveItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingId === id) resetForm();
  }

  const grandTotalCost = items.reduce((sum, it) => sum + (it.estimatedCost || 0), 0);
  const totalEstimatedTime = useMemo(() => summarizeEstimatedTime(items), [items]);

  async function handleSaveJobCard() {
    setIsSavingItems(true);
    try {
      // await bookingsApi.saveJobCardItems(booking.id, items);
      await new Promise((r) => setTimeout(r, 900));
    } finally {
      setIsSavingItems(false);
    }
  }

  async function handleUpdateStatus() {
    setIsSavingStatus(true);
    try {
      // await bookingsApi.updateStatus(booking.id, status);
      await new Promise((r) => setTimeout(r, 700));
    } finally {
      setIsSavingStatus(false);
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Loading...</div>;
  }
  if (!booking || status === null) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Booking not found.</div>;
  }
  const statusStyle = STATUS_STYLES[status];

  return (
    <div className="min-h-screen bg-[#060a14] pb-24 lg:pb-10">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#060a14]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0a0f1e] text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-syne text-xl font-bold text-white sm:text-2xl">Job Card</h1>
              <p className="font-dm-sans text-xs text-white/50 sm:text-sm">
                {booking.vehicleRegistrationNumber} · {booking.customerName}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-dm-sans text-xs font-medium ring-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ── Main column ── */}
          <div className="flex flex-col gap-5">
            {/* Vehicle & customer summary */}
            <SectionCard>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#060a14]">
                  {booking.vehiclePhotoUrl ? (
                    <img
                      src={booking.vehiclePhotoUrl}
                      alt={booking.vehicleRegistrationNumber}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Car className="h-8 w-8 text-white/25" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-syne text-lg font-bold text-white">
                      {booking.vehicleRegistrationNumber}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-dm-sans text-[11px] font-medium text-white/60">
                      {booking.visitType}
                    </span>
                  </div>
                  <p className="mt-0.5 font-dm-sans text-sm text-white/50">
                    {booking.vehicleType} · {booking.vehicleBrand} {booking.vehicleModel}
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    <div className="font-dm-sans text-sm text-white/70">{booking.customerName}</div>
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="flex items-center gap-1.5 font-dm-sans text-sm text-cyan-300 hover:text-cyan-200"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {booking.customerPhone}
                    </a>
                    <div className="font-dm-sans text-sm text-white/50">{booking.schedule.date}</div>
                    <div className="font-dm-sans text-sm text-white/50">
                      {booking.schedule.slotStartingTime}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Reported issue */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Quote className="h-4 w-4 text-white/30" />
                <span className="font-dm-sans text-xs font-medium uppercase tracking-wide text-white/40">
                  Customer Reported
                </span>
              </div>
              <p className="font-dm-sans text-sm leading-relaxed text-white/70">
                {booking.additionalInfo?.trim() || "No additional details provided by customer."}
              </p>
            </div>

            {/* Diagnosis form */}
            <SectionCard
              title={editingId ? "Edit Diagnosis Item" : "Add Diagnosis Item"}
              subtitle="Describe what you found and what it'll take to fix it."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field label="Issue Found">
                    <input
                      className={inputClasses}
                      placeholder="e.g. Worn front brake pads"
                      value={form.issueFound}
                      onChange={(e) => setForm({ ...form, issueFound: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Spare Part (optional)">
                  <input
                    className={inputClasses}
                    placeholder="e.g. Brake pad set"
                    value={form.sparePart}
                    onChange={(e) => setForm({ ...form, sparePart: e.target.value })}
                  />
                </Field>
                <Field label="Quantity (optional)">
                  <input
                    type="number"
                    min={0}
                    className={inputClasses}
                    placeholder="1"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </Field>
                <Field label="Estimated Time">
                  <input
                    className={inputClasses}
                    placeholder="e.g. 2 hours"
                    value={form.estimatedTime}
                    onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                  />
                </Field>
                <Field label="Estimated Cost">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-white/40">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      className={`${inputClasses} pl-7`}
                      placeholder="0"
                      value={form.estimatedCost}
                      onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleAddOrUpdateItem}
                  disabled={!canAddItem}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 font-dm-sans text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: canAddItem
                      ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                      : "rgba(255,255,255,0.06)",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {editingId ? "Update Item" : "Add Item"}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="font-dm-sans text-sm text-white/50 hover:text-white/80"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              {items.length > 0 && (
                <ul className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#060a14] px-3 py-2.5 transition hover:border-white/20"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-dm-sans text-sm text-white">
                          {item.issueFound}
                          {item.sparePart && <span className="text-white/50"> · {item.sparePart}</span>}
                          {item.quantity ? <span className="text-white/40"> ×{item.quantity}</span> : null}
                        </p>
                        <p className="mt-0.5 font-dm-sans text-xs text-white/40">
                          {item.estimatedTime} · ₹{item.estimatedCost.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => handleEditItem(item)}
                          aria-label="Edit item"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-white/40 transition hover:bg-white/5 hover:text-cyan-300"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove item"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-white/40 transition hover:bg-red-400/10 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {/* Items table */}
            <SectionCard title="Job Card Items" subtitle="Auto-generated from the diagnosis items above.">
              {items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center font-dm-sans text-sm text-white/40">
                  No diagnosis items added yet — start by describing what you found.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-3 py-2.5 font-dm-sans text-xs font-medium text-white/40">#</th>
                        <th className="px-3 py-2.5 font-dm-sans text-xs font-medium text-white/40">
                          Issue / Part
                        </th>
                        <th className="px-3 py-2.5 font-dm-sans text-xs font-medium text-white/40">Qty</th>
                        <th className="px-3 py-2.5 font-dm-sans text-xs font-medium text-white/40">
                          Est. Time
                        </th>
                        <th className="px-3 py-2.5 text-right font-dm-sans text-xs font-medium text-white/40">
                          Est. Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id} className="border-b border-white/5 last:border-0">
                          <td className="px-3 py-2.5 font-dm-sans text-sm text-white/40">{idx + 1}</td>
                          <td className="px-3 py-2.5 font-dm-sans text-sm text-white">
                            {item.issueFound}
                            {item.sparePart && <span className="text-white/50"> · {item.sparePart}</span>}
                          </td>
                          <td className="px-3 py-2.5 font-dm-sans text-sm text-white/60">
                            {item.quantity ?? "—"}
                          </td>
                          <td className="px-3 py-2.5 font-dm-sans text-sm text-white/60">
                            {item.estimatedTime}
                          </td>
                          <td className="px-3 py-2.5 text-right font-dm-sans text-sm text-white/80">
                            ₹{item.estimatedCost.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Sidebar (sticky on desktop) ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            {/* Totals */}
            <SectionCard title="Summary">
              <div className="flex flex-col divide-y divide-white/5">
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-dm-sans text-sm text-white/50">Items</span>
                  <span className="font-dm-sans text-sm text-white">{items.length}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-dm-sans text-sm text-white/50">Est. Time</span>
                  <span className="font-dm-sans text-sm text-white">{totalEstimatedTime}</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="font-dm-sans text-sm font-medium text-cyan-300">Total Cost</span>
                  <span className="font-syne text-lg font-bold text-cyan-300">
                    ₹{grandTotalCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSaveJobCard}
                disabled={isSavingItems || items.length === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-dm-sans text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                {isSavingItems && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Job Card
              </button>
            </SectionCard>

            {/* Status */}
            <SectionCard title="Update Status">
              <div className="flex flex-col gap-2">
                {STATUS_ORDER.map((s) => {
                  const active = s === status;
                  const style = STATUS_STYLES[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-dm-sans text-sm font-medium transition ${
                        active
                          ? `${style.bg} ${style.text} ${style.ring} border-transparent ring-1`
                          : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${active ? style.dot : "bg-white/20"}`} />
                      {s}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={isSavingStatus || status === booking.status}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-dm-sans text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSavingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Status
              </button>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Time summation helper
 * ──────────────────────────────────────────────────────────────────────── */

function summarizeEstimatedTime(items: DiagnosisItem[]): string {
  if (items.length === 0) return "—";

  let totalMinutes = 0;
  let hasUnparsed = false;

  for (const item of items) {
    const text = item.estimatedTime.toLowerCase().trim();
    const match = text.match(/([\d.]+)\s*(hour|hr|h|minute|min|m)/);
    if (!match) {
      hasUnparsed = true;
      continue;
    }
    const value = parseFloat(match[1]);
    const unit = match[2];
    totalMinutes += unit.startsWith("h") ? value * 60 : value;
  }

  if (totalMinutes === 0) {
    return hasUnparsed ? items.map((i) => i.estimatedTime).join(" + ") : "—";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  const parts: string[] = [];
  if (hours) parts.push(`${hours} hr${hours !== 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} min`);
  const summed = parts.join(" ") || "0 min";

  return hasUnparsed ? `${summed} + more` : summed;
}