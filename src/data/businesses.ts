import type {
  Business as ApiBusiness,
  Category as ApiCategory,
  Subcategory as ApiSubcategory,
} from "@/types/directory";
import { getApiBaseUrl } from "@/services/http";

const API_BASE = getApiBaseUrl();

export type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  subcategorySlug?: string;
  subcategoryId?: number;
  city: string;
  address: string;
  rating: number;
  reviews: number;
  phone: string;
  whatsapp: string;
  image: string;
  description: string;
  tags: string[];
  price?: string;
  imageLink?: string;
  verified?: boolean;
  featured?: boolean;
};

export type SiteCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  image?: string | null;
};

export type SiteSubcategory = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
};

const colors = [
  "from-orange-500 to-red-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-500",
  "from-slate-600 to-slate-800",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-pink-500",
  "from-sky-500 to-blue-600",
  "from-red-500 to-orange-500",
];

const iconMap: Record<string, string> = {
  restaurant: "UtensilsCrossed",
  hotel: "BedDouble",
  hospital: "Stethoscope",
  education: "GraduationCap",
  electronic: "Laptop",
  fashion: "Shirt",
  auto: "Car",
  packer: "Truck",
  beauty: "Scissors",
  home: "Wrench",
  gym: "Dumbbell",
  market: "Store",
  food: "UtensilsCrossed",
  clinic: "Cross",
  travel: "Plane",
  wedding: "Flower2",
  construction: "Building2",
};

export const cities = [
  "Parbhani",
];

export const trendingSearches = [
  "AC Repair",
  "Birthday Cakes",
  "Dentists",
  "Driving Schools",
  "PG Hostels",
  "Wedding Photographers",
  "Car Wash",
  "Tiffin Services",
];

