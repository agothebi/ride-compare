/** Dark map style aligned with app tokens. */
export const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#161618" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9b9b9e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b0b0c" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#222224" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2e2e32" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0b0b0c" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1c1c1e" }],
  },
];
