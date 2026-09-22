import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChatPanel from "../../../shared/components/ChatPanel";
import { useUserBookingDetails } from "../hooks/useMyBookings";
import { useAuth } from "../context/AuthContext";

export default function BookingChatPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const { data: booking, isLoading } = useUserBookingDetails(bookingId as string);

  if (isLoading) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Loading…</div>;
  }
  if (!booking) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Booking not found.</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-[#060a14]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold text-white">
            {booking.vehicleRegistrationNumber} · {booking.categoryName}
          </p>
          <p className="text-xs text-white/40">{booking.garageName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6">
        <ChatPanel
          bookingId={bookingId}
          currentUserId={user!.id}
          otherParticipantLabel={booking.mechanicName ?? "Mechanic"}
        />
      </div>
    </div>
  );
}