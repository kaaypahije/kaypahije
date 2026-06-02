const path = require("path");

process.chdir(path.resolve(__dirname, ".."));

const { sequelize, Category, Subcategory, Business } = require("../src/models");
const { slugify } = require("../src/utils/slugify");

const legacyCategories = [
  "Restaurants",
  "Hotels",
  "Hospitals",
  "Education",
  "Electronics",
  "Fashion",
  "Automobiles",
  "Packers & Movers",
  "Beauty Salon",
  "Home Services",
  "Gym & Fitness",
  "Interior Designers",
  "Event Management",
  "Digital Marketing",
  "Travel & Tourism",
  "Vivah Services",
  "Construction Services",
  "Supermarket",
  "Home Essentials",
  "Snacks & Beverages",
  "Personal Care",
];

const hospitalSubcategories = [
  "Doctors",
  "Multi Speciality",
  "Eye Care",
  "Child Care",
  "ENT",
  "Gynecology",
  "Cardiology",
  "Diabetes",
  "Orthopedic",
  "Kidney Care",
  "Gastro & Piles",
  "Dental",
  "Ayurveda",
  "Homeopathy",
  "Oncology",
  "Neurology",
  "Skin Care",
  "Psychiatry",
  "Cancer Care",
  "Physiotherapy",
];

const frontendSubcategoriesByCategory = {
  Restaurants: [
    "Fine Dining",
    "Fast Food",
    "Veg Restaurant",
    "Non Veg Restaurant",
    "Cafe",
  ],
  Hotels: [
    "Luxury Hotels",
    "Budget Hotels",
    "Resorts",
    "Business Hotels",
    "Family Hotels",
  ],
  Hospitals: [
    "Doctor's",
    "Multi Speciality",
    "नेत्र रोग",
    "बाल रोग तज्ज्ञ",
    "कान, नाक, घसा",
    "स्त्री रोग",
    "हृदय विकार",
    "मधुमेह",
    "हाडांचे उपचार",
    "किडनी विकार",
    "पोटांचे विकार व मूळव्याध",
    "दंत रोग",
    "आयुर्वेद",
    "होमिओपॅथी",
    "कॅन्सरचे विकार",
    "अर्धांगवायू",
    "त्वचा रोग",
    "मानसिक रोग",
    "कॅन्सर रोग",
    "फिजिओथेरपी",
  ],
  Education: ["Schools", "Colleges", "Coaching Classes", "Training Institutes"],
  Electronics: ["Mobile Stores", "Laptop Stores", "Home Appliances", "Repair Services"],
  Fashion: ["Mens Wear", "Womens Wear", "Kids Wear", "Boutiques"],
  Automobiles: ["Car Service", "Bike Service", "Spare Parts", "Accessories"],
  "Packers & Movers": ["Home Shifting", "Office Relocation", "Local Moving", "Domestic Transport"],
  "Beauty Salon": ["Hair Services", "Skin Care", "Bridal Makeup", "Spa Services"],
  "Home Services": ["Plumbing", "Electrical", "Cleaning", "AC Repair"],
  "Gym & Fitness": ["Gyms", "Yoga Classes", "Personal Training", "CrossFit"],
  "Interior Designers": ["Home Interior", "Office Interior", "Modular Kitchen", "Furniture Design"],
  "Event Management": ["Wedding Events", "Corporate Events", "Birthday Events", "Decoration Services"],
  "Digital Marketing": ["SEO", "Social Media Marketing", "PPC Ads", "Content Marketing"],
  "Travel & Tourism": ["Tour Packages", "Flight Booking", "Hotel Booking", "Visa Services"],
  "Vivah Services": ["Marriage Hall", "Catering", "Photography", "Decoration"],
  "Construction Services": ["Contractors", "Architects", "Renovation", "Material Suppliers"],
};

