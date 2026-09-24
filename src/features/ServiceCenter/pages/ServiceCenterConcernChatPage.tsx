import { useParams,useNavigate } from "react-router-dom";
import { useConcernDetail } from "../hooks/useConcerns";
import { useServiceCenterAuth } from "../context/useServiceCenterAuth";
import ChatPanel from "../../../shared/components/ChatPanel";
import { ArrowLeft } from "lucide-react";

export default function ServiceCenterConcernChatPage() {
  const { concernId } = useParams<{ concernId: string }>();
  const navigate = useNavigate();
  const { data: concern, isLoading } = useConcernDetail(concernId!);
  const { serviceCenter } = useServiceCenterAuth(); 

  if (isLoading || !concern || !serviceCenter) {
    return <div className="min-h-screen bg-[#060a14] text-white p-6">Loading…</div>;
  }
  console.log(concern);
  

  return (
    <div className="flex h-screen flex-col bg-[#060a14]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="...">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold text-white">{concern.issueTitle}</p>
          <p className="text-xs text-white/40">{concern.customerName}</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6">
        <ChatPanel
  concernId={concernId!}
  currentUserId={serviceCenter.id}
  currentUserRole="serviceCenter"
  otherParticipantLabel={concern.vehicleRegistrationNumber || "Customer"}
/>
      </div>
    </div>
  );
}