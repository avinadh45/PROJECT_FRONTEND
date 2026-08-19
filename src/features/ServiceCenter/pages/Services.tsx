import { useEffect, useMemo, useState } from "react";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
import type { AddServiceDTO } from "../interface/serviceCenter";

type ServiceStatus = "active" | "inactive";


const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

const ib = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const SearchIcon = (p: { size?: number }) => <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" {...ib}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
const FilterIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" {...ib}><path d="M4 5h16M7 12h10M10 19h4" /></svg>;
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" {...ib}><path d="M7 7h10M7 12h7M7 17h4" /><path d="M17 4v16" /></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const EditIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" {...ib}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;
const MoreIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>;
const ChevronLeftIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>;
const ChevronRightIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
const ChevronDownIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" {...ib}><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
const CarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" {...ib}><path d="M5 17h14M5 17a2 2 0 01-2-2v-1.5L4.5 9A2 2 0 016.4 7.5h11.2A2 2 0 0119.5 9L21 13.5V15a2 2 0 01-2 2M5 17v2a1 1 0 001 1h1a1 1 0 001-1v-2M17 17v2a1 1 0 001 1h1a1 1 0 001-1v-2" /><circle cx="7.5" cy="14.5" r="1.2" /><circle cx="16.5" cy="14.5" r="1.2" /></svg>;
const BikeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" {...ib}><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M12 17.5L15 9h4M5.5 17.5L9 10h3l2 3.5" /></svg>;
const TagIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" {...ib}><path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.2L4 3a1 1 0 00-1 1l.2 5.59a2 2 0 00.59 1.41l9.6 9.6a2 2 0 002.82 0l4.4-4.4a2 2 0 000-2.82z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" /></svg>;
const DollarIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" {...ib}><path d="M12 1v22M17 5.5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
const AlertIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></svg>;
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
const CheckIcon = (p: { size?: number }) => <svg width={p.size ?? 13} height={p.size ?? 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
const SpinnerIcon = () => <svg className="sc-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.25)" strokeWidth="3" /><path d="M21 12a9 9 0 00-9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>;
const EmptyIllustration = () => (
  <svg width="120" height="96" viewBox="0 0 120 96" fill="none">
    <ellipse cx="60" cy="86" rx="40" ry="6" fill="rgba(59,130,246,0.08)" />
    <rect x="28" y="18" width="64" height="52" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
    <rect x="38" y="30" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.14)" />
    <rect x="38" y="41" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
    <rect x="38" y="52" width="24" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
    <circle cx="82" cy="24" r="14" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5" />
    <circle cx="88" cy="30" r="9" fill="#0d1428" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />
    <path d="M85 30h6M91.5 26.5l3-3" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function StatusBadge({ status }: { status: ServiceStatus }) {
  const active = status === "active";
  return (
    <span className={cx("sc-status-pill", active ? "sc-status-pill--active" : "sc-status-pill--inactive")}>
      <span className={cx("sc-status-dot", active ? "sc-status-dot--active" : "sc-status-dot--inactive")} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: "blue" | "green" | "muted" }) {
  return (
    <div className="sc-stat-card">
      <span className={cx("sc-stat-dot", `sc-stat-dot--${accent}`)} />
      <div>
        <div className="sc-stat-value">{value}</div>
        <div className="sc-stat-label">{label}</div>
      </div>
    </div>
  );
}

const VEHICLE_TYPE_OPTIONS = [
  { value: "Cars", icon: CarIcon },
  { value: "Bikes", icon: BikeIcon },
  { value: "Two-Wheelers", icon: BikeIcon },
];
const SERVICE_MODE_OPTIONS = ["drive-in", "pickup"];

/* ── Add Service modal ── */
function AddserviceModel({
  existingServiceIds,
  onClose,
  onAdd,
}: {
  existingServiceIds: string[];
  onClose: () => void;
  onAdd: (dto: AddServiceDTO) => Promise<void>;
}) {
  const { categories, fetchCategories } = useServiceCenterAuth();
  const [selectedId, setSelectedId] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [serviceModes, setServiceModes] = useState<string[]>([]);
  const [advanceFee, setAdvanceFee] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const available = categories.filter((a: any) => !existingServiceIds.includes(a._id));
  const toggle = (arr: string[], setArr: (v: string[]) => void, value: string) =>
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const handleSubmit = async () => {
    if (!selectedId) return setError("Select a service category to continue");
    if (vehicleTypes.length === 0) return setError("Select at least one vehicle type");
    if (serviceModes.length === 0) return setError("Select at least one service mode");

    setSaving(true);
    setError("");
    try {
      await onAdd({ serviceId: selectedId, advanceFee: advanceFee ? Number(advanceFee) : null, vehicleTypes, serviceModes });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div>
            <h3 className="sc-heading text-[19px] font-bold text-white">Add New Service</h3>
            <p className="text-[13px] mt-1.5" style={{ color: "var(--sc-text-secondary)" }}>
              Select a category and configure how you provide this service.
            </p>
          </div>
          <button onClick={onClose} className="sc-modal-close"><CloseIcon /></button>
        </div>

        <div className="sc-modal-body sc-scrollbar">
          <div>
            <label className="sc-field-label">Select category</label>
            {available.length === 0 ? (
              <p className="text-[13px] text-center py-8 rounded-xl" style={{ color: "var(--sc-text-muted)", background: "var(--sc-surface)" }}>
                All available services have already been added.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1 sc-scrollbar">
                {available.map((c: any) => {
                  const selected = selectedId === c._id;
                  return (
                    <div key={c._id} onClick={() => setSelectedId(c._id)} className={cx("sc-category-card", selected && "sc-category-card--selected")}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="sc-category-icon">
                          {c.icon ? <img src={c.icon} alt={c.name} style={{ width: 24, height: 24, objectFit: "contain" }} /> : <TagIcon />}
                        </div>
                        <div className="min-w-0">
                          <div className="sc-category-name truncate">{c.name}</div>
                          {c.description && <div className="sc-category-desc truncate">{c.description}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="sc-category-fee">₹{c.advanceFee}</span>
                        {selected && <span className="sc-category-check"><CheckIcon size={11} /></span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="sc-field-label">Vehicle types</label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPE_OPTIONS.map(({ value, icon: Icon }) => (
                <button key={value} type="button" onClick={() => toggle(vehicleTypes, setVehicleTypes, value)}
                  className={cx("sc-segment-btn", vehicleTypes.includes(value) && "sc-segment-btn--selected")}>
                  <Icon />{value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="sc-field-label">Service modes</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_MODE_OPTIONS.map((m) => (
                <button key={m} type="button" onClick={() => toggle(serviceModes, setServiceModes, m)}
                  className={cx("sc-pill-btn", serviceModes.includes(m) && "sc-pill-btn--selected")}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="sc-field-label">Advance fee</label>
            <div className="sc-fee-input-wrap">
              <span style={{ color: "var(--sc-text-muted)", fontSize: 14 }}>₹</span>
              <input type="number" min={0} value={advanceFee} onChange={(e) => setAdvanceFee(e.target.value)} placeholder="e.g. 150" className="sc-fee-input" />
            </div>
            <p className="text-[12px] mt-1.5" style={{ color: "var(--sc-text-muted)" }}>
              Leave blank to use the default fee configured by Admin.
            </p>
          </div>

          {error && (
            <div className="sc-error-box">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="sc-modal-footer">
          <button onClick={onClose} className="sc-btn-cancel">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !selectedId || available.length === 0} className="sc-btn-submit">
            {saving && <SpinnerIcon />}
            {saving ? "Adding..." : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function ServiceCatalogPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [feeError, setFeeError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | ServiceStatus>("all");
  const [sortBy, setSortBy] = useState<"default" | "name" | "price">("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const { fetchServices, services, total, totalPages, updateServiceCenterFee, handleAddservices,toggleServiceStatu } = useServiceCenterAuth();
  const PAGE_SIZE = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchServices(1, PAGE_SIZE, query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
   fetchServices(page, PAGE_SIZE, query);
  }, [page]);

  const handleSaveFee = async (serviceId: string) => {
    const trimmed = editValue.trim();
    const value = trimmed === "" ? null : Number(trimmed);
    if (value !== null && (isNaN(value) || value < 0)) return setFeeError("Enter a valid, non-negative amount");
    try {
      await updateServiceCenterFee(serviceId, value);
      await fetchServices(page, PAGE_SIZE, query);
      setEditingId(null);
      setFeeError(null);
    } catch (err: any) {
      setFeeError(err.response?.data?.message || "Couldn't update fee");
    }
  };

  const handleToggleStatus = async(serviceId:string)=>{
    try {
      await toggleServiceStatu(serviceId)
      await fetchServices(page,PAGE_SIZE,query)
    } catch (err:any) {
      console.log(err);
      
    }
  }
  const displayedServices = useMemo(() => {
    let list = [...services];
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (sortBy === "name") list.sort((a, b) => a.serviceId.name.localeCompare(b.serviceId.name));
    if (sortBy === "price") list.sort((a, b) => (a.advanceFee ?? a.serviceId.advanceFee) - (b.advanceFee ?? b.serviceId.advanceFee));
    return list;
  }, [services, statusFilter, sortBy]);

  const activeCount = useMemo(() => services.filter((s) => s.status === "active").length, [services]);
  const inactiveCount = services.length - activeCount;

  return (
    <div className="sc-page flex h-screen">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto sc-scrollbar p-6 lg:p-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <div>
              <h1 className="sc-heading text-[26px] font-bold tracking-tight text-white">Service Center</h1>
              <p className="text-[14px] mt-1.5 leading-relaxed" style={{ color: "var(--sc-text-secondary)", maxWidth: 480 }}>
                Manage all services offered by your workshop. Track pricing, availability and service status.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <StatCard label="Total Services" value={total ?? services.length} accent="muted" />
              <StatCard label="Active Services" value={activeCount} accent="green" />
              <StatCard label="Inactive Services" value={inactiveCount} accent="blue" />
            </div>
          </div>

          {/* Search / filter / sort / add */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="sc-search-wrap">
              <SearchIcon />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search service ID, title…" className="sc-search-input" />
            </div>

            <div className="relative flex-shrink-0">
              <button onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }} className={cx("sc-btn", filterOpen && "sc-btn--open")}>
                <FilterIcon />Filter<ChevronDownIcon />
              </button>
              {filterOpen && (
                <div className="sc-dropdown">
                  {(["all", "active", "inactive"] as const).map((opt) => (
                    <button key={opt} onClick={() => { setStatusFilter(opt); setFilterOpen(false); }}
                      className={cx("sc-dropdown-item", statusFilter === opt && "sc-dropdown-item--active")}>
                      {opt}{statusFilter === opt && <CheckIcon size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-shrink-0">
              <button onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }} className={cx("sc-btn", sortOpen && "sc-btn--open")}>
                <SortIcon />Sort<ChevronDownIcon />
              </button>
              {sortOpen && (
                <div className="sc-dropdown" style={{ minWidth: 170 }}>
                  {[{ key: "default", label: "Default" }, { key: "name", label: "Name (A–Z)" }, { key: "price", label: "Price (low–high)" }].map((opt) => (
                    <button key={opt.key} onClick={() => { setSortBy(opt.key as typeof sortBy); setSortOpen(false); }}
                      className={cx("sc-dropdown-item", sortBy === opt.key && "sc-dropdown-item--active")}>
                      {opt.label}{sortBy === opt.key && <CheckIcon size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setShowAddModal(true)} className="sc-btn sc-btn-primary flex-shrink-0">
              <PlusIcon />Add Service
            </button>
          </div>

          {/* Table */}
          <div className="sc-table-card">
            <div className="overflow-x-auto sc-scrollbar">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--sc-border)" }}>
                    <th className="sc-th" style={{ width: "38%" }}>Service</th>
                    <th className="sc-th" style={{ width: "20%" }}>Pricing</th>
                    <th className="sc-th" style={{ width: "18%" }}>Status</th>
                    <th className="sc-th text-right" style={{ width: "16%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedServices.map((s, i) => (
                    <tr key={s.serviceId._id} className={cx("sc-row", "sc-row-anim")} style={{ animationDelay: `${i * 30}ms` }}>
                      {/* Service */}
                      <td>
                        <div className="flex items-center gap-3.5">
                          <div className="sc-avatar">
                            {(s.serviceId as any).icon ? (
                              <img src={(s.serviceId as any).icon} alt={s.serviceId.name} style={{ width: 24, height: 24, objectFit: "contain" }} />
                            ) : <CalendarIcon />}
                          </div>
                          <div className="min-w-0">
                            <div className="sc-service-name">{s.serviceId.name}</div>
                            <div className="sc-service-meta truncate" style={{ maxWidth: 360 }}>
                              {s.vehicleTypes.join(", ")} <span style={{ color: "rgba(255,255,255,0.18)" }}>•</span> {s.serviceModes.join(", ")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td>
                        {editingId === s.serviceId._id ? (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px]" style={{ color: "var(--sc-text-muted)" }}>₹</span>
                              <input
                                autoFocus
                                type="number"
                                min={0}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={async (e) => {
                                  if (e.key === "Enter") await handleSaveFee(s.serviceId._id);
                                  if (e.key === "Escape") { setEditingId(null); setFeeError(null); }
                                }}
                                className="sc-fee-edit-input"
                              />
                              <button onClick={() => handleSaveFee(s.serviceId._id)} className="sc-fee-save">Save</button>
                              <button onClick={() => { setEditingId(null); setFeeError(null); }} className="sc-fee-cancel">Cancel</button>
                            </div>
                            {feeError && <span className="text-[11px]" style={{ color: "var(--sc-red)" }}>{feeError}</span>}
                          </div>
                        ) : (
                          <div className="group flex items-center gap-1.5">
                            <span className="sc-price">₹{s.advanceFee ? s.advanceFee : s.serviceId.advanceFee}</span>
                            <button
                              onClick={() => { setEditingId(s.serviceId._id); setEditValue(s.advanceFee != null ? String(s.advanceFee) : ""); setFeeError(null); }}
                              className="sc-edit-btn"
                              title={`Edit ${s.serviceId.name} pricing`}
                            >
                              <EditIcon />
                            </button>
                          </div>
                        )}
                        <div className="sc-fee-hint"><DollarIcon />Advance fee</div>
                      </td>

                      {/* Status */}
                      <td><StatusBadge status={s.status} /></td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                             onClick={() => handleToggleStatus(s.serviceId._id)}
                            className={cx("sc-action-toggle", s.status === "active" ? "sc-action-toggle--active" : "sc-action-toggle--inactive")}
                          >
                            {s.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button className="sc-more-btn" title="More options"><MoreIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {displayedServices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <EmptyIllustration />
                          <div>
                            <div className="text-[14px] font-semibold" style={{ color: "var(--sc-text-secondary)" }}>No services found</div>
                            <div className="text-[12.5px] mt-1" style={{ color: "var(--sc-text-muted)" }}>
                              {query ? `Nothing matches "${query}".` : "Try adjusting your filters."}
                            </div>
                          </div>
                          <button onClick={() => { setQuery(""); setStatusFilter("all"); }} className="sc-empty-btn">
                            <SearchIcon size={13} />Search again
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--sc-border)" }}>
              <span className="text-[12.5px]" style={{ color: "var(--sc-text-muted)" }}>
                Showing <span className="font-semibold" style={{ color: "var(--sc-text-primary)" }}>{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)}</span> of{" "}
                <span className="font-semibold" style={{ color: "var(--sc-text-primary)" }}>{total}</span> services
              </span>

              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="sc-page-btn"><ChevronLeftIcon /></button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={cx("sc-page-btn", p === page && "sc-page-btn--active")}>{p}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="sc-page-btn"><ChevronRightIcon /></button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px]" style={{ color: "var(--sc-text-muted)" }}>Items:</span>
                <select defaultValue={PAGE_SIZE} className="sc-items-select">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          </div>

          {showAddModal && (
            <AddserviceModel
              existingServiceIds={services.map((s) => s.serviceId._id)}
              onClose={() => setShowAddModal(false)}
              onAdd={async (dto) => {
                await handleAddservices(dto);
                setShowAddModal(false);
                fetchServices(page, PAGE_SIZE, query);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}