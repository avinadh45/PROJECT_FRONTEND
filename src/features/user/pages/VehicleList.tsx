import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import type { VehicleResponse } from "../interface/vehicleIntraface";
import { useVehicle } from "../hooks/useVehicle"

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/history" },
];

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const CarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 16H6.5A1.5 1.5 0 015 14.5v-4a3 3 0 013-3h5l3 3h3.5A1.5 1.5 0 0121 12v2.5a1.5 1.5 0 01-1.5 1.5H18" />
  </svg>
);
const RegIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);
const GaugeIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

/* ─── Vehicle card ──────────────────────────────────────────────────────── */
function VehicleCard({ vehicle, onView, onManage,className = "" }: { vehicle: VehicleResponse; onView: () => void; onManage: () => void;className?: string }) {
  return (
    <div className={`vehicle-card ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-px top-glow-line" />

      <div className="vehicle-card-photo">
        {vehicle.documents.vehicleImage ? (
          <img src={vehicle.documents.vehicleImage} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
        ) : (
          <CarIcon className="w-10 h-10 text-[#3b9edd]/35" />
        )}
        <div className="vehicle-card-photo-fade" />
      </div>

      <div className="p-4">
        <p className="text-[15px] font-bold text-[#e8f0f8] tracking-tight mb-2.5">{vehicle.brand}</p>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="vehicle-meta-row">
            <RegIcon />
            <span className="text-[11.5px]">Reg: {vehicle.RegistrationNumber}</span>
          </div>
          <div className="vehicle-meta-row">
            <CalendarIcon />
            <span className="text-[11.5px]">Year: {vehicle.year}</span>
          </div>
          <div className="vehicle-meta-row">
            <GaugeIcon />
            <span className="text-[11.5px]">Odometer: {vehicle.odometer}</span>
          </div>
        </div>

       <div className="flex items-center gap-2.5">
  <button onClick={onView} className="btn-outline">View Details</button>
  <button onClick={onManage} className="btn-primary-gradient flex-1 py-2">Manage</button>
</div>
      </div>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────────────────── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="empty-state flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="empty-state-icon w-14 h-14 flex items-center justify-center mb-5">
        <CarIcon className="w-7 h-7 text-[#3b9edd]" />
      </div>
      <p className="text-[#e8f0f8] text-[15px] font-bold mb-1.5">No vehicles yet</p>
      <p className="text-[#7a95b0] text-[12.5px] max-w-xs mb-6">
        Add your first vehicle to start tracking service history and booking repairs.
      </p>
      <button onClick={onAdd} className="btn-primary-gradient inline-flex items-center gap-2 px-5 py-2.5 text-[12.5px]">
        <PlusIcon /> Add New Vehicle
      </button>
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="max-w-[1180px] mx-auto px-8 pt-12 pb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-9">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center text-white text-[11px] font-black">M</div>
              <span className="font-extrabold text-[15px] text-white tracking-tight">Moto<span className="text-[#3b9edd]">cline</span></span>
            </div>
            <p className="text-[#4e6077] text-[11px] leading-relaxed">
              The complete fleet management solution for private owners and professional teams. Track, maintain, and optimize.
            </p>
          </div>

          <div>
            <p className="text-[#e8f0f8] text-[11px] font-bold mb-3.5">Quick Links</p>
            <div className="flex flex-col gap-2.5">
              {["Dashboard", "My Vehicles", "Service History", "Analytics"].map(item => (
                <span key={item} className="footer-link">{item}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#e8f0f8] text-[11px] font-bold mb-3.5">Support</p>
            <div className="flex flex-col gap-2.5">
              {["Help Center", "Documentation", "API Reference", "Contact Us"].map(item => (
                <span key={item} className="footer-link">{item}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#e8f0f8] text-[11px] font-bold mb-3.5">Stay Updated</p>
            <p className="text-[#4e6077] text-[11px] mb-3 leading-relaxed">Get fleet tips and updates.</p>
            <div className="footer-input">
              <input type="email" placeholder="Email address" />
              <button>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-4">
          <p className="text-[#1e293b] text-[10px]">© 2026 Motocline Technologies Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function MyVehiclesPage() {
  const navigate = useNavigate();
  const { fetchVehicleById } = useVehicle() 
  const { logoutuser, vehicles, fetchVehicle } = useAuth();

  useEffect(() => {
    fetchVehicle();
  }, []);



  return (
    <div className="relative min-h-screen bg-[#050d1a] text-[#e8f0f8]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 page-bg-radial" />
        <div className="absolute inset-0 page-bg-dots" />
        <div className="absolute top-0 left-0 right-0 h-px top-glow-line" />
      </div>

      <div className="relative z-10">
        <Navbar links={navLinks} userInitials="AK" userName="Arun Kumar" userEmail="arun@email.com" notifications={[]} onLogout={logoutuser} />

        <div className="max-w-[1180px] mx-auto px-8 pt-[88px] pb-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
  <div>
    <h1 className="text-[32px] font-black tracking-tight text-[#f0f6ff] mb-1.5">My Vehicles</h1>
    <p className="text-[#7a95b0] text-[13px]">Manage and monitor your active fleet and service schedules.</p>
  </div>
  <button
    onClick={() => navigate("/add-vehicle")}
    className="btn-primary-gradient inline-flex items-center gap-2 px-4 py-2.5 text-[12.5px] hover:-translate-y-0.5 transition-transform"
  >
    <PlusIcon /> Add New Vehicle
  </button>
</div>

          {vehicles.length === 0 ? (
            <EmptyState onAdd={() => navigate("/add-vehicle")} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(v => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  onView={() => navigate(`/my-vehicle/${v.id}`)}
                  onManage={() => navigate(`/vehicle/update/${v.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}