const legacyBusinesses = [
  {
    slug: "ananya-hospital",
    name: "Ananya Cardiac & Multispeciality Hospital",
    category: "Hospitals",
    subcategory: "Cardiology",
    city: "Parbhani",
    address: "Station Road, Hedgewar Marg, Doctor Lane, Parbhani - 431401",
    phone: "+919096290703",
    whatsapp: "919096290703",
    image: "photo-1519494026892-80bbd2d6fd0d",
    description:
      "I.C.U. and 24x7 emergency services with advanced cardiac diagnosis, treatment, stroke and neuro care.",
    tags: ["I.C.U.", "24x7 Emergency", "Cardiac Care"],
    mapLink:
      "https://www.google.com/maps/place/Ananya+Hospital/@19.2606786,76.7704278,17z/data=!4m6!3m5!1s0x3bd0196be586c43b:0x3d77fcb387e0ee16!8m2!3d19.2606786!4d76.7730027!16s%2Fg%2F11j2chf39_",
    verified: true,
    featured: true,
  },
  {
    slug: "spice-garden-restaurant",
    name: "Spice Garden Restaurant",
    category: "Restaurants",
    subcategory: "General",
    city: "Pune",
    address: "FC Road, Shivajinagar, Pune",
    phone: "+919876543211",
    whatsapp: "919876543211",
    image: "photo-1517248135467-4c7edcad34c4",
    description: "Authentic Maharashtrian and North Indian cuisine in a warm modern setting.",
    tags: ["Family", "Veg & Non-Veg", "AC"],
    verified: true,
    featured: true,
  },
  {
    slug: "luxe-stay-boutique-hotel",
    name: "Luxe Stay Boutique Hotel",
    category: "Hotels",
    subcategory: "General",
    city: "Goa",
    address: "Calangute Beach Road, Goa",
    phone: "+919876543212",
    whatsapp: "919876543212",
    image: "photo-1566073771259-6a8506099945",
    description: "Beachfront rooms with infinity pool and rooftop bar.",
    tags: ["Pool", "Bar", "Wi-Fi"],
    verified: true,
    featured: true,
  },
  {
    slug: "bright-future-academy",
    name: "Bright Future Academy",
    category: "Education",
    subcategory: "General",
    city: "Pune",
    address: "Kothrud, Pune",
    phone: "+919876543214",
    whatsapp: "919876543214",
    image: "photo-1523240795612-9a054b0db644",
    description: "Coaching for JEE, NEET, MHT-CET with expert faculty.",
    tags: ["JEE", "NEET", "Foundation"],
    verified: true,
    featured: false,
  },
  {
    slug: "techzone-electronics",
    name: "TechZone Electronics",
    category: "Electronics",
    subcategory: "General",
    city: "Mumbai",
    address: "Lamington Road, Mumbai",
    phone: "+919876543215",
    whatsapp: "919876543215",
    image: "photo-1518770660439-4636190af475",
    description: "Latest mobiles, laptops & home appliances with EMI.",
    tags: ["EMI", "Warranty", "Delivery"],
    verified: false,
    featured: false,
  },
  {
    slug: "vogue-fashion-studio",
    name: "Vogue Fashion Studio",
    category: "Fashion",
    subcategory: "General",
    city: "Delhi",
    address: "Connaught Place, Delhi",
    phone: "+919876543216",
    whatsapp: "919876543216",
    image: "photo-1490481651871-ab68de25d43d",
    description: "Designer ethnic & western wear for men and women.",
    tags: ["Designer", "Bridal", "Custom"],
    verified: false,
    featured: false,
  },
  {
    slug: "speed-motors",
    name: "Speed Motors",
    category: "Automobiles",
    subcategory: "General",
    city: "Pune",
    address: "Hadapsar, Pune",
    phone: "+919876543217",
    whatsapp: "919876543217",
    image: "photo-1492144534655-ae79c964c9d7",
    description: "Authorized multi-brand car service & accessories.",
    tags: ["Service", "Accessories", "Pickup"],
    verified: false,
    featured: false,
  },
  {
    slug: "swift-packers-movers",
    name: "Swift Packers & Movers",
    category: "Packers & Movers",
    subcategory: "General",
    city: "Bengaluru",
    address: "HSR Layout, Bengaluru",
    phone: "+919876543218",
    whatsapp: "919876543218",
    image: "photo-1600585154340-be6161a56a0c",
    description: "Safe home & office relocation across India.",
    tags: ["Local", "Domestic", "Insured"],
    verified: true,
    featured: false,
  },
  {
    slug: "glow-beauty-salon-spa",
    name: "Glow Beauty Salon & Spa",
    category: "Beauty Salon",
    subcategory: "General",
    city: "Mumbai",
    address: "Bandra West, Mumbai",
    phone: "+919876543219",
    whatsapp: "919876543219",
    image: "photo-1560066984-138dadb4c035",
    description: "Hair, skin, bridal makeup & spa packages.",
    tags: ["Bridal", "Spa", "Unisex"],
    verified: false,
    featured: true,
  },
  {
    slug: "homefix-services",
    name: "HomeFix Services",
    category: "Home Services",
    subcategory: "General",
    city: "Pune",
    address: "Wakad, Pune",
    phone: "+919876543220",
    whatsapp: "919876543220",
    image: "photo-1581578731548-c64695cc6952",
    description: "Plumbing, electrical, AC repair & deep cleaning.",
    tags: ["24x7", "Verified Pros"],
    verified: false,
    featured: false,
  },
  {
    slug: "ironcore-gym-fitness",
    name: "IronCore Gym & Fitness",
    category: "Gym & Fitness",
    subcategory: "General",
    city: "Delhi",
    address: "Saket, Delhi",
    phone: "+919876543221",
    whatsapp: "919876543221",
    image: "photo-1534438327276-14e5300c3a48",
    description: "Strength, cardio, CrossFit & certified trainers.",
    tags: ["Trainer", "Cardio", "Yoga"],
    verified: false,
    featured: false,
  },
  {
    slug: "ym-fresh-groceries",
    name: "Green Basket Supermarket",
    category: "Supermarket",
    subcategory: "General",
    city: "Pune",
    address: "Karve Nagar, Pune",
    phone: "+919812340101",
    whatsapp: "919812340101",
    image: "photo-1542838132-92c53300491e",
    description: "Fresh produce, dairy, staples, and household needs with quick doorstep delivery.",
    tags: ["Fresh Produce", "Daily Essentials", "Delivery"],
    verified: true,
    featured: true,
  },
  {
    slug: "ym-home-kitchen",
    name: "Urban Home Needs",
    category: "Home Essentials",
    subcategory: "General",
    city: "Pune",
    address: "Kothrud, Pune",
    phone: "+919812340102",
    whatsapp: "919812340102",
    image: "photo-1556911220-bff31c812dba",
    description: "Kitchen tools, storage jars, cleaning supplies, and daily utility products.",
    tags: ["Kitchenware", "Storage", "Cleaning"],
    verified: true,
    featured: true,
  },
  {
    slug: "ym-snacks-beverages",
    name: "Snack Street Foods",
    category: "Snacks & Beverages",
    subcategory: "General",
    city: "Pune",
    address: "Erandwane, Pune",
    phone: "+919812340103",
    whatsapp: "919812340103",
    image: "photo-1499636136210-6f4ee915583e",
    description: "Cookies, namkeen, juices, cold drinks, and ready-to-eat family packs.",
    tags: ["Quick Bites", "Cold Drinks", "Family Packs"],
    verified: true,
    featured: true,
  },
  {
    slug: "ym-personal-care",
    name: "GlowCare Beauty & Wellness",
    category: "Personal Care",
    subcategory: "General",
    city: "Pune",
    address: "Deccan, Pune",
    phone: "+919812340104",
    whatsapp: "919812340104",
    image: "photo-1522335789203-aabd1fc54bc9",
    description: "Skincare, grooming, hygiene, and wellness essentials from trusted brands.",
    tags: ["Skincare", "Grooming", "Wellness"],
    verified: true,
    featured: true,
  },
];

