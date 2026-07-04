import axiosClient from "../../../shared/api/axiosClient";
import type {
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  VerifyOtpDTO,
} from "../interface/authinterface";
import { API_ROUTES } from "../../../shared/api/apiRoutes";

export const Register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const { confirmPassword,...user} = data
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