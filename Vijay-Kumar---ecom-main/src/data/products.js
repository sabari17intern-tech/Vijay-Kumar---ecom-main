/* ============================================
   VijayKumar Diamonds & Gems — Product Database
   ============================================ */

export const products = [
  // ── RUBY ──
  {
    id: 1, name: "Natural Burmese Ruby", category: "Ruby", price: 185000, mrp: 220000, carat: "3.15",
    origin: "Myanmar", cut: "Oval", color: "Pigeon Blood Red", clarity: "Eye Clean", cert: "GRS",
    treatment: "Unheated", image: "/images/red_vk.png", gallery: ["/images/red_vk.png","/images/red_front_view.png","/images/red_back_view.jpeg","/images/red_side_view.png"],
    rating: 5.0, reviews: 18, badge: "Bestseller", desc: "Unheated pigeon blood ruby from the legendary Mogok mines",
    details: ["3.15 Carat Weight", "Oval Faceted Cut", "GRS Certified", "Unheated / Untreated", "Origin: Myanmar (Burma)"],
    isRing: false, isCustomBuilder: false
  },
  {
    id: 2, name: "Natural Burmese Ruby", category: "Ruby", price: 185000, mrp: 220000, carat: "3.15",
    origin: "Myanmar", cut: "Oval", color: "Pigeon Blood Red", clarity: "Eye Clean", cert: "GRS",
    treatment: "Unheated", image: "/images/ruby.png",gallery: ["/images/ruby.png"],
    rating: 5.0, reviews: 18, badge: "Bestseller", desc: "Unheated pigeon blood ruby from the legendary Mogok mines",
    details: ["3.15 Carat Weight", "Oval Faceted Cut", "GRS Certified", "Unheated / Untreated", "Origin: Myanmar (Burma)"],
    isRing: false, isCustomBuilder: false
  },
  

  // ── BLUE SAPPHIRE ──
  {
    id: 5, name: "Ceylon Blue Sapphire", category: "Blue Sapphire", price: 210000, mrp: 250000, carat: "3.52",
    origin: "Sri Lanka", cut: "Cushion", color: "Royal Blue", clarity: "Eye Clean", cert: "GRS",
    treatment: "Unheated", image: "/images/bluevk.png", gallery: ["/images/bluevk.png","/images/blue_front_view.png","/images/blue_back_view.jpeg","/images/blue_side_view.png"],
    rating: 5.0, reviews: 24, badge: "Premium", desc: "Unheated royal blue sapphire from Sri Lanka mines",
    details: ["3.52 Carat", "Cushion Cut", "GRS Certified", "Unheated", "Origin: Sri Lanka (Ceylon)"],
    isRing: false, isCustomBuilder: false
  },
  {
    id: 6, name: "Ceylon Blue Sapphire", category: "Blue Sapphire", price: 210000, mrp: 250000, carat: "3.52",
    origin: "Sri Lanka", cut: "Cushion", color: "Royal Blue", clarity: "Eye Clean", cert: "GRS",
    treatment: "Unheated", image: "/images/blue_sapphire.png", gallery: ["/images/blue_sapphire.png"],
    rating: 5.0, reviews: 24, badge: "Premium", desc: "Unheated royal blue sapphire from Sri Lanka mines",
    details: ["3.52 Carat", "Cushion Cut", "GRS Certified", "Unheated", "Origin: Sri Lanka (Ceylon)"],
    isRing: false, isCustomBuilder: false
  },
  
  // ── EMERALD ──
  {
    id: 9, name: "Colombian Emerald", category: "Emerald", price: 295000, mrp: 350000, carat: "2.85",
    origin: "Colombia", cut: "Emerald", color: "Vivid Green", clarity: "Minor Inclusions", cert: "GRS",
    treatment: "Minor Oil", image: "/images/green_vk.png", gallery: ["/images/green_vk.png","/images/green_front_view.png","/images/green_back_view.jpeg","/images/green_side_view.png"],
    rating: 4.9, reviews: 15, badge: "Premium", desc: "Exceptional vivid green emerald from Muzo, Colombia",
    details: ["2.85 Carat", "Emerald Cut", "GRS Certified", "Minor Oil Treatment", "Origin: Colombia (Muzo)"],
    isRing: false, isCustomBuilder: false
  },
   {
    id: 10, name: "Colombian Emerald", category: "Emerald", price: 295000, mrp: 350000, carat: "2.85",
    origin: "Colombia", cut: "Emerald", color: "Vivid Green", clarity: "Minor Inclusions", cert: "GRS",
    treatment: "Minor Oil", image: "/images/emerald.png", gallery: ["/images/emerald.png"],
    rating: 4.9, reviews: 15, badge: "Premium", desc: "Exceptional vivid green emerald from Muzo, Colombia",
    details: ["2.85 Carat", "Emerald Cut", "GRS Certified", "Minor Oil Treatment", "Origin: Colombia (Muzo)"],
    isRing: false, isCustomBuilder: false
  },

  // ── YELLOW SAPPHIRE ──
  {
    id: 13, name: "Ceylon Yellow Sapphire", category: "Yellow Sapphire", price: 95000, mrp: 115000, carat: "4.20",
    origin: "Sri Lanka", cut: "Oval", color: "Canary Yellow", clarity: "Eye Clean", cert: "GIA",
    treatment: "Unheated", image: "/images/yellow_vk.png", gallery: ["/images/yellow_vk.png","/images/yellow_front_view.png","/images/yellow_back_view.jpeg","/images/yellow_side_view.png"],
    rating: 4.9, reviews: 22, badge: "Bestseller", desc: "Brilliant canary yellow pukhraj for Jupiter benefits",
    details: ["4.20 Carat", "Oval Cut", "GIA Certified", "Unheated", "Origin: Sri Lanka"],
    isRing: false, isCustomBuilder: false
  },
  {
    id: 14, name: "Ceylon Yellow Sapphire", category: "Yellow Sapphire", price: 95000, mrp: 115000, carat: "4.20",
    origin: "Sri Lanka", cut: "Oval", color: "Canary Yellow", clarity: "Eye Clean", cert: "GIA",
    treatment: "Unheated", image: "/images/yellow_sapphire.png", gallery: ["/images/yellow_sapphire.png"],
    rating: 4.9, reviews: 22, badge: "Bestseller", desc: "Brilliant canary yellow pukhraj for Jupiter benefits",
    details: ["4.20 Carat", "Oval Cut", "GIA Certified", "Unheated", "Origin: Sri Lanka"],
    isRing: false, isCustomBuilder: false
  },

  
  // ── PEARL ──
  {
    id: 17, name: "South Sea Pearl", category: "Pearl", price: 42000, mrp: 50000, carat: "12mm",
    origin: "Australia", cut: "Round", color: "Cream White", clarity: "AAA Luster", cert: "GIA",
    treatment: "Natural", image: "/images/white_vk.png", gallery: ["/images/white_vk.png","/images/white_front_view.png","/images/white_back_view.jpeg","/images/white_side_view.png"],
    rating: 4.8, reviews: 19, badge: "Popular", desc: "Lustrous 12mm South Sea pearl with exceptional orient",
    details: ["12mm Diameter", "Round Shape", "AAA Luster Grade", "GIA Certified", "Origin: Australia"],
    isRing: false, isCustomBuilder: false
  },
   {
    id: 18, name: "South Sea Pearl", category: "Pearl", price: 42000, mrp: 50000, carat: "12mm",
    origin: "Australia", cut: "Round", color: "Cream White", clarity: "AAA Luster", cert: "GIA",
    treatment: "Natural", image: "/images/pearl.png", gallery: ["/images/pearl.png"],
    rating: 4.8, reviews: 19, badge: "Popular", desc: "Lustrous 12mm South Sea pearl with exceptional orient",
    details: ["12mm Diameter", "Round Shape", "AAA Luster Grade", "GIA Certified", "Origin: Australia"],
    isRing: false, isCustomBuilder: false
  },
  

  // ── RED CORAL ──
  {
    id: 21, name: "Italian Red Coral", category: "Red Coral", price: 28000, mrp: 35000, carat: "8.50",
    origin: "Italy", cut: "Capsule", color: "Ox Blood Red", clarity: "Opaque", cert: "Lab Cert",
    treatment: "Natural", image: "/images/light_redvk.png", gallery: ["/images/light_redvk.png","/images/light red_front_view.png","/images/light red_back_view.jpeg","/images/light red_side_view.png"],
    rating: 4.6, reviews: 16, badge: "Popular", desc: "Premium ox blood Italian coral for Mars (Mangal)",
    details: ["8.50 Carat", "Capsule Shape", "Lab Certified", "Natural", "Origin: Italy (Mediterranean)"],
    isRing: false, isCustomBuilder: false
  },
  {
    id: 22, name: "Italian Red Coral", category: "Red Coral", price: 28000, mrp: 35000, carat: "8.50",
    origin: "Italy", cut: "Capsule", color: "Ox Blood Red", clarity: "Opaque", cert: "Lab Cert",
    treatment: "Natural", image: "/images/coral.png", gallery: ["/images/coral.png"],
    rating: 4.6, reviews: 16, badge: "Popular", desc: "Premium ox blood Italian coral for Mars (Mangal)",
    details: ["8.50 Carat", "Capsule Shape", "Lab Certified", "Natural", "Origin: Italy (Mediterranean)"],
    isRing: false, isCustomBuilder: false
  },

  // ── HESSONITE ──
  {
    id: 25, name: "Ceylon Hessonite Garnet", category: "Hessonite", price: 18000, mrp: 22000, carat: "5.80",
    origin: "Sri Lanka", cut: "Oval", color: "Honey Brown", clarity: "Eye Clean", cert: "IGI",
    treatment: "Natural", image: "/images/orange_vk.png", gallery: ["/images/orange_vk.png","/images/orange_front_view.png","/images/orange_back_view.jpeg","/images/orange_side_view.png"],
    rating: 4.5, reviews: 13, desc: "Premium Ceylon gomed for Rahu — excellent transparency",
    details: ["5.80 Carat", "Oval Cut", "IGI Certified", "Natural/Untreated", "Origin: Sri Lanka"],
    isRing: false, isCustomBuilder: false
  },
  {
    id: 26, name: "Ceylon Hessonite Garnet", category: "Hessonite", price: 18000, mrp: 22000, carat: "5.80",
    origin: "Sri Lanka", cut: "Oval", color: "Honey Brown", clarity: "Eye Clean", cert: "IGI",
    treatment: "Natural", image: "/images/hessonite.png", gallery: ["/images/hessonite.png"],
    rating: 4.5, reviews: 13, desc: "Premium Ceylon gomed for Rahu — excellent transparency",
    details: ["5.80 Carat", "Oval Cut", "IGI Certified", "Natural/Untreated", "Origin: Sri Lanka"],
    isRing: false, isCustomBuilder: false
  },


  // ── CATS EYE ──
  {
    id: 33, name: "Natural Chrysoberyl Cats Eye", category: "Cats Eye", price: 35000, mrp: 42000, carat: "4.25",
    origin: "Sri Lanka", cut: "Oval Cabochon", color: "Greenish Yellow", clarity: "Translucent with Sharp Chatoyancy", cert: "IGI",
    treatment: "Natural", image: "/images/careye2.png", gallery: ["/images/careye2.png","/images/careye2_front_view.png","/images/careye_back_view.jpeg","/images/careye2_side_view.png"],
    rating: 4.8, reviews: 15, badge: "Bestseller", desc: "Natural chrysoberyl cat's eye gemstone showing sharp, distinct chatoyancy (light band).",
    details: ["4.25 Carat Weight", "Oval Cabochon Cut", "IGI Certified", "Natural / Untreated", "Origin: Sri Lanka (Ceylon)"],
    isRing: false, isCustomBuilder: false
  },
  {
    id: 34, name: "Natural Chrysoberyl Cats Eye", category: "Cats Eye", price: 35000, mrp: 42000, carat: "4.25",
    origin: "Sri Lanka", cut: "Oval Cabochon", color: "Greenish Yellow", clarity: "Translucent with Sharp Chatoyancy", cert: "IGI",
    treatment: "Natural", image: "/images/cats_eye.png", gallery: ["/images/cats_eye.png"],
    rating: 4.8, reviews: 15, badge: "Bestseller", desc: "Natural chrysoberyl cat's eye gemstone showing sharp, distinct chatoyancy (light band).",
    details: ["4.25 Carat Weight", "Oval Cabochon Cut", "IGI Certified", "Natural / Untreated", "Origin: Sri Lanka (Ceylon)"],
    isRing: false, isCustomBuilder: false
  },
];

