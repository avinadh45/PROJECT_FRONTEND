export interface CreateVehicleDTO{
  vehicleType: string;
  FuelType: string;
  brand: string;
  model: string;
  year: string;
  odometer: string;
  lastNotedKms: string;
  RegistrationNumber: string;
  insuranceExpiryDate: string;
  RCNumber: string;
}
export interface VehicleDocuments{ 
    vehicleImage:string;
    RCDocument:string; 
    POCDocument:string;
}
export interface VehicleResponse{
      id: string;
  userId: string;
  vehicleType: string;
  FuelType: string;
  brand: string;
  model: string;
  year: number;
  odometer: number;
  lastNotedKms: number;
  RegistrationNumber: string;
  insuranceExpiryDate: Date;
  RCNumber: string;
  documents: VehicleDocuments;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface VehicleApiResponse {
  success: boolean;
  message: string;
  data: VehicleResponse;
}
export interface VehicleListApiResponse {
  success: boolean;
  message: string;
  data: VehicleResponse[];  
}
export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  imageUrl: string;
  type: string;
}