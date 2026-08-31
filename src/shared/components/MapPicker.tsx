import { MapContainer,TileLayer,Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet"

type Props = {
  setCoordinates: (coords: {
    type: string;
    coordinates: number[];
  }) => void;
};

function LocationMarker({ setCoordinates }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition(e.latlng);

      setCoordinates({
        type: "Point",
        coordinates: [lng, lat],
      });
//       console.log({
//   type: "Point",
//   coordinates: [lng, lat],
// });
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ setCoordinates }: Props) {
  return (
    <MapContainer
      center={[10.5276, 76.2144]}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker setCoordinates={setCoordinates} />
    </MapContainer>
  );
}
