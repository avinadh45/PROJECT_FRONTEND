import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useVehicles } from "../queries/useVehicle";
import { useCategories } from "../queries/useCategories";
import { useGarage } from "../queries/useGarages";
import { useSlots } from "../queries/useSlots";
import type { Category } from "../interface/bookingInterface";
import type { TimeSlot } from "../interface/bookingInterface";
import { useGeolocation } from "../hooks/useGeolocation";
import MapPicker from "../../../shared/components/MapPicker";




interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  imageUrl: string;
  type: string;
}

interface Garage {
  id: string;
  garageName: string;
  garageProfileImage?: string;
  formattedAddress?: string;
  advanceFee: number | null;
  distanceInKm?: number;
}



type ServiceMode = "drive-in" | "pickup-drop";

interface LocationValue {
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string;
}

import { ChevronLeft, ChevronRight, Star, MapPin, Warehouse, Truck, CheckCircle,Search } from 'lucide-react';
import { useCreateBookingOrder, useVerifyBookingPayment } from "../queries/useBookingPayment";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/history" },
];


const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];



function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
        }}
      >
        {String(step).padStart(2, "0")}
      </div>
      <div>
        <h2
          className="text-xl md:text-2xl text-white"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-1 text-sm text-slate-400"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-6 py-10 text-slate-400">
   
      <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {message}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Vehicle selector                                                */
/* ------------------------------------------------------------------ */

