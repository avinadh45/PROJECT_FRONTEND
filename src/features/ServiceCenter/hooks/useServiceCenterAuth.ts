import { useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  addService,
  BlockMechanic,
  forgotPasswordServicCenter,
  getcategories,
  getMyServices,
  loginServiceCnter,
  registerServicCenter,
  resetPasswordServiceCenter,
  updateServiceFee,
  toggleServiceStatus,

  GetServiceCenterPlans,
  Getsubscription,
  SubscribeToPlane,
  CreatePaymentOrder,
  VerifyPayment,
  UpdateAvailability
} from "../services/ServiceCenterService";
import type {
  AddServiceDTO,
  AvailabilityFormData,
  IServiceOffered,
  // ServiceCenterRegisterDTO,
  ServiceCenterLoginDTO,
} from "../interface/serviceCenter";
import axiosClient from "../../../shared/api/axiosClient";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import type { ActiveSubscription, Subscription } from "../types/subscription";
import type { AvailabilityFormDat } from "../types/slot";

export const useServiceCenterAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [mechanic, setMechanic] = useState();
  const [services, setServices] = useState<IServiceOffered[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [plans, setPlans] = useState<Subscription[]>([]); 
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const register = async (data: FormData) => {
    setLoading(true);
    setErrors({});
    try {
      let result = await registerServicCenter(data);
      return result;
    } catch (err: any) {
      handleApiError(err);
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
      localStorage.setItem(
        "serviceCenter",
        JSON.stringify(result.data.provider),
      );
      return result;
    } catch (err: any) {
      handleApiError(err);
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
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (token: string, password: string) => {
    setLoading(true);
    setErrors({});
    try {
      const data = await resetPasswordServiceCenter(token, password);
      return data;
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const block = async (id: string) => {
    setLoading(true);
    setErrors({});
    try {
      const mechanic = await BlockMechanic(id);
      setMechanic(mechanic);
      return mechanic;
    } catch (error) {}
  };
  const logoutServiceCenter = async () => {
    await axiosClient.post(API_ROUTES.SERVICE_CENTER.LOGOUT);
    localStorage.removeItem("serviceCenter");
    navigate("/service-center/login");
  };

  const handleApiError = (err: any) => {
    const backendErrors = err.response?.data?.errors;

    if (backendErrors && typeof backendErrors === "object") {
      setErrors(backendErrors);
    } else {
      setErrors({
        general:
          err.response?.data?.message || err.message || "Something went wrong",
      });
    }
  };
  const fetchServices = async (
    page: number,
    limit: number,
    search: string = "",
  ) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await getMyServices(page, limit, search);

      setServices(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      setErrors({ general: [err.response?.data?.message || err.message] });
    } finally {
      setLoading(false);
    }
  };
  const updateServiceCenterFee = async (
    serviceId: string,
    advanceFee: number | null,
  ) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await updateServiceFee(serviceId, advanceFee);
      
      setServices(res.data.data || []);
      return res;
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleAddservices = async (dto: AddServiceDTO) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await addService(dto);
      return res;
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async()=>{
    setLoading(true);
    setErrors({});
    try {
      const res = await getcategories()
      setCategories(res.data || [])
      return res.data
    } catch (err:any) {
      handleApiError(err)
      throw err
    }finally{
      setLoading(false)
    }
  }

  const toggleServiceStatu = async(id:string)=>{
    setLoading(true)
    setErrors({})
    try {
      const result  = await toggleServiceStatus(id)
      return result 
    } catch (err:any) {
      handleApiError(err)
      throw err
    }finally{
      setLoading(false)
    }
  }

  const fetchStatus = useCallback(async()=>{
    setLoading(true)
    setErrors({})
    try { 
      const result = await Getsubscription()
      setActiveSubscription(result)
    } catch (err:any) {
      handleApiError(err)
      throw err
    }finally{
      setLoading(false)
    }
  },[])

  const fetchPlans = useCallback(async()=>{
    setLoading(true)
    setErrors({})
    try {
      const result = await GetServiceCenterPlans()
      setPlans(result)
    } catch (err:any) {
      handleApiError(err)
      throw err
    }finally{
      setLoading(false)
    }
  },[])

  const subscribeToPlane = async(subscriptionId:string,durationMonths:number)=>{
     setLoading(true)
    setErrors({})
    try {
        const result = await SubscribeToPlane(subscriptionId,durationMonths)
        setActiveSubscription(result)
    } catch (err:any) {
      handleApiError(err)
      throw err
    }finally{
      setLoading(false)
    }
  }
  const createPaymentOrder = async(subscriptionId:string,durationMonths:number)=>{
    setLoading(true)
    setErrors({})
    try {
      return await CreatePaymentOrder(subscriptionId,durationMonths)
    } catch (err:any) {
      handleApiError(err)
    }finally{
      setLoading(false)
    }
  }
  const verifyPayment = async(payload:{
    razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  subscriptionId: string;
  durationMonths: number;
  })=>{
    return await VerifyPayment(payload)
  }

  const updateAvailability  = async(dto:AvailabilityFormData)=>{
    setLoading(true)
    setErrors({})
    try {
      
      const result = await UpdateAvailability(dto)
      return result 
    } catch (err:any) {
      handleAddservices(err)
    }finally{
      setLoading(false)
    }
  }
  return {
    register,
    login,
    handleforgotpassword,
    handleResetPassword,
    block,
    logoutServiceCenter,
    updateAvailability,
    fetchServices,
    setErrors,
    updateServiceCenterFee,
    handleAddservices,
    fetchCategories,
    toggleServiceStatu,
    fetchStatus,
    fetchPlans,
    subscribeToPlane,
    createPaymentOrder,
    verifyPayment,
    categories,
    total,
    totalPages,
    services,
    mechanic,
    loading,
    errors,
    activeSubscription,
    plans
  };
};
