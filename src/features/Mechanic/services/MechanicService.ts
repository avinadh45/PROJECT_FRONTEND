import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import type { MechanicLoginDTO,MechanicAuthResponse,CreateMechanicDTO,MechanicResponse } from "../interface/Mechanic";
import type { PaginationMechanicResponse } from "../interface/pagination";

 export const LoginMechanic = async(data:MechanicLoginDTO):Promise<MechanicAuthResponse>=>{
    const mechanic = await axiosClient.post(API_ROUTES.MECHANIC.LOGIN,data)
      return mechanic.data.data

 }

 export const CreatMechanic = async(data:CreateMechanicDTO):Promise<MechanicResponse >=>{
    const mechanic = await axiosClient.post(API_ROUTES.MECHANIC.CREATE,data)
    return  mechanic.data.data
 }

 export const getMechanics = async(page:number,limit:number,search:string = ""):Promise<PaginationMechanicResponse>=>{
   const mechanic = await axiosClient.get(API_ROUTES.MECHANIC.LIST(page,limit,search))
   return mechanic.data 
 }


