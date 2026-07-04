import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
export default function ForgotPassword() {
  const auth = useAuth()
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return
    try {
      await auth.handleForgotPassword(email)
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 50%, #0d1b3e 0%, #050d1a 40%, #020810 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow blobs */}
      <div style={{
        position: "absolute", top: "10%", left: "5%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(30,80,200,0.18) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "5%",
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(10,50,160,0.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 480,
        background: "linear-gradient(145deg, rgba(15,25,50,0.95) 0%, rgba(8,16,35,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "44px 40px 48px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        position: "relative",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 36 }}>
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(59,130,246,0.45)",
            fontWeight: 800, color: "#fff", fontSize: 18, fontFamily: "Arial Black, sans-serif",
          }}>M</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
            Moto<span style={{ color: "#3b82f6" }}>cline</span>
          </span>
        </div>

        {/* Icon block */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{
            width: "100%", maxWidth: 380, height: 88,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Highlighted center block */}
            <div style={{
              width: 64, height: 64,
              background: "linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(37,99,235,0.5)",
            }}>
              {/* Envelope icon */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 800, color: "#fff",
            margin: 0, lineHeight: 1.2, letterSpacing: "-0.5px",
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            textTransform: "uppercase",
          }}>
            Forgot your<br />password?
          </h1>
        </div>
        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.45)",
          fontSize: 14, lineHeight: 1.6, margin: "0 0 32px",
        }}>
          Enter your email address and we'll send you<br />a link to reset your password.
        </p>

        {!submitted ? (
          <>
            {/* Email field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600,
                color: "rgba(255,255,255,0.5)", marginBottom: 8,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>Email address</label>
              <div style={{
                position: "relative",
                border: `1px solid ${focused ? "rgba(59,130,246,0.7)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                transition: "border-color 0.2s",
                boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "14px 46px 14px 16px",
                    background: "transparent", border: "none", outline: "none",
                    color: "#fff", fontSize: 15,
                    caretColor: "#3b82f6",
                  }}
                />
                {/* Mail icon inside input */}
                <svg style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "15px",
                background: email.trim()
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : "rgba(59,130,246,0.3)",
                border: "none", borderRadius: 10, cursor: email.trim() ? "pointer" : "not-allowed",
                color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em",
                boxShadow: email.trim() ? "0 4px 20px rgba(59,130,246,0.4)" : "none",
                transition: "all 0.2s",
                marginBottom: 20,
              }}
            >
              Send Reset Link
            </button>
          </>
        ) : (
          /* Success state */
          <div style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 12, padding: "20px 24px",
            textAlign: "center", marginBottom: 20,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
            <p style={{ color: "#4ade80", fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>Check your inbox!</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>
              We sent a reset link to <strong style={{ color: "rgba(255,255,255,0.7)" }}>{email}</strong>
            </p>
          </div>
        )}

        {/* Back to sign in */}
        <div style={{ textAlign: "center" }}>
          <a href="#" style={{
            color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}