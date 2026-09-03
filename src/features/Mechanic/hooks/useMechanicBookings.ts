import { useQuery,keepPreviousData } from "@tanstack/react-query";
import { fetchMechanicBookings } from "../services/MechanicService";

export const useMechanicBookings=(
    page:number,
    limit:number,
    status?:string,
    search?:string,
)=>{
return useQuery({
    queryKey:["mechanic-bookings",page,limit,status,search],
    queryFn:()=> fetchMechanicBookings(page,limit,status,search),
    placeholderData:keepPreviousData
})
}