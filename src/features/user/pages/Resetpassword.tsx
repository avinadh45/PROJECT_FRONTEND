// ResetPassword.tsx
// Matches Motocline app design — dark navy #060a14, blue #3b82f6, cyan #06b6d4
// Fonts: Syne (headings) + DM Sans (body)
// Tailwind + custom CSS for animations

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// ── Icons ─────────────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ShieldCheck = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#sg)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6"/>
        <stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

// ── Password rules ─────────────────────────────────────────────────────────────
interface Rule { label: string; test: (p: string) => boolean }
const RULES: Rule[] = [
  { label: "At least 8 characters",        test: p => p.length >= 8 },
  { label: "One uppercase letter (A–Z)",   test: p => /[A-Z]/.test(p) },
  { label: "One number (0–9)",             test: p => /\d/.test(p) },
  { label: "One special character (!@#…)", test: p => /[^A-Za-z0-9]/.test(p) },
];

// ── Strength meter ────────────────────────────────────────────────────────────
function getStrength(p: string): { score: number; label: string; color: string } {
  const score = RULES.filter(r => r.test(p)).length;
  if (!p)        return { score: 0, label: "",         color: "transparent" };
  if (score <= 1) return { score: 1, label: "Weak",    color: "#ef4444" };
  if (score === 2) return { score: 2, label: "Fair",   color: "#f59e0b" };
  if (score === 3) return { score: 3, label: "Good",   color: "#3b82f6" };
  return              { score: 4, label: "Strong",     color: "#10b981" };
}

// ── Field component ───────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
}

