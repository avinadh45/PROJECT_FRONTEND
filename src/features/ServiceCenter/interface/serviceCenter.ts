export interface ServiceCenterRegisterDTO {

  email: string;
  password: string;

  providerProfile: {
    ownerName: string;
    garageName: string;
    phone: string;

    location: {
      type: string;
      coordinates: number[];
    };
  };

  servicesOffered: {
    serviceId: string;
     vehicleTypes: string[];
    serviceModes: string[];
  }[];
}

export interface ServiceCenterLoginDTO {
  email: string
  password: string
}
export interface ServiceCenterAuthResponse {
  success: boolean;
  data: {
    provider: {
      _id: string
      email: string
      isBlocked?: boolean
    }
    accessToken: string
    refreshToken: string
  }
}
export interface VerificationStatusDTO {

   status:
      | "pending"
      | "approved"
      | "rejected";

   garageName: string;

   submittedAt?: Date;

   reviewedAt?: Date;

   rejectionReason?: string;

   rejectionDetails?: string;
}