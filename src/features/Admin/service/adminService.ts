import axiosClient from "../../../shared/api/axiosClient";
import type {
  AdminLoginDTO,
  AdminAuthResponse,
  UserListDTO,
  ServiceCenterListDTO,
  UserDetailsDTO,
  PaginatedResponse,
  CategoryPaginationResponse,
  ServiceCenterDetailsDTO
} from "../interface/adminInterface";
import { API_ROUTES } from "../../../shared/api/apiRoutes";

export const adminLogin = async (
  data: AdminLoginDTO,
): Promise<AdminAuthResponse> => {
  const admin = await axiosClient.post(API_ROUTES.ADMIN.LOGIN, data);

  
  return admin.data.data
};

export const userList = async (page:number,limit:number,search:string = ""): Promise<PaginatedResponse<UserListDTO>> => {
  const user = await axiosClient.get(API_ROUTES.ADMIN.USER_LIST(page,limit,search));
  return user.data;
};

export const serviceCnterList = async (page:number,limit:number,search:string = ""): Promise<PaginatedResponse<ServiceCenterListDTO>> => {
  const serviceCenter = await axiosClient.get(API_ROUTES.ADMIN.SERVICE_CENTER_LIST(page,limit,search));
  return serviceCenter.data;
};

export const userDetails = async (id: string): Promise<UserDetailsDTO> => {
  const user = await axiosClient.get(API_ROUTES.ADMIN.USER_DETAILS(id));
  return user.data.data;
};
export const blockUser = async (id: string): Promise<UserDetailsDTO> => {
  const user = await axiosClient.patch(API_ROUTES.ADMIN.BLOCK_USER(id));
  return user.data.data;
};
export const serviceCenterDetail = async (
  id: string,
): Promise<ServiceCenterDetailsDTO> => {
  const serviceCenter = await axiosClient.get(API_ROUTES.ADMIN.SERVICE_CENTER_DETAILS(id));
  return serviceCenter.data.data;
};
export const blockServiceCenter = async (
  id: string,
): Promise<ServiceCenterDetailsDTO> => {
  const serviceCenter = await axiosClient.patch(API_ROUTES.ADMIN.BLOCK_SERVICE_CENTER(id));
  return serviceCenter.data.data;
};

export const createCategory = async (data: {
  name: string;
  advanceFee: number;
  iconFile: File;
}) => {
  console.log("here is that");

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("advanceFee", String(data.advanceFee));
  formData.append("icon", data.iconFile);
  const category = await axiosClient.post(API_ROUTES.ADMIN.CREATE_CATEGORY, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return category.data.data;
};

  export const getAllCategory = async (
    page: number,
    limit: number,
  ): Promise<CategoryPaginationResponse> => {
    const category = await axiosClient.get(
      API_ROUTES.ADMIN.GET_ALL_CATEGORY(page,limit),
    );
    return category.data;
  };

export const deleteCategory = async (id: string) => {
  const result = await axiosClient.delete(API_ROUTES.ADMIN.DELETE_CATEGORY(id));
  return result.data;
};
export const updateCategory = async (id: string, formData: FormData) => {
  const res = await axiosClient.put(API_ROUTES.ADMIN.UPDATE_CATEGORY(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
export const block = async (id: string) => {
  const result = await axiosClient.patch(API_ROUTES.ADMIN.CATEGORY_STATUS(id));
  return result.data;
};
export const verifyServiceCenter = async()=>{
  const servicenterCenters = await axiosClient.get(API_ROUTES.ADMIN.VERIFY_SERVICE_CENTER)
  return servicenterCenters.data 
}
export const verifiDetails = async(id:string)=>{
  const response = await axiosClient.get(API_ROUTES.ADMIN.VERIFY_DETAILS(id))
  return response.data
}
export const acceptVerification = async(id:string)=>{

  return await axiosClient.patch(API_ROUTES.ADMIN.APPROVE_SERVICE_CENTER(id))
}
export const rejectVerification = async(id:string,rejectionReason:string)=>{
  return await axiosClient.patch(API_ROUTES.ADMIN.REJECT_SERVICE_CENTER(id),{rejectionReason})
}
