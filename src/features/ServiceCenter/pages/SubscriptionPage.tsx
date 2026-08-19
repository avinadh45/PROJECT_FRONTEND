

import { useMemo, useState, useEffect } from "react";
import type {
  PricingTier,
  Subscription,
  ActiveSubscription
} from "../types/subscription";
import {
  getDaysRemaining,
  getSubscriptionHealth,
  getElapsedPercent,
} from "../types/subscription";

import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
import { useSubscriptionStatus } from "../context/SubscriptionStatusContext";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 3.5v5.4c0 5-3.4 8.6-8 10.1-4.6-1.5-8-5.1-8-10.1V5.5L12 2z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

const XCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(n: number): string {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

function formatDuration(months: number): string {
  return months === 1 ? "1 month" : `${months} months`;
}

type Health = "active" | "expiring-soon" | "expired";

const HEALTH_META: Record<Health, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "#34d399", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.35)" },
  "expiring-soon": { label: "Expiring soon", color: "#fbbf24", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.35)" },
  expired: { label: "Expired", color: "#f87171", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.35)" },
};

function StatusBadge({ health }: { health: Health }) {
  const meta = HEALTH_META[health];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{
        padding: "5px 11px",
        fontSize: "11.5px",
        fontWeight: 700,
        letterSpacing: "0.01em",
        color: meta.color,
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span className="rounded-full" style={{ width: "6px", height: "6px", background: meta.color }} />
      {meta.label}
    </span>
  );
}


