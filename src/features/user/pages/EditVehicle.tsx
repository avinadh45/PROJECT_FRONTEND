import { useState,useEffect,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVehicle } from "../hooks/useVehicle";

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const ChevronIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
  </svg>
);
const CarDetailsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 16H6.5A1.5 1.5 0 015 14.5v-4a3 3 0 013-3h5l3 3h3.5A1.5 1.5 0 0121 12v2.5a1.5 1.5 0 01-1.5 1.5H18" />
  </svg>
);
const RegDocIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
  </svg>
);
const FolderIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);
const FileIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const UploadIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" />
  </svg>
);
const CloudUploadIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4 4 0 01-1-7.87A5 5 0 0116 8a4.5 4.5 0 011 8.9M12 12v6m0-6l-2.5 2.5M12 12l2.5 2.5" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7h10z" />
  </svg>
);
const SaveIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/* ─── Reusable field ────────────────────────────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        <input
          className="field-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#4e6077]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Document row ──────────────────────────────────────────────────────── */
function DocRow({ name, url }: { name: string; url: string }) {
  return (
    <div className="doc-item">
      <div className="flex items-center gap-3 min-w-0">
        <div className="doc-icon"><FileIcon /></div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-[#e8f0f8] truncate">{name}</p>
          <p className="text-[11px] text-[#7a95b0]">Click to view current document</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#7a95b0] flex-shrink-0">
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="p-1.5 rounded-md hover:bg-white/5 hover:text-white transition-colors"
    title="Preview"
  >
    <EyeIcon />
  </a>
</div>
    </div>
  );
}

function Dropzone({ label, inputRef, onChange }: {
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (f: File) => void;
}) {
  return (
    <label className="dropzone">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) onChange(e.target.files[0]); }}
      />
      <div className="dropzone-icon"><CloudUploadIcon /></div>
      <p className="text-[12.5px] font-semibold text-[#c7d5e3]">{label}</p>
      <p className="text-[10.5px] text-[#4e6077]">Supports PDF, PNG, JPG (Max 5MB)</p>
    </label>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function EditVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {  vehicle, deleteVehicle ,fetchVehicleById,handleUpdateService,errors } = useVehicle();
  const fieldError = (key: string) => errors[key]?.[0];
const rcRef    = useRef<HTMLInputElement>(null);
const pocRef   = useRef<HTMLInputElement>(null);
// const photoRef = useRef<HTMLInputElement>(null);

const [newRCDoc,    setNewRCDoc]    = useState<File | null>(null);
const [newPOCDoc,   setNewPOCDoc]   = useState<File | null>(null);
const [newPhoto,    setNewPhoto]    = useState<File | null>(null);
 const [form, setForm] = useState({
    brand: "", model: "", year: "", FuelType: "",
    odometer: "", lastNotedKms: "", vehicleType: "",
    RegistrationNumber: "", RCNumber: "", insuranceExpiryDate: "",
  });
  const [vehicleImage, setVehicleImage] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

 const set = (k : keyof typeof form, v:string)=> setForm(f => ({ ...f, [k]: v }));
  
