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
  advancePaymentStatus: "pending" | "paid" | "failed";
}

export interface PaginatedBookings {
  data: BookingSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
