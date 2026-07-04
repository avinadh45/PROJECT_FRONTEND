export const API_ROUTES = {
  USER: {
    REGISTER: "/register",
    VERIFY_OTP: "/verify-otp",
    LOGIN: "/login",
    RESEND_OTP: "/resend-otp",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    GOOGLE_LOGIN: "/google-login",
    LOGOUT: "/logout",
  },
  SERVICE_CENTER: {
    REGISTER: "/service-center/register",
    LOGIN: "/service-center/login",
    LOGOUT:"/service-center/logout",
    FORGOT_PASSWORD: "/service-center/forgot-password",
    RESET_PASSWORD: "/service-center/reset-password",
    BLOCK_MECHANIC: (id: string) => `/service-center/block/${id}`,
    VERIFICATION_STATUS:"/service-center/verification-status",
    EDIT_VERIFICATION:"/service-center/application"
    
  },
  MECHANIC: {
    LOGIN: "/mechanic/login",
    CREATE: "/mechanic/create",
    LIST: (page: number, limit: number,search:string = "") =>
      `/mechanic/list?page=${page}&limit=${limit}&search=${search}`,
  },
  ADMIN: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    USER_LIST: (page: number, limit: number , search:string = "") =>
      `/admin/userList?page=${page}&limit=${limit}&search=${search}`,

    USER_DETAILS: (id: string) => `/admin/users/${id}`,

    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,

    SERVICE_CENTER_LIST: (page: number, limit: number,search:string="") =>
      `/admin/serviceCenterList?page=${page}&limit=${limit}&search=${search}`,

    SERVICE_CENTER_DETAILS: (id: string) => `/admin/serviceCenter/${id}`,

    BLOCK_SERVICE_CENTER: (id: string) => `/admin/serviceCenter/${id}/block`,

    CREATE_CATEGORY: "/admin/categorys",

     GET_ALL_CATEGORY: (page: number, limit: number) =>
    `/admin/categorys?page=${page}&limit=${limit}`,

      DELETE_CATEGORY: (id: string) =>
    `/admin/categorys/${id}`,

      UPDATE_CATEGORY: (id: string) =>
    `/admin/categorys/${id}`,

    CATEGORY_DETAILS: (id: string) => `/admin/categorys/${id}`,

    CATEGORY_STATUS: (id: string) => `/admin/categorys/${id}/status`,

    VERIFY_SERVICE_CENTER: "/admin/verifyServiceCenter",

    VERIFY_DETAILS: (id: string) => `/admin/verifyServiceCenter/${id}`,

    APPROVE_SERVICE_CENTER: (id: string) =>
      `/admin/verifyServiceCenter/approve/${id}`,

    REJECT_SERVICE_CENTER: (id: string) =>
      `/admin/verifyServiceCenter/reject/${id}`,
  },
};
