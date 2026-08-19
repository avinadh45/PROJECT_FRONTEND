import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface VehicleFormData {
  vehicleType: string;
  fuelType: string;
  brand: string;
  model: string;
  year: string;
  odometer: string;
  lastNotedKilometer: string;
  registrationNumber: string;
  insuranceExpiry: string;
  rcNumber: string;
  rcDocument: File | null;
  pucDocument: File | null;
  vehiclePhoto: File | null;
}

const VEHICLE_TYPES = ["Car", "Bike", "Truck", "Van", "SUV"];

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/repair" },
  { label: "History", href: "/history" },
];

/* ─── Tokens ────────────────────────────────────────────────────────────── */
const C = {
  bg: "#050d1a",
  surface: "rgba(255,255,255,0.035)",
  border: "rgba(255,255,255,0.07)",
  borderFocus: "rgba(99,179,237,0.7)",
  accent: "#3b9edd",
  accentDim: "rgba(59,158,221,0.15)",
  accentGlow: "rgba(59,158,221,0.25)",
  text: "#e8f0f8",
  textMuted: "#4e6077",
  textSub: "#7a95b0",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.12)",
  violet: "#8b7cf6",
};

/* ─── Reveal ────────────────────────────────────────────────────────────── */
function useReveal(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, [delay]);
  return on;
}
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const on = useReveal(delay);
  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0)" : "translateY(22px)",
      transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
      ...style,
    }}>{children}</div>
  );
}

/* ─── Field label ───────────────────────────────────────────────────────── */
function FL({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.textMuted, marginBottom: 7 }}>{children}</label>;
}

/* ─── Inputs ────────────────────────────────────────────────────────────── */
function GInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      borderRadius: 10,
      background: focused ? "rgba(59,158,221,0.04)" : C.surface,
      border: `1px solid ${focused ? C.borderFocus : C.border}`,
      boxShadow: focused ? `0 0 0 3px ${C.accentGlow}, 0 0 18px rgba(59,158,221,0.08)` : "none",
      transition: "all 0.22s ease",
    }}>
      <input
        placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", outline: "none", padding: "11px 14px", fontSize: 13, color: C.text, fontFamily: "inherit" }}
      />
    </div>
  );
}
function GSelect({ placeholder, value, options, onChange }: { placeholder: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: "relative", borderRadius: 10,
      background: focused ? "rgba(59,158,221,0.04)" : C.surface,
      border: `1px solid ${focused ? C.borderFocus : C.border}`,
      boxShadow: focused ? `0 0 0 3px ${C.accentGlow}, 0 0 18px rgba(59,158,221,0.08)` : "none",
      transition: "all 0.22s ease",
    }}>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", outline: "none", appearance: "none", padding: "11px 36px 11px 14px", fontSize: 13, color: value ? C.text : C.textMuted, fontFamily: "inherit", cursor: "pointer" }}
      >
        <option value="" disabled style={{ background: "#0a1626" }}>{placeholder}</option>
        {options.map(o => <option key={o} value={o} style={{ background: "#0a1626" }}>{o}</option>)}
      </select>
      <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: C.textMuted }} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18,
      backdropFilter: "blur(20px)", boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 12px 40px rgba(0,0,0,0.35)",
      overflow: "hidden", position: "relative", ...style,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(59,158,221,0.5) 40%, rgba(99,102,241,0.5) 60%, transparent 100%)" }} />
      {children}
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────────────────── */
function SecHead({ num, title, icon }: { num: number; title: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 24px 18px" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, rgba(59,158,221,0.2), rgba(99,102,241,0.15))", border: "1px solid rgba(59,158,221,0.3)", boxShadow: "0 0 18px rgba(59,158,221,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: C.accent, fontFamily: "monospace", background: C.accentDim, border: `1px solid ${C.accentGlow}`, borderRadius: 5, padding: "2px 6px" }}>0{num}</span>
        <span style={{ color: C.text, fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>{title}</span>
      </div>
    </div>
  );
}

/* ─── Upload zone ───────────────────────────────────────────────────────── */
function UpZone({ sublabel, hint, icon, file, inputRef, onChange }: {
  sublabel: string; hint: string; icon: React.ReactNode;
  file: File | null; inputRef: React.RefObject<HTMLInputElement | null>; onChange: (f: File | null) => void;
}) {
  const [drag, setDrag] = useState(false);
  const [hov, setHov] = useState(false);
  const active = drag || hov;
  return (
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 11, color: C.textSub, marginBottom: 8, fontWeight: 600 }}>{sublabel}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onChange(f); }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          border: `1.5px dashed ${file ? "rgba(52,211,153,0.45)" : drag ? "rgba(59,158,221,0.7)" : active ? "rgba(59,158,221,0.4)" : "rgba(255,255,255,0.09)"}`,
          borderRadius: 12, background: file ? C.greenDim : drag ? "rgba(59,158,221,0.07)" : active ? "rgba(59,158,221,0.04)" : "rgba(255,255,255,0.02)",
          padding: "26px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 9,
          cursor: "pointer", transition: "all 0.2s", textAlign: "center",
          boxShadow: active && !file ? "0 0 0 3px rgba(59,158,221,0.08)" : "none",
        }}
      >
        {file ? (
          <>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.greenDim, border: "1px solid rgba(52,211,153,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" fill="none" stroke={C.green} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p style={{ color: C.green, fontSize: 11, fontWeight: 600, wordBreak: "break-all", maxWidth: "90%" }}>{file.name}</p>
            <p style={{ color: C.textMuted, fontSize: 10 }}>Click to replace</p>
          </>
        ) : (
          <>
            {icon}
            <div>
              <p style={{ color: active ? C.text : C.textSub, fontSize: 12, fontWeight: 500, transition: "color 0.2s" }}>Click to upload or drag & drop</p>
              <p style={{ color: C.textMuted, fontSize: 10, marginTop: 4 }}>{hint}</p>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => onChange(e.target.files?.[0] ?? null)} />
      </div>
    </div>
  );
}

