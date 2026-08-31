import { useQuery } from "@tanstack/react-query";
import { getMyVehicle } from "../service/AuthService";
import type { VehicleResponse } from "../interface/vehicleIntraface";
import type { Vehicle } from "../interface/vehicleIntraface";

const mapToVehicle = (v: VehicleResponse): Vehicle => ({
  id: v.id,
  name: `${v.brand} ${v.model}`,
  plateNumber: v.RegistrationNumber,
  imageUrl: v.documents.vehicleImage, 
  type: v.vehicleType,
});

export const useVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const result = await getMyVehicle();
      return result.data.map(mapToVehicle);
    },
  });
};