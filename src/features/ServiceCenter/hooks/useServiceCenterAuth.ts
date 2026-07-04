import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BlockMechanic,
  forgotPasswordServicCenter,
  loginServiceCnter,
  registerServicCenter,
  resetPasswordServiceCenter,
} from "../services/ServiceCenterService";
import type {
 // ServiceCenterRegisterDTO,
  ServiceCenterLoginDTO,
} from '../interface/serviceCenter';
import axios from "axios";
import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";


export const useServiceCenterAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mechanic,setMechanic] = useState()
   const navigate = useNavigate()
  const register = async (data: FormData) => {
    setLoading(true);
    setErrors({});
    try {
      
      let result = await registerServicCenter(data);
      return result;
    } catch (err: any) {
      handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: ServiceCenterLoginDTO) => {
    setLoading(true);
    setErrors({});
    try {
      let result = await loginServiceCnter(data);
      localStorage.setItem("serviceCenter", JSON.stringify(result.data.provider));
      return result;
    } catch (err: any) {
      handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleforgotpassword = async (email: string) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await forgotPasswordServicCenter(email);
      return res;
    } catch (err: any) {
      handleApiError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async(token:string,password:string)=>{

    setLoading(true)
    setErrors({})
    try {
        const data = await resetPasswordServiceCenter(token,password)
        return data
    } catch (err: any) {
        handleApiError(err)
      throw err;
    }finally{
        setLoading(false)
    }
  }
  const block = async(id:string)=>{
    setLoading(true)
    setErrors({})
    try {
      const mechanic = await BlockMechanic(id)
      setMechanic(mechanic)
      return mechanic
    } catch (error) {
      
    }
  }
  const logoutServiceCenter = async()=>{
   await axiosClient.post(API_ROUTES.SERVICE_CENTER.LOGOUT)
    localStorage.removeItem("serviceCenter");
    navigate("/service-center/login")
  }
  
const handleApiError = (err: any) => {

  const backendErrors =
    err.response?.data?.errors;

  if (
    backendErrors &&
    typeof backendErrors === "object"
  ) {

    setErrors(backendErrors);

  } else {

    setErrors({
      general:
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
    });

  }

};
  return {
    register,
    login,
    handleforgotpassword,
    handleResetPassword,
    block,
    logoutServiceCenter,
    mechanic,
    loading,
    setErrors,
    errors,
  };
};
