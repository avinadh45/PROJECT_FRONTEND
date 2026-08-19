// src/pages/admin/SubscriptionManagementPage.tsx
import { useState, useEffect, useCallback, memo } from "react";
import { useSubscription } from "../hook/useSubscription";

interface PricingTier {
  durationMonths: number;
  price: number;
}

interface Subscription {
  id: string;
  name: string;
  features: string[];
  pricing: PricingTier[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface TierDraft {
  key: string;
  durationMonths: string;
  price: string;
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" />
  </svg>
);
const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const TagIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41 11 3.83A2 2 0 009.59 3.24L4 3a1 1 0 00-1 1l.24 5.59a2 2 0 00.58 1.41l9.58 9.58a2 2 0 002.83 0l4.36-4.36a2 2 0 000-2.83z" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const ListIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const RupeeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3c3 0 5-1.8 5-5" />
  </svg>
);
const LayersIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// ─────────────────────────────────────────────
// Field — focus handled entirely via CSS :focus-within, no JS state
// ─────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
  rows?: number;
}

const Field = memo(function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
}: FieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    [onChange],
  );

  return (
    <div className="sub-field">
      <label className="sub-field-label">{label}</label>
      <div
        className={`sub-field-wrap ${multiline ? "sub-field-wrap--multiline" : ""}`}
      >
        <span className="sub-field-icon">{icon}</span>
        {multiline ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            className="sub-field-input"
          />
        ) : (
          <input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="sub-field-input"
          />
        )}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────
// TierRow
// ─────────────────────────────────────────────

interface TierRowProps {
  tier: TierDraft;
  index: number;
  canRemove: boolean;
  onChange: (
    key: string,
    field: "durationMonths" | "price",
    value: string,
  ) => void;
  onRemove: (key: string) => void;
}

const TierRow = memo(function TierRow({
  tier,
  index,
  canRemove,
  onChange,
  onRemove,
}: TierRowProps) {
  const handleDur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        tier.key,
        "durationMonths",
        e.target.value.replace(/[^0-9]/g, ""),
      ),
    [onChange, tier.key],
  );
  const handlePrice = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(tier.key, "price", e.target.value.replace(/[^0-9]/g, "")),
    [onChange, tier.key],
  );
  const handleRemove = useCallback(
    () => onRemove(tier.key),
    [onRemove, tier.key],
  );

  return (
    <div className="sub-tier-row">
      <div className="sub-tier-index">{String(index + 1).padStart(2, "0")}</div>

      <div className="sub-tier-field sub-field">
        <label className="sub-tier-field-label">Duration (months)</label>
        <div className="sub-field-wrap">
          <span className="sub-field-icon">
            <CalendarIcon />
          </span>
          <input
            value={tier.durationMonths}
            onChange={handleDur}
            placeholder="e.g. 12"
            inputMode="numeric"
            className="sub-field-input"
          />
        </div>
      </div>

      <div className="sub-tier-field sub-field">
        <label className="sub-tier-field-label">Price (₹)</label>
        <div className="sub-field-wrap">
          <span className="sub-field-icon">
            <RupeeIcon />
          </span>
          <input
            value={tier.price}
            onChange={handlePrice}
            placeholder="e.g. 4999"
            inputMode="numeric"
            className="sub-field-input"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        disabled={!canRemove}
        title={canRemove ? "Remove this tier" : "At least one tier is required"}
        className="sub-tier-remove-btn"
      >
        <XIcon />
      </button>
    </div>
  );
});

// ─────────────────────────────────────────────
// PlanCard
// ─────────────────────────────────────────────

