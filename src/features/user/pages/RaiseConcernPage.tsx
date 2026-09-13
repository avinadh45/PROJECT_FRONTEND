import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, Video, X, ArrowLeft, AlertCircle, UploadCloud } from "lucide-react";
import { useUserBookingDetails } from "../hooks/useMyBookings";
import { createConcern } from "../service/AuthService";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/history" },
];

export default function RaiseConcernPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading: isLoadingBooking } = useUserBookingDetails(bookingId!);
  const { logoutuser } = useAuth();

  const [issueTitle, setIssueTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = issueTitle.trim().length > 0 && description.trim().length > 0 && !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit || !bookingId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await createConcern(bookingId, issueTitle.trim(), description.trim(), imageFile, videoFile);
      navigate(`/booking/${bookingId}`, { state: { concernSubmitted: true } });
    } catch (err: any) {
      const message = err?.response?.data?.message;
      if (message?.includes("already")) {
        setError("You already have an open concern for this booking.");
      } else if (message?.includes("eligible") || message?.includes("expired")) {
        setError("This booking is no longer eligible for a concern.");
      } else {
        setError(message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen" style={{ background: "#060a14" }}>
        <Navbar
          links={navLinks}
          userInitials="AK"
          userName="Arun Kumar"
          userEmail="arun@email.com"
          notifications={[]}
          onLogout={logoutuser}
        />
        <div className="flex h-[60vh] items-center justify-center text-sm text-slate-500">Loading…</div>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="min-h-screen" style={{ background: "#060a14" }}>
        <Navbar
          links={navLinks}
          userInitials="AK"
          userName="Arun Kumar"
          userEmail="arun@email.com"
          notifications={[]}
          onLogout={logoutuser}
        />
        <div className="flex h-[60vh] items-center justify-center text-sm text-slate-500">Booking not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-16" style={{ background: "#060a14" }}>
      <Navbar
        links={navLinks}
        userInitials="AK"
        userName="Arun Kumar"
        userEmail="arun@email.com"
        notifications={[]}
        onLogout={logoutuser}
      />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Raise a Concern
          </h1>
          <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Report an issue with your completed service — we'll help you get it fixed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main form column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Issue Overview */}
            <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-400">
                  1
                </span>
                <h2 className="text-sm font-semibold text-white">Issue Overview</h2>
              </div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Issue title</label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="e.g. Engine noise after repair"
                className="w-full rounded-xl border border-white/10 bg-[#060a14] px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
              />
            </section>

            {/* Problem Description */}
            <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-400">
                  2
                </span>
                <h2 className="text-sm font-semibold text-white">Problem Description</h2>
              </div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Describe the issue in detail</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Example: The engine check light is back on, or I hear a strange clicking noise when accelerating…"
                className="w-full resize-none rounded-xl border border-white/10 bg-[#060a14] p-4 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
              />
            </section>

            {/* Proof upload */}
            <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
              <div className="mb-1 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-400">
                  3
                </span>
                <h2 className="text-sm font-semibold text-white">Upload proof</h2>
                <span className="text-xs text-slate-600">(optional)</span>
              </div>
              <p className="mb-5 pl-8 text-xs text-slate-500">Photos or a short video help us diagnose the issue faster.</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="group relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#060a14] transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.03]"
                >
                  {imageFile ? (
                    <>
                      <Camera className="h-5 w-5 text-cyan-400" />
                      <p className="px-4 text-center text-xs text-slate-300 truncate max-w-full">{imageFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                        }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 text-slate-600 transition-colors group-hover:text-cyan-400" />
                      <p className="text-xs font-medium text-slate-400">Add photo</p>
                      <p className="text-[11px] text-slate-600">JPG, PNG</p>
                    </>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="group relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#060a14] transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.03]"
                >
                  {videoFile ? (
                    <>
                      <Video className="h-5 w-5 text-cyan-400" />
                      <p className="px-4 text-center text-xs text-slate-300 truncate max-w-full">{videoFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoFile(null);
                        }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 text-slate-600 transition-colors group-hover:text-cyan-400" />
                      <p className="text-xs font-medium text-slate-400">Add video</p>
                      <p className="text-[11px] text-slate-600">MP4, MOV</p>
                    </>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Sidebar: summary + submit */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Service summary</p>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#060a14]">
                    {booking.vehiclePhotoUrl && (
                      <img
                        src={booking.vehiclePhotoUrl}
                        alt={booking.vehicleRegistrationNumber}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {booking.vehicleBrand} {booking.vehicleModel}
                    </p>
                    <p className="truncate text-sm text-slate-400">
                      {booking.categoryName} at {booking.garageName}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-500">
                  <span>{booking.schedule.date}</span>
                  <span className="font-mono">#{booking.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-5">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                >
                  {isSubmitting ? "Submitting…" : "Submit concern"}
                </button>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                  By submitting, you agree to our Terms of Service regarding repair re-evaluations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}