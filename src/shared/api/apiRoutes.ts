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
    EDIT_VERIFICATION:"/service-center/application",
    MY_SERVICES:(page:number,limit:number,search:string = "")=> 
      `/service-center/services?page=${page}&limit=${limit}&search=${search}`,
    UPDATE_SERVICE_FEE:"/service-center/fee",
    ADD_SERVICES:"/service-center/add-service",
    GET_CATEGORIES:"/service-center/categories",
    TOGGLE_STATUS:(serviceId:string)=> `/service-center/status/${serviceId}`,
    PROFILE:'/service-center/profile',
    UPDATE_AVAILABILITY:"/service-center/availability",
    LIST:(page:number,limit:number,status?:string,search?:string)=>{
      const params = new URLSearchParams({page:String(page),limit:String(limit)});
      if(status) params.set("status",status)
      if(search) params.set("search",search) 
        return `/service-center/bookings?${params.toString()}`
    }
    
  },
  MECHANIC: {
    LOGIN: "/mechanic/login",
    CREATE: "/mechanic/create",
    LIST: (page: number, limit: number,search:string = "") =>
      `/mechanic/list?page=${page}&limit=${limit}&search=${search}`,
    BOOKINGS:(page:Number,limit:number,status?:string,search?:string)=>{
      const params = new URLSearchParams({page:String(page),limit:String(limit)})
      if(status) params.set("status",status)
      if(search) params.set("search",search)
        return `/mechanic/bookings?${params.toString()}`
    },
    BOOKING_DETAILS:(bookingId:string)=>`/mechanic/bookings/${bookingId}`
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
    CHECK_CATEGORY_NAME:(name:string)=> `/admin/categorys/check-name?name=${encodeURIComponent(name)}`
  },
  VEHICLE:{
    ADD:"/vehicle/add",
    GET_VEHICLE:"/vehicle/my-vehicle",
    UPDATE_VEHICLE: (id:string)=> `/vehicle/update/${id}`,
    GET_VEHICLE_BY_ID:(id:string)=> `/vehicle/${id}`, 
    DELETE:(id:string)=> `/vehicle/delete/${id}`
  },
  SUBSCRIPTION:{
    ADD_SUBSCRIPTION:"/subscription/add",
    LIST_SUBSCRIPTION:(page:number,limit:number,search:string="")=>{
       return  `subscription/list?page=${page}$limit=${limit}&search=${encodeURIComponent(search)}`
    },
    UPDATE_SUBSCRIPTION:(id:string)=> `subscription/${id}`,
    DELETE_SUBSCRIPTION:(id:string)=> `subscription/${id}`,
    PLANS: (limit: number = 50) => `subscription/plans?limit=${limit}`,
    STATUS:"/subscription/status",
    SUBSCRIBE:"/subscription/subscribe",
    CREATE_ORDER:"/subscription/create-order",
    VERIFY_PAYMENT:"/subscription/verify-payment"
  },
  SLOT:{
   GET_SLOT: (serviceCenterId: string, date: string) => `/slot/${serviceCenterId}/slots?date=${date}`,
   BLOCK_SLOT:'/slot/block',
   UNBLOCK_SLOT:"/slot/unblock",
   BLOCK_FULL_DAY:"/slot/block-day",
   UNBLOCK_FULL_DAY:"/slot/unblock-day"
  },
  BOOKING:{
    GARAGES:'/booking/garages',
    CATEGORIES:"/booking/categories",
    GET_SLOTS: (serviceCenterId: string, date: string) => `/booking/${serviceCenterId}/slots?date=${date}`,
    CREATE_ORDER:"/booking/create-order",
    VERIFY_PAYMENT:"/booking/verify-payment",
    GET_BY_ID:(bookingId:string)=> `/booking/${bookingId}`,
    
  }
};
