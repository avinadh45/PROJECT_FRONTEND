import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type{ VehicleResponse } from "../interface/vehicleIntraface";
import { deleteVehicle_API, getVehicleById, updateVehicle } from "../service/AuthService";
export function useVehicle() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [vehicle,setVehicle] = useState<VehicleResponse | null>(null)
  const navigate = useNavigate()
    const handleUpdateService = async (id: string, formData: FormData) => {
      setLoading(true);
      setErrors({});
      try {
        const res = await updateVehicle(id, formData);
        return res;
      } catch (err: any) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: [err.response?.data?.message || err.message] });
        }
        throw err;
      } finally {
        setLoading(false);
      }
    };
    
  const fetchVehicleById = async(id:string)=>{ 
    setLoading(true) 
    setErrors({})
    try {
      
      const vehicle = await getVehicleById(id) 
      setVehicle(vehicle.data)
    } catch (err:any) {
      handleError(err)
    }finally{
      setLoading(false)
    }
  }

const handleError = (err: any) => {
    if (err.response?.data?.errors) {
      setErrors(err.response.data.errors);
    } else {
      setErrors({ general: [err.response?.data?.message || err.message] });
    }
  }

  const deleteVehicle = async(id:string)=>{
     setLoading(true)
     setErrors({}) 
     try {
      await deleteVehicle_API(id)
      navigate('/my-vehicle')
     } catch (error) {
      
     }
  }
  return {
    loading,
    errors,
    vehicle,
    handleUpdateService,
    fetchVehicleById,
    deleteVehicle
  };

}