const cityStateMap = {
  pune: "Maharashtra",
  mumbai: "Maharashtra",
  parbhani: "Maharashtra",
  nashik: "Maharashtra",
  nagpur: "Maharashtra",
  delhi: "Delhi",
  bengaluru: "Karnataka",
  goa: "Goa",
  hyderabad: "Telangana",
  chennai: "Tamil Nadu",
  kolkata: "West Bengal",
  jaipur: "Rajasthan",
  ahmedabad: "Gujarat",
};

function stateFromCity(city) {
  return cityStateMap[String(city || "").trim().toLowerCase()] || "Maharashtra";
}

function pincodeFromAddress(address) {
  const match = String(address || "").match(/\b\d{6}\b/);
  return match ? match[0] : null;
}

function areaFromAddress(address) {
  const first = String(address || "").split(",")[0].trim();
  return first || null;
}

function imageUrl(image) {
  if (!image) {
    return null;
  }
  if (String(image).startsWith("http://") || String(image).startsWith("https://")) {
    return image;
  }
  if (String(image).startsWith("photo-")) {
    return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=70`;
  }
  return null;
}

async function uniqueSlug(Model, base) {
  const safeBase = slugify(base) || `item-${Date.now()}`;
  let candidate = safeBase;
  let count = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await Model.findOne({ where: { slug: candidate } });
    if (!exists) {
      return candidate;
    }
    candidate = `${safeBase}-${count}`;
    count += 1;
  }
}

async function getOrCreateCategory(name) {
  const existingByName = await Category.findOne({ where: { name } });
  if (existingByName) {
    return existingByName;
  }

  const categorySlug = await uniqueSlug(Category, name);
  return Category.create({
    name,
    slug: categorySlug,
    description: `${name} listings`,
    status: "active",
    featured: false,
  });
}

async function getOrCreateSubcategory(category, name) {
  const existing = await Subcategory.findOne({
    where: {
      categoryId: category.id,
      name,
    },
  });

  if (existing) {
    return existing;
  }

  const subcategorySlug = await uniqueSlug(Subcategory, `${category.slug}-${name}`);

  return Subcategory.create({
    categoryId: category.id,
    name,
    slug: subcategorySlug,
    description: `${name} under ${category.name}`,
    status: "active",
  });
}

async function seedCategoriesAndSubcategories() {
  const categoryMap = new Map();

  for (const name of legacyCategories) {
    // eslint-disable-next-line no-await-in-loop
    const category = await getOrCreateCategory(name);
    categoryMap.set(name, category);

    // eslint-disable-next-line no-await-in-loop
    await getOrCreateSubcategory(category, "General");
  }

  const hospitals = categoryMap.get("Hospitals");
  if (hospitals) {
    for (const name of hospitalSubcategories) {
      // eslint-disable-next-line no-await-in-loop
      await getOrCreateSubcategory(hospitals, name);
    }
  }

  for (const [categoryName, subcategoryNames] of Object.entries(frontendSubcategoriesByCategory)) {
    const category = categoryMap.get(categoryName);
    if (!category) {
      // eslint-disable-next-line no-continue
      continue;
    }

    for (const name of subcategoryNames) {
      // eslint-disable-next-line no-await-in-loop
      await getOrCreateSubcategory(category, name);
    }
  }

  return categoryMap;
}

async function seedBusinesses(categoryMap) {
  let created = 0;
  let skipped = 0;

  for (const item of legacyBusinesses) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await Business.findOne({ where: { slug: item.slug } });
    if (existing) {
      skipped += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    const category = categoryMap.get(item.category);
    if (!category) {
      skipped += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const subcategory = await getOrCreateSubcategory(category, item.subcategory || "General");

    const logo = imageUrl(item.image);
    const mapLink =
      item.mapLink ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}`)}`;

    // eslint-disable-next-line no-await-in-loop
    await Business.create({
      categoryId: category.id,
      subcategoryId: subcategory.id,
      businessName: item.name,
      slug: item.slug,
      logo,
      banner: logo,
      mobile: item.phone,
      whatsapp: item.whatsapp || item.phone,
      address: item.address,
      area: areaFromAddress(item.address),
      city: item.city,
      state: stateFromCity(item.city),
      pincode: pincodeFromAddress(item.address),
      mapLink,
      description: item.description,
      services: item.tags || [],
      openingTime: "09:00",
      closingTime: "21:00",
      featured: Boolean(item.featured),
      verified: Boolean(item.verified),
      status: "active",
      seoTitle: item.name,
      seoDescription: item.description,
    });

    created += 1;
  }

  return { created, skipped };
}

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const categoryMap = await seedCategoriesAndSubcategories();
    const { created, skipped } = await seedBusinesses(categoryMap);

    const counts = {
      categories: await Category.count(),
      subcategories: await Subcategory.count(),
      businesses: await Business.count(),
    };

    // eslint-disable-next-line no-console
    console.log("Legacy directory seed complete");
    // eslint-disable-next-line no-console
    console.log(`Businesses created: ${created}, skipped: ${skipped}`);
    // eslint-disable-next-line no-console
    console.log(counts);

    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}

run();
