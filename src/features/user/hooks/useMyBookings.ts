import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUserBookings,fetchUserBookingDetails } from "../service/AuthService";


export const useMyBookings = (page:number,limit:number,status?:string,search?:string)=>{

    return useQuery({
        queryKey:["my-bookings",page,limit,status,search],
        queryFn:()=> fetchUserBookings(page,limit,status,search),
        placeholderData:keepPreviousData
    })
}

export const useUserBookingDetails = (bookingId:string)=>{

    return useQuery({
        queryKey:["user-booking-details",bookingId],
        queryFn:()=> fetchUserBookingDetails(bookingId),
        enabled:!!bookingId
    })
}