function PasswordField({
  label, id, value, onChange, show, onToggle,
  focused, onFocus, onBlur, placeholder, error, success,
}: FieldProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-[13px] font-medium text-white/58 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder ?? "••••••••••"}
          className="w-full h-12 rounded-[10px] pr-11 pl-4 text-white text-sm outline-none transition-all duration-200"
          style={{
            background: focused
              ? "rgba(59,130,246,0.05)"
              : success
              ? "rgba(16,185,129,0.04)"
              : "rgba(255,255,255,0.04)",
            border: focused
              ? "1.5px solid rgba(59,130,246,0.65)"
              : success
              ? "1.5px solid rgba(16,185,129,0.45)"
              : error
              ? "1.5px solid rgba(239,68,68,0.5)"
              : "1.5px solid rgba(255,255,255,0.1)",
            boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        {/* Eye toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors p-0.5"
        >
          {show ? <EyeOpen /> : <EyeClosed />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-[12px] text-red-400 flex items-center gap-1.5">
          <span className="text-red-400"><XIcon /></span>{error}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface ResetPasswordProps {}

export default function ResetPassword(props: ResetPasswordProps) {
  const auth = useAuth();
  const [newPass, setNewPass]       = useState("");
  const [confirmPass, setConfirm]   = useState("");
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedNew, setFocusedNew]   = useState(false);
  const [focusedConfirm, setFocusedConfirm] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState<string | null>(null);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const strength    = getStrength(newPass);
  const allRulesMet = RULES.every(r => r.test(newPass));
  const matches = newPass === confirmPass;
  const mismatch = confirmPass.length > 0 && !matches;

  const canSubmit = newPass.length > 0 && confirmPass.length > 0 && matches && !auth.loading;
  const navigate = useNavigate();

const handleSubmit = async (e:React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);
  setError(null);

  if (!matches) {
    setError("Passwords do not match");
    return;
  } 

  try {
    await auth.handleResetPassword(token || "", "", newPass);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setDone(true);

  } catch (err:any) {
    setError(err?.response?.data?.message || err.message || "An error occurred");
  }
};

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <>
        <style>{styles}</style>
        <div className="reset-page">
          <BackgroundFX />
          <div className="card success-card">
            <div className="logo-row">
              <div className="logo-box">M</div>
              <span className="logo-txt">Moto<span>cline</span></span>
            </div>
            <div className="text-center" style={{ animation: "floatUp .6s ease both" }}>
              <div className="success-icon-wrap">
                <div className="success-ring" />
                <ShieldCheck />
              </div>
              <h2 className="font-syne font-extrabold text-white tracking-tight mt-5 mb-3"
                  style={{ fontFamily: "'Syne',sans-serif", fontSize: "24px", letterSpacing: "-0.4px" }}>
                Password updated!
              </h2>
              <p className="text-white/42 text-sm leading-relaxed mb-8">
                Your password has been reset successfully.<br/>You can now sign in with your new password.
              </p>
              <button
                className="submit-btn w-full"
                onClick={() => navigate("/login")}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="reset-page">
        <BackgroundFX />

        <div className="card">
          {/* Logo */}
          <div className="logo-row">
            <div className="logo-box">M</div>
            <span className="logo-txt">Moto<span>cline</span></span>
          </div>

          {/* Lock icon */}
          <div className="icon-wrap">
            <div className="icon-box">
              <LockIcon />
            </div>
            <div className="ping-ring" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-syne font-extrabold text-white mb-2"
                style={{ fontFamily: "'Syne',sans-serif", fontSize: "26px", letterSpacing: "-0.5px" }}>
              Reset your password
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Create a new secure password for your<br/>Motocline account.
            </p>
          </div>

          {/* ── New Password ── */}
          <PasswordField
            label="New password"
            id="newPass"
            value={newPass}
            onChange={v => { setNewPass(v); setSubmitted(false); }}
            show={showNew}
            onToggle={() => setShowNew(s => !s)}
            focused={focusedNew}
            onFocus={() => setFocusedNew(true)}
            onBlur={() => setFocusedNew(false)}
            success={allRulesMet}
            error={submitted && !allRulesMet ? "Password doesn't meet all requirements" : undefined}
          />

          {/* Strength bar */}
          {newPass.length > 0 && (
            <div className="mb-5 -mt-2">
              <div className="flex gap-1.5 mb-2">
                {[1,2,3,4].map(i => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: i <= strength.score ? strength.color : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
              {strength.label && (
                <span className="text-[12px] font-medium" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              )}
            </div>
          )}

          {/* Rules checklist */}
          {(focusedNew || newPass.length > 0) && (
            <div className="mb-5 p-3.5 rounded-xl border border-white/[0.07]"
                 style={{ background: "rgba(255,255,255,0.025)" }}>
              <p className="text-[11.5px] text-white/35 font-medium mb-2.5 uppercase tracking-wider">
                Password requirements
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {RULES.map(r => {
                  const ok = r.test(newPass);
                  return (
                    <div key={r.label} className="flex items-center gap-2">
                      <span
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          background: ok ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                          border: ok ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.12)",
                          color: ok ? "#34d399" : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {ok ? <CheckIcon /> : <XIcon />}
                      </span>
                      <span
                        className="text-[12px] leading-tight transition-colors duration-200"
                        style={{ color: ok ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)" }}
                      >
                        {r.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Confirm Password ── */}
          <PasswordField
            label="Confirm new password"
            id="confirmPass"
            value={confirmPass}
            onChange={v => { setConfirm(v); setSubmitted(false); }}
            show={showConfirm}
            onToggle={() => setShowConfirm(s => !s)}
            focused={focusedConfirm}
            onFocus={() => setFocusedConfirm(true)}
            onBlur={() => setFocusedConfirm(false)}
            success={!!matches}
            error={
              mismatch ? "Passwords do not match" :
              submitted && !confirmPass ? "Please confirm your password" :
              undefined
            }
          />

          {/* Match indicator */}
          {confirmPass.length > 0 && (
            <div className="flex items-center gap-2 -mt-2 mb-5">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: matches ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.15)",
                  border: matches ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(239,68,68,0.35)",
                  color: matches ? "#34d399" : "#f87171",
                }}
              >
                {matches ? <CheckIcon /> : <XIcon />}
              </span>
              <span
                className="text-[12px]"
                style={{ color: matches ? "#34d399" : "#f87171" }}
              >
                {matches ? "Passwords match" : "Passwords don't match yet"}
              </span>
            </div>
          )}

          {/* API error */}
          {(error || auth.error) && (
            <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4"
                 style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
              </svg>
              <span className="text-red-400 text-[13px] font-medium">{error || auth.error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            className="submit-btn w-full"
            onClick={handleSubmit}
            disabled={auth.loading}
            style={{ opacity: !canSubmit && submitted ? 0.6 : 1 }}
          >
            {auth.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Updating password…
              </span>
            ) : "Reset Password"}
          </button>

          {/* Back link */}
          <button
             onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 mt-4 text-white/35 hover:text-white/60 text-[13px] font-medium transition-colors"
          >
            <BackIcon />
            Back to sign in
          </button>
        </div>
      </div>
    </>
  );
}

// ── Background effects component ──────────────────────────────────────────────
function BackgroundFX() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 65% 55% at 15% 45%, rgba(29,78,216,0.16) 0%, transparent 65%)" }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 55% at 85% 65%, rgba(6,182,212,0.07) 0%, transparent 60%)" }} />
      <div className="shaft" style={{ left:"28%", height:"55%", background:"linear-gradient(to bottom,rgba(59,130,246,0.28),transparent)", animationDuration:"4.5s" }} />
      <div className="shaft" style={{ left:"68%", height:"42%", background:"linear-gradient(to bottom,rgba(6,182,212,0.16),transparent)", animationDuration:"6s", animationDirection:"alternate-reverse" }} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  @keyframes floatUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shaftAnim { from{opacity:.12;transform:scaleY(.8)} to{opacity:.7;transform:scaleY(1.1)} }
  @keyframes pulsePing { 0%{transform:scale(1);opacity:.5} 75%,100%{transform:scale(1.7);opacity:0} }
  @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes successPop{ 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  .reset-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #060a14;
    font-family: 'DM Sans', sans-serif;
    padding: 32px 16px;
    -webkit-font-smoothing: antialiased;
  }

  .shaft {
    position: absolute; top: 0; width: 1.5px; border-radius: 1px;
    filter: blur(5px); animation: shaftAnim ease-in-out infinite alternate;
  }

  .card {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    background: rgba(8,12,24,0.94);
    border: 1px solid rgba(59,130,246,0.13);
    border-radius: 22px;
    padding: 40px 38px 38px;
    backdrop-filter: blur(18px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset;
    animation: floatUp .55s ease both;
  }
  .success-card { text-align: center; }

  .logo-row {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-bottom: 28px;
  }
  .logo-box {
    width: 30px; height: 30px; border-radius: 6px;
    background: linear-gradient(135deg,#3b82f6,#06b6d4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne',sans-serif; font-weight: 900; font-size: 14px; color: #fff;
  }
  .logo-txt { font-family:'Syne',sans-serif; font-weight:800; font-size:16px; color:#fff; letter-spacing:-.3px; }
  .logo-txt span { color: #3b82f6; }

  .icon-wrap {
    position: relative; display: flex; justify-content: center; margin-bottom: 22px;
  }
  .icon-box {
    width: 58px; height: 58px; border-radius: 15px;
    background: linear-gradient(135deg,rgba(59,130,246,0.14),rgba(6,182,212,0.08));
    border: 1px solid rgba(59,130,246,0.27);
    display: flex; align-items: center; justify-content: center;
  }
  .ping-ring {
    position: absolute; inset: 0; border-radius: 15px;
    border: 1px solid rgba(59,130,246,0.28);
    animation: pulsePing 2.2s ease-in-out infinite;
  }

  .submit-btn {
    height: 50px; border-radius: 10px; border: none;
    background: linear-gradient(135deg,#1d4ed8,#3b82f6);
    color: #fff; font-family: 'Syne',sans-serif; font-weight: 700;
    font-size: 14.5px; letter-spacing: .04em; cursor: pointer;
    box-shadow: 0 4px 20px rgba(59,130,246,0.38);
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .submit-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);
    transform: translateX(-100%); transition: transform .5s;
  }
  .submit-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(59,130,246,0.52); }
  .submit-btn:not(:disabled):hover::after { transform: translateX(100%); }
  .submit-btn:not(:disabled):active { transform: translateY(0); }
  .submit-btn:disabled { cursor: not-allowed; }

  .success-icon-wrap {
    position: relative; display: flex; justify-content: center;
    margin: 0 auto 4px;
    animation: successPop .5s .1s ease both; opacity: 0;
  }
  .success-ring {
    position: absolute; inset: -12px; border-radius: 50%;
    border: 1px solid rgba(16,185,129,0.25);
    animation: pulsePing 2.5s ease-in-out infinite;
  }

  input::placeholder { color: rgba(255,255,255,0.2); }
`;