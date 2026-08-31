import {  useQuery } from "@tanstack/react-query";
import type{ GarageFilter } from "../interface/bookingInterface";
import { fetchGarages } from "../service/AuthService";



export const useGarage = (filter:GarageFilter | null)=>{

    return useQuery({
        queryKey:["garages",filter],
        queryFn: ()=> fetchGarages(filter!),
        enabled: !!filter
    })
}   