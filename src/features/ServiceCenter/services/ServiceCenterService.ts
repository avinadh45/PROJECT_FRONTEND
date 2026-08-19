import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import type {
  AddServiceDTO,
  AvailabilityFormData,
  ServiceCatalogResponse,
  ServiceCenterAuthResponse,
  ServiceCenterLoginDTO,
} from "../interface/serviceCenter";
import type { Subscription } from "../types/subscription";
import type { AvailabilityFormDat } from "../types/slot";

export const registerServicCenter = async (
  data: FormData,
): Promise<ServiceCenterAuthResponse> => {
  const result = await axiosClient.post(API_ROUTES.SERVICE_CENTER.REGISTER, data);
  return result.data;
};
export const loginServiceCnter = async (
  data: ServiceCenterLoginDTO,
): Promise<ServiceCenterAuthResponse> => {
  const serviceCenter = await axiosClient.post(API_ROUTES.SERVICE_CENTER.LOGIN, data);


  return serviceCenter.data;
};

export const forgotPasswordServicCenter = async (email: string) => {
  const response = await axiosClient.post(API_ROUTES.SERVICE_CENTER.FORGOT_PASSWORD, {
    email,
  });
  return response.data;
};
export const resetPasswordServiceCenter = async (
  token: string,
  password: string,
) => {
  const response = await axiosClient.post(API_ROUTES.SERVICE_CENTER.RESET_PASSWORD, {
    token,
    password,
  });
  return response.data;
};
export const BlockMechanic = async (id: string) => {
  const mechanic = await axiosClient.patch(API_ROUTES.SERVICE_CENTER.BLOCK_MECHANIC(id));
  return mechanic.data;
};
export const Verification_status = async()=>{
  return axiosClient.get(API_ROUTES.SERVICE_CENTER.VERIFICATION_STATUS)
}
export const getEditDetails = async()=>{
  return axiosClient.get(API_ROUTES.SERVICE_CENTER.EDIT_VERIFICATION)
}

export const updateVerification = async(data:FormData)=>{
const response = await axiosClient.patch(API_ROUTES.SERVICE_CENTER.EDIT_VERIFICATION,data)
return response.data
}

export const getMyServices = async(page:number,limit:number,search:string):Promise<ServiceCatalogResponse>=>{
  const res = await axiosClient.get(API_ROUTES.SERVICE_CENTER.MY_SERVICES(page,limit,search));
  return res.data
}

export const updateServiceFee = async(serviceId:string,advanceFee:number | null):Promise<ServiceCatalogResponse>=>{
  const res = await axiosClient.patch(API_ROUTES.SERVICE_CENTER.UPDATE_SERVICE_FEE,{serviceId,advanceFee})
  return res.data
}

export const addService = async(dto:AddServiceDTO)=>{
  const res = await axiosClient.post(API_ROUTES.SERVICE_CENTER.ADD_SERVICES,dto)
  return res.data
}

export const getcategories = async()=>{
  const res = await axiosClient.get(API_ROUTES.SERVICE_CENTER.GET_CATEGORIES)
  return res.data
}

export const toggleServiceStatus= async(serviceId:string)=>{
 const result = await axiosClient.patch(API_ROUTES.SERVICE_CENTER.TOGGLE_STATUS(serviceId))
 return result.data
}


export const GetServiceCenterPlans = async (): Promise<Subscription[]> => {
  const res = await axiosClient.get(API_ROUTES.SUBSCRIPTION.PLANS(50));
  return res.data.data.data; 
};
export const Getsubscription = async ()=>{
  const res = await axiosClient.get(API_ROUTES.SUBSCRIPTION.STATUS)
  const data = res.data.data ; 
  return data.hasActiveSubscription ? data.subscription : null;
}

  export const SubscribeToPlane = async(subscriptionId:string,durationMonths:number)=>{

    const res = await axiosClient.post(API_ROUTES.SUBSCRIPTION.SUBSCRIBE,{subscriptionId,durationMonths})
    const data = res.data.data 
    return data.hasActiveSubscription ? data.subscription : null;
  }

  export const CreatePaymentOrder = async(subscriptionId:string,durationMonths:number)=>{
    const res = await axiosClient.post(API_ROUTES.SUBSCRIPTION.CREATE_ORDER,{subscriptionId,durationMonths})
    return res.data.data 
  }
  export const VerifyPayment = async(payload:{
    razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  subscriptionId: string;
  durationMonths: number;
  })=>{
    const res = await axiosClient.post(API_ROUTES.SUBSCRIPTION.VERIFY_PAYMENT,payload)
    const data = res.data.data 
    return data.hasActiveSubscription ? data.subscription : null;
  }
  
  export const GetMyProfile = async()=>{

    const res = await axiosClient.get(API_ROUTES.SERVICE_CENTER.PROFILE)
    return res.data.data
  }
  export const UpdateAvailability = async(dto:AvailabilityFormData):Promise<AvailabilityFormData>=>{

    const res = await axiosClient.patch(API_ROUTES.SERVICE_CENTER.UPDATE_AVAILABILITY,dto)
    return res.data.data
  }