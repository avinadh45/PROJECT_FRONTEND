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
export interface IServiceOffered {
  serviceId: {
    _id: string;
    name: string;
    icon: string;
    advanceFee: number;
  };
  advanceFee: number  | null;
  status: "active" | "inactive";
  vehicleTypes: string[];
  serviceModes: string[];
}

export interface ServiceCatalogResponse {
  success: boolean;
  message: string;
  data: {
    data: IServiceOffered[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

}
export interface AddServiceDTO {
  serviceId: string;
  advanceFee: number | null;
   vehicleTypes: string[];
  serviceModes: string[];
 
}
export interface AvailabilityFormData {
  workingDays: string[];        
  workingHours: { start: string; end: string };
  slotDuration: number;          
  maxBookingsPerSlot: number;
}