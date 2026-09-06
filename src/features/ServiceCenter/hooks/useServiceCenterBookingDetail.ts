import { useQuery } from "@tanstack/react-query";
import { fetchServiceCenterBookingDetails } from "../services/ServiceCenterService";

export const useServiceCenterBookingDetail=(bookingId:string)=>{

    return useQuery({
        queryKey:["service-center-booking-detail",bookingId],
        queryFn: ()=> fetchServiceCenterBookingDetails(bookingId),
        enabled: !!bookingId
    })
}