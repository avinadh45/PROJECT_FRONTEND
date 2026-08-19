import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useVehicle } from "../hooks/useVehicle";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/repair" },
  { label: "History", href: "/history" },
];

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const GaugeIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" />
  </svg>
);
const FuelIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V8a2 2 0 012-2h6a2 2 0 012 2v13M3 21h10m5-14l2.5 2.5a1.5 1.5 0 010 2.1V17a1.5 1.5 0 003 0v-6l-3-3" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
  </svg>
);
const CarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 16H6.5A1.5 1.5 0 015 14.5v-4a3 3 0 013-3h5l3 3h3.5A1.5 1.5 0 0121 12v2.5a1.5 1.5 0 01-1.5 1.5H18" />
  </svg>
);
const TagIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41L11 22 2 13l8.6-8.6a2 2 0 011.42-.6H20a2 2 0 012 2v6.17a2 2 0 01-.6 1.42z" /><circle cx="15.5" cy="8.5" r="1.5" />
  </svg>
);
const RegIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
  </svg>
);
const HashIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18" />
  </svg>
);
const FolderIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const WrenchIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 00-5.6 5.1L3 17.5V21h3.5l6.1-6.1a4 4 0 005.1-5.6l-2.6 2.6-2-2 2.6-2.6z" />
  </svg>
);
const BellIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" /><path strokeLinecap="round" d="M9.5 21a2.5 2.5 0 005 0" />
  </svg>
);

/* ─── Stat tile ─────────────────────────────────────────────────────────── */
function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-tile">
      <div className="stat-tile-icon">{icon}</div>
      <p className="text-[10.5px] text-[#7a95b0] mb-0.5">{label}</p>
      <p className="text-[14px] font-bold text-[#e8f0f8]">{value}</p>
    </div>
  );
}

/* ─── Document row ──────────────────────────────────────────────────────── */
function DocRow({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="stat-tile-icon !mb-0"><ShieldIcon /></div>
        <span className="text-[12.5px] font-semibold text-[#e8f0f8]">{name}</span>
      </div>
      <button className="doc-view-btn">View</button>
    </div>
  );
}


