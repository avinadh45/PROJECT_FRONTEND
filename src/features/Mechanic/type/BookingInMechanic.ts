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