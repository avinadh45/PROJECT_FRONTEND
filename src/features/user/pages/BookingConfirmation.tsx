import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Calendar, Clock, Wrench, MapPin, ArrowRight } from "lucide-react";
import { fetchBookingById } from "../service/AuthService"; 
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/history" },
];
export default function BookingConfirmedPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { logoutuser} = useAuth()

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingById(bookingId!),
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#060a14" }}>
        <p className="text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Loading your booking…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#060a14" }}>
        <p className="text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-20" style={{ background: "#060a14" }}>
      <Navbar
        links={navLinks}
        userInitials="AK"
        userName="Arun Kumar"
        userEmail="arun@email.com"
        notifications={[]}
        onLogout={logoutuser}
      />

      <div className="mx-auto max-w-2xl px-4 pt-[104px] sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)" }}
          >
            <CheckCircle className="h-8 w-8 text-cyan-400" />
          </div>

          <h1
            className="mt-6 text-3xl text-white sm:text-4xl"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
          >
            Booking Confirmed
          </h1>
          <p className="mt-2 text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {booking.mechanicAssigned
              ? "A mechanic has been assigned to your service."
              : "We're finding a mechanic for you — you'll be notified once assigned."}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Wrench className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Booking #{booking.id.slice(-8).toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Calendar className="h-4 w-4 shrink-0 text-slate-500" />
              {booking.schedule.date}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Clock className="h-4 w-4 shrink-0 text-slate-500" />
              {booking.schedule.slotStartingTime} – {booking.schedule.slotEndingTime}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
              {booking.visitType === "drive-in" ? "Drive-in at garage" : "Pickup & drop"}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-[#060a14] px-4 py-3">
            <span className="text-xs uppercase tracking-wide text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Advance paid
            </span>
            <span className="text-sm font-semibold text-cyan-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ₹{booking.advancePayment.amount}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", fontFamily: "'DM Sans', sans-serif" }}
          >
            View My Bookings
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            to="/"
            className="flex flex-1 items-center justify-center rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-300 hover:border-white/25"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}