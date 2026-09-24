import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { LoginMechanic,CreatMechanic,getMechanics } from "../services/MechanicService";
import type { MechanicLoginDTO,CreateMechanicDTO,MechanicResponse } from "../interface/Mechanic";
import { API_ROUTES } from "../../../shared/api/apiRoutes";
import axiosClient from "../../../shared/api/axiosClient";


export interface MechanicUser {
  id: string;
  name: string;
  email: string;
  garageId: string;
}


interface MechanicAuthContextValue {
  mechanic: MechanicUser | null;
  loading: boolean;
  error: string | null;
  mechanics: MechanicResponse[];
  totalPages: number;
  currentPage: number;
  login: (data: MechanicLoginDTO) => Promise<any>;
  addMechanic: (data: CreateMechanicDTO) => Promise<any>;
  getMechanic: (page: number, limit: number, search?: string) => Promise<any>;
  fetchMechanicMe: () => Promise<void>;
}

const MechanicAuthContext = createContext< MechanicAuthContextValue | undefined>(undefined)

export function MechanicAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mechanics, setMechanics] = useState<MechanicResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [mechanic, setMechanic] = useState<MechanicUser | null>(null);

  const fetchMechanicMe = async () => {
    try {
      const res = await axiosClient.get(API_ROUTES.MECHANIC.ME);
      setMechanic({
        id: res.data.data.id,
        name: res.data.data.name,
        email: res.data.data.email,
        garageId: res.data.data.garageId,
      });
    } catch {
      setMechanic(null);
    }
  };

  useEffect(() => {
    fetchMechanicMe();
  }, []);

  const login = async (data: MechanicLoginDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginMechanic(data);
      await fetchMechanicMe();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMechanic = async (data: CreateMechanicDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CreatMechanic(data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create mechanic");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMechanic = async (page: number, limit: number, search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMechanics(page, limit, search);
      setMechanics(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch mechanics");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MechanicAuthContext.Provider
      value={{ mechanic, loading, error, mechanics, totalPages, currentPage, login, addMechanic, getMechanic, fetchMechanicMe }}
    >
      {children}
    </MechanicAuthContext.Provider>
  );
}

export function useMechanicAuth() {
  const context = useContext(MechanicAuthContext);
  if (!context) {
    throw new Error("useMechanicAuth must be used within a MechanicAuthProvider");
  }
  return context;
}