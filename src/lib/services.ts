export type RideshareServiceId = "uber" | "lyft";

export type RideshareService = {
  id: RideshareServiceId;
  name: string;
  brandColor: string;
};

export const rideshareServices: RideshareService[] = [
  { id: "uber", name: "Uber", brandColor: "#000000" },
  { id: "lyft", name: "Lyft", brandColor: "#FF00BF" },
];
