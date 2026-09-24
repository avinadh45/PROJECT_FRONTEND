import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import ChatPanel from "../../../shared/components/ChatPanel";

import { useUserConcernDetails } from "../queries/useConcern";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/my-bookings" },
];

export default function BookingChatPage() {
  const { concernId } = useParams<{ concernId: string }>();
  const navigate = useNavigate();
  const { user, logoutuser } = useAuth();

  const { data: concern, isLoading } = useUserConcernDetails(concernId as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white">
        <Navbar
          links={navLinks}
          userInitials="AK"
          userName="Arun Kumar"
          userEmail="arun@email.com"
          notifications={[]}
          onLogout={logoutuser}
        />
        <div className="p-6">Loading…</div>
      </div>
    );
  }
  if (!concern) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white">
        <Navbar
          links={navLinks}
          userInitials="AK"
          userName="Arun Kumar"
          userEmail="arun@email.com"
          notifications={[]}
          onLogout={logoutuser}
        />
        <div className="p-6">Booking not found.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#060a14]">
      <Navbar
        links={navLinks}
        userInitials="AK"
        userName="Arun Kumar"
        userEmail="arun@email.com"
        notifications={[]}
        onLogout={logoutuser}
      />

      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold text-white">
            {concern?.vehicleRegistrationNumber} · {concern?.categoryName}
          </p>
          <p className="text-xs text-white/40">{concern?.garageName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6">
        <ChatPanel
          concernId={concernId}
          currentUserId={user!.id}
          currentUserRole="user"
          otherParticipantLabel={concern?.garageName ?? "Mechanic"}
        />
      </div>
    </div>
  );
}