function VehicleCard({
  vehicle,
  selected,
  onSelect,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-52 shrink-0 flex-col overflow-hidden rounded-xl border text-left transition-all ${
        selected
          ? "border-transparent ring-2 ring-cyan-400"
          : "border-white/10 hover:border-white/25"
      }`}
      style={{
        background: "#0a0f1e",
      }}
    >
      {selected && (
        <div
          className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
        >
         
        </div>
      )}
      <div className="h-28 w-full bg-white/5">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            No image
          </div>
        )}
      </div>
      <div className="p-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p className="truncate text-sm font-semibold text-white">
          {vehicle.name}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{vehicle.plateNumber}</p>
      </div>
    </button>
  );
}

function VehicleSelector({
  vehicles,
  isLoading,
  selectedId,
  onSelect,
}: {
  vehicles: Vehicle[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (isLoading) return <LoadingState message="Loading your vehicles…" />;
  if (vehicles.length === 0)
    return (
      <EmptyState message="No saved vehicles yet. Add a vehicle to book a service." />
    );

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          selected={selectedId === vehicle.id}
          onSelect={() => onSelect(vehicle.id)}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Service category grid                                          */
/* ------------------------------------------------------------------ */

function CategorySelector({
  categories,
  isLoading,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (isLoading) return <LoadingState message="Loading categories…" />;
  if (categories.length === 0) return <EmptyState message="No categories available." />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
              isSelected
                ? "border-transparent ring-2 ring-cyan-400"
                : "border-white/10 hover:border-white/25"
            }`}
            style={{ background: "#0a0f1e" }}
          >
            {category.icon ? (
              <img src={category.icon} alt={category.name} className="h-7 w-7 object-contain" />
            ) : (
              <div className="h-7 w-7 rounded-md bg-white/5" /> 
            )}
            <span
              className="text-xs font-medium text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}


function ServiceTypeSelector({
  selected,
  onSelect,
}: {
  selected: ServiceMode | null;
  onSelect: (mode: ServiceMode) => void;
}) {
  const options: {
    id: ServiceMode;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "drive-in",
      title: "Drive-in",
      description: "Drop your vehicle at the garage",
      icon: Warehouse,
    },
    {
      id: "pickup-drop",
      title: "Pickup & Drop",
      description: "We pick it up from your doorstep",
      icon: Truck,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`flex items-center gap-4 rounded-xl border p-5 text-left transition-all ${
              isSelected
                ? "border-cyan-400/60 bg-cyan-400/[0.06]"
                : "border-white/10 bg-[#0a0f1e] hover:border-white/25"
            }`}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <p className="text-base font-semibold text-white">
                {option.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-400">
                {option.description}
              </p>
            </div>
            {isSelected && (
              <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-cyan-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}

async function reverseGeocode(lat:number,lng:number):Promise<string>{
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    const data = await res.json()
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch{
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}) {
    const [resolving, setResolving] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const  handleCoordinates = async(coords:{ type:string; coordinates:number[]})=>{
    const [lng,lat] = coords.coordinates;
    setResolving(true)
    const address = await reverseGeocode(lat,lng)
    onChange({latitude:lat,longitude:lng,formattedAddress:address})
    setResolving(false)
  }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {showMap ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <MapPicker setCoordinates={handleCoordinates} />
          </div>
        ) : (
          <div
            className="relative flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0f1e]"
            onClick={() => setShowMap(true)}
          >
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <MapPin className="h-8 w-8" />
              <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Tap to drop a pin on the map
              </p>
              {value.formattedAddress && (
                <p className="max-w-[80%] text-center text-xs text-cyan-400">
                  {value.formattedAddress}
                </p>
              )}
            </div>
          </div>
        )}
        {resolving && (
          <p className="mt-2 text-xs text-slate-500">Resolving address…</p>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:col-span-2">
        <label
          className="text-xs font-medium uppercase tracking-wide text-slate-400"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Or enter address manually
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={value.formattedAddress}
            onChange={(e) => onChange({ ...value, formattedAddress: e.target.value })}
            placeholder="House no, street, area, city…"
            className="w-full rounded-lg border border-white/10 bg-[#060a14] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
        <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          We'll use this address for pickup and drop-off.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Garage recommendations                                         */
/* ------------------------------------------------------------------ */

function GarageCard({
  garage,
  selected,
  onSelect,
}: {
  garage: Garage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border transition-all ${
        selected
          ? "border-cyan-400/60 bg-cyan-400/[0.05]"
          : "border-white/10 bg-[#0a0f1e]"
      }`}
    >
      <div className="h-32 w-full bg-white/5">
        {garage.garageProfileImage ? (
          <img
            src={garage.garageProfileImage}
            alt={garage.garageName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <Star className="h-6 w-6" />
          </div>
        )}
      </div>
      <div
        className="flex flex-1 flex-col gap-2 p-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <p className="truncate text-sm font-semibold text-white">
          {garage.garageName}
        </p>
        {garage.formattedAddress && (
          <p className="truncate text-xs text-slate-400">
            {garage.formattedAddress}
          </p>
        )}
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>
            {garage.distanceInKm !== undefined
              ? `${garage.distanceInKm} km away`
              : "Distance unavailable"}
          </span>
          <span>
            {garage.advanceFee !== null
              ? `₹${garage.advanceFee} advance`
              : "No advance fee"}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              // TODO: wire to real API — navigate to garage details view
            }}
            className="flex-1 rounded-lg border border-white/15 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/5"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={onSelect}
            className="flex-1 rounded-lg py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{
              background: selected
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg, #3b82f6, #06b6d4)",
              border: selected ? "1px solid rgba(6,182,212,0.6)" : "none",
            }}
          >
            {selected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GarageSelector({
  readyToLoad,
  garages,
  isLoading,
  selectedId,
  onSelect,
}: {
  readyToLoad: boolean;
  garages: Garage[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!readyToLoad)
    return (
      <EmptyState message="Complete the steps above to see garages near you." />
    );
  if (isLoading)
    return <LoadingState message="Finding garages near you…" />;
  if (garages.length === 0)
    return <EmptyState message="No garages found nearby yet." />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {garages.map((garage) => (
        <GarageCard
          key={garage.id}
          garage={garage}
          selected={selectedId === garage.id}
          onSelect={() => onSelect(garage.id)}
        />
      ))}
    </div>
  );
}



function buildMonthGrid(monthDate: Date): (Date | null)[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function DateTimeSelector({
  garageSelected,
  selectedDate,
  onSelectDate,
  slots,
  isLoadingSlots,
  selectedSlotId,
  onSelectSlot,
}: {
  garageSelected: boolean;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  slots: TimeSlot[];
  isLoadingSlots: boolean;
  selectedSlotId: string | null;
  onSelectSlot: (id: string) => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  if (!garageSelected) {
    return <EmptyState message="Select a garage above to view available slots." />;
  }

  const cells = buildMonthGrid(visibleMonth);
  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Calendar */}
      <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-4 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(
                new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1)
              )
            }
            className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(
                new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)
              )
            }
            className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_LABELS.map((d, i) => (
            <span key={i} className="text-[11px] font-medium text-slate-500">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, idx) => {
            if (!date) return <div key={idx} />;
            const disabled = date < today;
            const selected = isSameDay(date, selectedDate);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(date)}
                className={`aspect-square rounded-lg text-xs font-medium transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-slate-700"
                    : selected
                    ? "text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
                style={
                  selected
                    ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }
                    : undefined
                }
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot table */}
      <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-4 lg:col-span-3">
        <p
          className="mb-3 text-sm font-semibold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
            : "Select a date"}
        </p>

        {!selectedDate ? (
          <EmptyState message="Pick a date on the calendar to view time slots." />
        ) : isLoadingSlots ? (
          <LoadingState message="Loading available slots…" />
        ) : slots.length === 0 ? (
          <EmptyState message="No slots available for this date." />
        ) : (
          <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar sm:grid-cols-3">
            {slots.map((slot) => {
              const isDisabled = slot.status !== "available";
              const isSelected = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectSlot(slot.id)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    isDisabled
                      ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600 line-through"
                      : isSelected
                      ? "border-transparent text-white"
                      : "border-white/10 text-slate-300 hover:border-white/25"
                  }`}
                  style={
                    isSelected && !isDisabled
                      ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }
                      : undefined
                  }
                  title={
                    slot.status === "full"
                      ? "Fully booked"
                      : slot.status === "blocked"
                      ? "Blocked by garage"
                      : undefined
                  }
                >
                  {slot.startTime}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ScheduleRepairPage() {
  const { logoutuser } = useAuth();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const { data: vehicles, isLoading:isLoadingVehicles} = useVehicles()

 const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
const { data: categories, isLoading: isLoadingCategories } = useCategories();
 const [serviceMode,setServiceMode] = useState<ServiceMode | null>(null)
 const navigate = useNavigate()

 const [location,setLocation] = useState<LocationValue>({
    latitude:null,
    longitude:null,
    formattedAddress:""
 })
 const [ selectedGarageId, setSelectedGarageId] = useState<string | null>(null)

const createOrderMutation = useCreateBookingOrder()
const verifyPaymentMutation = useVerifyBookingPayment()
const [ submitting,setSubmitting] = useState(false)
const [bookingError, setBookingError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
 
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [additionalInfo, setAdditionalInfo] = useState("");

  const isPickup = serviceMode === "pickup-drop";
  const isDriveIn = serviceMode === "drive-in"

  const driveLocation  = useGeolocation(isDriveIn)
  const locationSatisfied = !isPickup || location.formattedAddress.trim().length > 0;

  const readyForGarages = Boolean(
    selectedVehicleId && selectedCategoryId && serviceMode && locationSatisfied
  );

  const garageFilter = readyForGarages ? {
    categoryId: selectedCategoryId!,
    vehicleType: vehicles?.find((v)=> v.id === selectedVehicleId)?.type ?? "",
    serviceMode: serviceMode!,
    latitude: isPickup ? (location.latitude ?? undefined) : ( driveLocation.latitude ?? undefined),
    longitude: isPickup ? ( location.longitude ?? undefined) : (driveLocation.longitude ?? undefined)
  }: null
  
const { data: garages, isLoading:isLoadingGarages} = useGarage(garageFilter)

  useEffect(()=>{
    setSelectedGarageId(null);
  },[selectedVehicleId, selectedCategoryId, serviceMode, location.formattedAddress])

  function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
  
    const slotFilter = selectedGarageId && selectedDate ? {serviceCenterId:selectedGarageId,date:toDateKey(selectedDate)}:null

    const { data:slots,isLoading:isLoadingSlots} = useSlots(slotFilter)

    useEffect(()=>{
      setSelectedSlotId(null)
    },[selectedGarageId,selectedDate])

  const canSubmit = Boolean(
    selectedVehicleId &&
      selectedCategoryId &&
      serviceMode &&
      locationSatisfied &&
      selectedGarageId &&
      selectedDate &&
      selectedSlotId
  );
//console.log({ selectedVehicleId, selectedCategoryId, serviceMode, locationSatisfied, readyForGarages },"valathum vanno");
  const handleSubmit = async () => {
  if (!canSubmit) return;
  setBookingError(null);
  setSubmitting(true);
  try {
    const selectedSlot = slots?.find((s: TimeSlot) => s.id === selectedSlotId);

    const order = await createOrderMutation.mutateAsync({
      vehicleId: selectedVehicleId!,
      categoryId: selectedCategoryId!,
      serviceCenterId: selectedGarageId!,
      visitType: serviceMode!,
      pickupLocation: isPickup
        ? {
            type: "Point",
            coordinates: [location.longitude!, location.latitude!],
            formattedAddress: location.formattedAddress,
          }
        : undefined,
      schedule: {
        date: toDateKey(selectedDate!),
        slotStartingTime: selectedSlot!.startTime,
        slotEndingTime: selectedSlot!.endTime,
      },
      additionalInfo: additionalInfo || undefined,
    });

    const razorpay = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: "INR",
      name: "Motocline",
      description: "Service booking advance payment",
      order_id: order.razorpayOrderId,
      handler: async (response: any) => {
        try {
          const confirmation = await verifyPaymentMutation.mutateAsync({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          navigate(`/booking-confirmed/${confirmation.id}`);
        } catch (err) {
          setBookingError("Payment succeeded but confirmation failed. Please contact support.");
        } finally {
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
        },
      },
      theme: { color: "#06b6d4" },
    });
    razorpay.open();
  } catch (err: any) {
    setBookingError(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }
};

  return (
    <div
      className="min-h-screen w-full pb-32"
      style={{ background: "#060a14" }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
      `}</style>

      <Navbar
        links={navLinks}
        userInitials="AK"
        userName="Arun Kumar"
        userEmail="arun@email.com"
        notifications={[]}
        onLogout={logoutuser}
      />

      <div className="mx-auto max-w-5xl px-4 pt-[104px] sm:px-6 lg:px-8">
        <div className="mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a service
          </p>
          <h1
            className="mt-2 text-3xl text-white sm:text-4xl"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
          >
            Schedule Your Repair
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm text-slate-400"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Pick your vehicle, tell us what's wrong, and choose a garage and
            time that works for you.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* 1. Vehicle */}
          <section>
  <SectionHeader step={1} title="Select Vehicle" />
  <VehicleSelector
    vehicles={vehicles ?? []}
    isLoading={isLoadingVehicles}
    selectedId={selectedVehicleId}
    onSelect={setSelectedVehicleId}
  />
</section>

          {/* 2. Category */}
          <section>
            <SectionHeader step={2} title="Select Service Category" />
            <CategorySelector
                categories={categories ?? []}
                isLoading={isLoadingCategories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </section>

          {/* 3. Service type */}
          <section>
            <SectionHeader step={3} title="Select Service Type" />
            <ServiceTypeSelector
              selected={serviceMode}
              onSelect={(mode) => {
                setServiceMode(mode);
                if (mode === "drive-in") {
                  setLocation({ latitude: null, longitude: null, formattedAddress: "" });
                }
              }}
            />
          </section>

          {/* 4. Location — pickup & drop only */}
          {isPickup && (
            <section>
              <SectionHeader
                step={4}
                title="Pickup Location"
                subtitle="Where should we pick up your vehicle?"
              />
              <LocationPicker value={location} onChange={setLocation} />
            </section>
          )}

          {/* 5. Garages */}
          <section>
            <SectionHeader
              step={isPickup ? 5 : 4}
              title="Recommended Garages Near You"
            />
            <GarageSelector
              readyToLoad={readyForGarages}
              garages={garages ?? []}
              isLoading={isLoadingGarages}
              selectedId={selectedGarageId}
              onSelect={setSelectedGarageId}
            />
          </section>

          {/* 6. Date & time */}
          <section>
            <SectionHeader step={isPickup ? 6 : 5} title="Select Date & Time" />
            <DateTimeSelector
              garageSelected={Boolean(selectedGarageId)}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              slots={slots ?? []}
              isLoadingSlots={isLoadingSlots}
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
            />
          </section>

          {/* 7. Additional info */}
          <section>
            <SectionHeader
              step={isPickup ? 7 : 6}
              title="Additional Information"
              subtitle="Optional — describe the issue so the garage can prepare."
            />
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
              placeholder="E.g. Grinding noise from the front left wheel when braking…"
              className="w-full resize-none rounded-xl border border-white/10 bg-[#0a0f1e] p-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-[#060a14]/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          {bookingError &&(<p className="mb-2 text-center text-sm text-red-400">{bookingError}</p>)}
          {bookingError && (
  <p className="mb-2 text-center text-sm text-red-400">{bookingError}</p>
)}
<button
  type="button"
  disabled={!canSubmit || submitting}
  onClick={handleSubmit}
  className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
  style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", fontFamily: "'DM Sans', sans-serif" }}
>
  {submitting ? "Processing…" : "Confirm & Book Service"}
</button>
        </div>
      </div>
    </div>
  );
}