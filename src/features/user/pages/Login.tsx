

import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../hooks/useAuth";
import { FullScreenLoader,Input,Button } from "../components";
// import { Link } from "react-router-dom";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setloading(true)
    const start = Date.now()
    try {
      await auth.Login({ email, password })
    } catch (error) {
      console.error(error);
    } finally {
      const elapsed = Date.now() - start
      const minTime = 500
      if (elapsed < minTime) {
        setTimeout(() => setloading(false), minTime - elapsed)
      } else {
        setloading(false)
      }
    }
  }

  return (
    <>
      {loading && <FullScreenLoader text="Signing you in..." />}
      <div className="min-h-screen flex justify-center items-center bg-[#060a14] text-white font-body">
        <div className="flex flex-col items-center justify-center p-10 bg-[#080c18] border-l border-blue-500/10 relative overflow-hidden">
          <div className="relative z-10 w-full max-w-[420px] animate-floatUp">

            <div className="text-center mb-8">
              <div className="font-display font-extrabold text-2xl tracking-tight mb-2">Welcome back</div>
              <div className="text-white/40 text-sm leading-relaxed">Please enter your details to sign in</div>
            </div>

            {auth.errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-2.5 rounded-lg mb-4 text-center text-sm">
                {auth.errors.general}
              </div>
            )}

            <div className="flex justify-center mb-6 w-[300px] mx-auto">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  if (credentialResponse.credential) {
                    auth.googleLoginHandler(credentialResponse.credential);
                  }
                }}
                onError={() => { auth.setErrors({ general: "Google Login Failed" }); }}
                width="100%"
                theme="outline"
                size="large"
                shape="rectangular"
              />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30 tracking-wider uppercase">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleLogin}>
              <Input
                label="Email address"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />

              <div className="mb-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-white/60 font-medium">Password</label>
                  <a href="/forgot-password" className="text-xs text-blue-500 font-medium hover:text-blue-400">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input
                    className="pr-11"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70"
                    onClick={() => setShowPass(!showPass)}
                    type="button"
                  >
                    {showPass ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <Button disabled={loading}>Sign In to Motocline</Button>
              </div>
            </form>

            <div className="text-center mt-5 text-sm text-white/40">
              Don't have an account?
              <a href="/register" className="text-blue-500 font-semibold ml-1 hover:text-blue-400">Create account</a>
            </div>
          </div>

          <div className="absolute bottom-5 left-0 right-0 text-center text-xs text-white/20">
            © 2026 Motocline Inc.
            <a href="#" className="mx-2 hover:text-white/60">Privacy Policy</a>·
            <a href="#" className="mx-2 hover:text-white/60">Terms of Service</a>
          </div>
        </div>
      </div>
    </>
  );
}