interface PlanCardProps {
  plan: Subscription;
  isEditing?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

const PlanCard = memo(function PlanCard({
  plan,
  isEditing,
  onEdit,
  onDelete,
  onToggleStatus,
}: PlanCardProps) {
  const isActive = plan.status === "active";
  const handleEdit = useCallback(() => onEdit?.(plan.id), [onEdit, plan.id]);
  const handleDelete = useCallback(
    () => onDelete?.(plan.id),
    [onDelete, plan.id],
  );
  const handleToggle = useCallback(
    () => onToggleStatus?.(plan.id),
    [onToggleStatus, plan.id],
  );

  const sortedTiers = [...plan.pricing].sort(
    (a, b) => a.durationMonths - b.durationMonths,
  );

  return (
    <div
      className={`sub-plan-card ${isEditing ? "sub-plan-card--editing" : ""}`}
    >
      <div className="sub-plan-header">
        <h3 className="sub-plan-name">{plan.name}</h3>
        <button
          onClick={handleToggle}
          title="Click to toggle status"
          className={`sub-status-badge ${isActive ? "sub-status-badge--active" : "sub-status-badge--inactive"}`}
        >
          <span
            className={`sub-status-dot ${isActive ? "sub-status-dot--active" : "sub-status-dot--inactive"}`}
          />
          {isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="sub-pricing-list">
        {sortedTiers.map((tier, i) => (
          <div key={i} className="sub-pricing-row">
            <span className="sub-pricing-duration">
              {tier.durationMonths === 1
                ? "1 month"
                : `${tier.durationMonths} months`}
            </span>
            <span className="sub-pricing-price">
              ₹{tier.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <p className="sub-features-label">Features</p>
      <ul className="sub-features-list">
        {plan.features.map((f, i) => (
          <li key={i} className="sub-feature-item">
            <span className="sub-feature-check">
              <CheckIcon />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="sub-card-actions">
        <button onClick={handleEdit} className="sub-edit-btn">
          <EditIcon /> Edit
        </button>
        <button onClick={handleDelete} className="sub-delete-btn">
          <TrashIcon /> Delete
        </button>
      </div>
    </div>
  );
});

const StatSkeleton = () => (
  <div className="sub-skel-stat-card">
    <div className="sub-skel sub-skel-icon" />
    <div style={{ flex: 1 }}>
      <div
        className="sub-skel"
        style={{ width: "44px", height: "18px", marginBottom: "6px" }}
      />
      <div className="sub-skel" style={{ width: "70px", height: "10px" }} />
    </div>
  </div>
);

const PlanCardSkeleton = () => (
  <div className="sub-skel-plan-card">
    <div className="sub-skel" style={{ width: "60%", height: "16px" }} />
    <div className="sub-skel" style={{ width: "100%", height: "34px" }} />
    <div className="sub-skel" style={{ width: "40%", height: "10px" }} />
    <div className="sub-skel" style={{ width: "100%", height: "12px" }} />
    <div className="sub-skel" style={{ width: "90%", height: "12px" }} />
    <div className="sub-skel" style={{ width: "70%", height: "12px" }} />
    <div style={{ display: "flex", gap: "10px" }}>
      <div className="sub-skel" style={{ flex: 1, height: "36px" }} />
      <div className="sub-skel" style={{ flex: 1, height: "36px" }} />
    </div>
  </div>
);

let tierKeySeq = 0;
const newTierKey = () => `tier-${Date.now()}-${tierKeySeq++}`;
const emptyTier = (): TierDraft => ({
  key: newTierKey(),
  durationMonths: "",
  price: "",
});

export default function SubscriptionManagementPage() {
  const [name, setName] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [tiers, setTiers] = useState<TierDraft[]>([emptyTier()]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;
  const {
    createSubscription,
    loading: isLoading,
    subscription: plans,
    total,
    totalPages,
    fetchSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscription();

  useEffect(() => {
    fetchSubscription(currentPage, PAGE_SIZE, searchTerm).finally(() =>
      setHasLoadedOnce(true),
    );
  }, [currentPage, searchTerm, fetchSubscription]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getPageNumbers = (
    current: number,
    total: number,
  ): (number | "ellipsis")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set<number>([
      1,
      2,
      total - 1,
      total,
      current - 1,
      current,
      current + 1,
    ]);
    const sorted = [...pages]
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);
    const result: (number | "ellipsis")[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
      result.push(p);
    });
    return result;
  };

  const resetForm = useCallback(() => {
    setName("");
    setFeaturesText("");
    setTiers([emptyTier()]);
    setEditingId(null);
    setErrors([]);
  }, []);

  const handleEditClick = useCallback(
    (id: string) => {
      const plan = plans.find((p) => p.id === id);
      if (!plan) return;
      setEditingId(plan.id);
      setName(plan.name);
      setFeaturesText(plan.features.join("\n"));
      setTiers(
        plan.pricing.length > 0
          ? plan.pricing.map((t) => ({
              key: newTierKey(),
              durationMonths: String(t.durationMonths),
              price: String(t.price),
            }))
          : [emptyTier()],
      );
      setErrors([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [plans],
  );

  const addTierRow = useCallback(
    () => setTiers((prev) => [...prev, emptyTier()]),
    [],
  );

  const updateTierField = useCallback(
    (key: string, field: "durationMonths" | "price", value: string) => {
      setTiers((prev) =>
        prev.map((t) => (t.key === key ? { ...t, [field]: value } : t)),
      );
    },
    [],
  );

  const removeTierRow = useCallback((key: string) => {
    setTiers((prev) =>
      prev.length <= 1 ? prev : prev.filter((t) => t.key !== key),
    );
  }, []);

  const validate = useCallback((): {
    valid: boolean;
    problems: string[];
    parsedTiers: PricingTier[];
    parsedFeatures: string[];
  } => {
    const problems: string[] = [];

    if (!name.trim()) problems.push("Plan name is required.");

    const parsedFeatures = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    if (parsedFeatures.length === 0)
      problems.push("At least one feature is required.");

    const completeTiers = tiers.filter(
      (t) => t.durationMonths.trim() !== "" && t.price.trim() !== "",
    );
    const incompleteCount = tiers.length - completeTiers.length;
    if (tiers.length === 0 || completeTiers.length === 0) {
      problems.push(
        "At least one complete pricing tier (duration + price) is required.",
      );
    } else if (incompleteCount > 0) {
      problems.push(
        `${incompleteCount} pricing tier row${incompleteCount > 1 ? "s are" : " is"} missing a value — fill in or remove ${incompleteCount > 1 ? "them" : "it"}.`,
      );
    }

    const parsedTiers: PricingTier[] = completeTiers.map((t) => ({
      durationMonths: Number(t.durationMonths),
      price: Number(t.price),
    }));
    const invalidTier = parsedTiers.find(
      (t) => t.durationMonths <= 0 || t.price <= 0,
    );
    if (invalidTier)
      problems.push("Duration and price must both be greater than zero.");

    return {
      valid: problems.length === 0,
      problems,
      parsedTiers,
      parsedFeatures,
    };
  }, [name, featuresText, tiers]);

  const handleSubmit = useCallback(async () => {
    const { valid, problems, parsedTiers, parsedFeatures } = validate();
    setErrors(problems);
    if (!valid) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await updateSubscription(editingId, {
          name: name.trim(),
          features: parsedFeatures,
          pricing: parsedTiers,
        });
      } else {
        await createSubscription({
          name: name.trim(),
          features: parsedFeatures,
          pricing: parsedTiers,
        });
      }
      resetForm();
    } catch {
      setErrors(["Something went wrong saving the subscription"]);
    } finally {
      setSubmitting(false);
    }
  }, [
    validate,
    editingId,
    name,
    createSubscription,
    updateSubscription,
    resetForm,
  ]);

  const handleDeleteRequest = useCallback(
    (id: string) => {
      const plan = plans.find((p) => p.id === id);
      if (plan) setDeleteTarget(plan);
    },
    [plans],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubscription(deleteTarget.id);
      if (editingId === deleteTarget.id) resetForm();
      await fetchSubscription(currentPage, PAGE_SIZE, searchTerm);
    } catch {
    
    } finally {
      setDeleteTarget(null);
    }
  }, [
    deleteTarget,
    editingId,
    resetForm,
    deleteSubscription,
    fetchSubscription,
    currentPage,
    searchTerm,
  ]);

  const closeDeleteModal = useCallback(() => setDeleteTarget(null), []);

  return (
    <div className="flex-1 overflow-y-auto admin-scrollbar sub-page">
      <div className="max-w-[1200px] mx-auto px-7 py-7">
        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7 max-w-[520px]">
          {isLoading && !hasLoadedOnce ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <div className="sub-stat-card">
                <div className="sub-stat-icon sub-stat-icon--green">
                  <LayersIcon />
                </div>
                <div>
                  <div className="sub-stat-value">{total}</div>
                  <div className="sub-stat-label">Total Plans</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="admin-card form-card rounded-2xl p-6 mb-9">
          <div className="sub-form-header">
            <div className="sub-form-title-wrap">
              <div className="sub-form-icon">
                <PlusIcon />
              </div>
              <h2 className="sub-form-title">
                {editingId
                  ? "Edit Subscription Plan"
                  : "Add New Subscription Plan"}
              </h2>
            </div>
            {editingId && (
              <button onClick={resetForm} className="sub-cancel-btn">
                <XIcon /> Cancel edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <Field
              label="Plan Name"
              icon={<TagIcon />}
              value={name}
              onChange={setName}
              placeholder="e.g. Enterprise Elite"
            />
            <Field
              label="Features (one per line)"
              icon={<ListIcon />}
              value={featuresText}
              onChange={setFeaturesText}
              placeholder={
                "Priority support\nAdvanced analytics\nUp to 5 locations"
              }
              multiline
              rows={1}
            />
          </div>

          <div className="mb-1">
            <div className="sub-tier-section-header">
              <label className="sub-tier-section-label">Pricing Tiers</label>
              <button
                type="button"
                onClick={addTierRow}
                className="sub-add-tier-btn"
              >
                <PlusIcon /> Add another duration
              </button>
            </div>

            <div className="sub-tier-list">
              {tiers.map((tier, i) => (
                <TierRow
                  key={tier.key}
                  tier={tier}
                  index={i}
                  canRemove={tiers.length > 1}
                  onChange={updateTierField}
                  onRemove={removeTierRow}
                />
              ))}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="sub-error-box">
              {errors.map((err, i) => (
                <div key={i} className="sub-error-item">
                  <AlertIcon />
                  {err}
                </div>
              ))}
            </div>
          )}

          <div className="sub-submit-row">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="sub-submit-btn"
            >
              {submitting ? <span className="sub-spinner" /> : <PlusIcon />}
              {editingId ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </div>

        {/* ── Plan list ── */}
        <div className="sub-section-header">
          <h2 className="sub-section-title">All Subscription Plans</h2>
          <div className="sub-divider" />
          {!isLoading && (
            <span className="sub-count">
              {total} plan{total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="sub-search-wrap">
          <span className="sub-search-icon">
            <SearchIcon />
          </span>
          <input
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search plans by name..."
            className="sub-search-input"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="sub-search-clear"
              title="Clear search"
            >
              <XIcon />
            </button>
          )}
        </div>

        {isLoading && !hasLoadedOnce ? (
          <div className="sub-grid">
            <PlanCardSkeleton />
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </div>
        ) : plans.length === 0 && searchTerm ? (
          <div className="sub-no-results">
            <p>No plans match "{searchTerm}".</p>
            <button onClick={clearSearch}>Clear search</button>
          </div>
        ) : plans.length === 0 ? (
          <div className="sub-empty">
            <p>No subscription plans yet. Create your first plan above.</p>
          </div>
        ) : (
          <>
            <div className="sub-grid">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isEditing={editingId === plan.id}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="sub-pagination">
                <span className="sub-pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="sub-pagination-controls">
                  <button
                    className="sub-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    title="Previous page"
                  >
                    ‹
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((p, i) =>
                    p === "ellipsis" ? (
                      <span key={`ellipsis-${i}`} className="sub-page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`sub-page-btn ${p === currentPage ? "sub-page-btn--active" : ""}`}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    className="sub-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    title="Next page"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="sub-modal-overlay" onClick={closeDeleteModal}>
          <div className="sub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal-icon">
              <AlertIcon />
            </div>
            <h3 className="sub-modal-title">Delete "{deleteTarget.name}"?</h3>
            <p className="sub-modal-text">
              This will permanently remove all {deleteTarget.pricing.length}{" "}
              pricing tier{deleteTarget.pricing.length !== 1 ? "s" : ""} for
              this plan. This action can't be undone.
            </p>
            <div className="sub-modal-actions">
              <button onClick={closeDeleteModal} className="sub-modal-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="sub-modal-delete">
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}