export interface MechanicBookingSummary {
  id: string;
  customerName: string;
  vehicleRegistrationNumber: string;
  categoryName: string;
  visitType: "drive-in" | "pickup-drop";
  schedule: { date: string; slotStartingTime: string; slotEndingTime: string };
  status: string;
  advancePaymentStatus: "pending" | "paid" | "failed";
}

export interface PaginatedMechanicBookings {
  data: MechanicBookingSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface MechanicBookingDetail {
  id: string;
  status: string;
  visitType: "drive-in" | "pickup-drop";
  customerName: string;
  customerPhone: string;
  vehicleRegistrationNumber: string;
  vehicleType: string;          // new
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePhotoUrl: string | null;  // new
  categoryName: string;
  schedule: {
    date: string;
    slotStartingTime: string;
    slotEndingTime: string;
  };
  additionalInfo: string | null;
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
}