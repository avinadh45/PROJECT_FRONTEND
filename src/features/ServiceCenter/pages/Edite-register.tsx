import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import MapPicker from "../components/MapPicker";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
import { getAllCategory } from "../../Admin/service/adminService";
import { getEditDetails, updateVerification } from "../services/ServiceCenterService"

// ── Types ──────────────────────────────────────────────────────────────────
type ServiceMode = "pickup-drop" | "drive-in" | "both";

interface VerificationFormData {
  garageName: string;
  ownerName: string;
  phone: string;
  location: {
    type: string;
    coordinates: number[];
  } | null;
  workingDays: string[];
  workingHoursFrom: string;
  workingHoursTo: string;
  services: string[];
  vehicleTypes: string[];
  serviceMode: ServiceMode;
  garageLicense: File | null;
  ownerIdProof: File | null;
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VEHICLE_TYPES = ["Cars", "Bikes / Two-Wheelers", "Commercial Vehicles"];

export default function ServiceCenterEditVerification() {
  const navigate = useNavigate();
  const { errors, setErrors } = useServiceCenterAuth();
  const licenseRef = useRef<HTMLInputElement>(null);
  const idProofRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<VerificationFormData>({
    garageName: "",
    ownerName: "",
    phone: "",
    location: null,
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    workingHoursFrom: "09:00",
    workingHoursTo: "18:00",
    services: [],
    vehicleTypes: ["Cars", "Bikes / Two-Wheelers"],
    serviceMode: "drive-in",
    garageLicense: null,
    ownerIdProof: null,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");

  // ── Load categories ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory(1, 100);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  // ── Load existing details ────────────────────────────────────────────────
  useEffect(() => {
    fetchEditDetails();
  }, []);
  const fetchEditDetails = async () => {
      try {
          setFetching(true);
          const response = await getEditDetails();

const serviceCenter = response.data.data;

// console.log(
//   "EDIT SERVICES RAW",
//   serviceCenter.servicesOffered
// );

setForm({
  garageName: serviceCenter.garageName,
  ownerName: serviceCenter.ownerName,
  phone: serviceCenter.phone,
  location: serviceCenter.location,

  workingDays:
    serviceCenter.availability.workingDays,

  workingHoursFrom:
    serviceCenter.availability.workingHours.start,

  workingHoursTo:
    serviceCenter.availability.workingHours.end,

services: serviceCenter.servicesOffered.map(
  (s: any) =>
    typeof s.serviceId === "object"
      ? s.serviceId._id.toString()
      : s.serviceId.toString()
),

  vehicleTypes:
    serviceCenter.servicesOffered[0]
      ?.vehicleTypes || [],

  serviceMode:
    serviceCenter.servicesOffered[0]
      ?.serviceModes?.[0] || "drive-in",

  garageLicense: null,
  ownerIdProof: null,

      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  // ── Toggles ──────────────────────────────────────────────────────────────
  const toggleDay = (day: string) =>
    setForm(f => ({
      ...f,
      workingDays: f.workingDays.includes(day)
        ? f.workingDays.filter(d => d !== day)
        : [...f.workingDays, day],
    }));

  const toggleService = (svc: string) =>
    setForm(f => ({
      ...f,
      services: f.services.includes(svc)
        ? f.services.filter(s => s !== svc)
        : [...f.services, svc],
    }));

  const toggleVehicle = (v: string) =>
    setForm(f => ({
      ...f,
      vehicleTypes: f.vehicleTypes.includes(v)
        ? f.vehicleTypes.filter(x => x !== v)
        : [...f.vehicleTypes, v],
    }));

  const handleFile = (
    field: "garageLicense" | "ownerIdProof",
    file: File | null
  ) => {
    setForm(prev => ({ ...prev, [field]: file }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validations (email/password removed)
    if (!form.garageName) return setErrors({ garageName: "Garage name is required" });
    if (!form.ownerName)  return setErrors({ ownerName: "Owner name is required" });
    if (!form.phone)      return setErrors({ phone: "Phone number is required" });
    // if (!form.location)   return setErrors({ location: "Please select location" });

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("ownerName", form.ownerName);
      formData.append("garageName", form.garageName);
      formData.append("phone", form.phone);
      formData.append("location", JSON.stringify(form.location));
      formData.append(
        "availability",
        JSON.stringify({
          workingDays: form.workingDays,
          workingHours: {
            start: form.workingHoursFrom,
            end: form.workingHoursTo,
          },
        })
      );
      formData.append(
        "servicesOffered",
        JSON.stringify(
          form.services.map(id => ({
            serviceId: id,
            vehicleTypes: form.vehicleTypes,
            serviceModes: [form.serviceMode],
          }))
        )
      );
      if (form.garageLicense) formData.append("garageLicense", form.garageLicense);
      if (form.ownerIdProof)  formData.append("ownerIdProof", form.ownerIdProof);

      console.log("FORM SERVICES", form.services);

// console.log(
//   "SERVICES PAYLOAD",
//   form.services.map(id => ({-ip
//     serviceId: id,
//     vehicleTypes: form.vehicleTypes,
//     serviceModes: [form.serviceMode],
//   }))
// );
      await updateVerification(formData);
      navigate("/service-center/verification-status");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#07111d" }}
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400 text-sm">Loading your details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#07111d" }}>

      {/* ── Background layers ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #050d18 0%, #071525 40%, #050f1c 70%, #030a12 100%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-180px", left: "-120px", width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-200px", right: "-150px", width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.5) 30%, rgba(34,211,238,0.8) 50%, rgba(34,211,238,0.5) 70%, transparent 100%)",
        }}
      />

      {/* ── Two-column layout ── */}
      <div className="relative z-10 min-h-screen flex">

        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[380px] shrink-0 px-10 py-12 sticky top-0 h-screen"
          style={{
            borderRight: "1px solid rgba(34,211,238,0.08)",
            background: "rgba(5,13,24,0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-12">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(37,99,235,0.15))",
                  border: "1px solid rgba(6,182,212,0.3)",
                }}
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-white text-lg font-bold tracking-tight">
                Moto<span className="text-cyan-400">Cline</span>
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-white text-3xl font-bold tracking-tight leading-snug mb-4">
              Update your<br />
              <span className="text-cyan-400">Details</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Update your garage information, location, availability, and services to keep your profile accurate for customers.
            </p>

            {/* Steps list */}
            <div className="space-y-5">
              {[
                { icon: "01", label: "Basic Information", sub: "Garage & owner details" },
                { icon: "02", label: "Location & Hours", sub: "Map pin & availability" },
                { icon: "03", label: "Services & Fleet", sub: "What you offer" },
                { icon: "04", label: "Verification Docs", sub: "License & ID proof" },
              ].map(step => (
                <div key={step.icon} className="flex items-start gap-3.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold text-cyan-400"
                    style={{
                      background: "rgba(6,182,212,0.08)",
                      border: "1px solid rgba(6,182,212,0.2)",
                      fontFamily: "monospace",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{step.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badge */}
          <div
            className="rounded-xl px-4 py-4"
            style={{
              background: "rgba(6,182,212,0.06)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-cyan-400 text-xs font-semibold">Verified Partner Program</span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              Your documents are encrypted and reviewed within 48 hours. We never share your data with third parties.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-xl mx-auto px-6 lg:px-10 py-10">

            {/* Mobile-only brand header */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white text-base font-bold tracking-tight">
                Moto<span className="text-cyan-400">Cline</span>
              </span>
            </div>

            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold tracking-tight">Edit Garage Details</h1>
              <p className="text-gray-400 text-xs mt-1">
                Update your garage information. Changes will be reviewed and reflected on your profile.
              </p>
            </div>

            {rejectionReason && (
              <div
                className="mb-5 p-4 rounded-xl"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <h4 className="text-red-400 font-semibold">Verification Rejected</h4>
                <p className="text-red-300 text-sm mt-1">{rejectionReason}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {errors?.general && (
                <div
                  className="px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#f87171",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {errors?.general}
                </div>
              )}

              {/* ── 1. Basic Information (no email/password) ── */}
              <Section icon={<InfoIcon />} title="Basic Information">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Garage Name">
                    <input
                      type="text"
                      placeholder="e.g. Midnight Motors"
                      value={form.garageName}
                      onChange={e => setForm(f => ({ ...f, garageName: e.target.value }))}
                      className="w-full bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    />
                  </Field>
                  {errors?.garageName && (
                    <p className="text-red-400 text-xs mt-1">{errors?.garageName}</p>
                  )}
                  <Field label="Owner Name">
                    <input
                      type="text"
                      placeholder="Full name of owner"
                      value={form.ownerName}
                      onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
                      className="w-full bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    />
                  </Field>
                  {errors?.ownerName && (
                    <p className="text-red-400 text-xs mt-1">{errors?.ownerName}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone">
                    <input
                      type="text"
                      placeholder="+91 000000"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    />
                  </Field>
                  {errors?.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors?.phone}</p>
                  )}
                </div>
              </Section>

              {/* ── 2. Location ── */}
              <Section icon={<LocationIcon />} title="Location">
  <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
    <LocationView location={form.location} />
  </div>
</Section>

              {/* ── 3. Availability ── */}
              <Section icon={<ClockIcon />} title="Availability">
                <p className="text-gray-400 text-[11px] font-medium tracking-wider uppercase mb-2">Working Days</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ALL_DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        form.workingDays.includes(day)
                          ? "bg-cyan-500 text-black"
                          : "border border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-300"
                      }`}
                      style={!form.workingDays.includes(day) ? { background: "rgba(255,255,255,0.05)" } : {}}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <p className="text-gray-400 text-[11px] font-medium tracking-wider uppercase mb-2">Working Hours</p>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={form.workingHoursFrom}
                    onChange={e => setForm(f => ({ ...f, workingHoursFrom: e.target.value }))}
                    className="border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all duration-200 [color-scheme:dark]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  <input
                    type="time"
                    value={form.workingHoursTo}
                    onChange={e => setForm(f => ({ ...f, workingHoursTo: e.target.value }))}
                    className="border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all duration-200 [color-scheme:dark]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                </div>
              </Section>

              {/* ── 4. Services Offered ── */}
              <Section icon={<WrenchIcon />} title="Services Offered">
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => {
                 //   console.log("CATEGORY", category);
                 console.log("CATEGORY ID", category.id);
console.log("CATEGORY _ID", category._id);
console.log("FORM SERVICES", form.services);
                    const active = form.services.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleService(category.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                          active
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                            : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                        }`}
                      >
                        {category.name}
                        {active && (
                          <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-gray-500 text-[11px] mt-3">
                  Select all services that your garage currently provides to customers.
                </p>
                {errors?.services && (
                  <p className="text-red-400 text-xs mt-3">{errors?.services}</p>
                )}
              </Section>

              {/* ── 5. Vehicles Type + Service Modes ── */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CarIcon />
                    <span className="text-white text-sm font-semibold">Vehicles Type</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mb-3">Vehicle Types Supported</p>
                  <div className="space-y-3">
                    {VEHICLE_TYPES.map(v => {
                      const checked = form.vehicleTypes.includes(v);
                      return (
                        <label key={v} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggleVehicle(v)}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                            checked ? "border-cyan-400" : "border-white/25 group-hover:border-white/40"
                          }`}>
                            {checked && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                          <span className="text-gray-300 text-xs leading-tight">{v}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors?.vehicleTypes && (
                    <p className="text-red-400 text-xs mt-2">{errors?.vehicleTypes}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TruckIcon />
                    <span className="text-white text-sm font-semibold">Service Modes</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mb-3">Service Modes</p>
                  <div className="space-y-2">
                    {(
                      [
                        { value: "pickup-drop", label: "Pick-up & Drop" },
                        { value: "drive-in",    label: "Drive-In" },
                        { value: "both",        label: "Both" },
                      ] as { value: ServiceMode; label: string }[]
                    ).map(mode => {
                      const active = form.serviceMode === mode.value;
                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, serviceMode: mode.value }))}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                            active
                              ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300"
                              : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                          }`}
                          style={!active ? { background: "rgba(255,255,255,0.04)" } : {}}
                        >
                          {mode.label}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            active ? "border-cyan-400" : "border-white/20"
                          }`}>
                            {active && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {errors?.serviceMode && (
                  <p className="text-red-400 text-xs mt-2">{errors?.serviceMode}</p>
                )}
              </div>

              {/* ── 6. Verification Documents ── */}
              <Section icon={<DocumentIcon />} title="Verification Documents">
                <div className="grid grid-cols-2 gap-3">
                  <DocUpload
                    label="Garage License"
                    hint="Click to upload licence copy"
                    sub="JPG, GIF or PNG. Max 10MB"
                    file={form.garageLicense}
                    inputRef={licenseRef}
                    onChange={f => handleFile("garageLicense", f)}
                  />
                  <DocUpload
                    label="Owner ID Proof"
                    hint="Click to upload identity proof"
                    sub="Aadhar, Passport, Driver's license"
                    file={form.ownerIdProof}
                    inputRef={idProofRef}
                    onChange={f => handleFile("ownerIdProof", f)}
                  />
                </div>
                {errors?.garageLicense && (
                  <p className="text-red-400 text-xs mt-2">{errors?.garageLicense}</p>
                )}
                {errors?.ownerIdProof && (
                  <p className="text-red-400 text-xs mt-2">{errors?.ownerIdProof}</p>
                )}
              </Section>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  style={{ boxShadow: "0 0 24px rgba(34,211,238,0.5)" }}
                />
                <div className="relative flex items-center justify-center gap-2 py-3 text-black font-semibold text-sm tracking-wide">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </div>
              </button>

              <p className="text-center text-gray-600 text-[11px] pb-4">
                By submitting, you agree to our{" "}
                <span className="text-cyan-500 cursor-pointer hover:text-cyan-400 transition-colors">Terms of Service</span>
                {" "}and{" "}
                <span className="text-cyan-500 cursor-pointer hover:text-cyan-400 transition-colors">Privacy Policy</span>.
                {" "}Changes may take up to 48 hours to reflect.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-cyan-400 w-4 h-4 shrink-0">{icon}</span>
        <h3 className="text-white text-sm font-semibold tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group">
      <label className="block text-gray-400 text-[11px] font-medium tracking-wider uppercase mb-[6px]">
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl border border-white/10 focus-within:border-cyan-500/60 transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Document upload card ───────────────────────────────────────────────────
function DocUpload({
  label, hint, sub, file, inputRef, onChange,
}: {
  label: string; hint: string; sub: string; file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      <p className="text-gray-400 text-[11px] font-medium tracking-wider uppercase mb-2">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 h-28 border border-dashed border-white/15 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-all duration-200 px-3 text-center"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {file ? (
          <>
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-cyan-400 text-[11px] font-medium truncate w-full px-2">{file.name}</p>
            <p className="text-gray-600 text-[10px]">Click to replace</p>
          </>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-400 text-[11px]">{hint}</p>
            <p className="text-gray-600 text-[10px]">{sub}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={e => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
function LocationView({
  location,
}: {
  location: {
    type: string;
    coordinates: number[];
  } | null;
}) {
  if (!location) return null;

  return (
    <MapContainer
      center={[
        location.coordinates[1],
        location.coordinates[0],
      ]}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[
          location.coordinates[1],
          location.coordinates[0],
        ]}
      />
    </MapContainer>
  );
}
// ── Icons ──────────────────────────────────────────────────────────────────
const InfoIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const LocationIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ClockIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const WrenchIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const CarIcon = () => (
  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16H6.5A1.5 1.5 0 015 14.5v-4a3 3 0 013-3h5l3 3h2.5A1.5 1.5 0 0120 12v2.5a1.5 1.5 0 01-1.5 1.5H17" />
  </svg>
);
const TruckIcon = () => (
  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zM18 17a2 2 0 100-4 2 2 0 000 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
  </svg>
);
const DocumentIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);