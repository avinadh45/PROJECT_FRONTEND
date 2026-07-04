import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminLogin,
  userList,
  serviceCnterList,
  userDetails,
  blockUser,
  serviceCenterDetail,
  blockServiceCenter,
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
  block,
  verifyServiceCenter,
  verifiDetails,
  acceptVerification,
  rejectVerification,
} from "../service/adminService";
import type {
  AdminLoginDTO,
  UserListDTO,
  ServiceCenterListDTO,
  UserDetailsDTO,
  ServiceCenterDetailsDTO,
  VerificationDetailsDTO,
  //CategoryDTO
} from "../interface/adminInterface";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import axiosClient from "../../../shared/api/axiosClient";
export const useAdminAuth = () => {
  const [users, Setuser] = useState<UserListDTO[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenterListDTO[]>([],);
  const [selectedServiceCenter, SetSelectedServiceCenter] =
    useState<ServiceCenterDetailsDTO | null>(null);
  const [selectedUser, SetselectedUser] = useState<UserDetailsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [details,setDetails] = useState<VerificationDetailsDTO | null>(null)
const [page, setPage] = useState(1);
const limit = 5 
const [totalPages, setTotalPages] = useState(1);
const navigate = useNavigate()
  const login = async (data: AdminLoginDTO) => {
    setLoading(true);
    setError(null);
    try {
      const admin = await adminLogin(data);
      return admin;
    } catch (error: any) {
      setError(
        error.response?.data?.message || error.message || "login failed",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const usersList = async (search:string = "") => {
    setLoading(true);
    setError(null);
    try {
      const result = await userList(page,limit,search);
      Setuser(result.data);
      setTotalPages(result.totalPages)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceCenters = async (page:number,limit:number,search:string = "") => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceCnterList(page,limit,search);
      setServiceCenters(result.data);
      setTotalPages(result.totalPages)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const UsersDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      let user = await userDetails(id);
      SetselectedUser(user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const Blockuser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await blockUser(id);
      SetselectedUser(user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const serviceCenterDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const serviceCenter = await serviceCenterDetail(id);
      SetSelectedServiceCenter(serviceCenter);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  const serviceCenterblock = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const serviceCenter = await blockServiceCenter(id);
      SetSelectedServiceCenter(serviceCenter);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const addCategory = async (data: {
    name: string;
    advanceFee: number;
    iconFile: File;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createCategory(data);
      setCategories((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getallCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategory(page,limit);
      setCategories(response.data);
      setTotalPages(response.totalPages)
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const editCategory = async (id: string, data: any) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("advanceFee", data.advanceFee);
    formData.append("status", data.status);

    if (data.iconFile) {
      formData.append("icon", data.iconFile);
    }
    return updateCategory(id, formData);
  };

  const blockun = async (id: string) => {
    console.log("calling toggle with id:", id);
    try {
      const res = await block(id);
      console.log("API response:", res);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, status: res.data.status } : cat,
        ),
      );
    } catch (error: any) {
      setError(error.message);
    }
  };
  const FetchverifyServicecenter = async()=>{
     setLoading(true)
    try {
     
      const response = await verifyServiceCenter()
       console.log(response);
      setServiceCenters(response.serviceCenter)
    } catch (error:any) {
      setError(error.response?.data?.message || error.message)
    }finally{
      setLoading(false)
    }
  } 
const verifyDetails = async(id:string)=>{
  setLoading(true)
  try {
    const response = await verifiDetails(id)
    setDetails(response.data   )
    
  } catch (error:any) {
     setError(error.response?.data?.message || error.message)
  }finally{
    setLoading(false)
  }
}

 const verificationApprove=async(id:string)=>{
  try {
    
    await acceptVerification(id)
    await verifiDetails(id)
  } catch (error:any) {
    setError(error.message)
  }
 }
 const verificationReject = async(id:string,rejectionReason:string)=>{
  try {
    await rejectVerification(id,rejectionReason)
    await verifiDetails(id)
  } catch (error:any) {
    setError(error.message)
  }
 }
 const logoutAdmin = async ()=>{
  await axiosClient.post(API_ROUTES.ADMIN.LOGOUT)
  navigate("/admin/login")
 }
  return {
    login,
    usersList,
    fetchServiceCenters,
    Blockuser,
    UsersDetails,
    serviceCenterDetails,
    serviceCenterblock,
    addCategory,
    getallCategory,
    editCategory,
    blockun,
    removeCategory,
    setPage,
    FetchverifyServicecenter,
    verifyDetails,
    verificationApprove,
    verificationReject,
    logoutAdmin,
    details,
    page,
    totalPages,
    categories,
    selectedServiceCenter,
    users,
    serviceCenters,
    selectedUser,
    loading,
    error,
  };
};
