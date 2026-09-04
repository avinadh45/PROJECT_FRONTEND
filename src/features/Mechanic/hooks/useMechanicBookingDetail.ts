import { useQuery } from "@tanstack/react-query";
import { fetchMechanicBookingDetails } from "../services/MechanicService";


export const useMechanicBookingDetails = (bookingId:string)=>{

    return useQuery({
        queryKey:["mechanic-bookingpdetails",bookingId],
        queryFn:()=> fetchMechanicBookingDetails(bookingId),
        enabled: !!bookingId
    })
}