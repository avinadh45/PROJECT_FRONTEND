import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminAuth } from "../hook/useAdminAuth";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// ── Types ──────────────────────────────────────────────────────────────────
interface GarageDetail {
  id: string;
  garageName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  appliedOn: string;
  serviceMode: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  coverImage: string | null;
  workingDays: string[];
  workingHoursFrom: string;
  workingHoursTo: string;
  services: string[];
  vehicleTypes: ("Car" | "Bike" | "Commercial Vehicle")[];
  garageLicenseUrl: string | null;
  ownerIdProofUrl: string | null;
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Icons ──────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const CarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
    <path d="M5 12h14"/>
  </svg>
);
const BikeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 6h-5l-3 5.5M9 11.5l2.5-5.5M15 6l3 5.5M9 17.5h9"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const WrenchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const XSmall = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// ── FadeIn ─────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
    }}>
      {children}
    </div>
  );
}

// ── Section card wrapper ───────────────────────────────────────────────────
function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius: "14px",
      background: "linear-gradient(160deg,#0d1a10,#090e0b)",
      border: "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "14px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(255,255,255,0.015)",
    }}>
      <span style={{ color: "#10b981" }}>{icon}</span>
      <span style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Read-only field ────────────────────────────────────────────────────────
function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "5px" }}>
        {label}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8f5ee", fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function GarageDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { verifyDetails, details, loading, verificationApprove, verificationReject } = useAdminAuth();
  const garage = details;
  console.log(details);

  useEffect(() => {
    if (id) {
      verifyDetails(id);
    }
  }, [id]);

  if (!garage) {
    return <div>Loading...</div>;
  }

  const statusColors = {
    pending: {
      bg: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.3)",
      color: "#fbbf24",
    },
    approved: {
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.3)",
      color: "#34d399",
    },
    rejected: {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.3)",
      color: "#f87171",
    },
  }[garage.verificationStatus] || {
    bg: "rgba(255,255,255,0.1)",
    border: "rgba(255,255,255,0.2)",
    color: "#fff",
  };

  const vehicleIcons: Record<string, React.ReactNode> = {
    "Car": <CarIcon />,
    "Bike": <BikeIcon />,
    "Commercial Vehicle": <TruckIcon />,
  };

  const handleCancel = () => {
    setConfirmAction(null);
    setRejectReason("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.6)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(16,185,129,0.2); border-radius:2px; }
        .reject-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          color: #e8f5ee;
          font-size: 12px;
          padding: 10px 13px;
          resize: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s;
          line-height: 1.6;
        }
        .reject-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .reject-textarea:focus { border-color: rgba(239,68,68,0.55); }
      `}</style>

      <div style={{
        background: "#080e0a", minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif", overflowY: "auto",
      }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "32px 24px 60px" }}>

          {/* ── Top bar ── */}
          <FadeIn delay={0}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "9px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = "rgba(16,185,129,0.1)"; b.style.color = "#10b981"; b.style.borderColor = "rgba(16,185,129,0.25)"; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = "rgba(255,255,255,0.04)"; b.style.color = "rgba(255,255,255,0.5)"; b.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <BackIcon />
              </button>
              <h1 style={{
                margin: 0, fontSize: "17px", fontWeight: 700,
                color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.2px",
              }}>
                Garage Details
              </h1>
            </div>
          </FadeIn>

          {/* ── Hero banner ── */}
          <FadeIn delay={40}>
            <div style={{
              borderRadius: "16px", overflow: "hidden", marginBottom: "20px",
              background: "linear-gradient(135deg,#0d1f14 0%,#091510 50%,#071210 100%)",
              border: "1px solid rgba(16,185,129,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              position: "relative",
            }}>
              <div style={{ height: "2px", background: "linear-gradient(90deg,#10b981,#06b6d4 60%,transparent)" }} />
              <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: "22px" }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "14px", flexShrink: 0,
                  background: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.08))",
                  border: "1px solid rgba(16,185,129,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <h2 style={{
                      margin: 0, fontSize: "20px", fontWeight: 800,
                      color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px",
                    }}>
                      {garage.providerProfile?.garageName}
                    </h2>
                    <span style={{
                      padding: "3px 10px", borderRadius: "100px",
                      fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      background: statusColors.bg, border: `1px solid ${statusColors.border}`, color: statusColors.color,
                    }}>
                      {garage.verificationStatus}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.38)", fontSize: "12px" }}>
                    <CalendarIcon />
                    Applied: {garage.createdAt ? new Date(garage.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── Main 2-col layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px", marginBottom: "16px" }}>

            {/* LEFT — Garage Information */}
            <FadeIn delay={80}>
              <SectionCard>
                <SectionHeader icon={<InfoIcon />} label="Garage Information" />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 28px" }}>
                    <ReadField label="Garage Name"   value={garage.providerProfile?.garageName} />
                    <ReadField label="Owner Name"    value={garage.providerProfile?.ownerName} />
                    <ReadField label="Phone Number"  value={garage.providerProfile?.phone} />
                    <ReadField label="Email Address" value={garage.email} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "5px" }}>
                        Business Address
                      </div>
                    </div>
                    <ReadField label="Applied On" value={garage.createdAt ? new Date(garage.createdAt).toLocaleDateString() : "N/A"} />
                    <ReadField
                      label="Service Mode"
                      value={
                        [
                          ...new Set(
                            garage.servicesOffered?.flatMap((service) => service.serviceModes)
                          ),
                        ].join(", ") || "N/A"
                      }
                    />
                  </div>

                  {/* ── Map ── */}
                  <div style={{ marginTop: "20px" }}>
                    <div style={{
                      fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.09em",
                      textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "10px",
                    }}>
                      Location on Map
                    </div>
                    <div style={{
                      width: "100%", height: "300px", borderRadius: "12px",
                      overflow: "hidden", border: "1px solid rgba(16,185,129,0.15)",
                    }}>
                      <MapContainer
                        center={[
                          garage.providerProfile?.location?.coordinates?.[1] || 0,
                          garage.providerProfile?.location?.coordinates?.[0] || 0,
                        ]}
                        zoom={13}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            garage.providerProfile?.location?.coordinates?.[1] || 0,
                            garage.providerProfile?.location?.coordinates?.[0] || 0,
                          ]}
                        >
                          <Popup>{garage.providerProfile?.garageName}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </FadeIn>

            {/* RIGHT column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Vehicle Types */}
              <FadeIn delay={100}>
                <SectionCard>
                  <SectionHeader icon={<CarIcon />} label="Vehicle Types Supported" />
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(["Car", "Bike", "Commercial Vehicle"] as const).map(v => {
                      const supported = garage.servicesOffered
                        ?.flatMap((service) => service.vehicleTypes)
                        .includes(v);
                      return (
                        <div key={v} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", borderRadius: "10px",
                          background: supported ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${supported ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                            <span style={{ color: supported ? "#10b981" : "rgba(255,255,255,0.25)" }}>
                              {vehicleIcons[v]}
                            </span>
                            <span style={{ fontSize: "12.5px", fontWeight: 500, color: supported ? "#e8f5ee" : "rgba(255,255,255,0.3)" }}>
                              {v}
                            </span>
                          </div>
                          {supported && (
                            <div style={{
                              width: "18px", height: "18px", borderRadius: "50%",
                              background: "linear-gradient(135deg,#059669,#10b981)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: "0 2px 6px rgba(16,185,129,0.35)",
                            }}>
                              <CheckIcon />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </FadeIn>

              {/* Uploaded Documents */}
              <FadeIn delay={120}>
                <SectionCard>
                  <SectionHeader icon={<FileIcon />} label="Uploaded Documents" />
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Garage License", url: garage.providerProfile?.documents?.garageLicense?.url },
                      { label: "Owner ID Proof", url: garage.providerProfile?.documents?.ownerIdProof?.url },
                    ].map((doc) => (
                      <div
                        key={doc.label}
                        onClick={() => window.open(doc.url, "_blank")}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "11px 14px", borderRadius: "10px",
                          background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "8px",
                            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981",
                          }}>
                            <FileIcon />
                          </div>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8f5ee" }}>{doc.label}</div>
                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "1px", letterSpacing: "0.05em" }}>TAP TO VIEW</div>
                          </div>
                        </div>
                        <div style={{
                          width: "22px", height: "22px", borderRadius: "6px",
                          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981",
                        }}>
                          <CheckIcon />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </FadeIn>
            </div>
          </div>

          {/* ── Availability ── */}
          <FadeIn delay={140}>
            <SectionCard style={{ marginBottom: "16px" }}>
              <SectionHeader icon={<ClockIcon />} label="Availability" />
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "10px" }}>
                    Working Days
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {ALL_DAYS.map(day => {
                      const active = garage.availability?.workingDays?.includes(day);
                      return (
                        <div key={day} style={{
                          padding: "6px 16px", borderRadius: "100px",
                          fontSize: "12px", fontWeight: 600,
                          background: active ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${active ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)"}`,
                          color: active ? "#fff" : "rgba(255,255,255,0.28)",
                          boxShadow: active ? "0 2px 8px rgba(16,185,129,0.25)" : "none",
                        }}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "10px" }}>
                    Working Hours
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      padding: "10px 18px", borderRadius: "10px",
                      background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                      fontSize: "13px", fontWeight: 600, color: "#e8f5ee",
                    }}>
                      {garage.availability?.workingHours?.start}
                    </div>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>to</span>
                    <div style={{
                      padding: "10px 18px", borderRadius: "10px",
                      background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                      fontSize: "13px", fontWeight: 600, color: "#e8f5ee",
                    }}>
                      {garage.availability?.workingHours?.end}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </FadeIn>

          {/* ── Services Offered ── */}
          <FadeIn delay={160}>
            <SectionCard style={{ marginBottom: "20px" }}>
              <SectionHeader icon={<WrenchIcon />} label="Services Offered" />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                  {garage.servicesOffered?.map((service, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "6px 14px", borderRadius: "100px",
                        fontSize: "12px", fontWeight: 500,
                        background: "rgba(16,185,129,0.07)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {service.serviceId.name}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.22)", margin: 0 }}>
                  Select all services that your garage currently provides to customers.
                </p>
              </div>
            </SectionCard>
          </FadeIn>

          {/* ── Ready for verification banner + actions ── */}
          <FadeIn delay={180}>
            <div style={{
              borderRadius: "14px",
              background: "linear-gradient(160deg,#0d1a10,#090e0b)",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "18px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>

                {/* Left: icon + text/textarea */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0, marginTop: "2px",
                    background: confirmAction === "reject"
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(16,185,129,0.1)",
                    border: `1px solid ${confirmAction === "reject"
                      ? "rgba(239,68,68,0.22)"
                      : "rgba(16,185,129,0.22)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: confirmAction === "reject" ? "#f87171" : "#10b981",
                    transition: "all 0.2s",
                  }}>
                    <ShieldIcon />
                  </div>

                  <div style={{ flex: 1 }}>
                    {confirmAction === null && (
                      <>
                        <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: "2px" }}>
                          Ready for verification?
                        </div>
                        <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
                          Review all documents carefully before taking any action.
                        </div>
                      </>
                    )}

                    {confirmAction === "approve" && (
                      <>
                        <div style={{ fontSize: "13.5px", fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: "2px", color: "#34d399" }}>
                          Approve this garage?
                        </div>
                        <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
                          This will mark the garage as approved and notify the owner.
                        </div>
                      </>
                    )}

                    {confirmAction === "reject" && (
                      <>
                        <div style={{ fontSize: "13.5px", fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: "2px", color: "#f87171" }}>
                          Reject this garage?
                        </div>
                        <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)", marginBottom: "14px" }}>
                          This will reject the application and notify the owner.
                        </div>

                        {/* ── Rejection reason textarea ── */}
                        <div style={{ maxWidth: "480px" }}>
                          <div style={{
                            fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.09em",
                            textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "7px",
                          }}>
                            Reason for rejection <span style={{ color: "#f87171" }}>*</span>
                          </div>
                          <textarea
                            className="reject-textarea"
                            rows={3}
                            maxLength={300}
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="e.g. Documents are unclear, license expired, incomplete information…"
                          />
                          <div style={{
                            fontSize: "10px", color: "rgba(255,255,255,0.2)",
                            textAlign: "right", marginTop: "5px",
                          }}>
                            {rejectReason.length} / 300
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, paddingTop: "2px" }}>

                  {confirmAction === null ? (
                    /* ── Initial state: Reject + Accept ── */
                    <>
                      <button
                        onClick={() => setConfirmAction("reject")}
                        style={{
                          display: "flex", alignItems: "center", gap: "7px",
                          padding: "10px 20px", borderRadius: "10px", cursor: "pointer",
                          fontSize: "13px", fontWeight: 700, fontFamily: "Syne, sans-serif",
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                          color: "#f87171", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { const b = e.currentTarget; b.style.background = "rgba(239,68,68,0.18)"; b.style.borderColor = "rgba(239,68,68,0.45)"; }}
                        onMouseLeave={e => { const b = e.currentTarget; b.style.background = "rgba(239,68,68,0.1)"; b.style.borderColor = "rgba(239,68,68,0.25)"; }}
                      >
                        <XSmall /> REJECT
                      </button>

                      <button
                        onClick={() => setConfirmAction("approve")}
                        style={{
                          display: "flex", alignItems: "center", gap: "7px",
                          padding: "10px 22px", borderRadius: "10px", cursor: "pointer",
                          fontSize: "13px", fontWeight: 700, fontFamily: "'Syne', sans-serif",
                          background: "linear-gradient(135deg,#059669,#10b981)",
                          color: "#fff", transition: "all 0.15s", border: "none",
                          boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(16,185,129,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,185,129,0.35)"; }}
                      >
                        <CheckIcon /> ACCEPT
                      </button>
                    </>
                  ) : (
                    /* ── Confirmation state: Cancel + Confirm ── */
                    <>
                      <button
                        onClick={handleCancel}
                        style={{
                          display: "flex", alignItems: "center", gap: "7px",
                          padding: "10px 18px", borderRadius: "10px", cursor: "pointer",
                          fontSize: "13px", fontWeight: 700, fontFamily: "Syne, sans-serif",
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { const b = e.currentTarget; b.style.background = "rgba(255,255,255,0.09)"; b.style.color = "#fff"; }}
                        onMouseLeave={e => { const b = e.currentTarget; b.style.background = "rgba(255,255,255,0.05)"; b.style.color = "rgba(255,255,255,0.5)"; }}
                      >
                        CANCEL
                      </button>

                      <button
                        disabled={confirmAction === "reject" && rejectReason.trim().length === 0}
                        onClick={async () => {
                          if (confirmAction === "approve") {
                            await verificationApprove(garage.id);
                          } else {
                            await verificationReject(garage.id, rejectReason.trim());
                          }
                          setConfirmAction(null);
                          setRejectReason("");
                          navigate("/admin/garage-verification");
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: "7px",
                          padding: "10px 22px", borderRadius: "10px", cursor: "pointer",
                          fontSize: "13px", fontWeight: 700, fontFamily: "'Syne', sans-serif",
                          background: confirmAction === "approve"
                            ? "linear-gradient(135deg,#059669,#10b981)"
                            : "linear-gradient(135deg,#b91c1c,#ef4444)",
                          color: "#fff", transition: "all 0.15s", border: "none",
                          boxShadow: confirmAction === "approve"
                            ? "0 4px 14px rgba(16,185,129,0.35)"
                            : "0 4px 14px rgba(239,68,68,0.35)",
                          opacity: confirmAction === "reject" && rejectReason.trim().length === 0 ? 0.4 : 1,
                        }}
                        onMouseEnter={e => {
                          if (!(confirmAction === "reject" && rejectReason.trim().length === 0)) {
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }
                        }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        {confirmAction === "approve"
                          ? <><CheckIcon /> CONFIRM APPROVE</>
                          : <><XSmall /> CONFIRM REJECT</>
                        }
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </>
  );
}