/* ─── Live preview card (right rail) ───────────────────────────────────── */
function LivePreview({ form }: { form: VehicleFormData }) {
  const filled = [form.brand, form.model, form.year, form.registrationNumber].filter(Boolean).length;
  const total = 4;
  const pct = Math.round((filled / total) * 100);
  return (
    <Card style={{ position: "sticky", top: 92 }}>
      <div style={{ padding: "22px 22px 0" }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>Live Preview</p>
        <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 18 }}>Your vehicle card updates as you type</p>
      </div>

      {/* Mini vehicle card preview */}
      <div style={{ padding: "0 22px" }}>
        <div style={{
          borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.025)",
          overflow: "hidden", position: "relative",
        }}>
          {/* Photo area */}
          <div style={{
            height: 110, position: "relative",
            background: form.vehiclePhoto
              ? `url(${URL.createObjectURL(form.vehiclePhoto)}) center/cover`
              : "linear-gradient(135deg, rgba(59,158,221,0.08), rgba(99,102,241,0.06))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {!form.vehiclePhoto && (
              <svg width="28" height="28" fill="none" stroke="rgba(59,158,221,0.35)" strokeWidth="1.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 16H6.5A1.5 1.5 0 015 14.5v-4a3 3 0 013-3h5l3 3h3.5A1.5 1.5 0 0121 12v2.5a1.5 1.5 0 01-1.5 1.5H18" />
              </svg>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,13,26,0.85) 0%, transparent 55%)" }} />
            {form.registrationNumber && (
              <div style={{ position: "absolute", bottom: 8, left: 10, fontFamily: "monospace", fontSize: 10, color: "#dbeafe", background: "rgba(5,13,26,0.7)", padding: "2px 7px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.1)" }}>
                {form.registrationNumber}
              </div>
            )}
          </div>
          {/* Info */}
          <div style={{ padding: "12px 14px 14px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: form.brand || form.model ? C.text : C.textMuted, marginBottom: 4 }}>
              {form.brand || form.model ? `${form.brand} ${form.model}`.trim() : "Your vehicle name"}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 10, color: C.textMuted }}>{form.year || "Year"}</span>
              <span style={{ fontSize: 10, color: C.textMuted }}>•</span>
              <span style={{ fontSize: 10, color: C.textMuted }}>{form.fuelType || "Fuel type"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion meter */}
      <div style={{ padding: "20px 22px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>Profile completeness</span>
          <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 4,
            background: "linear-gradient(90deg, #2563eb, #3b9edd, #6366f1)",
            boxShadow: `0 0 10px ${C.accentGlow}`,
            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 9 }}>
          {[
            { label: "Vehicle specs", done: !!(form.brand && form.model) },
            { label: "Registration details", done: !!form.registrationNumber },
            { label: "Documents uploaded", done: !!(form.rcDocument || form.pucDocument) },
            { label: "Photo added", done: !!form.vehiclePhoto },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
                background: item.done ? C.greenDim : "rgba(255,255,255,0.04)",
                border: `1px solid ${item.done ? "rgba(52,211,153,0.4)" : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s",
              }}>
                {item.done && <svg width="8" height="8" fill="none" stroke={C.green} strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span style={{ fontSize: 11, color: item.done ? C.textSub : C.textMuted, transition: "color 0.25s" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div style={{ margin: "0 22px 22px", padding: "13px 14px", borderRadius: 11, background: "rgba(139,124,246,0.07)", border: "1px solid rgba(139,124,246,0.18)" }}>
        <div style={{ display: "flex", gap: 7, marginBottom: 5 }}>
          <svg width="13" height="13" fill="none" stroke={C.violet} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z"/></svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.violet, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick tip</span>
        </div>
        <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>A clear front-angle photo helps mechanics recognize your vehicle instantly at drop-off.</p>
      </div>
    </Card>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "rgba(2,5,12,0.97)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 32px 26px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, marginBottom: 38 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#22c55e" }}>Moto</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>cline</span>
            </div>
            <p style={{ color: C.textMuted, fontSize: 11, lineHeight: 1.75 }}>
              Professional vehicle care and management, simplified. Track service history, book repairs, and maintain your vehicle's health all in one place.
            </p>
          </div>
          {[
            { title: "Services", items: ["Emergency Repair", "Periodic Service", "Body Works", "RSA Services"] },
            { title: "Company", items: ["About Us", "Our Team", "Partners", "Contact"] },
            { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ color: C.text, fontSize: 11, fontWeight: 700, marginBottom: 13 }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {col.items.map(item => (
                  <p key={item} style={{ color: C.textMuted, fontSize: 11, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.textSub)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.04)`, paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "#1e293b", fontSize: 10 }}>© 2026 Motocline Technologies Private Limited. All rights reserved.</p>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              <svg key="g" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
              <svg key="x" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
              <svg key="ig" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
            ].map((icon, i) => (
              <span key={i} style={{ color: "#1e293b", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#64748b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1e293b")}>{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { logoutuser,handleAddVehicle,loading:vehicleLoading,errors:vehicleErrors,setErrors: setVehicleErrors } = useAuth();
  const fieldError = (key: string) => vehicleErrors[key]?.[0];
  const rcRef = useRef<HTMLInputElement>(null);
  const pucRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<VehicleFormData>({
    vehicleType: "", fuelType: "", brand: "", model: "", year: "",
    odometer: "", lastNotedKilometer: "", registrationNumber: "",
    insuranceExpiry: "", rcNumber: "", rcDocument: null, pucDocument: null, vehiclePhoto: null,
  });

  const set = (k: keyof VehicleFormData, v: string | File | null) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData()
      formData.append("vehicleType",form.vehicleType)
      formData.append("FuelType",form.fuelType)
      formData.append("brand",form.brand)
      formData.append("model",form.model)
      formData.append("year",form.year)
      formData.append("odometer",form.odometer)
      formData.append("lastNotedKms",form.lastNotedKilometer)
      formData.append("RegistrationNumber",form.registrationNumber)
      formData.append("insuranceExpiryDate", form.insuranceExpiry);
      formData.append("RCNumber",form.rcNumber) 
      if(form.rcDocument){
        formData.append("RCDocument",form.rcDocument)
      }
      if(form.pucDocument){
        formData.append("POCDocument",form.pucDocument)
      }
      if(form.vehiclePhoto){
        formData.append("vehicleImage",form.vehiclePhoto)
      }
      await handleAddVehicle(formData)
      setSubmitted(true)
      setTimeout(()=> setSubmitted(false),3000)
    } catch (error) {
      
    }finally{
      setSubmitting(false)
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, position: "relative" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes floatSlow { 0%,100% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-14px) translateX(8px); } }
        ::placeholder { color: #2a3f55 !important; }
        @media (max-width: 980px) {
          .av-grid { grid-template-columns: 1fr !important; }
          .av-rail { display: none !important; }
        }
      `}</style>

      {/* ── Background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 8% -8%, rgba(37,99,235,0.16) 0%, transparent 55%),
            radial-gradient(ellipse 60% 45% at 95% 15%, rgba(99,102,241,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 60% 45% at 100% 100%, rgba(59,158,221,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 0% 70%, rgba(139,124,246,0.07) 0%, transparent 55%),
            ${C.bg}
          `,
        }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(59,158,221,0.6) 35%, rgba(99,102,241,0.7) 50%, rgba(59,158,221,0.6) 65%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: "14%", left: "3%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)", animation: "float 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "55%", right: "4%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", animation: "floatSlow 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "30%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,124,246,0.06) 0%, transparent 70%)", animation: "float 10s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar links={navLinks} userInitials="AK" userName="Arun Kumar" userEmail="arun@email.com" notifications={[]} onLogout={logoutuser} />

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "88px 32px 60px" }}>

          {/* ── Hero header ── */}
          <Reveal delay={0}>
            <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 12, padding: "4px 10px", borderRadius: 20, background: C.accentDim, border: `1px solid ${C.accentGlow}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase" }}>Vehicle Registration</span>
                </div>
                <h1 style={{ color: "#f0f6ff", fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 10px" }}>
                  Add New Vehicle
                </h1>
                <p style={{ color: C.textSub, fontSize: 13, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
                  Complete the details below to register your vehicle to Motocline services.
                </p>
              </div>

              {/* Progress steps moved to top-right, fills space */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {["Specs", "Docs", "Photo"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 20,
                      background: i === 0 ? C.accentDim : "rgba(255,255,255,0.03)",
                      border: `1px solid ${i === 0 ? C.accentGlow : C.border}`,
                    }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: i === 0 ? C.accent : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: i === 0 ? "#fff" : C.textMuted, boxShadow: i === 0 ? `0 0 10px ${C.accentGlow}` : "none" }}>{i + 1}</div>
                      <span style={{ fontSize: 11, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.text : C.textMuted }}>{s}</span>
                    </div>
                    {i < 2 && <div style={{ width: 18, height: 1, background: C.border }} />}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Two column grid: form + live preview rail ── */}
          <div className="av-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

            {/* LEFT — form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Section 1 */}
              <Reveal delay={100}>
                <Card>
                  <SecHead num={1} title="Vehicle Specifications"
                    icon={<svg width="16" height="16" fill="none" stroke="#3b9edd" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M13 16H6.5A1.5 1.5 0 015 14.5v-4a3 3 0 013-3h5l3 3h2.5A1.5 1.5 0 0120 12v2.5a1.5 1.5 0 01-1.5 1.5H17"/></svg>}
                  />
                  <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                      <div><FL>Vehicle Type</FL><GSelect placeholder="e.g Car" value={form.vehicleType} options={VEHICLE_TYPES} onChange={v => set("vehicleType", v)} />
                        {fieldError("vehicleType") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("vehicleType")}</p>}
                      </div>
                      <div><FL>Fuel Type</FL><GInput placeholder="e.g Petrol" value={form.fuelType} onChange={v => set("fuelType", v)} />
                         {fieldError("FuelType") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("FuelType")}</p>}
                      </div>
                      <div><FL>Year</FL><GInput placeholder="YYYY" value={form.year} onChange={v => set("year", v)} />
                        {fieldError("year") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("year")}</p>}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div><FL>Brand</FL><GInput placeholder="e.g BMW, Toyota" value={form.brand} onChange={v => set("brand", v)} />
                        {fieldError("brand") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("brand")}</p>}
                      </div>
                      <div><FL>Model</FL><GInput placeholder="e.g X5, Corolla" value={form.model} onChange={v => set("model", v)} />
                        {fieldError("model") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("model")}</p>}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div><FL>Odometer (km)</FL><GInput placeholder="Current mileage" value={form.odometer} onChange={v => set("odometer", v)} />
                        {fieldError("odometer") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("odometer")}</p>}
                      </div>
                      <div><FL>Last Noted Kilometer</FL><GInput placeholder="eg 24000" value={form.lastNotedKilometer} onChange={v => set("lastNotedKilometer", v)} />
                        {fieldError("lastNotedKms") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("lastNotedKms")}</p>}
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>

              {/* Section 2 */}
              <Reveal delay={180}>
                <Card>
                  <SecHead num={2} title="Registration & Documents"
                    icon={<svg width="16" height="16" fill="none" stroke="#3b9edd" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                  />
                  <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                      <div><FL>Registration Number</FL><GInput placeholder="ABC-1234" value={form.registrationNumber} onChange={v => set("registrationNumber", v)} />
                        {fieldError("RegistrationNumber") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("RegistrationNumber")}</p>}
                      </div>
                      <div><FL>Insurance Expiry Date</FL><GInput placeholder="mm/dd/yyyy" value={form.insuranceExpiry} onChange={v => set("insuranceExpiry", v)} />
                      {fieldError("insuranceExpiryDate") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("insuranceExpiryDate")}</p>}
                      </div>
                      <div><FL>RC Number</FL><GInput placeholder="Registration Card No." value={form.rcNumber} onChange={v => set("rcNumber", v)} />
                        {fieldError("RCNumber") && <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>{fieldError("RCNumber")}</p>}
                      </div>
                    </div>

                    <div style={{ borderRadius: 12, border: `1px solid rgba(255,255,255,0.06)`, background: "rgba(255,255,255,0.015)", padding: "16px 18px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.textMuted, marginBottom: 14 }}>Upload Documents (RC / POC)</p>
                      <div style={{ display: "flex", gap: 14 }}>
                        <UpZone sublabel="Upload Documents (RC)" hint="PDF, PNG, JPG or WEBP — max 10MB" file={form.rcDocument} inputRef={rcRef} onChange={f => set("rcDocument", f)}
                          icon={<div style={{ width: 40, height: 40, borderRadius: 11, background: C.accentDim, border: `1px solid ${C.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="18" height="18" fill="none" stroke={C.accent} strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>}
                        />
                        <UpZone sublabel="POC Document" hint="PDF, JPG — max 5MB" file={form.pucDocument} inputRef={pucRef} onChange={f => set("pucDocument", f)}
                          icon={<div style={{ width: 40, height: 40, borderRadius: 11, background: C.accentDim, border: `1px solid ${C.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="18" height="18" fill="none" stroke={C.accent} strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg></div>}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>

              {/* Section 3 */}
              <Reveal delay={260}>
                <Card>
                  <SecHead num={3} title="Vehicle Photo"
                    icon={<svg width="16" height="16" fill="none" stroke="#3b9edd" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                  />
                  <div style={{ padding: "0 24px 24px" }}>
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                      <div
                        onClick={() => photoRef.current?.click()}
                        style={{ width: 160, height: 116, borderRadius: 12, flexShrink: 0, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", overflow: "hidden", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentGlow; e.currentTarget.style.background = C.accentDim; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.accentGlow}`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {form.vehiclePhoto ? (
                          <img src={URL.createObjectURL(form.vehiclePhoto)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <>
                            <svg width="26" height="26" fill="none" stroke={C.textMuted} strokeWidth="1.4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <p style={{ color: C.textMuted, fontSize: 9.5, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.45 }}>Preview image<br/>will appear here</p>
                          </>
                        )}
                        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => set("vehiclePhoto", e.target.files?.[0] ?? null)} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <p style={{ color: C.text, fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 8 }}>Add a clear photo of your vehicle</p>
                        <p style={{ color: C.textSub, fontSize: 12, lineHeight: 1.7, marginBottom: 18 }}>Photos help mechanics identify your vehicle quickly during service visits. Front or side profile recommended.</p>
                        <button type="button" onClick={() => photoRef.current?.click()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 600, color: C.accent, padding: "8px 16px", borderRadius: 9, background: C.accentDim, border: `1px solid ${C.accentGlow}`, cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,158,221,0.22)"; e.currentTarget.style.boxShadow = `0 0 14px ${C.accentGlow}`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.accentDim; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          Choose Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>

              {/* Action row */}
              <Reveal delay={340}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 2px" }}>
                  <GoBackBtn onClick={() => navigate(-1)} />
                  <ConfirmBtn submitting={submitting || vehicleLoading} done={submitted} />
                </div>
              </Reveal>

            </form>

            {/* RIGHT — sticky live preview rail */}
            <div className="av-rail">
              <Reveal delay={220}>
                <LivePreview form={form} />
              </Reveal>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

/* ─── Buttons ───────────────────────────────────────────────────────────── */
function GoBackBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 600, color: hov ? C.text : C.textSub, padding: "9px 18px", borderRadius: 10, background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${hov ? "rgba(255,255,255,0.12)" : C.border}`, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
    >
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      Go Back
    </button>
  );
}
function ConfirmBtn({ submitting, done }: { submitting: boolean; done: boolean }) {
  const [hov, setHov] = useState(false);
  const base = done ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#2563eb 0%,#3b9edd 60%,#6366f1 100%)";
  return (
    <button type="submit" disabled={submitting} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#fff",
        padding: "10px 24px", borderRadius: 11, background: base,
        boxShadow: hov && !submitting ? "0 0 32px rgba(59,130,246,0.55), 0 6px 22px rgba(0,0,0,0.45)" : "0 3px 14px rgba(0,0,0,0.45)",
        transform: hov && !submitting ? "translateY(-2px)" : "translateY(0)",
        border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.8 : 1,
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)", fontFamily: "inherit", letterSpacing: "-0.01em",
      }}
    >
      {submitting ? (
        <><svg style={{ animation: "spin 0.8s linear infinite" }} width="13" height="13" fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity: 0.8 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
      ) : done ? (
        <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Saved!</>
      ) : (
        <>Confirm Vehicle<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></>
      )}
    </button>
  );
}