export const categoryImages = {
  "Yellow Sapphire": "/images/yellow_sapphire.png",
  "Blue Sapphire": "/images/blue_sapphire.png",
  "Emerald": "/images/emerald.png",
  "Ruby": "/images/ruby.png",
  "Pearl": "/images/pearl.png",
  "Red Coral": "/images/coral.png",
  "Hessonite": "/images/hessonite.png",
  "Cats Eye": "/images/cats_eye.png",
};
export const allCategories = ["Yellow Sapphire", "Blue Sapphire", "Emerald", "Ruby", "Pearl", "Red Coral", "Hessonite", "Cats Eye"];
export const gemCategories = ["Yellow Sapphire", "Blue Sapphire", "Emerald", "Ruby", "Pearl", "Red Coral", "Hessonite", "Cats Eye"];
export const jewelryCategories = [];

export const metalPrices = {
  'Ring': {
    '22K Yellow Gold': 45000,
    '18K White Gold': 35000,
    'Sterling Silver': 4500,
    'Panchdhatu': 6000
  },
  'Pendant': {
    '22K Yellow Gold': 30000,
    '18K White Gold': 24000,
    'Sterling Silver': 3000,
    'Panchdhatu': 4000
  }
};

export const chatbotKnowledge = {
  storeName: "VijayKumar Diamonds & Gems",
  address: "Venkatakrishna Street, Opposite Shanmuga Nursing Home, RS Puram, Coimbatore — 641002, Tamil Nadu, India",
  phone: "+91 90927 16427",
  email: "info@vijaykumardiamonds.com",
  hours: "Monday – Sunday: 9:00 AM — 10:00 PM (Open 7 days)",
};

