import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type {
  RegisterDTO,
  VerifyOtpDTO,
  LoginDTO,
} from "../interface/authinterface";
import {
  Register,
  verifyOtp,
  login,
  forgotPassword,
  resendOtp,
  resetPassword,
  googleLogin,
  logout,
} from "../service/AuthService";
import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");

  //   const publicRoutes = ["/login", "/register", "/verify"];

  //   if (token && publicRoutes.includes(window.location.pathname)) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate, location.pathname]);

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

  const Login = async (data: LoginDTO) => {
    setLoading(true);
    clearMessages();
    try {
      let user = await login(data);
      if (!user.success) {
        setErrors({general:user.message});
        return;
      }
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

  const logoutuser = async () => {
    try {
      await axiosClient.post(API_ROUTES.USER.LOGOUT)
      localStorage.removeItem("user")
        navigate("/login");
    } catch {
    } finally {
      
    
    }
  };
  const handleApiError = (err:any)=>{
    if(err.response?.data?.errors){
      setErrors(err.response.data.errors)
    }else{
      setErrors({general:err.response?.data?.message || err.message})
    }
  }
  return {
    errors,
    setErrors,
    loading,
    success,
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
  };
}
