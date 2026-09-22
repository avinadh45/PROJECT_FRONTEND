
import { useQuery,useMutation,useQueryClient,keepPreviousData } from "@tanstack/react-query";
import { fetchServiceCenterConcern,fetchConcernDetail,responceToConcern } from "../services/ServiceCenterService";


export const useServiceCenterConcerns = (page:number,limit:number,status?:string)=>{
    return useQuery({
        queryKey: ["service-center-concerns", page, limit, status],
        queryFn:()=> fetchServiceCenterConcern(page,limit,status),
        placeholderData:keepPreviousData
    })
}
export const useConcernDetail = (concernId:string)=>{

    return useQuery({
        queryKey :["concern-detail", concernId],
        queryFn:()=> fetchConcernDetail(concernId),
        enabled: !!concernId
    })
}
export const useRespondToConcern = (concernId:string)=>{

    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn:({rejected, rejectReason}:{rejected: boolean; rejectReason?: string})=>
            responceToConcern(concernId,rejected,rejectReason),
        onSuccess:(data)=>{
            queryClient.setQueryData(["concern-detail", concernId], data);
            queryClient.invalidateQueries({queryKey: ["service-center-concerns"] })
        }
    })
}