useEffect(()=>{
  if(id){
    fetchVehicleById(id)
  }
},[id])
useEffect(() => {
  if (!vehicle) return;
  setVehicleImage(vehicle.documents.vehicleImage);
  setForm({
    brand:               vehicle.brand,
    model:               vehicle.model,
    year:                String(vehicle.year),
    FuelType:            vehicle.FuelType,
    odometer:            String(vehicle.odometer),
    lastNotedKms:        String(vehicle.lastNotedKms),
    vehicleType:         vehicle.vehicleType,
    RegistrationNumber:  vehicle.RegistrationNumber,
    RCNumber:            vehicle.RCNumber,
    insuranceExpiryDate: new Date(vehicle.insuranceExpiryDate).toLocaleDateString(),
  });
}, [vehicle]);
  const handleSave = async () => {
    if(!id) return 
    setIsSaving(true);
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (newRCDoc)   formData.append("RCDocument",   newRCDoc);
    if (newPOCDoc)  formData.append("POCDocument",  newPOCDoc);
    if (newPhoto)   formData.append("vehicleImage", newPhoto); 
    await handleUpdateService(id,formData)
      navigate(`/my-vehicle`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete called", id); 
    if(!id){
      return
    }
    setIsDeleting(true)
    try {
       await deleteVehicle(id)
    } catch(err){
       console.error("Delete failed:", err);
    }
    finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d1a] text-[#e8f0f8]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 page-bg-radial" />
        <div className="absolute inset-0 page-bg-dots" />
        <div className="absolute top-0 left-0 right-0 h-px top-glow-line" />
      </div>

      <div className="relative z-10 max-w-[860px] mx-auto px-6 pt-10 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11.5px] text-[#4e6077] mb-4">
          <span className="hover:text-[#7a95b0] cursor-pointer transition-colors" onClick={() => navigate("/my-vehicle")}>
            Vehicles
          </span>
          <ChevronIcon />
          <span className="text-[#7a95b0]">{form.brand} {form.model} ({form.RegistrationNumber})</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[24px] font-black tracking-tight text-[#f0f6ff] mb-1">Edit Vehicle</h1>
            <p className="text-[#7a95b0] text-[12.5px]">Update your vehicle information and compliance documents.</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger-outline flex-shrink-0"
          >
            <TrashIcon /> Delete Vehicle
          </button>
        </div>

        {/* Hero photo */}
        <div className="relative h-52 rounded-2xl overflow-hidden mb-6 border border-white/[0.07]">
          <img
            src={vehicleImage || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"}
            alt={`${form.brand} ${form.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/70 via-transparent to-transparent" />
          <span className="plate-badge absolute bottom-4 left-4">{form.RegistrationNumber}</span>
        </div>

        {/* Vehicle Details */}
        <div className="form-card mb-6">
          <div className="form-card-header">
            <div className="form-card-icon"><CarDetailsIcon /></div>
            <span className="text-[13px] font-bold text-[#e8f0f8]">Vehicle Details</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div>
    <Field label="Brand" value={form.brand} onChange={v => set("brand", v)} />
    {fieldError("brand") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("brand")}</p>}
  </div>
  <div>
    <Field label="Model" value={form.model} onChange={v => set("model", v)} />
    {fieldError("model") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("model")}</p>}
  </div>
  <div>
    <Field label="Year" value={form.year} onChange={v => set("year", v)} />
    {fieldError("year") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("year")}</p>}
  </div>
  <div>
    <Field label="Fuel Type" value={form.FuelType} onChange={v => set("FuelType", v)} />
    {fieldError("FuelType") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("FuelType")}</p>}
  </div>
  <div>
    <Field label="Odometer (km)" value={form.odometer} onChange={v => set("odometer", v)} suffix="km" />
    {fieldError("odometer") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("odometer")}</p>}
  </div>
  <div>
    <Field label="Last Noted Kilometer" value={form.lastNotedKms} onChange={v => set("lastNotedKms", v)} suffix="km" />
    {fieldError("lastNotedKms") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("lastNotedKms")}</p>}
  </div>
  <div>
    <Field label="Vehicle Type" value={form.vehicleType} onChange={v => set("vehicleType", v)} />
    {fieldError("vehicleType") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("vehicleType")}</p>}
  </div>
</div>
</div>
        {/* Registration + Insurance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-icon"><RegDocIcon /></div>
              <span className="text-[13px] font-bold text-[#e8f0f8]">Registration</span>
            </div>
           <div className="p-5 flex flex-col gap-4">
  <div>
    <Field label="Registration Number" value={form.RegistrationNumber} onChange={v => set("RegistrationNumber", v)} />
    {fieldError("RegistrationNumber") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("RegistrationNumber")}</p>}
  </div>
  <div>
    <Field label="RC Number" value={form.RCNumber} onChange={v => set("RCNumber", v)} />
    {fieldError("RCNumber") && <p className="text-[#f87171] text-[10px] mt-1">{fieldError("RCNumber")}</p>}
  </div>
</div>

          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-icon"><ShieldIcon /></div>
              <span className="text-[13px] font-bold text-[#e8f0f8]">Insurance</span>
            </div>
            <div className="p-5">
              <Field label="Expiry Date" value={form.insuranceExpiryDate} onChange={v => set("insuranceExpiryDate", v)} />
            </div>
          </div>
        </div>
    </div>
        {/* Documents */}
        <div className="form-card mb-8">
          <div className="form-card-header justify-between">
            <div className="flex items-center gap-2">
              <div className="form-card-icon"><FolderIcon /></div>
              <span className="text-[13px] font-bold text-[#e8f0f8]">Documents</span>
            </div>
            <button className="text-[11.5px] font-semibold text-[#3b9edd] hover:text-[#5cb3ea] transition-colors flex items-center gap-1">
              <UploadIcon /> Upload New
            </button>
          </div>
         <div className="p-5 flex flex-col gap-3">
 
  {vehicle?.documents.RCDocument && (
    <DocRow name="RC Document (current)" url={vehicle.documents.RCDocument} />
  )}
  {vehicle?.documents.POCDocument && (
    <DocRow name="POC Document (current)" url={vehicle.documents.POCDocument} />
  )}

  <Dropzone
    label={newRCDoc ? `✓ ${newRCDoc.name}` : "Replace RC Document"}
    inputRef={rcRef}
    onChange={f => setNewRCDoc(f)}
  />
  <Dropzone
    label={newPOCDoc ? `✓ ${newPOCDoc.name}` : "Replace POC Document"}
    inputRef={pocRef}
    onChange={f => setNewPOCDoc(f)}
  />
</div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary-gradient inline-flex items-center gap-2 px-5 py-2.5 text-[12.5px] disabled:opacity-60"
          >
            <SaveIcon /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => !isDeleting && setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-4 text-red-400">
              <TrashIcon />
            </div>
            <h3 className="text-[15px] font-bold text-[#e8f0f8] mb-1.5">Delete this vehicle?</h3>
            <p className="text-[12.5px] text-[#7a95b0] mb-6 leading-relaxed">
              This removes {form.brand} {form.model} ({form.RegistrationNumber}) and all its service history. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-danger-solid disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}