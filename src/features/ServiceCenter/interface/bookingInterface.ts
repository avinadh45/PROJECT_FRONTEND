import type{ BookingStatus } from "../pages/Booking-Details";
export interface BookingSummary {
  id: string;
  customerName: string;
  vehicleRegistrationNumber: string;
  categoryName: string;
  visitType: "drive-in" | "pickup-drop";
  schedule: {
    date: string;
    slotStartingTime: string;
    slotEndingTime: string;
  };
  mechanicName: string | null;
  status: string;
  advancePaymentStatus: "pending" | "paid" | "failed" | "refund_due" | "refunded";
}

export interface PaginatedBookings {
  data: BookingSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceCenterBookingDetail {
  id: string;
  status: BookingStatus;
  visitType: "drive-in" | "pickup-drop";
  customerName: string;
  customerPhone: string;
  vehicleRegistrationNumber: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePhotoUrl: string | null;
  categoryName: string;
  mechanicName: string | null;
  schedule: { date: string; slotStartingTime: string; slotEndingTime: string };
  additionalInfo: string | null;
  statusTimeline: { status: string; updatedBy: string; at: string }[];
  job: {
    reportedIssue: string;
    estimatedTime: string;
    estimatedCost: number;
    description: {
      jobItemsId: string;
      issueFound: string;
      spareParts: string;
      sparePartQty: number;
      estimatedTime: string;
      initalCost: number;
    }[];
  } | null;
  proof: { imageUrl: string; uploadedBy: string; uploadedAt: string } | null;
  pickupLocation: { type: "Point"; coordinates: number[]; formatedAddress: string } | null;
 advancePayment: {
  amount: number;
  status: "pending" | "paid" | "failed" | "refund_due" | "refunded";
  paidAt?: string;
  refundedAt?: string;
};
}