function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="detail-skeleton h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="detail-skeleton h-20 rounded-xl" />
          ))}
        </div>
        <div className="detail-skeleton h-40 w-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="detail-skeleton h-40 w-full rounded-2xl" />
        <div className="detail-skeleton h-52 w-full rounded-2xl" />
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function VehicleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { logoutuser } = useAuth();
 
  const { vehicle,fetchVehicleById,loading } = useVehicle()


  useEffect(() => {
    console.log("reached")
    if(id)  fetchVehicleById(id)
  }, [id]);

  if(loading){
    return <DetailSkeleton/>
  }

  if(!vehicle)return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center text-[#4e6077]">
      Vehicle not found
    </div>
  );

  // const vehicle = {
  //   brand: "Volkswagen",
  //   model: "Polo GT",
  //   edition: "2020 Edition",
  //   regNumber: "KL 75 D 2532",
  //   odometer: "24,500 km",
  //   fuelType: "Petrol",
  //   year: "2020",
  //   insurance: "11-10-2028",
  //   vehicleType: "Car",
  //   lastNotedKms: "20,000 km",
  //   rcNumber: "Rc1245785623",
  //   image:
  //     "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
  // };

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
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#4e6077] mb-5">
            <span className="hover:text-[#7a95b0] cursor-pointer transition-colors" onClick={() => navigate("/my-vehicle")}>
              Vehicles
            </span>
            <span>›</span>
            <span className="text-[#7a95b0]">{vehicle.brand} {vehicle.model}</span>
          </div>

          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Left column ── */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Hero */}
                <div className="relative h-64 rounded-2xl overflow-hidden border border-white/[0.07]">
                  <img src={vehicle.documents.vehicleImage} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/95 via-[#050d1a]/10 to-transparent" />
                  <span className="status-pill status-pill--good absolute top-4 right-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" /> Active
                  </span>
                  <div className="absolute bottom-5 left-5">
                    <h1 className="text-[26px] font-black tracking-tight text-white mb-1">{vehicle.model}</h1>
                    <p className="text-[12.5px] font-semibold text-[#3b9edd]">
                      {vehicle.RegistrationNumber} • {vehicle.year}
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatTile icon={<GaugeIcon />} label="Odometer" value={String(vehicle.odometer)} />
                  <StatTile icon={<FuelIcon />} label="Fuel Type" value={vehicle.FuelType} />
                  <StatTile icon={<CalendarIcon />} label="Year" value={String(vehicle.year)} />
                  <StatTile icon={<ShieldIcon />} label="Insurance" value={new Date(vehicle.insuranceExpiryDate).toLocaleDateString()} />
                  <StatTile icon={<CarIcon />} label="Vehicle Type" value={vehicle.vehicleType} />
                  <StatTile icon={<TagIcon />} label="Brand" value={vehicle.brand} />
                  <StatTile icon={<TagIcon />} label="Model" value={vehicle.model} />
                  <StatTile icon={<RegIcon />} label="Registration No" value={vehicle.RegistrationNumber} />
                  <StatTile icon={<ClockIcon />} label="Last Noted Kms" value={String(vehicle.lastNotedKms)} />
                  <StatTile icon={<HashIcon />} label="RC Number" value={vehicle.RCNumber} />
                </div>

                {/* Documents */}
                <div className="side-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <FolderIcon />
                      <span className="text-[13.5px] font-bold text-[#e8f0f8]">Documents</span>
                    </div>
                    <button
                      onClick={() => navigate(`/my-vehicle/${id}/manage`)}
                      className="text-[11.5px] font-semibold text-[#3b9edd] hover:text-[#5cb3ea] transition-colors"
                    >
                      Manage All
                    </button>
                  </div>
                  <div className="mt-2">
                    <DocRow name="RC Document" />
                    <DocRow name="POC Document" />
                  </div>
                </div>
              </div>

              {/* ── Right column ── */}
              <div className="flex flex-col gap-6">
                {/* CTA */}
                <div className="cta-card">
                  <div className="cta-card-ring" />
                  <p className="text-[16px] font-black text-white mb-3 relative z-10">Maintain Performance</p>
                  <button
                    onClick={() => navigate(`/repair?vehicle=${id}`)}
                    className="cta-btn relative z-10"
                  >
                    BOOK SERVICE NOW
                  </button>
                </div>

                {/* Next service reminder */}
                <div className="side-card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="stat-tile-icon !mb-0"><WrenchIcon /></div>
                    <span className="text-[13px] font-bold text-[#e8f0f8]">Next Service</span>
                  </div>
                  <p className="text-[20px] font-black text-[#f0f6ff] mb-1">4,500 km</p>
                  <p className="text-[11.5px] text-[#7a95b0] mb-4">or by 15 Oct 2026, whichever comes first</p>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b9edd]" style={{ width: "68%" }} />
                  </div>
                </div>

                {/* Insurance status */}
                <div className="side-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="stat-tile-icon !mb-0"><BellIcon /></div>
                      <span className="text-[13px] font-bold text-[#e8f0f8]">Insurance Status</span>
                    </div>
                    <span className="status-pill status-pill--warn">89 days left</span>
                  </div>
                  <p className="text-[11.5px] text-[#7a95b0] leading-relaxed">
                    Policy expires on <span className="text-[#e8f0f8] font-semibold">{new Date(vehicle.insuranceExpiryDate).toLocaleDateString()}</span>. Renew ahead of time to avoid a lapse in coverage.
                  </p>
                </div>

                {/* Recent activity */}
                <div className="side-card">
                  <p className="text-[13px] font-bold text-[#e8f0f8] mb-4">Recent Activity</p>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: "Oil change completed", date: "2 Jul 2026" },
                      { label: "RC document uploaded", date: "18 Jun 2026" },
                      { label: "Odometer updated", date: "2 Jun 2026" },
                    ].map((item, i, arr) => (
                      <div key={item.label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="timeline-dot mt-1" />
                          {i !== arr.length - 1 && <div className="timeline-line" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-[12px] font-semibold text-[#e8f0f8]">{item.label}</p>
                          <p className="text-[10.5px] text-[#7a95b0]">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
} 