export interface Slot {
  time: string;
  maxBookings: number;
  bookedCount: number;
  status: "available" | "full" | "blocked";
}
export interface AvailabilityFormDat{

  workingDays:string[];
  workingHourse:{ start:string ; end:string} 
  slotDuration:number;
  maxBookingsPerSlot:number
}