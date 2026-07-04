// AdminLogin.tsx
import { useState, useEffect } from "react";
import { useAdminAuth } from '../hook/useAdminAuth';
// ── Icons ──────────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EyeOnIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="url(#sg)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981"/>
        <stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const SpinIcon = () => (
  <svg
    style={{ animation: "adminSpin 0.75s linear infinite" }}
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// ── Props ──────────────────────────────────────────────────────────────────────
// interface AdminLoginProps {
//   onSubmit: (data: { email: string; password: string }) => void
//   onGoogle?:  () => void;
//   onForgot?:  () => void;
//   loading?:   boolean;
// error: string | null
// }

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const [email,    setEmail]    = useState(""); 
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<"email" | "pass" | null>(null);
  const [mounted,  setMounted]  = useState(false);
const {login,loading,error} = useAdminAuth()
  // useEffect(() => {
  //   const t = setTimeout(() => setMounted(true), 40);
  //   return () => clearTimeout(t);
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   try {
    await login({email,password});
    window.location.href = "/admin/dashboard"
   } catch (error) {
    console.error(error);
    
   }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const inputWrap = (field: "email" | "pass"): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "10px",
    height: "44px", borderRadius: "9px", padding: "0 13px",
    background: focused === field ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.04)",
    border: focused === field ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.09)",
    boxShadow: focused === field ? "0 0 0 3px rgba(16,185,129,0.08)" : "none",
    transition: "all 0.18s ease",
    cursor: "text",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes adminCardIn { from{opacity:0;transform:translateY(24px) scale(.982)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes adminFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adminSpin   { to{transform:rotate(360deg)} }
        @keyframes adminPulse  { 0%,100%{opacity:.65} 50%{opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color:rgba(255,255,255,0.2); }
        input:focus { outline:none; }
      `}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "#0a0f1a",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background layers ── */}
        <div style={{ position:"fixed",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse 70% 60% at 50% 100%, rgba(5,46,22,0.75) 0%, transparent 70%)",
          animation:"adminPulse 8s ease-in-out infinite" }}/>
        <div style={{ position:"fixed",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse 45% 40% at 8% 5%, rgba(16,185,129,0.09) 0%, transparent 55%)" }}/>
        <div style={{ position:"fixed",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse 40% 35% at 95% 95%, rgba(6,182,212,0.07) 0%, transparent 55%)" }}/>
        {/* Subtle grid */}
        <div style={{ position:"fixed",inset:0,pointerEvents:"none",opacity:0.025,
          backgroundImage:`linear-gradient(rgba(16,185,129,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.6) 1px,transparent 1px)`,
          backgroundSize:"48px 48px" }}/>

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-6 flex-shrink-0"
          style={{ height:"52px", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"relative", zIndex:10 }}>
          <div/>

          {/* ── Logo — matches all previous pages: cyan M-box + wordmark ── */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:"linear-gradient(135deg, #22d3ee, #0891b2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:16, color:"#000",
              boxShadow:"0 4px 12px rgba(34,211,238,0.35)",
              fontFamily:"'Syne',sans-serif",
            }}>M</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#fff", letterSpacing:"-.3px" }}>
              Moto<span style={{ color:"#22d3ee" }}>Cline</span>
            </span>
          </div>

          {/* Admin badge */}
          <div style={{ padding:"3px 10px", borderRadius:"100px",
            background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)",
            fontSize:"10.5px", fontWeight:600, color:"rgba(16,185,129,0.8)",
            letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
            Admin
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10"
          style={{ position:"relative", zIndex:1 }}>

          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center mb-7" style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            <div className="flex items-center justify-center mb-4" style={{
              width:"58px", height:"58px", borderRadius:"16px",
              background:"linear-gradient(135deg,rgba(16,185,129,0.14),rgba(6,182,212,0.08))",
              border:"1px solid rgba(16,185,129,0.28)",
              boxShadow:"0 0 40px rgba(16,185,129,0.14)",
            }}>
              <ShieldIcon/>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:"clamp(1.55rem,3.5vw,2rem)", color:"#fff",
              letterSpacing:"-.5px", marginBottom:"7px" }}>
              Welcome Back
            </h1>
            <p style={{ fontSize:"13.5px", color:"rgba(255,255,255,0.38)", fontFamily:"'DM Sans',sans-serif" }}>
              Enterprise-grade fleet management solution
            </p>
          </div>

          {/* ── Card ── */}
          <div style={{
            width:"100%", maxWidth:"400px",
            background:"linear-gradient(160deg,rgba(10,18,28,0.97) 0%,rgba(8,14,22,0.99) 100%)",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"18px", padding:"28px 26px 24px",
            backdropFilter:"blur(16px)",
            boxShadow:"0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.05) inset",
            animation:"adminCardIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
          }}>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 mb-5"
                style={{ background:"rgba(239,68,68,0.09)", border:"1px solid rgba(239,68,68,0.25)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
                </svg>
                <span style={{ fontSize:"13px", color:"#f87171", fontFamily:"'DM Sans',sans-serif" }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Google SSO */}
              <button
                type="button"
                // onClick={() => onGoogle?.()}
                className="w-full flex items-center justify-center gap-2.5 rounded-[10px] mb-5 transition-all duration-200"
                style={{
                  height:"42px",
                  background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  color:"rgba(255,255,255,0.75)",
                  fontSize:"13.5px", fontWeight:500,
                  fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <GoogleIcon/>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.07)" }}/>
                <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.24)", letterSpacing:"0.08em",
                  textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>or</span>
                <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.07)" }}/>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label style={{ display:"block", marginBottom:"7px", fontSize:"11px", fontWeight:700,
                  color:"rgba(255,255,255,0.4)", letterSpacing:"0.09em", textTransform:"uppercase",
                  fontFamily:"'DM Sans',sans-serif" }}>
                  Email Address
                </label>
                <div style={inputWrap("email")}
                  onClick={() => (document.getElementById("admin-email") as HTMLInputElement)?.focus()}>
                  <span style={{ color: focused==="email" ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.25)",
                    flexShrink:0, transition:"color 0.18s" }}>
                    <MailIcon/>
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    style={{ background:"transparent", border:"none", outline:"none", color:"#fff",
                      fontSize:"13.5px", flex:1, fontFamily:"'DM Sans',sans-serif" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)",
                    letterSpacing:"0.09em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
                    Password
                  </label>
                  <button
                    type="button"
                    // onClick={() => onForgot?.()}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:"12px",
                      color:"#10b981", fontWeight:500, fontFamily:"'DM Sans',sans-serif",
                      padding:0, transition:"color 0.18s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#34d399")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#22d3ee")}
                  >
                   
                  </button>
                </div>
                <div style={inputWrap("pass")}
                  onClick={() => (document.getElementById("admin-pass") as HTMLInputElement)?.focus()}>
                  <span style={{ color: focused==="pass" ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.25)",
                    flexShrink:0, transition:"color 0.18s" }}>
                    <LockIcon/>
                  </span>
                  <input
                    id="admin-pass"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ background:"transparent", border:"none", outline:"none", color:"#fff",
                      fontSize:"13.5px", flex:1, fontFamily:"'DM Sans',sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{ background:"none", border:"none", cursor:"pointer", padding:"2px",
                      color: showPass ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.28)",
                      display:"flex", alignItems:"center", flexShrink:0, transition:"color 0.18s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                    onMouseLeave={e => (e.currentTarget.style.color = showPass ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.28)")}
                  >
                    {showPass ? <EyeOnIcon/> : <EyeOffIcon/>}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2.5 mb-5 mt-1">
                <button
                  type="button"
                  onClick={() => setRemember(r => !r)}
                  style={{
                    width:"17px", height:"17px", borderRadius:"5px",
                    background: remember ? "linear-gradient(135deg,#10b981,#06b6d4)" : "rgba(255,255,255,0.05)",
                    border: remember ? "1px solid rgba(16,185,129,0.6)" : "1px solid rgba(255,255,255,0.14)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", flexShrink:0,
                    boxShadow: remember ? "0 0 8px rgba(16,185,129,0.3)" : "none",
                    transition:"all 0.18s", color:"#fff",
                  }}
                >
                  {remember && <CheckIcon/>}
                </button>
                <span
                  onClick={() => setRemember(r => !r)}
                  style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", cursor:"pointer",
                    userSelect:"none", fontFamily:"'DM Sans',sans-serif" }}
                >
                  Remember this device
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height:"46px", borderRadius:"10px", border:"none",
                  background: canSubmit
                    ? "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)"
                    : "rgba(16,185,129,0.25)",
                  color: canSubmit ? "#fff" : "rgba(255,255,255,0.3)",
                  fontFamily:"'Syne',sans-serif",
                  fontWeight:700, fontSize:"14px", letterSpacing:"0.03em",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit ? "0 4px 22px rgba(34,211,238,0.35), 0 0 0 1px rgba(16,185,129,0.25)" : "none",
                  transition:"transform 0.2s, box-shadow 0.2s, background 0.2s",
                  position:"relative", overflow:"hidden",
                }}
                onMouseEnter={e => {
                  if (canSubmit) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(16,185,129,0.5), 0 0 0 1px rgba(16,185,129,0.3)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 22px rgba(34,211,238,0.35), 0 0 0 1px rgba(16,185,129,0.25)";
                }}
              >
                {loading ? <><SpinIcon/> Signing in…</> : "Sign In"}
              </button>

            </form>
          </div>

          {/* Footer links */}
          <div className="flex items-center gap-5 mt-7" style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.2s",
          }}>
            {["Privacy Policy","Terms of Service","Help Center"].map(l => (
              <a key={l} href="#"
                style={{ fontSize:"11.5px", color:"rgba(255,255,255,0.22)", textDecoration:"none",
                  fontFamily:"'DM Sans',sans-serif", transition:"color 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
              >{l}</a>
            ))}
          </div>
          <p style={{ marginTop:"10px", fontSize:"11px", color:"rgba(255,255,255,0.15)",
            fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.05em", textTransform:"uppercase" }}>
            © 2026 Motocline International
          </p>
        </div>
      </div>
    </>
  );
}