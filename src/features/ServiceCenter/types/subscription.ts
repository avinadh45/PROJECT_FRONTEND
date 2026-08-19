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
}

export interface ActiveSubscription {
  id: string;
  planId: string;
  planName: string;
  tier: PricingTier;
  startDate: string; 
  expiryDate: string; 
}

export type SubscriptionHealth = "active" | "expiring-soon" | "expired";

export function getDaysRemaining(expiryDate: string): number {
  const diffMs = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getSubscriptionHealth(expiryDate: string): SubscriptionHealth {
  const days = getDaysRemaining(expiryDate);
  if (days <= 0) return "expired";
  if (days <= 7) return "expiring-soon";
  return "active";
}

export function getElapsedPercent(startDate: string, expiryDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(expiryDate).getTime();
  const now = Date.now();
  if (end <= start) return 100;
  const pct = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, pct));
}