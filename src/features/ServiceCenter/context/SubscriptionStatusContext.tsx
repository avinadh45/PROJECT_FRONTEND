import { createContext, useContext,useCallback, useEffect, useState,  } from "react";
import type { ReactNode } from "react";
import type { ActiveSubscription } from "../types/subscription";
import { Getsubscription } from "../services/ServiceCenterService";

interface SubscriptionStatusContextValue {
  activeSubscription: ActiveSubscription | null;
  loading: boolean;
  refetchStatus: () => Promise<void>;
}
const SubscriptionStatusContext = createContext<SubscriptionStatusContextValue | undefined>(undefined);
export function SubscriptionStatusProvider({ children }: { children: ReactNode }) {
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  const refetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Getsubscription();
      setActiveSubscription(result);
    } catch {
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchStatus();
  }, [refetchStatus]);

  return (
    <SubscriptionStatusContext.Provider value={{ activeSubscription, loading, refetchStatus }}>
      {children}
    </SubscriptionStatusContext.Provider>
  );
}
export function useSubscriptionStatus() {
  const ctx = useContext(SubscriptionStatusContext);
  if (!ctx) {
    throw new Error("useSubscriptionStatus must be used within a SubscriptionStatusProvider");
  }
  return ctx;
}