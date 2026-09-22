import { createContext, useContext, useState,  useEffect} from "react";
import type{ ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type {
  RegisterDTO,
  VerifyOtpDTO,
  LoginDTO,
  //AuthUser,
} from "../interface/authinterface";
import {
  Register,
  verifyOtp,
  login,
  forgotPassword,
  resendOtp,
  resetPassword,
  googleLogin,
  getMyVehicle,
  addVehicle
  
} from "../service/AuthService";

import type{ VehicleResponse } from "../interface/vehicleIntraface";
import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
interface AuthContextValue {
  user: AuthUser | null;
  errors: Record<string, string>;
  loading: boolean;
  vehicles: VehicleResponse[];
  success: string | null;
  setErrors: (e: Record<string, string>) => void;
  handleApiError: (err: any) => void;
  setSuccess: (s: string | null) => void;
  handleRegister: (data: RegisterDTO) => Promise<any>;
  handleVerify: (otpValue: VerifyOtpDTO) => Promise<any>;
  Login: (data: LoginDTO) => Promise<any>;
  clearMessages: () => void;
  logoutuser: () => Promise<void>;
  handleResendOtp: (email: string) => Promise<any>;
  handleForgotPassword: (email: string) => Promise<any>;
  handleResetPassword: (token: string, email: string, password: string) => Promise<any>;
  googleLoginHandler: (token: string) => Promise<any>;
  handleAddVehicle: (formData: FormData) => Promise<any>;
  fetchVehicle: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export function AuthProvider({children}:{children: ReactNode}){
     const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
  fetchMe();
}, []);

  const clearMessages = () => {
    setErrors({});
    setSuccess(null);
  };

  const handleRegister = async (data: RegisterDTO) => {
    try {
      
      setLoading(true);
      clearMessages();
      let user = await Register(data);
      localStorage.setItem("verifyEmail", data.email);
      localStorage.setItem("otp_sent_time", Date.now().toString());
      setSuccess(
        "Registration successful! Please verify the OTP sent to your email.",
      );
      navigate("/verify");
      return user;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          general: err.message,
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (otpValue: VerifyOtpDTO) => {
    setLoading(true);
    clearMessages();
    try {
      const data = await verifyOtp(otpValue);
      setSuccess("OTP verified successfully! You can now login.");
      navigate("/dashboard");
      return data;
    } catch (err: any) {
      handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleApiError = (err:any)=>{
    if(err.response?.data?.errors){
      setErrors(err.response.data.errors)
    }else{
      setErrors({general:err.response?.data?.message || err.message})
    }
  }
  const handleAddVehicle = async(formData:FormData)=>{
    setLoading(true)
    setErrors({})
  try {
    const res = await addVehicle(formData) 
      return res 
  } catch (err:any) {
    if(err.response?.data?.errors){
      setErrors(err.response.data.errors);
    }else{
      setErrors({ general: err.response?.data?.message || err.message });
    }
    throw err
  }finally{
    setLoading(false)
  }
  }
const fetchVehicle = async()=>{
  setLoading(true)
  try {
    const res = await getMyVehicle();
    console.log("API response:", res); 
    setVehicles(res.data)
  } catch (err:any) {
    console.log("fetchVehicle error:", err);
     setErrors({ general: err.response?.data?.message || err.message });
  }finally{
    setLoading(false)
  }
} 
const fetchMe = async()=>{

  try {
    const res = await axiosClient.get(API_ROUTES.USER.ME)
   setUser({
      id: res.data.data.id,
      name: res.data.data.name,
      email: res.data.data.email,
      role: res.data.data.role,
    });
  } catch{
    setUser(null)
  }
}
  const logoutuser = async () => {
    try {
      await axiosClient.post(API_ROUTES.USER.LOGOUT)
      localStorage.removeItem("user")
        navigate("/login");
    } catch {
    } finally {
      
    
    }
  };
  
  const googleLoginHandler = async (token: string) => {
    setLoading(true);
    clearMessages();
    try {
      let response = await googleLogin(token);
      navigate("/dashboard");
      return response;
    } catch (err: any) {
      handleApiError(err)
    } finally {
      setLoading(false);
    }
  };
   const handleResendOtp = async (email: string) => {
    setLoading(true);
    clearMessages();
    try {
      let data = await resendOtp(email);
      setSuccess("Otp resent successfull");
      return data;
    } catch (err: any) {
     handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    clearMessages();
    try {
      let response = await forgotPassword(email);
      setSuccess("Reset link sent to your email");
      return response;
    } catch (err: any) {
     handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };
    const Login = async (data: LoginDTO) => {
    setLoading(true);
    clearMessages();
    try {
      let user = await login(data);
      if (!user.success) {
        setErrors({general:user.message});
        return;
      }
      setUser({
      id: user.data.user._id,
      name: user.data.user.name,
      email: user.data.user.email,
      role: user.data.user.role,
    });
      navigate("/dashboard");
      return user;
    } catch (err: any) {
     handleApiError(err)
      return;
    } finally {
      setLoading(false);
    }
  };
   const handleResetPassword = async (
    token: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    clearMessages();
    try {
      const ResetPassword = await resetPassword(token, email, password);
      setSuccess("Password reset successful");
      return ResetPassword;
    } catch (err: any) {
      handleApiError(err)
      throw err;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        errors,
        loading,
        vehicles,
        success,
        setErrors,
        handleApiError,
        setSuccess,
        handleRegister,
        handleVerify,
        Login,
        clearMessages,
        logoutuser,
        handleResendOtp,
        handleForgotPassword,
        handleResetPassword,
        googleLoginHandler,
        handleAddVehicle,
        fetchVehicle,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}