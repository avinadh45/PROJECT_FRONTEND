import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  status: "idle" | "loading" | "success" | "denied" | "unavailable";
}

export function useGeolocation(enabled: boolean) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    status: "idle",
  });

  useEffect(() => {
    if (!enabled) return;
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, status: "unavailable" }));
      return;
    }
    setState((s) => ({ ...s, status: "loading" }));
    navigator.geolocation.getCurrentPosition((position) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        status: "success",
      });
    },
    (error)=>{
        setState(s=>({...s,status:"denied"}))
    },
    {enableHighAccuracy:false,timeout:8000,maximumAge: 5*60*1000}
);
  },[enabled]);
  return state
}
