
export interface RegisterDTO {
    name:string
    email:string
    password:string
    confirmPassword:string
    phoneNumber:string
}
export interface VerifyOtpDTO{
    email:string
    otp:string
}
export interface LoginDTO{
    email:string
    password:string
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      isVerified?: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}