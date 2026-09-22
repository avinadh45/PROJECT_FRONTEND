export interface ConcernSummary {
  id: string;
  bookingId: string;
  issueTitle: string;
  status: "pending" | "approved" | "rejected" | "scheduled" | "resolved";
  createdAt: string;
}
export interface ConcernListSummary {
  id: string;
  issueTitle: string;
  status: "pending" | "approved" | "rejected" | "scheduled" | "resolved";
  customerName: string;
  vehicleRegistrationNumber: string;
  createdAt: string;
}

export interface PaginatedConcerns {
  data: ConcernListSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface ConcernDetail {
  id: string;
  bookingId: string;
  issueTitle: string;
  description: string;
  proof: { imageUrl?: string; videoUrl?: string }[];
  status: "pending" | "approved" | "rejected" | "scheduled" | "resolved";
  providerResponse?: { rejected: boolean; rejectReason?: string; respondedAt?: string };
  vehicleRegistrationNumber: string;
  categoryName: string;
  customerName: string;
  customerPhone: string;
  originalServiceDate: string;
  timeline: { status: string; updatedBy: string; at: string }[];
  createdAt: string;
}
