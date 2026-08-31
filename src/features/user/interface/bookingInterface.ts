
export type ServiceMode = "drive-in" | "pickup-drop";

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