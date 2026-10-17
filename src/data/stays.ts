export type StayCategory = "Beachfront" | "Mountain" | "City" | "Countryside";
export type Stay = {
  id: number;
  slug: string;
  title: string;
  location: string;
  province: string;
  category: StayCategory;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  amenities: string[];
  isGuestFavorite?: boolean;
};

// Fictional demonstration listings only. Photos are representative external images,
// not documentation of real properties. No bookings or availability are stored.
export const stays: Stay[] = [
  { id: 1, slug: "siargao-palm-hideaway", title: "Palm Hideaway Villa", location: "General Luna, Siargao", province: "Surigao del Norte", category: "Beachfront", guests: 4, bedrooms: 2, beds: 2, baths: 2, price: 5800, rating: 4.95, reviews: 88, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85", description: "Slow mornings, ocean breezes, and island energy. A bright escape designed for a relaxed coastal getaway.", amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Free parking"], isGuestFavorite: true },
  { id: 2, slug: "baguio-pine-cabin", title: "The Pinewood Cabin", location: "Baguio City, Benguet", province: "Benguet", category: "Mountain", guests: 6, bedrooms: 3, beds: 4, baths: 2, price: 4200, rating: 4.89, reviews: 126, image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85", description: "A cozy mountain hideout with warm textures and space to slow down after a day outdoors.", amenities: ["Wi-Fi", "Kitchen", "Free parking", "Mountain view"], isGuestFavorite: true },
  { id: 3, slug: "tagaytay-skyline-loft", title: "Skyline View Loft", location: "Tagaytay City, Cavite", province: "Cavite", category: "Countryside", guests: 2, bedrooms: 1, beds: 1, baths: 1, price: 3100, rating: 4.86, reviews: 64, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", description: "An airy little weekend base with serene interiors and easy access to the city’s cafés.", amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Workspace"] },
  { id: 4, slug: "el-nido-casa-azul", title: "Casa Azul Retreat", location: "El Nido, Palawan", province: "Palawan", category: "Beachfront", guests: 4, bedrooms: 2, beds: 3, baths: 2, price: 7400, rating: 4.98, reviews: 93, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85", description: "A restful tropical retreat inspired by Palawan's coastline and laid-back island living.", amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Pool"], isGuestFavorite: true },
  { id: 5, slug: "makati-urban-nest", title: "Urban Nest Studio", location: "Makati City, Metro Manila", province: "Metro Manila", category: "City", guests: 2, bedrooms: 1, beds: 1, baths: 1, price: 2650, rating: 4.82, reviews: 112, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85", description: "A thoughtful city studio for quick getaways, work trips, and explorations around Metro Manila.", amenities: ["Wi-Fi", "Air conditioning", "Workspace", "Elevator"] },
  { id: 6, slug: "la-union-surf-house", title: "Salt & Surf House", location: "San Juan, La Union", province: "La Union", category: "Beachfront", guests: 5, bedrooms: 2, beds: 3, baths: 2, price: 4900, rating: 4.91, reviews: 78, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85", description: "Unwind after long beach days in this cheerful surf-inspired home designed for friends.", amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Free parking"] },
  { id: 7, slug: "cebu-garden-suite", title: "Garden Haven Suite", location: "Cebu City, Cebu", province: "Cebu", category: "City", guests: 3, bedrooms: 1, beds: 2, baths: 1, price: 3300, rating: 4.87, reviews: 56, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85", description: "A relaxed city stay balancing modern comfort with lush, calming touches.", amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Workspace"] },
  { id: 8, slug: "batangas-poolside-villa", title: "Soleil Poolside Villa", location: "Nasugbu, Batangas", province: "Batangas", category: "Countryside", guests: 8, bedrooms: 3, beds: 5, baths: 3, price: 8900, rating: 4.93, reviews: 101, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", description: "Gather your favorite people for sunshine, pool dips, and unhurried evenings.", amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Pool", "Free parking"], isGuestFavorite: true },
];
export const formatPeso = (value: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
