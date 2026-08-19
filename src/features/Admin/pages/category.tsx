import { useState, useRef, useEffect } from "react";
import { useAdminAuth } from '../hook/useAdminAuth';
import { useNavigate } from "react-router-dom";
import { checkCategoryName } from "../service/adminService";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  icon: string | null;
  iconEmoji?: string;
  status: "active" | "disabled";
  advanceFee: number | string;
  createdAt?: string;
  createdOn?: string;
}

const PAGE_SIZE = 5;

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const BlockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
);
const EnableIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
  </svg>
);
const DeleteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M12 8v8M9 11l3-3 3 3"/>
  </svg>
);
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const ChevLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const ChevRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ── Confirm Dialog ────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmDialog({ open, title, message, confirmLabel, confirmColor, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  const isRed = confirmColor === "red";
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-[6px] flex items-center justify-center"
      style={{ animation: "fadeIn .15s ease" }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-[18px] px-8 py-7 bg-gradient-to-br from-[#0e1610] to-[#0a0f0c] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        style={{ animation: "popIn .2s ease" }}
      >
        {/* Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 ${
            isRed ? "bg-red-500/10 border border-red-500/25 text-red-400" : "bg-amber-400/10 border border-amber-400/25 text-amber-400"
          }`}>
            <WarningIcon />
          </div>
          <div>
            <div className="font-syne text-[15px] font-bold text-white mb-[3px]">{title}</div>
            <div className="font-dm text-[12.5px] text-white/38 leading-[1.5]">{message}</div>
          </div>
        </div>

        <div className="h-px bg-white/[0.06] my-5" />

        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-[9px] rounded-[10px] text-[13px] font-semibold bg-white/5 border border-white/10 text-white/55 cursor-pointer font-dm transition-all duration-150 hover:bg-white/[0.09]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-[9px] rounded-[10px] text-[13px] font-bold border-none text-white cursor-pointer font-syne transition-transform duration-150 hover:-translate-y-px ${
              isRed
                ? "bg-gradient-to-br from-red-600 to-red-500 shadow-[0_4px_14px_rgba(239,68,68,0.35)]"
                : "bg-gradient-to-br from-amber-600 to-amber-500 shadow-[0_4px_14px_rgba(245,158,11,0.35)]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Animate-in wrapper ────────────────────────────────────────────────────────
// `vis` depends on mount timing — genuinely dynamic, stays inline.
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}
    >
      {children}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (cat: Category): string => {
  if (cat.createdOn) return cat.createdOn;
  if (cat.createdAt) {
    return new Date(cat.createdAt).toLocaleDateString("en-US", {
      month: "short", day: "2-digit", year: "numeric",
    });
  }
  return "—";
};

const getAdvanceFee = (cat: Category): string => {
  if (cat.advanceFee == null) return "";
  return String(cat.advanceFee);
};

const getIcon = (cat: Category): string | null => {
  if (!cat.icon) return null;
  if (cat.icon.startsWith("data:") || cat.icon.startsWith("http")) return cat.icon;
  return `data:image/png;base64,${cat.icon}`;
};

const getIconEmoji = (cat: Category): string => cat.iconEmoji || "🔧";

// ── Empty form state ──────────────────────────────────────────────────────────
const emptyForm = {
  name: "",
  iconEmoji: "",
  amount: "",
  status: "active" as "active" | "disabled",
};

// ── Confirm state type ────────────────────────────────────────────────────────
interface ConfirmState {
  open: boolean;
  type: "delete" | "toggle" | null;
  catId: string | null;
  catName: string;
  currentStatus?: "active" | "disabled";
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const [form, setForm]               = useState({ ...emptyForm });
  const [editId, setEditId]           = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [focusedF, setFocused]        = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile]       = useState<File | null>(null);
  const [confirm, setConfirm]         = useState<ConfirmState>({
    open: false, type: null, catId: null, catName: "", currentStatus: undefined,
  });
  const [nameCheckLoading, setNameCheckLoad] = useState(false);
  const navigate = useNavigate();
  const {
    categories,
    getallCategory: fetchCategories,
    addCategory,
    page,
    setPage,
    totalPages,
    blockun,
    removeCategory,
  } = useAdminAuth();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, [page]);

  useEffect(() => {
    if (!form.name.trim() || form.name.trim().length < 3) return;
    const timer = setTimeout(async () => {
      setNameCheckLoad(true);
      try {
        const exist = await checkCategoryName(form.name.trim());
        if (exist && !editId) {
          setErrors((prev) => ({ ...prev, name: "Category already exist" }));
        } else {
          setErrors((prev) => { const { name, ...rest } = prev; return rest; });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setNameCheckLoad(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.name, editId]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = ev => setIconPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }
    if (form.name.trim().length < 3) {
      setErrors({ name: "Category name must be at least 3 characters" });
      return;
    }
    if (!iconFile && !editId) {
      setErrors({ icon: "Please upload an icon image." });
      return;
    }
    if (!form.amount) {
      setErrors({ amount: "Amount is required" });
      return;
    }
    if (Number(form.amount) < 0) {
      setErrors({ amount: "Amount should be positive" });
      return;
    }

    setSaving(true);
    try {
      await addCategory({
        name: form.name,
        advanceFee: parseFloat(form.amount) || 0,
        iconFile: iconFile!,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setForm({ ...emptyForm });
      setIconFile(null);
      setIconPreview(null);
      setEditId(null);
      setPage(1);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          general: err.response?.data?.message || err.message || "Failed to save category.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    navigate(`/admin/category/edit/${cat.id}`, { state: cat });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setIconPreview(null);
    setIconFile(null);
    setErrors({});
  };

  const openDeleteConfirm = (cat: Category) =>
    setConfirm({ open: true, type: "delete", catId: cat.id, catName: cat.name });

  const openToggleConfirm = (cat: Category) =>
    setConfirm({ open: true, type: "toggle", catId: cat.id, catName: cat.name, currentStatus: cat.status });

  const closeConfirm = () =>
    setConfirm({ open: false, type: null, catId: null, catName: "", currentStatus: undefined });

  const handleConfirmed = async () => {
    if (!confirm.catId) return;
    if (confirm.type === "delete") {
      await removeCategory(confirm.catId);
      fetchCategories();
    } else if (confirm.type === "toggle") {
      await blockun(confirm.catId);
      fetchCategories();
    }
    closeConfirm();
  };

  const inputBase = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focusedF === field ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)",
    border: focusedF === field ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)",
    boxShadow: focusedF === field ? "0 0 0 3px rgba(16,185,129,0.08)" : "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "all 0.18s ease",
  });

  const activeCount   = (categories ?? []).filter(c => c.status === "active").length;
  const disabledCount = (categories ?? []).filter(c => c.status === "disabled").length;
  const totalCount    = (categories ?? []).length;

  return (
    <>
      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === "delete"
            ? `Delete "${confirm.catName}"?`
            : confirm.currentStatus === "active"
              ? `Disable "${confirm.catName}"?`
              : `Enable "${confirm.catName}"?`
        }
        message={
          confirm.type === "delete"
            ? "This action is permanent and cannot be undone. All data associated with this category will be removed."
            : confirm.currentStatus === "active"
              ? "This category will be hidden from the platform until re-enabled."
              : "This category will become visible and active on the platform."
        }
        confirmLabel={confirm.type === "delete" ? "Delete" : confirm.currentStatus === "active" ? "Disable" : "Enable"}
        confirmColor={confirm.type === "delete" ? "red" : "amber"}
        onConfirm={handleConfirmed}
        onCancel={closeConfirm}
      />

      <div className="bg-[#080e0a] min-h-screen h-screen overflow-y-auto font-dm admin-scrollbar">
        <div className="max-w-[960px] mx-auto px-6 py-9">

          {/* ── Stats header (no page title — AdminTopbar owns that now) ── */}
          <FadeIn delay={0}>
            <div className="mb-8">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-[7px] px-3.5 py-[7px] rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" style={{ animation: "pulseDot 2s infinite" }} />
                  {activeCount} Active
                </div>
              </div>

              {/* Stat pills */}
              <div className="flex gap-2.5 mt-5">
                {[
                  { label: "Total Categories", value: totalCount, className: "text-white/50" },
                  { label: "Active", value: activeCount, className: "text-emerald-400" },
                  { label: "Disabled", value: disabledCount, className: "text-red-400/80" },
                ].map(s => (
                  <div key={s.label} className="px-4 py-[9px] rounded-[10px] bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <span className={`font-syne text-lg font-extrabold ${s.className}`}>{s.value}</span>
                    <span className="text-[11.5px] text-white/30 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── Form Card ─────────────────────────────────────────────────── */}
          <FadeIn delay={60}>
            <div className={`rounded-2xl overflow-hidden mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
              editId ? "border border-emerald-500/30" : "border border-white/[0.07]"
            }`} style={{ background: "linear-gradient(160deg,#0d1a10,#090e0b)" }}>
              <div className="h-0.5" style={{ background: "linear-gradient(90deg,#10b981 0%,#06b6d4 60%,transparent 100%)" }} />

              <div className="px-7 py-6">
                <div className="flex items-center justify-between mb-[22px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/[0.22] flex items-center justify-center text-emerald-500">
                      <PlusIcon />
                    </div>
                    <span className="font-syne text-sm font-bold text-white">
                      {editId ? "Edit Category" : "Add New Category"}
                    </span>
                    {editId && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/[0.22] text-emerald-500">
                        Editing
                      </span>
                    )}
                  </div>
                  {editId && (
                    <button
                      onClick={cancelEdit}
                      className="bg-transparent border-none cursor-pointer text-white/30 p-1 flex items-center hover:text-red-400 transition-colors"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} noValidate>
                  <div className="grid gap-3.5 mb-[18px] items-end" style={{ gridTemplateColumns: "2.4fr 0.8fr 1.4fr 1fr" }}>

                    {/* Name */}
                    <div>
                      <label className="block mb-[7px] text-[10.5px] font-bold text-white/35 tracking-[0.09em] uppercase">
                        Category Name
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-[180ms]"
                          style={{ color: focusedF === "name" ? "#10b981" : "rgba(255,255,255,0.22)" }}
                        >
                          <TagIcon />
                        </span>
                        <input
                          type="text" value={form.name}
                          placeholder="e.g. Engine Repair"
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                          style={{ ...inputBase("name"), height: "42px", paddingLeft: "34px", paddingRight: "12px" }}
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1.5 font-dm">{errors.name}</p>}
                    </div>

                    {/* Icon */}
                    <div>
                      <label className="block mb-[7px] text-[10.5px] font-bold text-white/35 tracking-[0.09em] uppercase">
                        Icon
                      </label>
                      <button
                        type="button" onClick={() => fileRef.current?.click()}
                        className={`w-full h-[42px] rounded-[10px] cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-150 ${
                          iconPreview
                            ? "bg-emerald-500/[0.07] border border-emerald-500/30 text-emerald-500 hover:border-emerald-500/40"
                            : "bg-white/[0.03] border border-dashed border-white/15 text-white/[0.28] hover:border-white/25"
                        }`}
                      >
                        {iconPreview
                          ? <img src={iconPreview} alt="icon" className="w-[22px] h-[22px] rounded-[5px] object-cover" />
                          : <UploadIcon />
                        }
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
                      {errors.icon && <p className="text-red-400 text-xs mt-1.5 font-dm">{errors.icon}</p>}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block mb-[7px] text-[10.5px] font-bold text-white/35 tracking-[0.09em] uppercase">
                        Status
                      </label>
                      <div className="flex gap-1 p-[3px] h-[42px] rounded-[10px] bg-white/[0.03] border border-white/[0.08]">
                        {(["active", "disabled"] as const).map(s => (
                          <button
                            key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                            className={`flex-1 h-full rounded-[7px] border-none cursor-pointer text-xs font-semibold font-dm flex items-center justify-center gap-[5px] transition-all duration-150 ${
                              form.status === s
                                ? s === "active"
                                  ? "text-white shadow-[0_2px_8px_rgba(16,185,129,0.28)]"
                                  : "bg-red-500/[0.16] text-red-400"
                                : "bg-transparent text-white/30"
                            }`}
                            style={form.status === s && s === "active" ? { background: "linear-gradient(135deg,#059669,#10b981)" } : undefined}
                          >
                            {s === "active" && (
                              <span className={`w-[5px] h-[5px] rounded-full inline-block ${form.status === "active" ? "bg-white" : "bg-white/25"}`} />
                            )}
                            {s === "active" ? "Active" : "Inactive"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block mb-[7px] text-[10.5px] font-bold text-white/35 tracking-[0.09em] uppercase">
                        Advance Fee
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold pointer-events-none transition-colors duration-[180ms]"
                          style={{ color: focusedF === "amount" ? "#10b981" : "rgba(255,255,255,0.3)" }}
                        >
                          ₹
                        </span>
                        <input
                          type="number" min="0" step="0.01" value={form.amount} placeholder="0.00"
                          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                          onFocus={() => setFocused("amount")} onBlur={() => setFocused(null)}
                          style={{ ...inputBase("amount"), height: "42px", paddingLeft: "26px", paddingRight: "10px" }}
                        />
                      </div>
                      {errors.amount && <p className="text-red-400 text-xs mt-1.5 font-dm">{errors.amount}</p>}
                    </div>
                  </div>

                  {errors.general && (
                    <div className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 mb-3.5 bg-red-500/[0.07] border border-red-500/[0.17]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span className="text-[13px] text-red-400 font-dm">{errors.general}</span>
                    </div>
                  )}
                  {saved && (
                    <div
                      className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 mb-3.5 bg-emerald-500/[0.07] border border-emerald-500/[0.22]"
                      style={{ animation: "popIn .25s ease both" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                      </svg>
                      <span className="text-[13px] text-emerald-400 font-dm">
                        Category {editId ? "updated" : "created"} successfully!
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5">
                    {editId && (
                      <button
                        type="button" onClick={cancelEdit}
                        className="px-[18px] py-[9px] rounded-[10px] text-[13px] font-semibold bg-white/[0.04] border border-white/[0.09] text-white/50 cursor-pointer font-dm transition-all duration-150 hover:bg-white/[0.08]"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit" disabled={saving}
                      className={`flex items-center gap-[7px] px-[22px] py-[9px] rounded-[10px] text-[13px] font-bold border-none text-white font-syne tracking-[0.02em] transition-all duration-150 hover:-translate-y-px ${
                        saving ? "cursor-not-allowed" : "cursor-pointer shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
                      }`}
                      style={{ background: saving ? "rgba(16,185,129,0.35)" : "linear-gradient(135deg,#059669,#10b981)" }}
                    >
                      {saving ? (
                        <>
                          <svg style={{ animation: "spin .7s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Saving…
                        </>
                      ) : (
                        <>{editId ? "Update Category" : "Save Category"}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </FadeIn>

          {/* ── Table Card ─────────────────────────────────────────────────── */}
          <FadeIn delay={110}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_8px_28px_rgba(0,0,0,0.3)]" style={{ background: "linear-gradient(160deg,#0d1a10,#090e0b)" }}>

              <div className="flex items-center justify-between px-6 py-[18px] border-b border-white/[0.055]">
                <div>
                  <span className="font-syne text-sm font-bold text-white">Existing Categories</span>
                  <p className="text-[11.5px] text-white/[0.28] mt-0.5">
                    {categories.length} {categories.length === 1 ? "category" : "categories"} total
                  </p>
                </div>

                <div className="flex items-center gap-2 h-9 w-[210px] px-3 rounded-[10px] bg-white/[0.03] border border-white/[0.08] text-white/[0.28]">
                  <SearchIcon />
                  <input
                    type="text" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search categories…"
                    className="flex-1 bg-transparent border-none outline-none text-white text-[12.5px] font-dm"
                  />
                  {search && (
                    <button onClick={() => { setSearch(""); setPage(1); }} className="bg-transparent border-none cursor-pointer text-white/30 leading-none p-0">
                      <XIcon />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid px-6 py-2.5 border-b border-white/[0.045] bg-white/[0.015]" style={{ gridTemplateColumns: "2.2fr 1fr 1fr 130px" }}>
                {["Category", "Status", "Created On", "Actions"].map((label, i) => (
                  <span key={label} className={`text-[10px] font-bold text-white/[0.22] tracking-[0.1em] uppercase ${i === 3 ? "text-right" : "text-left"}`}>
                    {label}
                  </span>
                ))}
              </div>

              {categories.length === 0 ? (
                <div className="py-14 text-center text-white/[0.22] text-[13px]">
                  No categories found{search ? ` for "${search}"` : ""}.
                </div>
              ) : (
                categories.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="row-hover grid px-6 items-center transition-colors duration-150"
                    style={{
                      gridTemplateColumns: "2.2fr 1fr 1fr 130px",
                      height: "58px",
                      borderBottom: i < categories.length - 1 ? "1px solid rgba(255,255,255,0.038)" : "none",
                      animation: `fadeUp .35s ease ${i * 40}ms both`,
                    }}
                  >
                    {/* Name + icon */}
                    <div className="flex items-center gap-3">
                      <div className={`w-[34px] h-[34px] rounded-[9px] shrink-0 flex items-center justify-center text-sm border ${
                        cat.status === "active"
                          ? `border-emerald-500/[0.18] ${getIcon(cat) ? "" : "bg-emerald-500/[0.08]"}`
                          : `border-white/[0.07] ${getIcon(cat) ? "" : "bg-white/[0.04]"}`
                      }`}>
                        {getIcon(cat)
                          ? <img src={getIcon(cat)!} alt={cat.name} className="w-5 h-5 rounded object-cover" />
                          : <span>{getIconEmoji(cat)}</span>
                        }
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#e8f5ee] font-dm">{cat.name}</div>
                        {getAdvanceFee(cat) && (
                          <div className="text-[11px] text-white/[0.27] mt-px">₹{getAdvanceFee(cat)} advance fee</div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-semibold border ${
                        cat.status === "active"
                          ? "bg-emerald-500/[0.09] border-emerald-500/[0.22] text-emerald-400"
                          : "bg-white/5 border-white/[0.09] text-white/[0.38]"
                      }`}>
                        <span
                          className="w-[5px] h-[5px] rounded-full inline-block"
                          style={{
                            background: cat.status === "active" ? "#34d399" : "rgba(255,255,255,0.3)",
                            animation: cat.status === "active" ? "pulseDot 2s infinite" : "none",
                          }}
                        />
                        {cat.status === "active" ? "Active" : "Disabled"}
                      </span>
                    </div>

                    {/* Created on */}
                    <div className="text-xs text-white/35">{formatDate(cat)}</div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(cat)}
                        title="Edit"
                        className="w-[30px] h-[30px] rounded-lg cursor-pointer flex items-center justify-center bg-white/[0.04] border border-white/[0.09] text-white/40 transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/[0.28] hover:text-emerald-500"
                      >
                        <EditIcon />
                      </button>

                      <button
                        onClick={() => openToggleConfirm(cat)}
                        title={cat.status === "active" ? "Disable" : "Enable"}
                        className={`w-[30px] h-[30px] rounded-lg cursor-pointer flex items-center justify-center border transition-all duration-150 ${
                          cat.status === "active"
                            ? "bg-amber-400/[0.07] border-amber-400/20 text-amber-400/70 hover:bg-amber-400/[0.14] hover:text-amber-400"
                            : "bg-emerald-500/[0.07] border-emerald-500/20 text-emerald-400/70 hover:bg-emerald-500/[0.14] hover:text-emerald-400"
                        }`}
                      >
                        {cat.status === "active" ? <BlockIcon /> : <EnableIcon />}
                      </button>

                      <button
                        onClick={() => openDeleteConfirm(cat)}
                        title="Delete"
                        className="w-[30px] h-[30px] rounded-lg cursor-pointer flex items-center justify-center bg-red-500/[0.06] border border-red-500/[0.16] text-red-400/60 transition-all duration-150 hover:bg-red-500/[0.13] hover:text-red-400"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/[0.045] bg-white/[0.01]">
                <span className="text-[11.5px] text-white/25 font-dm">
                  Showing {categories.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, categories.length)} of {categories.length}
                </span>

                <div className="flex items-center gap-[5px]">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className={`flex items-center gap-[5px] px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.08] font-dm transition-all duration-150 ${
                      page === 1 ? "text-white/[0.18] cursor-not-allowed" : "text-white/50 cursor-pointer"
                    }`}
                  >
                    <ChevLeft /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                    <button
                      key={pg} onClick={() => setPage(pg)}
                      className={`w-[30px] h-[30px] rounded-lg text-[12.5px] font-semibold font-dm cursor-pointer transition-all duration-150 border ${
                        pg === page
                          ? "border-emerald-500/35 text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
                          : "border-white/[0.08] bg-white/[0.03] text-white/[0.42]"
                      }`}
                      style={pg === page ? { background: "linear-gradient(135deg,#059669,#10b981)" } : undefined}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className={`flex items-center gap-[5px] px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.08] font-dm transition-all duration-150 ${
                      page === totalPages ? "text-white/[0.18] cursor-not-allowed" : "text-white/50 cursor-pointer"
                    }`}
                  >
                    Next <ChevRight />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </>
  );
}