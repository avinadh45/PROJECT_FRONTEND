import { useCallback, useState } from "react";

import type {
  Subscription,
  SubscriptionCreatePayload,
  SubscriptionUpdatePayload,
} from "../interface/adminInterface";
import { AddSubscription, DeleteSubscription, ListSubscription, UpdateSubscription } from "../service/adminService";

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const createSubscription = async (data: SubscriptionCreatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const create = await AddSubscription(data);
      setSubscription((prev) => [create, ...prev]);
      return create;
    } catch (err: any) {
      setError(error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = useCallback(async(page = 1 ,limit = 5 ,search = "")=>{
    setLoading(true)
    setError(null)
    try {
       const result = await ListSubscription(page,limit,search) 
       setSubscription(result.data)
       setTotal(result.total)
       setTotalPages(result.totalPages)
    } catch (err:any) {
        setError(err?.response?.data?.message || "Failed to fetch subscription plans");
    }finally{
        setLoading(false)
    }
  },[])

  const updateSubscription = async(id:string,data:SubscriptionUpdatePayload)=>{
    setLoading(true)
    setError(null)
    try {
      const update = await UpdateSubscription(id,data) 
      setSubscription((prev)=> prev.map((p)=> (p.id === id ? update : p)))
      return update
    } catch (err:any) {
      setError(err?.response?.data?.message || "Failed to update subscription plan");
      throw err;
    }finally{
      setLoading(false)
    }
  }

  const deleteSubscription = async(id:string)=>{
    setLoading(true)
    setError(null)
    try {
      await DeleteSubscription(id)
      setSubscription((prev)=> prev.filter((p)=> p.id !== id))
    } catch (err:any) {
      setError(err?.response?.data?.message || "Failed to delete subscription plan");
      throw err
    }finally{
      setLoading(false)
    }
  }
  return {
    loading,
    subscription,
    total,
    totalPages,
    createSubscription,
    fetchSubscription,
    updateSubscription,
    deleteSubscription
  };
};
