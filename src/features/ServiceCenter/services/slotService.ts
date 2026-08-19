import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import type { Slot } from "../types/slot";

export const getAvailableSlots = async(serviceCenterId:string,date:string):Promise<Slot[]>=>{

    const res = await axiosClient.get(API_ROUTES.SLOT.GET_SLOT(serviceCenterId,date))
    return res.data.data
}
export const Block = async(date:string,time:string):Promise<void>=>{
    
 await axiosClient.post(API_ROUTES.SLOT.BLOCK_SLOT,{date,time})

}
export const UnBlockSlot = async(date:string,time:string)=>{

    await axiosClient.post(API_ROUTES.SLOT.UNBLOCK_SLOT,{date,time})
}
export const BlockFullDay = async(date:string)=>{

    await axiosClient.post(API_ROUTES.SLOT.BLOCK_FULL_DAY,{date})
}

export const UnBlockFullDay = async(date:string)=>{

    await axiosClient.post(API_ROUTES.SLOT.UNBLOCK_FULL_DAY,{date})
}