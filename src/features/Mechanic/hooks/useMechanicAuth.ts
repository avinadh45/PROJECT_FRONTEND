import { useState } from "react";

// import { LoginMechanic } from "../service/MechanicService";
import {
  LoginMechanic,
  CreatMechanic,
  getMechanics,
} from "../services/MechanicService";

import type {
  MechanicLoginDTO,
  CreateMechanicDTO,
  MechanicResponse,
} from "../interface/Mechanic";

export const useMechanicAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mechanics, setMechanics] = useState<MechanicResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const login = async (data: MechanicLoginDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginMechanic(data);
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
  const getMechanic = async (page: number, limit: number,search:string = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMechanics(page, limit,search);
      setMechanics(response.data);
      setTotalPages(response.totalPages)
      setCurrentPage(response.page)
      return response;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch mechanics",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // const logout = () => {
  //     service.logout();
  // };

  return {
    login,
    addMechanic,
    getMechanic,
    mechanics,
    loading,
    totalPages,
    currentPage,
    error,
  };
};
