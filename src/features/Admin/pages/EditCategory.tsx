import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from '../hook/useAdminAuth';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getIconSrc = (cat: any): string | null => {
  if (!cat?.icon) return null;
  if (cat.icon.startsWith("data:") || cat.icon.startsWith("http")) return cat.icon;
  return `data:image/png;base64,${cat.icon}`;
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const InfoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const ImagePlaceholderIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const EditBadgeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const RupeeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 9M6 8a5 5 0 005 5H6" />
  </svg>
);

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      padding: "2px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)",
      color: "#6ee7b7", animation: "slideIn 0.2s ease both",
    }}>
      {children}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EditCategoryPage() {
  const { id }      = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { editCategory } = useAdminAuth();

  const [name, setName]               = useState<string>(state?.name || "");
  const [advanceFee, setAdvanceFee]   = useState<string>(
    state?.advanceFee != null ? String(state.advanceFee) : ""
  );
  const [status, setStatus]           = useState<"active" | "inactive">(state?.status || "active");
  const [iconPreview, setIconPreview] = useState<string | null>(getIconSrc(state));
  const [iconFile, setIconFile]       = useState<File | null>(null);
  const [focused, setFocused]         = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [errors, setErrors] =
  useState<Record<string, string>>({});
  const [mounted, setMounted]         = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setIconPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIconFile(null);
    setIconPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    setErrors({});
    
if (!name.trim()) {
  return setErrors({
    name: "Category name is required",
  });
}

if (name.trim().length < 3) {
  return setErrors({
    name:
      "Category name must be at least 3 characters",
  });
}

if (!advanceFee) {
  return setErrors({
    advanceFee: "Advance fee is required",
  });
}

if (Number(advanceFee) < 0) {
  return setErrors({
    advanceFee:
      "Advance fee cannot be negative",
  });
}
    try {
      await editCategory(id!, {
        name,
        advanceFee: parseFloat(advanceFee) || 0,
        status,
        iconFile,
      });
      setSaved(true);
      setTimeout(() => navigate("/admin/category"), 1200);
    } catch (err: any) {
      if (err.response?.data?.errors) {

    setErrors(
      err.response.data.errors
    );

  } else {

    setErrors({
      general:
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update category.",
    });
  }
    } finally {
      setSaving(false);
    }
  };

  // Detect what changed
  const originalFee = state?.advanceFee != null ? String(state.advanceFee) : "";
  const hasChanges  =
    name !== (state?.name || "") ||
    advanceFee !== originalFee ||
    status !== (state?.status || "active") ||
    !!iconFile;

  // Style helpers
  const fade = (delay = 0): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.42s ease ${delay}s, transform 0.42s ease ${delay}s`,
  });

  const inputBase = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focused === field ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)",
    border: focused === field
      ? "1.5px solid rgba(16,185,129,0.5)"
      : "1.5px solid rgba(255,255,255,0.08)",
    boxShadow: focused === field ? "0 0 0 3px rgba(16,185,129,0.07)" : "none",
    borderRadius: "10px", color: "#e2e8f0",
    fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif",
    outline: "none", transition: "all 0.18s ease",
  });

  const lbl: React.CSSProperties = {
    display: "block", marginBottom: "8px",
    fontSize: "10px", fontWeight: 700,
    color: "rgba(255,255,255,0.28)",
    letterSpacing: "0.11em", textTransform: "uppercase",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.8)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes popIn    { 0%{opacity:0;transform:scale(.93) translateY(4px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
        input::placeholder { color:rgba(255,255,255,0.16); }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(16,185,129,0.22);border-radius:2px; }
        .inp-lift { transition:transform 0.14s ease; }
        .inp-lift:focus-within { transform:translateY(-1px); }
      `}</style>

      <div style={{ background: "#0a120e", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 64px" }}>

          {/* ── Breadcrumb ─────────────────────────────────────────────── */}
          <div style={{ ...fade(0), display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <button
              onClick={() => navigate("/admin/category")}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 13px", borderRadius: "8px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)", fontSize: "12px", fontWeight: 500,
                cursor: "pointer", transition: "all 0.17s",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "rgba(16,185,129,0.08)";
                b.style.borderColor = "rgba(16,185,129,0.22)";
                b.style.color = "#10b981";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "rgba(255,255,255,0.04)";
                b.style.borderColor = "rgba(255,255,255,0.08)";
                b.style.color = "rgba(255,255,255,0.45)";
              }}
            >
              <ArrowLeftIcon /> Back
            </button>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>/</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>Category Management</span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>/</span>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>Edit</span>
          </div>

          {/* ── Page header ────────────────────────────────────────────── */}
          <div style={{
            ...fade(0.05),
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "24px", flexWrap: "wrap", gap: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
              {/* Live icon preview */}
              <div style={{
                width: "50px", height: "50px", borderRadius: "14px", flexShrink: 0,
                background: iconPreview ? "transparent" : "rgba(16,185,129,0.09)",
                border: "1.5px solid rgba(16,185,129,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                {iconPreview
                  ? <img src={iconPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "20px" }}>{state?.iconEmoji || "📁"}</span>}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <h1 style={{
                    margin: 0, fontFamily: "'Syne',sans-serif",
                    fontSize: "19px", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px",
                  }}>
                    Edit Category
                  </h1>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    padding: "3px 9px", borderRadius: "20px",
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)",
                    color: "#10b981", fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.07em", textTransform: "uppercase",
                  }}>
                    <EditBadgeIcon /> Editing
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(255,255,255,0.32)" }}>
                  Modifying:&nbsp;
                  <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{state?.name || "—"}</span>
                </p>
              </div>
            </div>

            {/* Status summary pills */}
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "6px 13px", borderRadius: "40px",
                background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.22)",
              }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "block", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>Active</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "6px 13px", borderRadius: "40px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "block" }} />
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Disabled</span>
              </div>
            </div>
          </div>

          {/* ── Main card ──────────────────────────────────────────────── */}
          <div style={{
            ...fade(0.1),
            background: "linear-gradient(155deg,rgba(13,22,16,0.98),rgba(8,14,10,0.99))",
            border: "1px solid rgba(16,185,129,0.18)", borderRadius: "20px", overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)",
          }}>
            {/* Accent bar */}
            <div style={{ height: "2.5px", background: "linear-gradient(90deg,#059669,#10b981 45%,#06b6d4 75%,transparent)" }} />

            <div style={{ padding: "26px 28px" }}>

              {/* Section label */}
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                paddingBottom: "16px", marginBottom: "20px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "7px",
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981",
                }}>
                  <TagIcon />
                </div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "13px", color: "#fff" }}>
                  Category Details
                </span>
              </div>

              {/* ── Name + Fee ────────────────────────────────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

                <div className="inp-lift">
                  <label style={lbl}>Category Name</label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                      color: focused === "name" ? "#10b981" : "rgba(255,255,255,0.18)",
                      transition: "color 0.18s", pointerEvents: "none",
                    }}>
                      <TagIcon />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      placeholder="e.g. Engine Repair"
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputBase("name"), height: "44px", paddingLeft: "36px", paddingRight: "12px" }}
                    />
                  </div>
                  {errors.name && (
  <p
    style={{
      color: "#f87171",
      fontSize: "12px",
      marginTop: "6px",
    }}
  >
    {errors.name}
  </p>
)}
                </div>

                <div className="inp-lift">
                  <label style={lbl}>Advance Fee</label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                      color: focused === "fee" ? "#10b981" : "rgba(255,255,255,0.18)",
                      transition: "color 0.18s", pointerEvents: "none",
                    }}>
                      <RupeeIcon />
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={advanceFee}
                      placeholder="0.00"
                      onChange={e => setAdvanceFee(e.target.value)}
                      onFocus={() => setFocused("fee")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputBase("fee"), height: "44px", paddingLeft: "36px", paddingRight: "12px" }}
                    />
                  </div>
                    {errors.advanceFee && (
  <p
    style={{
      color: "#f87171",
      fontSize: "12px",
      marginTop: "6px",
    }}
  >
    {errors.advanceFee}
  </p>
)}
                </div>
              
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", marginBottom: "20px" }} />

              {/* ── Icon + Status ─────────────────────────────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* Icon upload */}
                <div>
                  <label style={lbl}>Category Icon</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      position: "relative", height: "124px", borderRadius: "12px",
                      border: iconPreview
                        ? "1.5px solid rgba(16,185,129,0.32)"
                        : "1.5px dashed rgba(255,255,255,0.1)",
                      background: iconPreview ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "7px",
                      cursor: "pointer", transition: "all 0.18s", overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      const d = e.currentTarget as HTMLDivElement;
                      d.style.borderColor = "rgba(16,185,129,0.42)";
                      d.style.background = "rgba(16,185,129,0.06)";
                    }}
                    onMouseLeave={e => {
                      const d = e.currentTarget as HTMLDivElement;
                      d.style.borderColor = iconPreview ? "rgba(16,185,129,0.32)" : "rgba(255,255,255,0.1)";
                      d.style.background = iconPreview ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)";
                    }}
                  >
                    {iconPreview ? (
                      <>
                        <img src={iconPreview} alt="preview"
                          style={{ width: "58px", height: "58px", objectFit: "cover", borderRadius: "11px" }} />
                        <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>Click to change</span>
                        <button
                          type="button" onClick={clearIcon}
                          style={{
                            position: "absolute", top: "7px", right: "7px",
                            width: "24px", height: "24px", borderRadius: "6px",
                            background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.28)",
                            color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.26)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.14)"; }}
                        >
                          <TrashIcon />
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ color: "rgba(255,255,255,0.18)" }}><ImagePlaceholderIcon /></span>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Click to upload</div>
                          <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.18)", marginTop: "2px" }}>PNG, JPG, SVG · Max 2MB</div>
                        </div>
                        <div style={{
                          padding: "4px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)",
                          color: "#10b981",
                        }}>
                          Upload Image
                        </div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleIconUpload} />
                  <p style={{ margin: "6px 0 0", fontSize: "10.5px", color: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <InfoIcon /> Leave unchanged to keep current icon
                  </p>
                </div>

                {/* Status selector */}
                <div>
                  <label style={lbl}>Status</label>

                  {/* Active */}
                  <div
                    onClick={() => setStatus("active")}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "13px 15px", borderRadius: "11px", marginBottom: "8px",
                      background: status === "active" ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.025)",
                      border: status === "active"
                        ? "1.5px solid rgba(16,185,129,0.3)" : "1.5px solid rgba(255,255,255,0.07)",
                      cursor: "pointer", transition: "all 0.18s",
                    }}
                    onMouseEnter={e => {
                      if (status !== "active") {
                        const d = e.currentTarget as HTMLDivElement;
                        d.style.background = "rgba(16,185,129,0.04)";
                        d.style.borderColor = "rgba(16,185,129,0.18)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (status !== "active") {
                        const d = e.currentTarget as HTMLDivElement;
                        d.style.background = "rgba(255,255,255,0.025)";
                        d.style.borderColor = "rgba(255,255,255,0.07)";
                      }
                    }}
                  >
                    <div style={{
                      width: "17px", height: "17px", borderRadius: "50%", flexShrink: 0,
                      background: status === "active" ? "linear-gradient(135deg,#059669,#10b981)" : "transparent",
                      border: status === "active" ? "none" : "2px solid rgba(255,255,255,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: status === "active" ? "0 2px 8px rgba(16,185,129,0.35)" : "none",
                      transition: "all 0.18s",
                    }}>
                      {status === "active" && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: status === "active" ? "#fff" : "rgba(255,255,255,0.4)" }}>
                          Active
                        </span>
                        {status === "active" && (
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "block", animation: "pulseDot 2s infinite" }} />
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.24)", marginTop: "1px" }}>Visible to customers</div>
                    </div>
                  </div>

                  {/* Inactive */}
                  <div
                    onClick={() => setStatus("inactive")}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "13px 15px", borderRadius: "11px",
                      background: status === "inactive" ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.025)",
                      border: status === "inactive"
                        ? "1.5px solid rgba(239,68,68,0.24)" : "1.5px solid rgba(255,255,255,0.07)",
                      cursor: "pointer", transition: "all 0.18s",
                    }}
                    onMouseEnter={e => {
                      if (status !== "inactive") {
                        const d = e.currentTarget as HTMLDivElement;
                        d.style.background = "rgba(239,68,68,0.03)";
                        d.style.borderColor = "rgba(239,68,68,0.14)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (status !== "inactive") {
                        const d = e.currentTarget as HTMLDivElement;
                        d.style.background = "rgba(255,255,255,0.025)";
                        d.style.borderColor = "rgba(255,255,255,0.07)";
                      }
                    }}
                  >
                    <div style={{
                      width: "17px", height: "17px", borderRadius: "50%", flexShrink: 0,
                      background: status === "inactive" ? "rgba(239,68,68,0.75)" : "transparent",
                      border: status === "inactive" ? "none" : "2px solid rgba(255,255,255,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.18s",
                    }}>
                      {status === "inactive" && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: status === "inactive" ? "#fca5a5" : "rgba(255,255,255,0.4)" }}>
                        Inactive
                      </span>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.24)", marginTop: "1px" }}>Hidden from customers</div>
                    </div>
                  </div>

                  {/* Original status hint */}
                  <div style={{
                    marginTop: "9px", padding: "8px 12px", borderRadius: "9px",
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", gap: "7px",
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.25)" }}><InfoIcon /></span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                      Original:&nbsp;
                      <span style={{ fontWeight: 700, color: state?.status === "active" ? "#10b981" : "#f87171" }}>
                        {state?.status || "—"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Unsaved changes ───────────────────────────────────── */}
              {hasChanges && (
                <div style={{
                  marginTop: "18px", padding: "11px 15px", borderRadius: "11px",
                  background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)",
                  animation: "popIn 0.22s ease both",
                  display: "flex", alignItems: "center", gap: "11px",
                }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", animation: "pulseDot 2s infinite", display: "block", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#10b981", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Unsaved Changes
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {name !== (state?.name || "") && <Chip>Name</Chip>}
                      {advanceFee !== originalFee && <Chip>Advance Fee</Chip>}
                      {status !== (state?.status || "active") && <Chip>Status</Chip>}
                      {iconFile && <Chip>Icon</Chip>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Alerts ───────────────────────────────────────────── */}
              {errors.general && (
                <div style={{
                  marginTop: "14px", padding: "11px 15px", borderRadius: "11px",
                  background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex", alignItems: "center", gap: "9px",
                  animation: "popIn 0.22s ease both",
                }}>
                  <span style={{ color: "#f87171", flexShrink: 0 }}><InfoIcon /></span>
                  <span style={{ fontSize: "12.5px", color: "#fca5a5" }}>{errors.general}</span>
                </div>
              )}
              {saved && (
                <div style={{
                  marginTop: "14px", padding: "11px 15px", borderRadius: "11px",
                  background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex", alignItems: "center", gap: "9px",
                  animation: "popIn 0.22s ease both",
                }}>
                  <span style={{ color: "#34d399", flexShrink: 0 }}><CheckIcon /></span>
                  <span style={{ fontSize: "12.5px", color: "#6ee7b7" }}>Category updated — redirecting…</span>
                </div>
              )}
            </div>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <div style={{
              padding: "16px 28px 22px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.17)", fontFamily: "monospace" }}>
                ID: {id || state?.id}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/admin/category")}
                  style={{
                    padding: "9px 20px", borderRadius: "9px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.45)", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.17s",
                  }}
                  onMouseEnter={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(255,255,255,0.08)";
                    b.style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(255,255,255,0.04)";
                    b.style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || !hasChanges}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "9px 22px", borderRadius: "9px",
                    background: saving || !hasChanges
                      ? "rgba(16,185,129,0.28)"
                      : "linear-gradient(135deg,#059669,#10b981)",
                    border: "none", color: "#fff",
                    fontSize: "13px", fontWeight: 700, letterSpacing: "0.04em",
                    cursor: saving || !hasChanges ? "not-allowed" : "pointer",
                    fontFamily: "'Syne',sans-serif",
                    boxShadow: saving || !hasChanges ? "none" : "0 4px 16px rgba(16,185,129,0.3)",
                    transition: "all 0.18s",
                    opacity: !hasChanges && !saving ? 0.5 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!saving && hasChanges) {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.transform = "translateY(-1px)";
                      b.style.boxShadow = "0 7px 22px rgba(16,185,129,0.42)";
                    }
                  }}
                  onMouseLeave={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "translateY(0)";
                    b.style.boxShadow = "0 4px 16px rgba(16,185,129,0.3)";
                  }}
                >
                  {saving ? (
                    <>
                      <svg style={{ animation: "spin .7s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <><CheckIcon /> Update Category</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Danger zone ────────────────────────────────────────────── */}
          <div style={{
            ...fade(0.16),
            marginTop: "14px", padding: "15px 20px", borderRadius: "13px",
            background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
          }}>
            <div>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "rgba(248,113,113,0.72)", marginBottom: "2px" }}>
                Danger Zone
              </div>
              <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.2)" }}>
                Disabling hides this category from all customers immediately.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatus(s => s === "inactive" ? "active" : "inactive")}
              style={{
                padding: "7px 15px", borderRadius: "8px", whiteSpace: "nowrap",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.17s",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "rgba(239,68,68,0.18)";
                b.style.borderColor = "rgba(239,68,68,0.36)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "rgba(239,68,68,0.08)";
                b.style.borderColor = "rgba(239,68,68,0.2)";
              }}
            >
              {status === "inactive" ? "Re-enable Category" : "Disable Category"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}