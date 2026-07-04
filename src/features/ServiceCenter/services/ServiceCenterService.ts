import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import type {
  ServiceCenterAuthResponse,
  ServiceCenterLoginDTO,
} from "../interface/serviceCenter";

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