function DaysRemainingRing({ percentElapsed, daysRemaining, health }: { percentElapsed: number; daysRemaining: number; health: Health }) {
  const size = 96;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const remainingFraction = Math.max(0, 1 - percentElapsed / 100);
  const dash = c * remainingFraction;
  const meta = HEALTH_META[health];

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={meta.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold leading-none" style={{ fontSize: "20px", fontFamily: "'Syne', sans-serif" }}>
          {Math.max(0, daysRemaining)}
        </span>
        <span style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
          days left
        </span>
      </div>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <span
            className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
            style={{ width: "16px", height: "16px", color: "#06b6d4", background: "rgba(6,182,212,0.12)" }}
          >
            <CheckIcon />
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            {f}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan card (with per-plan tier selection)
// ─────────────────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  currentPlanId,
  currentTierMonths,
  onSubscribe,
}: {
  plan: Subscription;
  currentPlanId?: string;
  currentTierMonths?: number;
  onSubscribe: (plan: Subscription, tier: PricingTier) => void;
}) {
  const [selectedMonths, setSelectedMonths] = useState<number>(plan.pricing[0]?.durationMonths ?? 0);
  const selectedTier = plan.pricing.find((t) => t.durationMonths === selectedMonths) ?? plan.pricing[0];
  const isCurrentPlan = plan.id === currentPlanId;
  const isCurrentTier = isCurrentPlan && currentTierMonths === selectedMonths;

  return (
    <div
      className="relative flex flex-col rounded-2xl"
      style={{
        padding: "22px",
        background: "rgba(255,255,255,0.03)",
        border: isCurrentPlan ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isCurrentPlan ? "0 0 0 1px rgba(6,182,212,0.15), 0 12px 32px rgba(0,0,0,0.35)" : "0 12px 32px rgba(0,0,0,0.25)",
      }}
    >
      {isCurrentPlan && (
        <span
          className="absolute rounded-full"
          style={{
            top: "-11px",
            left: "20px",
            padding: "4px 10px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.03em",
            color: "#0a0f1e",
            background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          CURRENT PLAN
        </span>
      )}

      <h3 className="text-white font-bold" style={{ fontSize: "18px", fontFamily: "'Syne', sans-serif" }}>
        {plan.name}
      </h3>

      <div className="mt-4 mb-1">
        <FeatureList features={plan.features} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          Choose duration
        </span>
        <div className="flex flex-col gap-2">
          {plan.pricing.map((tier) => {
            const active = tier.durationMonths === selectedMonths;
            const isOwnedTier = isCurrentPlan && currentTierMonths === tier.durationMonths;
            return (
              <button
                key={tier.durationMonths}
                onClick={() => setSelectedMonths(tier.durationMonths)}
                className="flex items-center justify-between rounded-xl transition-colors"
                style={{
                  padding: "10px 13px",
                  background: active ? "rgba(6,182,212,0.10)" : "rgba(255,255,255,0.02)",
                  border: active ? "1px solid rgba(6,182,212,0.45)" : "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      width: "15px",
                      height: "15px",
                      border: active ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {active && <span className="rounded-full" style={{ width: "7px", height: "7px", background: "#06b6d4" }} />}
                  </span>
                  <span style={{ fontSize: "13px", color: active ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                    {formatDuration(tier.durationMonths)}
                  </span>
                  {isOwnedTier && (
                    <span style={{ fontSize: "10px", color: "#06b6d4", fontFamily: "'DM Sans', sans-serif" }}>owned</span>
                  )}
                </span>
                <span className="font-semibold" style={{ fontSize: "13.5px", color: active ? "#fff" : "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                  {formatPrice(tier.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onSubscribe(plan, selectedTier)}
        disabled={isCurrentTier}
        className="mt-5 w-full rounded-xl font-semibold transition-opacity"
        style={{
          height: "44px",
          fontSize: "13.5px",
          color: isCurrentTier ? "rgba(255,255,255,0.35)" : "#fff",
          background: isCurrentTier ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#3b82f6,#06b6d4)",
          border: isCurrentTier ? "1px solid rgba(255,255,255,0.08)" : "none",
          cursor: isCurrentTier ? "default" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {isCurrentTier ? "Currently subscribed" : "Subscribe to this plan"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Current subscription summary card
// ─────────────────────────────────────────────────────────────────────────────

function SubscriptionSummaryCard({
  subscription,
  onChangePlan,
}: {
  subscription: ActiveSubscription;
  onChangePlan: () => void;
}) {
  const daysRemaining = getDaysRemaining(subscription.expiryDate);
  const healthRaw = getSubscriptionHealth(subscription.expiryDate);
  const health: Health = healthRaw;
  const percentElapsed = getElapsedPercent(subscription.startDate, subscription.expiryDate);

  return (
    <div
      className="rounded-2xl flex flex-col md:flex-row md:items-center gap-6"
      style={{
        padding: "26px",
        background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(6,182,212,0.03))",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
      }}
    >
      <DaysRemainingRing percentElapsed={percentElapsed} daysRemaining={daysRemaining} health={health} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-white font-bold" style={{ fontSize: "20px", fontFamily: "'Syne', sans-serif" }}>
            {subscription.planName}
          </h2>
          <StatusBadge health={health} />
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }} className="mt-1">
          {formatDuration(subscription.tier.durationMonths)} plan — {formatPrice(subscription.tier.price)}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>
              Start date
            </div>
            <div style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
              {formatDate(subscription.startDate)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>
              Expiry date
            </div>
            <div style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
              {formatDate(subscription.expiryDate)}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onChangePlan}
        className="flex-shrink-0 rounded-xl font-semibold transition-colors"
        style={{
          height: "42px",
          padding: "0 20px",
          fontSize: "13px",
          color: "#fff",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)")}
      >
        Change Plan
      </button>
    </div>
  );
}

function PaymentStatusOverlay({
  status,
  planName,
  onClose,
}: {
  status: "verifying" | "success" | "error";
  planName?: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5,13,26,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="flex flex-col items-center text-center rounded-2xl"
        style={{
          width: "380px",
          padding: "40px 32px",
          background: "linear-gradient(180deg, #0a0f1e, #060a14)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        {status === "verifying" && (
          <>
            <div
              className="rounded-full animate-spin"
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid rgba(6,182,212,0.15)",
                borderTopColor: "#06b6d4",
              }}
            />
            <h3 className="text-white font-bold mt-5" style={{ fontSize: "17px", fontFamily: "'Syne', sans-serif" }}>
              Verifying payment…
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }} className="mt-1.5">
              This should only take a moment. Please don't close this window.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <span style={{ color: "#34d399" }}>
              <CheckCircleIcon />
            </span>
            <h3 className="text-white font-bold mt-4" style={{ fontSize: "19px", fontFamily: "'Syne', sans-serif" }}>
              Subscription activated
            </h3>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }} className="mt-1.5">
              You're now subscribed to the <span style={{ color: "#fff" }}>{planName}</span> plan. Your garage is live and ready to receive bookings.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl font-semibold"
              style={{
                height: "44px",
                fontSize: "13.5px",
                color: "#fff",
                background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Go to overview
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <span style={{ color: "#f87171" }}>
              <XCircleIcon />
            </span>
            <h3 className="text-white font-bold mt-4" style={{ fontSize: "17px", fontFamily: "'Syne', sans-serif" }}>
              Payment couldn't be verified
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }} className="mt-1.5">
              If any amount was deducted, it will be refunded automatically. You can try again below.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl font-semibold"
              style={{
                height: "44px",
                fontSize: "13.5px",
                color: "#fff",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

type View = "overview" | "plans";

export default function SubscriptionPage() {
  
  const {plans,fetchStatus,fetchPlans,createPaymentOrder,verifyPayment} = useServiceCenterAuth()
  const {activeSubscription} = useSubscriptionStatus()
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [subscribedPlanName, setSubscribedPlanName] = useState<string>("");


  useEffect(()=>{
    fetchStatus()
    fetchPlans()
  },[fetchPlans,fetchStatus])

    const [view, setView] = useState<View>("plans");

    useEffect(()=>{
      if(activeSubscription) setView("overview");
    },[activeSubscription])

  const health: Health | null = useMemo(
    () => (activeSubscription ? getSubscriptionHealth(activeSubscription.expiryDate) : null),
    [activeSubscription]
  );

 async function handleSubscribe(plan: Subscription, tier: PricingTier) {
    try {
      const order = await createPaymentOrder(plan.id, tier.durationMonths);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Motocline",
        description: `${plan.name} - ${tier.durationMonths} month(s)`,
        handler: async (response: any) => {
          setPaymentStatus("verifying");
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: plan.id,
              durationMonths: tier.durationMonths,
            });
            await fetchStatus(); 
            setSubscribedPlanName(plan.name);
            setPaymentStatus("success");
          } catch (err) {
            setPaymentStatus("error");
          }
        },
        modal: {
          ondismiss: () => {
           
            setPaymentStatus("idle");
          },
        },
        theme: { color: "#06b6d4" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      setPaymentStatus("error");
    }
  }
  function closeStatusOverlay() {
    const wasSuccess = paymentStatus === "success";
    setPaymentStatus("idle");
    if (wasSuccess) setView("overview");
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "radial-gradient(1200px 600px at 15% -10%, rgba(59,130,246,0.08), transparent), linear-gradient(180deg, #060a14 0%, #0a0f1e 100%)",
        padding: "32px 36px 60px",
      }}
    >
    {paymentStatus !== "idle" && (
        <PaymentStatusOverlay
          status={paymentStatus === "verifying" ? "verifying" : paymentStatus === "success" ? "success" : "error"}
          planName={subscribedPlanName}
          onClose={closeStatusOverlay}
        />
      )}
      <div className="max-w-5xl mx-auto">
        {/* ── Page header ─────────────────────────────────────────── */}
        {!activeSubscription ? (
          <div className="flex items-start gap-3 mb-8">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-xl mt-0.5"
              style={{ width: "40px", height: "40px", color: "#06b6d4", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)" }}
            >
              <ShieldCheckIcon />
            </span>
            <div>
              <h1 className="text-white font-bold" style={{ fontSize: "23px", fontFamily: "'Syne', sans-serif" }}>
                You're verified! Choose a plan to start receiving bookings.
              </h1>
              <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }} className="mt-1.5">
                Your garage is approved and ready to go live. Pick a subscription plan below to appear in search and start accepting bookings.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <div>
              <h1 className="text-white font-bold" style={{ fontSize: "22px", fontFamily: "'Syne', sans-serif" }}>
                Subscription
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }} className="mt-1">
                Manage your plan and billing cycle.
              </p>
            </div>

            
            <div className="flex items-center gap-1 rounded-xl" style={{ padding: "4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["overview", "plans"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="rounded-lg transition-colors"
                  style={{
                    padding: "7px 14px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    color: view === v ? "#fff" : "rgba(255,255,255,0.45)",
                    background: view === v ? "linear-gradient(135deg,#3b82f6,#06b6d4)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {v === "overview" ? "Overview" : "View all plans"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Expiring / expired banner ───────────────────────────── */}
        {activeSubscription && health !== "active" && view === "overview" && (
          <div
            className="flex items-center gap-2.5 rounded-xl mb-6"
            style={{
              padding: "12px 16px",
              background: HEALTH_META[health as Health].bg,
              border: `1px solid ${HEALTH_META[health as Health].border}`,
              color: HEALTH_META[health as Health].color,
            }}
          >
            <AlertIcon />
            <span style={{ fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
              {health === "expired"
                ? "Your subscription has expired. Renew a plan to keep receiving bookings."
                : "Your subscription is expiring soon. Renew to avoid interruptions to your bookings."}
            </span>
          </div>
        )}

        {/* ── Overview view ───────────────────────────────────────── */}
        {activeSubscription && view === "overview" && (
          <SubscriptionSummaryCard subscription={activeSubscription} onChangePlan={() => setView("plans")} />
        )}

        {/* ── Plans view ──────────────────────────────────────────── */}
        {view === "plans" && (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlanId={activeSubscription?.planId}
                currentTierMonths={activeSubscription?.tier.durationMonths}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}