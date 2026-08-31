import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "../../ServiceCenter/services/slotService";
import type { TimeSlot } from "../interface/bookingInterface";
import { fetchSlot } from "../service/AuthService";

interface SlotFilter{

    serviceCenterId: string;
    date: string;

}

function addMinutes(time:string,minutes:number):string{

      const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

const mapToTimeSlot = (s: {
  time: string;
  maxBookings: number;
  bookedCount: number;
  status: "available" | "full" | "blocked";
}): TimeSlot => ({
  id: s.time,
  startTime: s.time,
  endTime: addMinutes(s.time, 60),
  status: s.status,
});

export const useSlots = (filter:SlotFilter | null)=>{

    return useQuery({
        queryKey:["slots",filter],
        queryFn: async ()=>{
            const result = await fetchSlot(filter!.serviceCenterId,filter!.date)
            return result.map(mapToTimeSlot)
        },
        enabled:!!filter
    })
}