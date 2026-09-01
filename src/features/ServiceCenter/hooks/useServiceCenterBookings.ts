import { useQuery,keepPreviousData } from "@tanstack/react-query";
import { fetchBooking } from "../services/ServiceCenterService";

export const useServiceCenterBookings = (page:number,limit:number,status?:string,search?:string)=>{

    return useQuery({
        queryKey:["service-center-bookings",page,limit,status,search],
        queryFn:()=>fetchBooking(page,limit,status,search),
        placeholderData:keepPreviousData
    })
}