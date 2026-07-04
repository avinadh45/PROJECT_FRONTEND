

import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../hooks/useAuth";
// import { Link } from "react-router-dom";



// ── Eye icons ────────────────────────────────────────────────────────────────
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

export default function Login() {
  const auth = useAuth()
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused]   = useState<string | null>(null);

  const handleLogin = async(e:React.FormEvent)=>{
    e.preventDefault()
    try {
      await auth.Login({ email,password})
    } catch (error) {
      console.error(error);
      
    }
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #060a14; color: #fff; min-height: 100vh; -webkit-font-smoothing: antialiased; }

        @keyframes floatUp   { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shaftAnim { from { opacity:0.15; transform:scaleY(0.8) }    to { opacity:0.7; transform:scaleY(1.1) } }
        @keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.5)} }
        @keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

        .login-page {
          min-height: 100vh;
            display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        /* ── Left panel ─────────────────────────────────────────────── */
        .left-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 56px 48px;
          background: #060a14;
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 70% at 20% 60%, rgba(29,78,216,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        /* light shafts */
        .shaft {
          position: absolute; top: 0; width: 1.5px; border-radius: 1px;
          filter: blur(4px); animation: shaftAnim 5s ease-in-out infinite alternate;
        }

        .left-logo { position: relative; z-index: 2; display: flex; align-items: center; gap: 9px; }
        .logo-box {
          width: 32px; height: 32px; border-radius: 7px;
          background: linear-gradient(135deg,#3b82f6,#06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne',sans-serif; font-weight: 900; font-size: 15px; color: #fff;
        }
        .logo-text { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -.4px; }
        .logo-text span { color: #3b82f6; }

        .left-hero { position: relative; z-index: 2; }
        .left-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);
          border-radius: 100px; padding: 5px 14px; margin-bottom: 28px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; animation: pulseDot 2s infinite; }
        .badge-label { font-size: 11px; color: #93c5fd; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }

        .left-heading {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2rem, 3.5vw, 3rem);
          color: #fff; line-height: 1.1; letter-spacing: -1px;
          margin-bottom: 18px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
          animation: floatUp .7s ease both;
        }
        .text-grad {
          background: linear-gradient(90deg,#3b82f6,#06b6d4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .left-sub {
          color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.75;
          max-width: 380px; animation: floatUp .7s .1s ease both;
        }

        .trust-row {
          position: relative; z-index: 2;
          display: flex; gap: 32px; flex-wrap: wrap;
        }
        .trust-item {}
        .trust-val { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 26px; color: #fff; letter-spacing: -1px; text-shadow: 0 0 18px rgba(59,130,246,0.45); }
        .trust-lbl { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 3px; letter-spacing: .07em; text-transform: uppercase; }
        .trust-divider { width: 1px; background: rgba(255,255,255,0.12); align-self: stretch; }

        /* ── Right panel ─────────────────────────────────────────────── */
        .right-panel {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 40px 48px;
          background: #080c18;
          border-left: 1px solid rgba(59,130,246,0.1);
          position: relative;
          overflow: hidden;
        }
        .right-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 80% 20%, rgba(6,182,212,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        /* form card */
        .form-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 420px;
          animation: floatUp .6s .15s ease both; opacity: 0;
        }

        .form-header { text-align: center; margin-bottom: 32px; }
        .form-title {
          font-family: 'Syne',sans-serif; font-weight: 800;
          font-size: 26px; color: #fff; letter-spacing: -.5px; margin-bottom: 8px;
        }
        .form-sub { color: rgba(255,255,255,0.42); font-size: 14px; line-height: 1.6; }

        /* google btn */
        .google-btn {
          width: 100%; height: 48px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff; font-family: 'DM Sans',sans-serif; font-size: 14px; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer; transition: background .2s, border-color .2s;
          margin-bottom: 24px;
        }
        .google-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.22); }

        /* divider */
        .or-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .or-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .or-text { font-size: 12px; color: rgba(255,255,255,0.28); letter-spacing: .08em; text-transform: uppercase; }

        /* field */
        .field-group { margin-bottom: 18px; }
        .field-label {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .field-label-text { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500; }
        .forgot-link {
          font-size: 12.5px; color: #3b82f6; text-decoration: none; font-weight: 500;
          transition: color .2s;
        }
        .forgot-link:hover { color: #60a5fa; }

        .input-wrap { position: relative; }
        .field-input {
          width: 100%; height: 48px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #fff; font-family: 'DM Sans',sans-serif; font-size: 14px;
          padding: 0 44px 0 16px;
          outline: none; transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.22); }
        .field-input:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); }
        .field-input.focused {
          border-color: rgba(59,130,246,0.6);
          background: rgba(59,130,246,0.04);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.35);
          cursor: pointer; display: flex; align-items: center; padding: 2px;
          transition: color .2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }

        /* submit */
        .submit-btn {
          width: 100%; height: 50px; border-radius: 10px; border: none;
          background: linear-gradient(135deg,#1d4ed8,#3b82f6);
          color: #fff; font-family: 'Syne',sans-serif; font-weight: 700;
          font-size: 14.5px; letter-spacing: .04em;
          cursor: pointer; margin-top: 8px;
          box-shadow: 0 4px 20px rgba(59,130,246,0.4);
          transition: transform .2s, box-shadow .2s, opacity .2s;
          position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
          transform: translateX(-100%);
          transition: transform .5s;
        }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(59,130,246,0.55); }
        .submit-btn:hover::after { transform: translateX(100%); }
        .submit-btn:active { transform: translateY(0); box-shadow: 0 4px 20px rgba(59,130,246,0.4); }

        .signup-row {
          text-align: center; margin-top: 22px;
          font-size: 13.5px; color: rgba(255,255,255,0.38);
        }
        .signup-link { color: #3b82f6; font-weight: 600; text-decoration: none; margin-left: 4px; transition: color .2s; }
        .signup-link:hover { color: #60a5fa; }

        /* feature pills */
        .feature-pills { display: flex; flex-direction: column; gap: 10px; margin-top: 32px; }
        .pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 14px;
        }
        .pill-icon {
          width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25);
        }
        .pill-text { font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 500; }
        .pill-text strong { color: rgba(255,255,255,0.85); font-weight: 600; }

        /* footer */
        .page-footer {
          position: absolute; bottom: 20px; left: 0; right: 0;
          text-align: center; font-size: 12px; color: rgba(255,255,255,0.2);
          z-index: 2;
        }
        .page-footer a { color: rgba(255,255,255,0.3); text-decoration: none; margin: 0 8px; transition: color .2s; }
        .page-footer a:hover { color: rgba(255,255,255,0.6); }

        @media (max-width: 768px) {
          .login-page { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 40px 24px; }
        }
      `}</style>

      <div className="login-page">

        {/* ── Left Panel ─────────────────────────────────────────── */}
        

        {/* ── Right Panel ────────────────────────────────────────── */}
        <div className="right-panel">
          <div className="form-card">

            {/* Header */}
            <div className="form-header">
              <div className="form-title">Welcome back</div>
              <div className="form-sub">Please enter your details to sign in</div>
            </div>
{auth.errors.general && (
  <div
    style={{
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.3)",
      color: "#ef4444",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "16px",
      textAlign: "center",
      fontSize: "13px",
    }}
  >
    {auth.errors.general}
  </div>
)}


            {/* Google */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', width:300 }}>
              <GoogleLogin
                onSuccess={credentialResponse => {
                  if (credentialResponse.credential) {
                    auth.googleLoginHandler(credentialResponse.credential);
                  }
                }}
                onError={() => {
                auth.setErrors({
  general: "Google Login Failed",
});
                }}
                width="100%"
                theme="outline"
                size="large"
                shape="rectangular"
              />
            </div>

            {/* Divider */}
            <div className="or-row">
              <div className="or-line" />
              <span className="or-text">or</span>
              <div className="or-line" />
            </div>

            {/* Email */}
            <form onSubmit={handleLogin}>
            <div className="field-group">
              <div className="field-label">
                <span className="field-label-text">Email address</span>
              </div>
              <div className="input-wrap">
                <input
                  type="email"
                  className={`field-input${focused === "email" ? " focused" : ""}`}
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <div className="field-label">
                <span className="field-label-text">Password</span>
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>
              <div className="input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className={`field-input${focused === "pass" ? " focused" : ""}`}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                />
                <button className="eye-btn" onClick={() => setShowPass(!showPass)} type="button">
                  {showPass ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="submit-btn">Sign In to Motocline</button>

                </form>
            {/* Sign up */}
            <div className="signup-row">
              Don't have an account?
              <a href="/register" className="signup-link">Create account</a>
            </div>
          </div>

          {/* Footer */}
          <div className="page-footer">
            © 2026 Motocline Inc.
            <a href="#">Privacy Policy</a>·
            <a href="#">Terms of Service</a>
          </div>
        </div>

      </div>
    </>
  );
}