// Map GemPundit style astrology & certification to existing products
const astrologyMap = {
  "Ruby": { planet: "Sun (Surya)", day: "Sunday", mantra: "Om Suryaya Namaha", finger: "Ring Finger" },
  "Blue Sapphire": { planet: "Saturn (Shani)", day: "Saturday", mantra: "Om Sham Shanaischaraya Namaha", finger: "Middle Finger" },
  "Emerald": { planet: "Mercury (Budh)", day: "Wednesday", mantra: "Om Budhaya Namaha", finger: "Little Finger" },
  "Yellow Sapphire": { planet: "Jupiter (Guru)", day: "Thursday", mantra: "Om Gurave Namaha", finger: "Index Finger" },
  "Pearl": { planet: "Moon (Chandra)", day: "Monday", mantra: "Om Chandraya Namaha", finger: "Little Finger" },
  "Red Coral": { planet: "Mars (Mangal)", day: "Tuesday", mantra: "Om Mangalaya Namaha", finger: "Ring Finger" },
  "Hessonite": { planet: "Rahu", day: "Saturday", mantra: "Om Rahave Namaha", finger: "Middle Finger" },
  "Cats Eye": { planet: "Ketu", day: "Tuesday", mantra: "Om Ketave Namaha", finger: "Middle Finger" },
};

