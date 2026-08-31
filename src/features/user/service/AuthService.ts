import axiosClient from "../../../shared/api/axiosClient";
import type {
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  VerifyOtpDTO,
} from "../interface/authinterface";
import type{ VehicleApiResponse,VehicleListApiResponse } from "../interface/vehicleIntraface";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import type { BookingConfirmation, BookingOrderPayload, BookingOrderResult, GarageFilter, VerifyPaymentPayload } from "../interface/bookingInterface";

export const Register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const {...user} = data
  const response = await axiosClient.post(API_ROUTES.USER.REGISTER, user);
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpDTO): Promise<AuthResponse> => {
  const response = await axiosClient.post(API_ROUTES.USER.VERIFY_OTP, data);
  return response.data;
};

export const login = async (data: LoginDTO): Promise<AuthResponse> => {
  const response = await axiosClient.post(API_ROUTES.USER.LOGIN, data);

  return response.data;
};
export const resendOtp = async (email: string): Promise<AuthResponse> => {
  const responce = await axiosClient.post(API_ROUTES.USER.RESEND_OTP,{email});
  return responce.data;
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  const responce = await axiosClient.post(API_ROUTES.USER.FORGOT_PASSWORD,{ email});
  return responce.data;
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const responce = await axiosClient.post(API_ROUTES.USER.RESET_PASSWORD, {
    token,
    email,
    password,
  });
  return responce.data;
};  

export const googleLogin = async (token: string): Promise<AuthResponse> => {
  const response = await axiosClient.post(API_ROUTES.USER.GOOGLE_LOGIN, {token});
  return response.data;
};
export const logout = async()=>{
  return await axiosClient.post(API_ROUTES.USER.LOGOUT) 
}

export const addVehicle = async(formData:FormData):Promise<VehicleApiResponse>=>{
  const response = await axiosClient.post(API_ROUTES.VEHICLE.ADD,formData,{
    headers:{ "Content-Type":"multipart/form-data"},
  })
  return response.data
}

export const getMyVehicle = async():Promise<VehicleListApiResponse>=>{
  const response = await axiosClient.get(API_ROUTES.VEHICLE.GET_VEHICLE) 
  return response.data 
}

export const updateVehicle = async(id:string,formData:FormData):Promise<VehicleApiResponse>=>{

  const responce = await axiosClient.put(API_ROUTES.VEHICLE.UPDATE_VEHICLE(id),formData,{
    headers:{"Content-Type":"multipart/form-data"}
  })
  return responce.data
}

export const getVehicleById = async(id:string):Promise<VehicleApiResponse>=>{
  const vehicle = await axiosClient.get(API_ROUTES.VEHICLE.GET_VEHICLE_BY_ID(id)) 
  return vehicle.data 
}

export const deleteVehicle_API = async(id:string):Promise<void>=>{
  return await axiosClient.delete(API_ROUTES.VEHICLE.DELETE(id))
}

export const fetchGarages = async(filter:GarageFilter)=>{

  const res = await axiosClient.get(API_ROUTES.BOOKING.GARAGES,{params:filter})
  return res.data.data
}

export const fetchCategories  = async()=>{

  const res = await axiosClient.get(API_ROUTES.BOOKING.CATEGORIES,{params: { page: 1, limit: 50, status: "active" }})
  return res.data.data
}


export const fetchSlot  = async(serviceCenterId:string,date:string)=>{

  const res = await axiosClient.get(API_ROUTES.BOOKING.GET_SLOTS(serviceCenterId,date))
  return res.data.data
}

export const createBooking = async(payload:BookingOrderPayload):Promise<BookingOrderResult>=>{
  const res = await axiosClient.post(API_ROUTES.BOOKING.CREATE_ORDER,payload)
  return res.data.data 
}

export const verifyBookingPayment = async(payload:VerifyPaymentPayload):Promise<BookingConfirmation>=>{
  const res = await axiosClient.post(API_ROUTES.BOOKING.VERIFY_PAYMENT,payload)
  return res.data.data
}

export const fetchBookingById  = async(bookingId:string): Promise<BookingConfirmation>=>{

  const res = await axiosClient.get(API_ROUTES.BOOKING.GET_BY_ID(bookingId))
  return res.data.data 
}