export interface AdminLoginDTO {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  admin: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
}
export interface UserListDTO {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isBlocked?: boolean;
  createdAt?: Date;
}
export interface ServiceCenterListDTO {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  verificationStatus: string;
  isBlocked?: boolean;
}
export interface UserDetailsDTO {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isBlocked: boolean;
  createdAt: string;
}
export interface ServiceCenterDetailsDTO {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  isBlocked?: boolean;
  createdAt?: string;
}
export interface CategoryDTO {
  id: string;
  name: string;
  advanceFee: number;
  icon: string;
  status: string;
  createdAt: string;
}
export interface UpdateCategoryPayload {
  name?: string;
  advanceFee?: number;
  status?: "active" | "inactive";
  iconFile?: File;
}

export interface CategoryPaginationResponse {
  data: CategoryDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface verifyServiceCenter {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  verificationStatus: string;
  isBlocked?: boolean;
}
export interface VerificationDetailsDTO {
  id: string;

  email: string;

  verificationStatus: string;

  createdAt?: string;

  providerProfile: {
    ownerName: string;

    garageName: string;

    phone: string;

    formattedAddress?: string;

    location?: {
      type: "Point";
      coordinates: number[];
    };

    documents?: {
      garageLicense?: {
        url: string;
      };

      ownerIdProof?: {
        url: string;
      };
    };
  };

  availability?: {
    workingDays: string[];

    workingHours: {
      start: string;
      end: string;
    };
  };

  servicesOffered?: {
      serviceId: {
    name: string;
  };
    vehicleTypes: string[];

    serviceModes: string[];
  }[];
}

export interface PricingTier {
  durationMonths: number;
  price: number;
}

export interface Subscription {
  id: string;
  name: string;
  features: string[];
  pricing: PricingTier[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionCreatePayload {
  name: string;
  features: string[];
  pricing: PricingTier[];
  status?: "active" | "inactive";
}

export interface SubscriptionUpdatePayload {
  name?: string;
  features?: string[];
  pricing?: PricingTier[];
  status?: "active" | "inactive";
}