products.forEach(p => {
  p.astrology = astrologyMap[p.category] || astrologyMap["Rings"];
  p.certificationDetails = {
    lab: p.cert || "Standard Lab",
    type: p.treatment === "Natural" || p.treatment === "Unheated" ? "100% Natural & Untreated" : "Standard Treatment",
    reportNo: "VK" + Math.floor(100000 + Math.random() * 900000)
  };
});

export const gemOptions = {
  qualities: [
    { label: "AA", priceMultiplier: 1.0, img: "/images/blue_sapphire.png" },
    { label: "AAA", priceMultiplier: 1.3, img: "/images/blue_sapphire.png" },
    { label: "Deluxe", priceMultiplier: 1.8, img: "/images/blue_sapphire.png" }
  ],
  carats: [
    { label: "1.50 - 2.00 ct", value: 1.5 },
    { label: "2.00 - 2.50 ct", value: 2.0 },
    { label: "2.50 - 3.00 ct", value: 2.5 },
    { label: "3.00 - 4.00 ct", value: 3.0 }
  ],
  diamondQualities: [
    { label: "None", price: 0 },
    { label: "Natural Diamond IJ-SI", price: 15000 },
    { label: "Natural Diamond GH-VS", price: 25000 },
    { label: "Natural Diamond EF-VVS", price: 40000 }
  ],
  goldPurities: [
    { label: "14K Gold", price: 67500 },
    { label: "18K Gold", price: 85000 },
    { label: "22K Gold", price: 105000 }
  ],
  ringSizeSystems: ["Indian/Asian", "US/Canada", "UK/Australia"],
  ringSizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
  designs: [
    { label: "Solitaire", img: "/images/ring_solitaire.png" },
    { label: "Halo", img: "/images/ring_halo.png" },
    { label: "Vintage", img: "/images/ring_vintage.png" }
  ]
};
