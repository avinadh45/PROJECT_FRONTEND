import { useState, useCallback } from "react";
import type { Slot } from "../types/slot";
import { Block, BlockFullDay, getAvailableSlots, UnBlockFullDay, UnBlockSlot } from "../services/slotService";

export const useSlotManagement = (serviceCenterId: string) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlot = useCallback(
    async (date: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAvailableSlots(serviceCenterId, date);
        setSlots(result);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch slots");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [serviceCenterId],
  );
  const block = async(date:string,time:string)=>{
    setLoading(true)
    setError(null)
    try {
      await Block(date,time)
      await fetchSlot(date)
    } catch (err:any) {
         setError(err?.response?.data?.message || "Failed to block slot");
         throw err;
    }finally{
      setLoading(false)
    }
  }
  const unBlockSlot = async(date:string,time:string)=>{

    setLoading(true)
    setError(null)
    try {
      await UnBlockSlot(date,time)
      await fetchSlot(date)
    } catch (err:any) {
      setError(err?.response?.data?.message || "Failed to unblock slot");
      throw err;
    }finally{
      setLoading(false)
    }
  }
  const blockFullDay = async(date:string)=>{
    console.log("hook blockFullDay called with date:", date);
    setLoading(true)
    setError(null)
    try {
      await BlockFullDay(date)
      await fetchSlot(date)
    } catch (err:any) {
      setError(err?.response?.data?.message || "Failed to unblock slot");
      throw err;
    }finally{
      setLoading(false)
    }
  }
  const unBlockFullDay = async(date:string)=>{
    setLoading(true)
    setError(null) 
    try {
      await UnBlockFullDay(date)
      await fetchSlot(date)
    } catch (err:any) {
      setError(err?.response?.data?.message || "Failed to unblock slot");
      throw err;
    }finally{
      setLoading(false)
    }
  }

  return {
    slots,
    loading,
    error,
    fetchSlot,
    block,
    unBlockSlot,
    blockFullDay,
    unBlockFullDay
  }
};
