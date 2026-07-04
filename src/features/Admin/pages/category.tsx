import { useState, useRef, useEffect } from "react";
import { useAdminAuth } from '../hook/useAdminAuth';
import { useNavigate } from "react-router-dom";


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
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn .15s ease",
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg,#0e1610,#0a0f0c)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          padding: "28px 32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
          animation: "popIn .2s ease",
        }}
      >
        {/* Icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px",
            background: confirmColor === "red" ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
            border: `1px solid ${confirmColor === "red" ? "rgba(239,68,68,0.25)" : "rgba(251,191,36,0.25)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: confirmColor === "red" ? "#f87171" : "#fbbf24",
            flexShrink: 0,
          }}>
            <WarningIcon />
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif", marginBottom: "3px" }}>
              {title}
            </div>
            <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>
              {message}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "20px 0" }} />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "9px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 700,
              background: confirmColor === "red"
                ? "linear-gradient(135deg,#dc2626,#ef4444)"
                : "linear-gradient(135deg,#d97706,#f59e0b)",
              border: "none",
              color: "#fff", cursor: "pointer", fontFamily: "'Syne',sans-serif",
              boxShadow: confirmColor === "red" ? "0 4px 14px rgba(239,68,68,0.35)" : "0 4px 14px rgba(245,158,11,0.35)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Animate-in wrapper ────────────────────────────────────────────────────────
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
  // const [page, setPage]               = useState(1);
  const [focusedF, setFocused]        = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
 const [errors, setErrors] =
  useState<Record<string, string>>({});
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile]       = useState<File | null>(null);
  const [confirm, setConfirm]         = useState<ConfirmState>({
    open: false, type: null, catId: null, catName: "", currentStatus: undefined,
  });
  
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
    // toggleStatus,
  } = useAdminAuth();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  fetchCategories();
}, [page]);

  // ── Filtered + paged ──────────────────────────────────────────────────────
  // const filtered = useMemo(() =>
  //   (categories ?? []).filter(c =>
  //     c.name?.toLowerCase().includes(search.toLowerCase())
  //   ), [categories, search]);

  // const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Icon upload ────────────────────────────────────────────────────────────
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = ev => setIconPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({})
    if (!form.name.trim()) return;
    if (!iconFile && !editId) {
      setErrors({ icon:"Please upload an icon image."});
      return;
    }
  

// Name required
if(!form.name.trim()){

 setErrors({name:"Category name is required"})
  return
}

// Minimum length
if(form.name.trim().length < 3){

  setErrors({name:"Category name must be at least 3 characters"})

  return
}

// Icon required
if(!iconFile && !editId){

   setErrors({ icone:"Please upload an icon image."});

  return
}

// Advance fee required
if(!form.amount){

   setErrors({ Amount:"Amount is required"});

  return
}

// Invalid fee
if(Number(form.amount) < 0){

   setErrors({ amount:"Amount is should be positive"});

  return
}
    setSaving(true);
    // setSaveError(null);
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

    setErrors(
      err.response.data.errors
    );

  } else {

    setErrors({
      general:
        err.response?.data?.message ||
        err.message ||
        "Failed to save category.",
    });
  }
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
 const handleEdit = (cat: Category) => {
  //const navigate = useNavigate();
  navigate(`/admin/category/edit/${cat.id}`, {
    state: cat,
  });
};

  const cancelEdit = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setIconPreview(null);
    setIconFile(null);
    setErrors({});
  };

  // ── Confirm actions ────────────────────────────────────────────────────────
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
      console.log("delete", confirm.catId);
      fetchCategories();
    } else if (confirm.type === "toggle") {
       await blockun(confirm.catId);  
    fetchCategories();  
    }
    closeConfirm();
  };

  // ── Input style ────────────────────────────────────────────────────────────
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

  // ── Stats ─────────────────────────────────────────────────────────────────
  const activeCount   = (categories ?? []).filter(c => c.status === "active").length;
  const disabledCount = (categories ?? []).filter(c => c.status === "disabled").length;
  const totalCount    = (categories ?? []).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.5)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes popIn    { 0%{transform:scale(.88);opacity:0} 60%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
        input::placeholder,textarea::placeholder { color:rgba(255,255,255,0.18); }
        input:focus,textarea:focus { outline:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(16,185,129,0.25); border-radius:2px; }
        .row-hover:hover { background:rgba(16,185,129,0.025) !important; }
        .action-btn { transition: all 0.15s ease !important; }
      `}</style>

      {/* ── Confirm Dialog ──────────────────────────────────────────────────── */}
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
        confirmLabel={
          confirm.type === "delete"
            ? "Delete"
            : confirm.currentStatus === "active" ? "Disable" : "Enable"
        }
        confirmColor={confirm.type === "delete" ? "red" : "amber"}
        onConfirm={handleConfirmed}
        onCancel={closeConfirm}
      />

      <div
        style={{ background: "#080e0a", minHeight: "100vh", height: "100vh", overflowY: "auto", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 24px" }}>

          {/* ── Header ────────────────────────────────────────────────────── */}
          <FadeIn delay={0}>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "12px",
                    background: "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.08))",
                    border: "1px solid rgba(16,185,129,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#10b981",
                  }}>
                    <TagIcon />
                  </div>
                  <div>
                    <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.3px", margin: 0 }}>
                      Category Management
                    </h1>
                    <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)", margin: "2px 0 0", fontFamily: "'DM Sans',sans-serif" }}>
                      Manage and organise service categories for your platform
                    </p>
                  </div>
                </div>

                {/* Live badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 14px", borderRadius: "100px",
                  background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                  color: "#10b981", fontSize: "12px", fontWeight: 600,
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: "pulseDot 2s infinite", display: "inline-block" }} />
                  {activeCount} Active
                </div>
              </div>

              {/* Stat pills */}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {[
                  { label: "Total Categories", value: totalCount, color: "rgba(255,255,255,0.5)" },
                  { label: "Active", value: activeCount, color: "#34d399" },
                  { label: "Disabled", value: disabledCount, color: "rgba(248,113,113,0.8)" },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: "9px 16px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.value}</span>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── Form Card ─────────────────────────────────────────────────── */}
          <FadeIn delay={60}>
            <div style={{
              borderRadius: "16px", overflow: "hidden", marginBottom: "20px",
              background: "linear-gradient(160deg,#0d1a10,#090e0b)",
              border: editId ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            }}>
              {/* Top accent */}
              <div style={{ height: "2px", background: "linear-gradient(90deg,#10b981 0%,#06b6d4 60%,transparent 100%)" }} />

              <div style={{ padding: "24px 28px" }}>
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981",
                    }}>
                      <PlusIcon />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>
                      {editId ? "Edit Category" : "Add New Category"}
                    </span>
                    {editId && (
                      <span style={{
                        padding: "2px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)", color: "#10b981",
                      }}>
                        Editing
                      </span>
                    )}
                  </div>
                  {editId && (
                    <button onClick={cancelEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: "4px", display: "flex", alignItems: "center" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                    >
                      <XIcon />
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave}>
                 
                  <div style={{ display: "grid", gridTemplateColumns: "2.4fr 0.8fr 1.4fr 1fr", gap: "14px", marginBottom: "18px", alignItems: "end" }}>

                    {/* Name */}
                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                        Category Name
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: focusedF === "name" ? "#10b981" : "rgba(255,255,255,0.22)", transition: "color 0.18s", pointerEvents: "none" }}>
                          <TagIcon />
                        </span>
                        <input
                          type="text"  value={form.name}
                          placeholder="e.g. Engine Repair"
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                          style={{ ...inputBase("name"), height: "42px", paddingLeft: "34px", paddingRight: "12px" }}
                        />
                      </div>
                      {errors.name && (
  <p
    style={{
      color: "#f87171",
      fontSize: "12px",
      marginTop: "6px",
      fontFamily: "'DM Sans',sans-serif",
    }}
  >
    {errors.name}
  </p>
)}
                    </div>

                    {/* Icon */}
                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                        Icon
                      </label>
                      <button
                        type="button" onClick={() => fileRef.current?.click()}
                        style={{
                          width: "100%", height: "42px", borderRadius: "10px", cursor: "pointer",
                          background: iconPreview ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.03)",
                          border: iconPreview ? "1px solid rgba(16,185,129,0.3)" : "1px dashed rgba(255,255,255,0.15)",
                          color: iconPreview ? "#10b981" : "rgba(255,255,255,0.28)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = iconPreview ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.15)"; }}
                      >
                        {iconPreview
                          ? <img src={iconPreview} alt="icon" style={{ width: "22px", height: "22px", borderRadius: "5px", objectFit: "cover" }} />
                          : <UploadIcon />
                        }
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleIconUpload} />
                        {errors.icon && (
  <p
    style={{
      color: "#f87171",
      fontSize: "12px",
      marginTop: "6px",
      fontFamily: "'DM Sans',sans-serif",
    }}
  >
    {errors.icon}
  </p>
)}
                    </div>

                    {/* Status */}
                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                        Status
                      </label>
                      <div style={{
                        display: "flex", gap: "4px", padding: "3px",
                        height: "42px", borderRadius: "10px",
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                        {(["active", "disabled"] as const).map(s => (
                          <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                            style={{
                              flex: 1, height: "100%", borderRadius: "7px", border: "none", cursor: "pointer",
                              fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                              background: form.status === s
                                ? s === "active" ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(239,68,68,0.16)"
                                : "transparent",
                              color: form.status === s
                                ? s === "active" ? "#fff" : "#f87171"
                                : "rgba(255,255,255,0.3)",
                              transition: "all 0.15s",
                              boxShadow: form.status === s && s === "active" ? "0 2px 8px rgba(16,185,129,0.28)" : "none",
                            }}
                          >
                            {s === "active" && (
                              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: form.status === "active" ? "#fff" : "rgba(255,255,255,0.25)", display: "inline-block" }} />
                            )}
                            {s === "active" ? "Active" : "Inactive"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                        Advance Fee
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", fontWeight: 700, color: focusedF === "amount" ? "#10b981" : "rgba(255,255,255,0.3)", transition: "color 0.18s", pointerEvents: "none" }}>
                          ₹
                        </span>
                        <input
                          type="number" min="0" step="0.01" value={form.amount} placeholder="0.00"
                          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                          onFocus={() => setFocused("amount")} onBlur={() => setFocused(null)}
                          style={{ ...inputBase("amount"), height: "42px", paddingLeft: "26px", paddingRight: "10px" }}
                        />
                      </div>
                    </div>
                    {errors.amount && (
  <p
    style={{
      color: "#f87171",
      fontSize: "12px",
      marginTop: "6px",
      fontFamily: "'DM Sans',sans-serif",
    }}
  >
    {errors.amount}
  </p>
)}
                  </div>

                  {/* Feedback */}
{errors.general && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderRadius: "10px",
      padding: "10px 14px",
      marginBottom: "14px",
      background: "rgba(239,68,68,0.07)",
      border: "1px solid rgba(239,68,68,0.17)",
    }}
  >
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f87171"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>

    <span
      style={{
        fontSize: "13px",
        color: "#f87171",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {errors.general}
    </span>
  </div>
)}
                  {saved && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.22)", animation: "popIn .25s ease both" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                      </svg>
                      <span style={{ fontSize: "13px", color: "#34d399", fontFamily: "'DM Sans',sans-serif" }}>Category {editId ? "updated" : "created"} successfully!</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                    {editId && (
                      <button type="button" onClick={cancelEdit}
                        style={{ padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" disabled={saving}
                      style={{
                        display: "flex", alignItems: "center", gap: "7px",
                        padding: "9px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 700,
                        background: saving ? "rgba(16,185,129,0.35)" : "linear-gradient(135deg,#059669,#10b981)",
                        border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "'Syne',sans-serif", letterSpacing: "0.02em",
                        boxShadow: saving ? "none" : "0 4px 14px rgba(16,185,129,0.3)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
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
            <div style={{
              borderRadius: "16px", overflow: "hidden",
              background: "linear-gradient(160deg,#0d1a10,#090e0b)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
            }}>
              {/* Table toolbar */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.055)",
              }}>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>
                    Existing Categories
                  </span>
                  <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.28)", margin: "2px 0 0" }}>
                    {categories.length} {categories.length === 1 ? "category" : "categories"} total
                  </p>
                </div>

                {/* Search */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  height: "36px", width: "210px",
                  padding: "0 12px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.28)",
                }}>
                  <SearchIcon />
                  <input
                    type="text" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search categories…"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "12.5px", fontFamily: "'DM Sans',sans-serif" }}
                  />
                  {search && (
                    <button onClick={() => { setSearch(""); setPage(1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", lineHeight: 1, padding: 0 }}>
                      <XIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 130px", padding: "10px 24px", borderBottom: "1px solid rgba(255,255,255,0.045)", background: "rgba(255,255,255,0.015)" }}>
                {[
                  { label: "Category", align: "left" },
                  { label: "Status", align: "left" },
                  { label: "Created On", align: "left" },
                  { label: "Actions", align: "right" },
                ].map(h => (
                  <span key={h.label} style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: h.align as any }}>
                    {h.label}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {categories.length === 0 ? (
                <div style={{ padding: "56px 0", textAlign: "center", color: "rgba(255,255,255,0.22)", fontSize: "13px" }}>
                  No categories found{search ? ` for "${search}"` : ""}.
                </div>
              ) : (
                categories.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="row-hover"
                    style={{
                      display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 130px",
                      padding: "0 24px", height: "58px", alignItems: "center",
                      borderBottom: i < categories.length - 1 ? "1px solid rgba(255,255,255,0.038)" : "none",
                      transition: "background 0.15s",
                      animation: `fadeUp .35s ease ${i * 40}ms both`,
                    }}
                  >
                    {/* Name + icon */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: getIcon(cat) ? "transparent" : cat.status === "active" ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${cat.status === "active" ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.07)"}`,
                        fontSize: "14px",
                      }}>
                        {getIcon(cat)
                          ? <img src={getIcon(cat)!} alt={cat.name} style={{ width: "20px", height: "20px", borderRadius: "4px", objectFit: "cover" }} />
                          : <span>{getIconEmoji(cat)}</span>
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8f5ee", fontFamily: "'DM Sans',sans-serif" }}>
                          {cat.name}
                        </div>
                        {getAdvanceFee(cat) && (
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.27)", marginTop: "1px" }}>
                            ₹{getAdvanceFee(cat)} advance fee
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
                        background: cat.status === "active" ? "rgba(16,185,129,0.09)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${cat.status === "active" ? "rgba(16,185,129,0.22)" : "rgba(255,255,255,0.09)"}`,
                        color: cat.status === "active" ? "#34d399" : "rgba(255,255,255,0.38)",
                      }}>
                        <span style={{
                          width: "5px", height: "5px", borderRadius: "50%", display: "inline-block",
                          background: cat.status === "active" ? "#34d399" : "rgba(255,255,255,0.3)",
                          animation: cat.status === "active" ? "pulseDot 2s infinite" : "none",
                        }} />
                        {cat.status === "active" ? "Active" : "Disabled"}
                      </span>
                    </div>

                    {/* Created on */}
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                      {formatDate(cat)}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>

                      {/* Edit */}
                      <button
                        className="action-btn"
                        onClick={() => handleEdit(cat)}
                        title="Edit"
                        style={{
                          width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                          color: "rgba(255,255,255,0.4)",
                        }}
                        onMouseEnter={e => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(16,185,129,0.1)";
                          b.style.borderColor = "rgba(16,185,129,0.28)";
                          b.style.color = "#10b981";
                        }}
                        onMouseLeave={e => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(255,255,255,0.04)";
                          b.style.borderColor = "rgba(255,255,255,0.09)";
                          b.style.color = "rgba(255,255,255,0.4)";
                        }}
                      >
                        <EditIcon />
                      </button>

                      {/* Block / Enable */}
                      <button
                        className="action-btn"
                        onClick={() => openToggleConfirm(cat)}
                        title={cat.status === "active" ? "Disable" : "Enable"}
                        style={{
                          width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: cat.status === "active" ? "rgba(251,191,36,0.07)" : "rgba(16,185,129,0.07)",
                          border: `1px solid ${cat.status === "active" ? "rgba(251,191,36,0.2)" : "rgba(16,185,129,0.2)"}`,
                          color: cat.status === "active" ? "rgba(251,191,36,0.7)" : "rgba(52,211,153,0.7)",
                        }}
                        onMouseEnter={e => {
                          const b = e.currentTarget as HTMLButtonElement;
                          if (cat.status === "active") {
                            b.style.background = "rgba(251,191,36,0.14)";
                            b.style.color = "#fbbf24";
                          } else {
                            b.style.background = "rgba(16,185,129,0.14)";
                            b.style.color = "#34d399";
                          }
                        }}
                        onMouseLeave={e => {
                          const b = e.currentTarget as HTMLButtonElement;
                          if (cat.status === "active") {
                            b.style.background = "rgba(251,191,36,0.07)";
                            b.style.color = "rgba(251,191,36,0.7)";
                          } else {
                            b.style.background = "rgba(16,185,129,0.07)";
                            b.style.color = "rgba(52,211,153,0.7)";
                          }
                        }}
                      >
                        {cat.status === "active" ? <BlockIcon /> : <EnableIcon />}
                      </button>

                      {/* Delete */}
                      <button
                        className="action-btn"
                        onClick={() => openDeleteConfirm(cat)}
                        title="Delete"
                        style={{
                          width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.16)",
                          color: "rgba(248,113,113,0.6)",
                        }}
                        onMouseEnter={e => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(239,68,68,0.13)";
                          b.style.color = "#f87171";
                        }}
                        onMouseLeave={e => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(239,68,68,0.06)";
                          b.style.color = "rgba(248,113,113,0.6)";
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Footer */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.045)",
                background: "rgba(255,255,255,0.01)",
              }}>
                <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>
                  Showing {categories.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, categories.length)} of {categories.length}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      color: page === 1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)",
                      cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    <ChevLeft /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                    <button key={pg} onClick={() => setPage(pg)}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px", fontSize: "12.5px", fontWeight: 600,
                        background: pg === page ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${pg === page ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)"}`,
                        color: pg === page ? "#fff" : "rgba(255,255,255,0.42)",
                        cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                        boxShadow: pg === page ? "0 2px 8px rgba(16,185,129,0.25)" : "none",
                        transition: "all 0.15s",
                      }}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      color: page === totalPages ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)",
                      cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif",
                      transition: "all 0.15s",
                    }}
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