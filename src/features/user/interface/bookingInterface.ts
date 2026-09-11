export type ServiceMode = "drive-in" | "pickup-drop";

export type BookingStatus =
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "pending_payment"
  | "failed_slot_unavailable";

export interface GarageFilter {
  categoryId: string;
  vehicleType: string;
  serviceMode: ServiceMode;
  latitude?: number;
  longitude?: number;
}
export interface Category {
  id: string;
  name: string;
  icon?: string;
}
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string; 
  status: "available" | "full" | "blocked";
}
export interface BookingOrderPayload{

  vehicleId:string;
  categoryId:string;
  serviceCenterId:string;
  visitType: "drive-in" | "pickup-drop";
  pickupLocation?:{
    type:"Point";
    coordinates:number[];
    formattedAddress:string
  }
  schedule:{
    date:string;
    slotStartingTime: string;
    slotEndingTime: string;
  }
  additionalInfo?: string;
}
export interface BookingOrderResult{
   razorpayOrderId: string;
   amount:number ;
   bookingId:string 
}
export interface VerifyPaymentPayload {
   razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
export interface BookingConfirmation{
  id:string;
  status:string;
  mechanicAssigned:boolean;
  serviceCenterId:string;
  vehicleId:string;
  categoryId:string ;
  visitType: "drive-in" | "pickup-drop";
  schedule:{
    date:string ; 
    slotStartingTime: string;
    slotEndingTime: string;
  }
  advancePayment:{
    amount:number;
    status:"pending" | "paid" | "failed"
    paidAt?:string
  }
}
export interface UserBookingSummary {
  id: string;
  vehicleRegistrationNumber: string;
  vehiclePhotoUrl: string | null;
  categoryName: string;
  garageName: string;
  visitType: "drive-in" | "pickup-drop";
  schedule: { date: string; slotStartingTime: string; slotEndingTime: string };
  status: string;
  advancePaymentStatus: "pending" | "paid" | "failed";
}

export interface PaginatedUserBookings {
  data: UserBookingSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

  export interface UserBookingDetail {
    id: string;
    status: BookingStatus;
    visitType: "drive-in" | "pickup-drop";
    vehicleRegistrationNumber: string;
    vehicleType: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehiclePhotoUrl: string | null;
    categoryName: string;
    serviceCenterId: string;
    garageName: string;
    garagePhone: string;
    garageEmail: string;
    garageAddress: string | null;
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
    advancePayment: { amount: number; status: "pending" | "paid" | "failed"|  "refund_due" | "refunded"; paidAt?: string; refundedAt?: string; };
  }
export interface RescheduleBookingPayload {
  date: string;
  slotStartingTime: string;
  slotEndingTime: string;
}