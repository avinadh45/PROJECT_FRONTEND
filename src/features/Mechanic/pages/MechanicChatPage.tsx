import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";
import ChatPanel from "../../../shared/components/ChatPanel";
import { useMechanicBookingDetails } from "../hooks/useMechanicBookingDetail";
import { useMechanicAuth } from "../context/MechanicAuthContext";

export default function MechanicChatPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading } = useMechanicBookingDetails(bookingId!);
  const { mechanic } = useMechanicAuth();

  if (isLoading || !booking || !mechanic) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060a14] text-white/50">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
          Loading conversation…
        </div>
      </div>
    );
  }

  const initials = booking.customerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen flex-col bg-[#060a14]">
      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-white/10 bg-[#0a0f1e]/80 px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-semibold text-[#060a14]">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-[Syne] text-sm font-semibold text-white">
              {booking.customerName}
            </p>
            <span className="hidden h-1 w-1 shrink-0 rounded-full bg-white/20 sm:block" />
            <span className="hidden items-center gap-1 text-xs text-white/40 sm:flex">
              <Wrench className="h-3 w-3" />
              {booking.categoryName}
            </span>
          </div>
          <p className="truncate font-[DM_Sans] text-xs text-white/40">
            {booking.vehicleRegistrationNumber}
          </p>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-[#060a14] to-[#0a0f1e] px-4 py-4 sm:px-6">
        <ChatPanel
  bookingId={bookingId}
  currentUserId={mechanic.id}
  currentUserRole="mechanic"
  otherParticipantLabel={booking.customerName}
/>
      </div>
    </div>
  );
}