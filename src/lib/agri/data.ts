export type Grade = "A" | "B" | "C";

export type Geo = { name: string; lat: number; lng: number };

export type Listing = {
  id: string;
  crop: string;
  grade: Grade;
  qtyKg: number;
  pricePerKg: number;
};

export type Supplier = {
  id: string;
  name: string;
  kind: "Farmer" | "FPO";
  location: Geo;
  rating: number;
  listings: Listing[];
};

export type Transporter = {
  id: string;
  driver: string;
  vehicleType: string;
  vehicleNo: string;
  capacityKg: number;
  location: Geo;
  ratePerKm: number;
  available: boolean;
  rating: number;
};

export const CROPS = [
  "Onion",
  "Tomato",
  "Green Chillies",
  "Carrot",
  "Potato",
  "Cabbage",
  "Brinjal",
] as const;

export const HYDERABAD: Geo = {
  name: "Hyderabad Wholesale Market, Bowenpally",
  lat: 17.475,
  lng: 78.472,
};

export const SUPPLIERS: Supplier[] = [
  {
    id: "f-a",
    name: "Farmer A · Ramesh Yadav",
    kind: "Farmer",
    location: { name: "Shamirpet, Medchal", lat: 17.62, lng: 78.57 },
    rating: 4.7,
    listings: [
      { id: "l1", crop: "Onion", grade: "A", qtyKg: 450, pricePerKg: 22 },
      { id: "l2", crop: "Potato", grade: "B", qtyKg: 200, pricePerKg: 18 },
    ],
  },
  {
    id: "f-b",
    name: "Farmer B · Lakshmi Devi",
    kind: "Farmer",
    location: { name: "Sangareddy", lat: 17.62, lng: 78.09 },
    rating: 4.5,
    listings: [
      { id: "l3", crop: "Onion", grade: "A", qtyKg: 380, pricePerKg: 21.5 },
      { id: "l4", crop: "Tomato", grade: "B", qtyKg: 250, pricePerKg: 15 },
    ],
  },
  {
    id: "fpo-c",
    name: "FPO C · Medak Growers Collective",
    kind: "FPO",
    location: { name: "Medak", lat: 18.04, lng: 78.26 },
    rating: 4.8,
    listings: [
      { id: "l5", crop: "Onion", grade: "A", qtyKg: 900, pricePerKg: 23 },
      { id: "l6", crop: "Cabbage", grade: "A", qtyKg: 400, pricePerKg: 12 },
    ],
  },
  {
    id: "f-d",
    name: "Farmer D · Srinivas Reddy",
    kind: "Farmer",
    location: { name: "Chevella, Ranga Reddy", lat: 17.31, lng: 78.13 },
    rating: 4.6,
    listings: [
      { id: "l7", crop: "Tomato", grade: "A", qtyKg: 320, pricePerKg: 18 },
      { id: "l8", crop: "Brinjal", grade: "A", qtyKg: 180, pricePerKg: 20 },
    ],
  },
  {
    id: "fpo-e",
    name: "FPO E · Vikarabad Farmer Producer Org",
    kind: "FPO",
    location: { name: "Vikarabad", lat: 17.34, lng: 77.9 },
    rating: 4.4,
    listings: [
      { id: "l9", crop: "Tomato", grade: "A", qtyKg: 600, pricePerKg: 19 },
      { id: "l10", crop: "Carrot", grade: "A", qtyKg: 200, pricePerKg: 28 },
    ],
  },
  {
    id: "f-f",
    name: "Farmer F · Anjaiah Goud",
    kind: "Farmer",
    location: { name: "Nalgonda", lat: 17.05, lng: 79.27 },
    rating: 4.3,
    listings: [
      { id: "l11", crop: "Green Chillies", grade: "A", qtyKg: 160, pricePerKg: 46 },
    ],
  },
  {
    id: "f-g",
    name: "Farmer G · Kavitha Rao",
    kind: "Farmer",
    location: { name: "Siddipet", lat: 18.1, lng: 78.85 },
    rating: 4.6,
    listings: [
      { id: "l12", crop: "Carrot", grade: "A", qtyKg: 350, pricePerKg: 26 },
      { id: "l13", crop: "Green Chillies", grade: "B", qtyKg: 90, pricePerKg: 38 },
    ],
  },
  {
    id: "f-h",
    name: "Farmer H · Mahesh Kumar",
    kind: "Farmer",
    location: { name: "Zaheerabad", lat: 17.68, lng: 77.61 },
    rating: 4.1,
    listings: [
      { id: "l14", crop: "Onion", grade: "B", qtyKg: 500, pricePerKg: 18 },
      { id: "l15", crop: "Carrot", grade: "A", qtyKg: 150, pricePerKg: 30 },
    ],
  },
];

export const TRANSPORTERS: Transporter[] = [
  {
    id: "t-1",
    driver: "Ravi Kumar",
    vehicleType: "Truck · 6 Tyre",
    vehicleNo: "TS 09 UB 4412",
    capacityKg: 6000,
    location: { name: "Medchal", lat: 17.63, lng: 78.48 },
    ratePerKm: 34,
    available: true,
    rating: 4.7,
  },
  {
    id: "t-2",
    driver: "Imran Shaikh",
    vehicleType: "Mini Truck",
    vehicleNo: "TS 07 TA 9081",
    capacityKg: 2500,
    location: { name: "Sangareddy", lat: 17.61, lng: 78.08 },
    ratePerKm: 22,
    available: true,
    rating: 4.4,
  },
  {
    id: "t-3",
    driver: "Naresh Goud",
    vehicleType: "Refrigerated Truck",
    vehicleNo: "TS 10 UC 2277",
    capacityKg: 4000,
    location: { name: "Vikarabad", lat: 17.35, lng: 77.92 },
    ratePerKm: 41,
    available: true,
    rating: 4.8,
  },
  {
    id: "t-4",
    driver: "Shiva Prasad",
    vehicleType: "Pickup Van",
    vehicleNo: "TS 08 UA 5510",
    capacityKg: 1200,
    location: { name: "Nalgonda", lat: 17.06, lng: 79.26 },
    ratePerKm: 16,
    available: true,
    rating: 4.2,
  },
];

export const DEMO_ITEMS = [
  { crop: "Onion", qtyKg: 1000, grade: "A" as Grade },
  { crop: "Green Chillies", qtyKg: 100, grade: "A" as Grade },
  { crop: "Tomato", qtyKg: 500, grade: "A" as Grade },
  { crop: "Carrot", qtyKg: 300, grade: "A" as Grade },
];