export const legacyCategories: SiteCategory[] = [
  { id: 1, name: "Restaurants", slug: "restaurants", icon: "UtensilsCrossed", color: "from-orange-500 to-red-500" },
  { id: 2, name: "Hotels", slug: "hotels", icon: "BedDouble", color: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Hospitals", slug: "hospitals", icon: "Stethoscope", color: "from-rose-500 to-pink-500" },
  { id: 4, name: "Education", slug: "education", icon: "GraduationCap", color: "from-indigo-500 to-purple-500" },
  { id: 5, name: "Electronics", slug: "electronics", icon: "Laptop", color: "from-slate-600 to-slate-800" },
  { id: 6, name: "Fashion", slug: "fashion", icon: "Shirt", color: "from-fuchsia-500 to-pink-500" },
  { id: 7, name: "Automobiles", slug: "automobiles", icon: "Car", color: "from-zinc-600 to-zinc-900" },
  { id: 8, name: "Packers & Movers", slug: "packers-movers", icon: "Truck", color: "from-amber-500 to-orange-600" },
  { id: 9, name: "Beauty Salon", slug: "beauty-salon", icon: "Scissors", color: "from-pink-400 to-rose-500" },
  { id: 10, name: "Home Services", slug: "home-services", icon: "Wrench", color: "from-sky-500 to-blue-600" },
  { id: 11, name: "Gym & Fitness", slug: "gym-fitness", icon: "Dumbbell", color: "from-red-500 to-orange-500" },
  { id: 12, name: "Interior Designers", slug: "interior-designers", icon: "Sofa", color: "from-amber-600 to-yellow-600" },
  { id: 13, name: "Event Management", slug: "event-management", icon: "PartyPopper", color: "from-purple-500 to-fuchsia-500" },
  { id: 14, name: "Digital Marketing", slug: "digital-marketing", icon: "Megaphone", color: "from-cyan-500 to-blue-600" },
  { id: 15, name: "Travel & Tourism", slug: "travel-tourism", icon: "Plane", color: "from-teal-500 to-emerald-600" },
  { id: 16, name: "Vivah Services", slug: "vivah-services", icon: "Flower2", color: "from-rose-500 to-orange-400" },
  { id: 17, name: "Construction Services", slug: "construction-services", icon: "Building2", color: "from-amber-500 to-red-500" },
];

export const categories = legacyCategories.map((category) => ({ name: category.name }));

const legacySubcategoryTemplates: Record<string, string[]> = {
  restaurants: ["Fine Dining", "Fast Food", "Veg Restaurant", "Non Veg Restaurant", "Cafe"],
  hotels: ["Luxury Hotels", "Budget Hotels", "Resorts", "Business Hotels", "Family Hotels"],
  hospitals: ["General", "Cardiology", "Child Care", "Dental", "Emergency"],
  education: ["Schools", "Colleges", "Coaching", "Online Learning", "Vocational"],
  electronics: ["Mobiles", "Laptops", "Accessories", "Home Appliances", "Repairs"],
  fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear", "Accessories"],
  automobiles: ["Cars", "Bikes", "Service Centers", "Spare Parts", "Accessories"],
  "packers-movers": ["Local Moving", "Domestic Moving", "Office Shifting", "Storage", "Packing Services"],
  "beauty-salon": ["Hair Salon", "Spa", "Skin Care", "Bridal Makeup", "Grooming"],
  "home-services": ["AC Repair", "Plumbing", "Electrical", "Cleaning", "Painting"],
  "gym-fitness": ["Gym", "Yoga", "CrossFit", "Personal Training", "Cardio"],
  "interior-designers": ["Residential", "Commercial", "Modular Kitchens", "Space Planning", "Renovation"],
  "event-management": ["Weddings", "Corporate Events", "Birthday Parties", "Decoration", "Catering"],
  "digital-marketing": ["SEO", "Social Media", "Ads", "Branding", "Content"],
  "travel-tourism": ["Tours", "Hotels", "Transport", "Flight Booking", "Visa"],
  "vivah-services": ["Pandit", "Marriage Hall", "Photographer", "Catering", "Decor"],
  "construction-services": ["Contractors", "Materials", "Architecture", "Renovation", "Civil Work"],
};

function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getLegacySubcategoriesForCategory(category: SiteCategory | string): SiteSubcategory[] {
  const slug = (typeof category === "string" ? category : category.slug).toLowerCase();
  const categoryId = typeof category === "string" ? 0 : category.id;
  const labels = legacySubcategoryTemplates[slug] || [];

  return labels.map((name, index) => ({
    id: -(categoryId * 100 + index + 1),
    categoryId,
    name,
    slug: slugifyLabel(name),
    image: null,
    description: `Explore ${name.toLowerCase()} services`,
  }));
}

export function mergeSubcategoriesWithLegacyFallback(
  category: SiteCategory | string,
  apiSubcategories: SiteSubcategory[] = [],
) {
  const merged = [...apiSubcategories];
  const existing = new Set(apiSubcategories.map((subcategory) => subcategory.slug.toLowerCase()));

  for (const fallbackSubcategory of getLegacySubcategoriesForCategory(category)) {
    const key = fallbackSubcategory.slug.toLowerCase();
    if (!existing.has(key)) {
      merged.push(fallbackSubcategory);
      existing.add(key);
    }
  }

  return merged;
}

export const legacyBusinesses: Business[] = [
  {
    id: "ananya-hospital",
    slug: "ananya-hospital",
    name: "Ananya Cardiac & Multispeciality Hospital",
    category: "Hospitals",
    city: "Parbhani",
    address: "Station Road, Hedgewar Marg, Doctor Lane, Parbhani - 431401",
    rating: 4.7,
    reviews: 892,
    phone: "+919096290703",
    whatsapp: "919096290703",
    image: "photo-1519494026892-80bbd2d6fd0d",
    description:
      "I.C.U. and 24x7 emergency services with advanced cardiac diagnosis, treatment, stroke and neuro care.",
    tags: ["I.C.U.", "24x7 Emergency", "Cardiac Care"],
    imageLink:
      "https://www.google.com/maps/place/Ananya+Hospital/@19.2606786,76.7704278,17z/data=!4m6!3m5!1s0x3bd0196be586c43b:0x3d77fcb387e0ee16!8m2!3d19.2606786!4d76.7730027!16s%2Fg%2F11j2chf39_?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D",
    verified: true,
    featured: true,
  },
  {
    id: "spice-garden-restaurant",
    slug: "spice-garden-restaurant",
    name: "Spice Garden Restaurant",
    category: "Restaurants",
    city: "Pune",
    address: "FC Road, Shivajinagar, Pune",
    rating: 4.6,
    reviews: 1284,
    phone: "+919876543211",
    whatsapp: "919876543211",
    image: "photo-1517248135467-4c7edcad34c4",
    description: "Authentic Maharashtrian and North Indian cuisine in a warm modern setting.",
    tags: ["Family", "Veg & Non-Veg", "AC"],
    verified: true,
    featured: true,
  },
  {
    id: "luxe-stay-boutique-hotel",
    slug: "luxe-stay-boutique-hotel",
    name: "Luxe Stay Boutique Hotel",
    category: "Hotels",
    city: "Goa",
    address: "Calangute Beach Road, Goa",
    rating: 4.7,
    reviews: 932,
    phone: "+919876543212",
    whatsapp: "919876543212",
    image: "photo-1566073771259-6a8506099945",
    description: "Beachfront rooms with infinity pool and rooftop bar.",
    tags: ["Pool", "Bar", "Wi-Fi"],
    verified: true,
    featured: true,
  },
  {
    id: "bright-future-academy",
    slug: "bright-future-academy",
    name: "Bright Future Academy",
    category: "Education",
    city: "Pune",
    address: "Kothrud, Pune",
    rating: 4.7,
    reviews: 678,
    phone: "+919876543214",
    whatsapp: "919876543214",
    image: "photo-1523240795612-9a054b0db644",
    description: "Coaching for JEE, NEET, MHT-CET with expert faculty.",
    tags: ["JEE", "NEET", "Foundation"],
    verified: true,
  },
  {
    id: "techzone-electronics",
    slug: "techzone-electronics",
    name: "TechZone Electronics",
    category: "Electronics",
    city: "Mumbai",
    address: "Lamington Road, Mumbai",
    rating: 4.4,
    reviews: 521,
    phone: "+919876543215",
    whatsapp: "919876543215",
    image: "photo-1518770660439-4636190af475",
    description: "Latest mobiles, laptops & home appliances with EMI.",
    tags: ["EMI", "Warranty", "Delivery"],
  },
  {
    id: "vogue-fashion-studio",
    slug: "vogue-fashion-studio",
    name: "Vogue Fashion Studio",
    category: "Fashion",
    city: "Delhi",
    address: "Connaught Place, Delhi",
    rating: 4.6,
    reviews: 389,
    phone: "+919876543216",
    whatsapp: "919876543216",
    image: "photo-1490481651871-ab68de25d43d",
    description: "Designer ethnic & western wear for men and women.",
    tags: ["Designer", "Bridal", "Custom"],
  },
  {
    id: "speed-motors",
    slug: "speed-motors",
    name: "Speed Motors",
    category: "Automobiles",
    city: "Pune",
    address: "Hadapsar, Pune",
    rating: 4.5,
    reviews: 612,
    phone: "+919876543217",
    whatsapp: "919876543217",
    image: "photo-1492144534655-ae79c964c9d7",
    description: "Authorized multi-brand car service & accessories.",
    tags: ["Service", "Accessories", "Pickup"],
  },
  {
    id: "swift-packers-movers",
    slug: "swift-packers-movers",
    name: "Swift Packers & Movers",
    category: "Packers & Movers",
    city: "Bengaluru",
    address: "HSR Layout, Bengaluru",
    rating: 4.7,
    reviews: 845,
    phone: "+919876543218",
    whatsapp: "919876543218",
    image: "photo-1600585154340-be6161a56a0c",
    description: "Safe home & office relocation across India.",
    tags: ["Local", "Domestic", "Insured"],
    verified: true,
  },
  {
    id: "glow-beauty-salon-spa",
    slug: "glow-beauty-salon-spa",
    name: "Glow Beauty Salon & Spa",
    category: "Beauty Salon",
    city: "Mumbai",
    address: "Bandra West, Mumbai",
    rating: 4.8,
    reviews: 1102,
    phone: "+919876543219",
    whatsapp: "919876543219",
    image: "photo-1560066984-138dadb4c035",
    description: "Hair, skin, bridal makeup & spa packages.",
    tags: ["Bridal", "Spa", "Unisex"],
    featured: true,
  },
  {
    id: "homefix-services",
    slug: "homefix-services",
    name: "HomeFix Services",
    category: "Home Services",
    city: "Pune",
    address: "Wakad, Pune",
    rating: 4.5,
    reviews: 478,
    phone: "+919876543220",
    whatsapp: "919876543220",
    image: "photo-1581578731548-c64695cc6952",
    description: "Plumbing, electrical, AC repair & deep cleaning.",
    tags: ["24x7", "Verified Pros"],
  },
  {
    id: "ironcore-gym-fitness",
    slug: "ironcore-gym-fitness",
    name: "IronCore Gym & Fitness",
    category: "Gym & Fitness",
    city: "Delhi",
    address: "Saket, Delhi",
    rating: 4.6,
    reviews: 712,
    phone: "+919876543221",
    whatsapp: "919876543221",
    image: "photo-1534438327276-14e5300c3a48",
    description: "Strength, cardio, CrossFit & certified trainers.",
    tags: ["Trainer", "Cardio", "Yoga"],
  },
];

export const yashaswiniMartCards: Business[] = [
  {
    id: "ym-fresh-groceries",
    slug: "ym-fresh-groceries",
    name: "Green Basket Supermarket",
    category: "Supermarket",
    city: "Pune",
    address: "Karve Nagar, Pune",
    rating: 4.8,
    reviews: 0,
    phone: "+919812340101",
    whatsapp: "919812340101",
    image: "photo-1542838132-92c53300491e",
    description: "Fresh produce, dairy, staples, and household needs with quick doorstep delivery.",
    tags: ["Fresh Produce", "Daily Essentials", "Delivery"],
    price: "₹99 onwards",
    verified: true,
    featured: true,
  },
  {
    id: "ym-home-kitchen",
    slug: "ym-home-kitchen",
    name: "Urban Home Needs",
    category: "Home Essentials",
    city: "Pune",
    address: "Kothrud, Pune",
    rating: 4.5,
    reviews: 0,
    phone: "+919812340102",
    whatsapp: "919812340102",
    image: "photo-1556911220-bff31c812dba",
    description: "Kitchen tools, storage jars, cleaning supplies, and daily utility products.",
    tags: ["Kitchenware", "Storage", "Cleaning"],
    price: "₹49 onwards",
    verified: true,
    featured: true,
  },
  {
    id: "ym-snacks-beverages",
    slug: "ym-snacks-beverages",
    name: "Snack Street Foods",
    category: "Snacks & Beverages",
    city: "Pune",
    address: "Erandwane, Pune",
    rating: 4.7,
    reviews: 0,
    phone: "+919812340103",
    whatsapp: "919812340103",
    image: "photo-1499636136210-6f4ee915583e",
    description: "Cookies, namkeen, juices, cold drinks, and ready-to-eat family packs.",
    tags: ["Quick Bites", "Cold Drinks", "Family Packs"],
    price: "₹29 onwards",
    verified: true,
    featured: true,
  },
  {
    id: "ym-personal-care",
    slug: "ym-personal-care",
    name: "GlowCare Beauty & Wellness",
    category: "Personal Care",
    city: "Pune",
    address: "Deccan, Pune",
    rating: 4.7,
    reviews: 0,
    phone: "+919812340104",
    whatsapp: "919812340104",
    image: "photo-1522335789203-aabd1fc54bc9",
    description: "Skincare, grooming, hygiene, and wellness essentials from trusted brands.",
    tags: ["Skincare", "Grooming", "Wellness"],
    price: "₹149 onwards",
    verified: true,
    featured: true,
  },
  {
    id: "ym-homemade-foods",
    slug: "ym-homemade-foods",
    name: "Aai's Homemade Kitchen",
    category: "Homemade Foods",
    city: "Pune",
    address: "Sinhagad Road, Pune",
    rating: 4.8,
    reviews: 0,
    phone: "+919812340105",
    whatsapp: "919812340105",
    image: "photo-1498837167922-ddd27525d352",
    description: "Fresh homemade meals, lunch boxes, and party platters prepared with care.",
    tags: ["Home Cooked", "Meal Boxes", "Party Orders"],
    price: "₹89 onwards",
    verified: true,
  },
  {
    id: "ym-grocery",
    slug: "ym-grocery",
    name: "Daily Needs Grocery Mart",
    category: "Grocery",
    city: "Pune",
    address: "Baner, Pune",
    rating: 4.6,
    reviews: 0,
    phone: "+919812340106",
    whatsapp: "919812340106",
    image: "photo-1542838132-92c53300491e",
    description: "Everyday grocery staples, fresh produce, and quick doorstep restocking.",
    tags: ["Staples", "Fresh Produce", "Delivery"],
    price: "₹79 onwards",
    verified: true,
  },
  {
    id: "ym-gift-items",
    slug: "ym-gift-items",
    name: "Celebrate Gift Gallery",
    category: "Gift Items",
    city: "Pune",
    address: "Camp, Pune",
    rating: 4.7,
    reviews: 0,
    phone: "+919812340107",
    whatsapp: "919812340107",
    image: "photo-1513519245088-0e12902e5a38",
    description: "Thoughtful gifts, personalized hampers, and celebration decor for every occasion.",
    tags: ["Hampers", "Birthday Gifts", "Personalized"],
    price: "₹199 onwards",
    verified: true,
  },
  {
    id: "ym-wellness-products",
    slug: "ym-wellness-products",
    name: "Wellness Corner",
    category: "Wellness Products",
    city: "Pune",
    address: "Aundh, Pune",
    rating: 4.7,
    reviews: 0,
    phone: "+919812340108",
    whatsapp: "919812340108",
    image: "photo-1517836357463-d25dfeac3438",
    description: "Vitamins, supplements, self-care essentials, and healthy lifestyle products.",
    tags: ["Supplements", "Self Care", "Healthy Living"],
    price: "₹249 onwards",
    verified: true,
  },
  {
    id: "ym-ayurvedic-products",
    slug: "ym-ayurvedic-products",
    name: "Ayurveda Life Store",
    category: "Ayurvedic Products",
    city: "Pune",
    address: "Kharadi, Pune",
    rating: 4.8,
    reviews: 0,
    phone: "+919812340109",
    whatsapp: "919812340109",
    image: "photo-1519823551278-64ac92734fb1",
    description: "Herbal oils, Ayurvedic remedies, and traditional wellness products.",
    tags: ["Herbal", "Traditional Care", "Natural"],
    price: "₹129 onwards",
    verified: true,
  },
  {
    id: "ym-imitation-jewellery",
    slug: "ym-imitation-jewellery",
    name: "Trendy Sparkle Jewellery",
    category: "Imitation Jewellery",
    city: "Pune",
    address: "Laxmi Road, Pune",
    rating: 4.6,
    reviews: 0,
    phone: "+919812340110",
    whatsapp: "919812340110",
    image: "photo-1617038220319-276d3cfab638",
    description: "Fashionable imitation jewellery, bridal sets, and everyday statement pieces.",
    tags: ["Bridal", "Fashion Jewellery", "Accessories"],
    price: "₹299 onwards",
    verified: true,
  },
  {
    id: "ym-organic-foods",
    slug: "ym-organic-foods",
    name: "Organic Harvest Foods",
    category: "Organic Foods",
    city: "Pune",
    address: "Wakad, Pune",
    rating: 4.9,
    reviews: 0,
    phone: "+919812340111",
    whatsapp: "919812340111",
    image: "photo-1464226184884-fa280b87c399",
    description: "Certified organic grains, fruits, vegetables, and healthy pantry staples.",
    tags: ["Certified Organic", "Fresh", "Healthy Pantry"],
    price: "₹159 onwards",
    verified: true,
  },
];

const legacyYashaswiniBusinessBySlug = new Map(
  yashaswiniMartCards.map((business) => [business.slug, business]),
);

export const yashaswiniMartCategoryNames = [
  "Supermarket",
  "Home Essentials",
  "Snacks & Beverages",
  "Personal Care",
  "Homemade Foods",
  "Grocery",
  "Gift Items",
  "Wellness Products",
  "Ayurvedic Products",
  "Imitation Jewellery",
  "Organic Foods",
];

const yashaswiniMartCategoryAliases = ["Personal Care Products"];

export const allYashaswiniMartCategoryNames = yashaswiniMartCategoryNames;

function normalizeCategoryKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const yashaswiniMartCategoryKeySet = new Set([
  ...yashaswiniMartCategoryNames.map((name) => normalizeCategoryKey(name)),
  ...yashaswiniMartCategoryAliases.map((name) => normalizeCategoryKey(name)),
]);

export function isYashaswiniMartCategoryName(categoryName: string | null | undefined) {
  if (!categoryName) {
    return false;
  }
  const normalized = normalizeCategoryKey(categoryName.trim());
  return yashaswiniMartCategoryKeySet.has(normalized);
}

export function mergeWithLegacyYashaswiniBusinesses(apiBusinesses: Business[] = []) {
  const merged = [...apiBusinesses];
  const existing = new Set(apiBusinesses.map((business) => business.slug));

  for (const business of yashaswiniMartCards) {
    if (!existing.has(business.slug)) {
      merged.push(business);
      existing.add(business.slug);
    }
  }

  return merged;
}

function resolveAssetPath(path: string | null | undefined) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_BASE}${path}`;
  }

  return `${API_BASE}/${path}`;
}

function formatPriceAmount(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return String(value).trim();
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: Number.isInteger(numericValue) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function extractPriceValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const match = value.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  const numericValue = Number(match[0]);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function normalizeCardPriceText(value: string | null | undefined) {
  if (!value) {
    return "Price on request";
  }

  const firstDigitIndex = value.search(/\d/);
  if (firstDigitIndex === -1) {
    return value.trim();
  }

  return value.slice(firstDigitIndex).trim();
}

function formatBusinessPriceDisplay(
  value: string | number | null | undefined,
  priceLabel: string | null | undefined,
) {
  const formattedAmount = formatPriceAmount(value);
  if (!formattedAmount) {
    return undefined;
  }

  const suffix = priceLabel?.trim();
  return [formattedAmount, suffix].filter(Boolean).join(" ");
}

function pickIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  const matched = Object.entries(iconMap).find(([key]) => name.includes(key));
  return matched?.[1] || "Circle";
}

export function mapApiCategoryToSite(category: ApiCategory, index = 0): SiteCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: pickIcon(category.name),
    color: colors[index % colors.length],
    image: resolveAssetPath(category.image) || null,
  };
}

export function mapApiSubcategoryToSite(subcategory: ApiSubcategory): SiteSubcategory {
  return {
    id: subcategory.id,
    categoryId: subcategory.categoryId,
    name: subcategory.name,
    slug: subcategory.slug,
    image: resolveAssetPath(subcategory.image) || null,
    description: subcategory.description || null,
  };
}

export function mergeWithLegacyCategories(apiCategories: SiteCategory[] = []) {
  const merged = [...apiCategories];
  const existing = new Set(apiCategories.map((category) => category.slug.toLowerCase()));

  for (const category of legacyCategories) {
    const key = category.slug.toLowerCase();
    if (!existing.has(key)) {
      merged.push(category);
      existing.add(key);
    }
  }

  return merged;
}

export function getBrowsableCategories(apiCategories: SiteCategory[] = []) {
  const merged: SiteCategory[] = [];
  const existing = new Set<string>();
  const filteredApiCategories = apiCategories.filter((category) => !isYashaswiniMartCategoryName(category.name));

  for (const category of legacyCategories) {
    if (isYashaswiniMartCategoryName(category.name)) {
      continue;
    }

    const key = category.slug.toLowerCase();
    const apiCategory = filteredApiCategories.find((item) => item.slug.toLowerCase() === key);

    merged.push(apiCategory || category);
    existing.add(key);
  }

  for (const category of filteredApiCategories) {
    const key = category.slug.toLowerCase();
    if (existing.has(key)) {
      continue;
    }

    merged.push(category);
    existing.add(key);
  }

  return merged;
}

export function mapApiBusinessToSite(business: ApiBusiness): Business {
  const legacyFallback = legacyYashaswiniBusinessBySlug.get(business.slug);
  const image =
    resolveAssetPath(business.banner) ||
    resolveAssetPath(business.logo) ||
    resolveAssetPath(business.gallery?.[0]?.image) ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=70";

  const categoryName = business.category?.name || "Business";
  const subcategoryName = business.subcategory?.name || "";
  const mapLink =
    business.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.businessName}, ${business.address}`)}`;

  return {
    id: String(business.id),
    slug: business.slug,
    name: business.businessName,
    category: categoryName,
    subcategory: subcategoryName || undefined,
    subcategorySlug: business.subcategory?.slug || undefined,
    subcategoryId: business.subcategory?.id || undefined,
    city: business.city,
    address: [business.area, business.city].filter(Boolean).join(", ") || business.address,
    rating: 4.5,
    reviews: 0,
    phone: business.mobile,
    whatsapp: business.whatsapp || business.mobile,
    image,
    description: business.description || "",
    tags: (business.services || []).slice(0, 8),
    price: isYashaswiniMartCategoryName(categoryName)
      ? formatBusinessPriceDisplay(business.price, business.priceLabel) || legacyFallback?.price
      : undefined,
    imageLink: mapLink,
    verified: business.verified,
    featured: business.featured,
  };
}

export function businessImage(business: Business) {
  if (business.image.startsWith("http://") || business.image.startsWith("https://")) {
    return business.image;
  }

  if (business.image.startsWith("photo-")) {
    return `https://images.unsplash.com/${business.image}?auto=format&fit=crop&w=900&q=70`;
  }

  return business.image;
}
