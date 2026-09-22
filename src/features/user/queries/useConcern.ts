import { useQuery } from "@tanstack/react-query";
import { fetchUserConcernDetail } from "../service/AuthService";

export const useUserConcernDetails = (concernId:string)=>{

    return useQuery({
        queryKey:["user-concern-detail",concernId],
        queryFn:()=> fetchUserConcernDetail(concernId),
        enabled:!!concernId
    })
}