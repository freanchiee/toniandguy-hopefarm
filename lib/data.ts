// ── Service cards shown on homepage & services page ──────────────────────────
export const services = [
  {
    number: "01",
    name: "Haircut & Styling",
    description: "Men's cuts from ₹800 · Women's cut & blow dry from ₹1,200 · Kids from ₹700. Precision shape work by trained T&G stylists.",
    price: "from ₹700",
    duration: "45 min – 1 hr"
  },
  {
    number: "02",
    name: "Colour Services",
    description: "Global colour (men from ₹2,000 · women from ₹6,000), tint re-growth from ₹2,800, advance colour techniques (balayage, ombré, lumi-ombré) from ₹8,000.",
    price: "from ₹2,000",
    duration: "90 – 150 min"
  },
  {
    number: "03",
    name: "Highlights",
    description: "Full head highlights from ₹7,000 · Half head from ₹5,000 · T-section from ₹2,500 · Men's cap highlights from ₹4,000. Multi-toned dimension that lightens and adds shine.",
    price: "from ₹2,500",
    duration: "120 – 180 min"
  },
  {
    number: "04",
    name: "Blow Dry & Styling",
    description: "Wash & blast dry ₹700 · Straight blow dry ₹900 · In curl/out curl ₹1,200 · Ironing from ₹1,500 · Tonging from ₹1,500 · Scrunching from ₹1,200.",
    price: "from ₹700",
    duration: "45 – 60 min"
  },
  {
    number: "05",
    name: "Professional Hair Spa",
    description: "Shea Retention Treatment from ₹2,000 · System Pro Re-Born from ₹2,000 · Sebastian Professional from ₹2,000 · Wellaplex Care Spa from ₹3,500.",
    price: "from ₹2,000",
    duration: "60 – 90 min"
  },
  {
    number: "06",
    name: "Hair Treatments",
    description: "Straightening/Rebonding from ₹3,000 · Cysteine/Keratin from ₹4,500 · Botox from ₹5,000 · Botoliss from ₹5,000 · Perming from ₹6,000. Permanent frizz-free solutions.",
    price: "from ₹3,000",
    duration: "bespoke"
  },
  {
    number: "07",
    name: "Skin Care & Facials",
    description: "Sothys, Dermalogica & Skeyndor facials from ₹2,199. Clean-up rituals, hydrating, brightening & anti-ageing treatments by trained therapists.",
    price: "from ₹2,199",
    duration: "60 – 90 min"
  },
  {
    number: "08",
    name: "Manicure & Pedicure",
    description: "Deluxe Manicure from ₹1,000 · Deluxe Pedicure from ₹1,300 · Luxury Manicure ₹1,600 · Luxury Pedicure ₹2,000. Nail extensions & nail art available.",
    price: "from ₹1,000",
    duration: "45 – 90 min"
  },
  {
    number: "09",
    name: "Threading & Waxing",
    description: "Eyebrow threading from ₹100 · Full face threading ₹500 · Premium, luxury & Brazilian waxing · De-TAN treatments across all body zones.",
    price: "from ₹100",
    duration: "15 – 60 min"
  },
  {
    number: "10",
    name: "Massage & Wellness",
    description: "Reflexology from ₹1,000 · Head oil massage from ₹700 · Swedish therapy from ₹2,500 · Balinese therapy from ₹2,700 · Deep tissue from ₹2,700.",
    price: "from ₹700",
    duration: "30 – 90 min"
  },
];

// ── Full price list (used on /services page) ──────────────────────────────────
export const priceList = {
  haircut: {
    title: "Haircut",
    mens: [
      { name: "Style Director", price: 1800, note: "*Selective Outlets" },
      { name: "Creative Director", price: 1500 },
      { name: "Top Stylist", price: 1200 },
      { name: "Senior Stylist", price: 900 },
      { name: "Stylist", price: 800, note: "*Selective Outlets" },
      { name: "Kids Haircut (Age 5–10 yrs)", price: 700 },
      { name: "Deep Conditioning", price: 800 },
    ],
    womens: [
      { name: "Style Director", price: 2600, note: "*Selective Outlets" },
      { name: "Creative Director", price: 2200 },
      { name: "Top Stylist", price: 1800 },
      { name: "Senior Stylist", price: 1500 },
      { name: "Stylist", price: 1200, note: "*Selective Outlets" },
      { name: "Kids Haircut (Age 5–10 yrs)", price: 800 },
      { name: "Fringe Cut", price: 600 },
      { name: "Deep Conditioning", price: 1000 },
    ],
  },
  blowDry: {
    title: "Blow Dry",
    items: [
      { name: "Wash and Blast Dry", price: 700 },
      { name: "Extra Long Hair (Blast Dry)", price: 800 },
      { name: "Straight Blow Dry", price: 900 },
      { name: "In Curl / Out Curl", price: 1200 },
      { name: "Extra Long (Blow Dry)", price: 1300 },
    ],
  },
  shave: {
    title: "Shave",
    items: [
      { name: "Zero Trim", price: 150 },
      { name: "Regular Shave", price: 300 },
      { name: "Beard Shape-Up", price: 350 },
      { name: "Beard Design", price: 500 },
      { name: "Head Shave", price: 500 },
      { name: "Royal Shave", price: 1000 },
    ],
  },
  styleCheck: {
    title: "Style Check",
    ironing: [
      { name: "Shoulder Length", price: 1500 },
      { name: "Below Shoulder", price: 1700 },
      { name: "Extra Long", price: 2000 },
    ],
    tonging: [
      { name: "Shoulder Length", price: 1500 },
      { name: "Below Shoulder", price: 1800 },
      { name: "Extra Long", price: 2000 },
    ],
    scrunching: { price: 1200, note: "onwards" },
    mensStyle: { price: 700 },
    perming: [
      { name: "Shoulder Length", price: 6000, note: "onwards" },
      { name: "Below Shoulder", price: 7500, note: "onwards" },
    ],
  },
  colour: {
    title: "Colour Services",
    items: [
      { name: "Tint Re-Growth", price: 2800, note: "onwards" },
      { name: "Global Colour — Men", price: 2000, note: "onwards" },
      { name: "Global Colour — Women", price: 6000, note: "onwards" },
      { name: "Men's Cap Highlights", price: 4000, note: "onwards" },
      { name: "Highlights Full Head", price: 7000, note: "onwards" },
      { name: "Highlights Half Head", price: 5000, note: "onwards" },
      { name: "T-Section (Hairline Highlights)", price: 2500, note: "onwards" },
      { name: "Per Streak (without pre light)", price: 1000, note: "onwards" },
      { name: "Moustache Colour", price: 300 },
      { name: "Beard Colour", price: 500, note: "onwards" },
      { name: "Colour Change / Correction", price: 8000, note: "onwards" },
      { name: "Pre Light / Toner", price: 0, note: "Price on Consultation" },
      { name: "Advance Colour Technique (Balayage, Ombré, Lumi-Ombré)", price: 8000, note: "onwards" },
    ],
  },
  treatments: {
    title: "Hair Treatments",
    straightening: [
      { name: "Fringe", price: 3000, note: "onwards" },
      { name: "Crown Area", price: 5000, note: "onwards" },
      { name: "Up to Neck", price: 6000, note: "onwards" },
      { name: "Shoulder Length", price: 9000, note: "onwards" },
      { name: "Below Shoulder", price: 10000, note: "onwards" },
      { name: "Up to Waist", price: 12000, note: "onwards" },
    ],
    cysteine: [
      { name: "Fringe", price: 4500, note: "onwards" },
      { name: "Crown Area", price: 5500, note: "onwards" },
      { name: "Up to Neck", price: 7500, note: "onwards" },
      { name: "Shoulder Length", price: 10000, note: "onwards" },
      { name: "Below Shoulder", price: 11000, note: "onwards" },
      { name: "Up to Waist", price: 13000, note: "onwards" },
    ],
    botox: [
      { name: "Fringe", price: 5000, note: "onwards" },
      { name: "Crown", price: 7000, note: "onwards" },
      { name: "Up to Neck", price: 8500, note: "onwards" },
      { name: "Shoulder Length", price: 11000, note: "onwards" },
      { name: "Below Shoulder", price: 13000, note: "onwards" },
      { name: "Up to Waist", price: 15000, note: "onwards" },
    ],
    botoliss: [
      { name: "Fringe", price: 5000, note: "onwards" },
      { name: "Crown", price: 7000, note: "onwards" },
      { name: "Up to Neck", price: 8500, note: "onwards" },
      { name: "Shoulder Length", price: 11000, note: "onwards" },
      { name: "Below Shoulder", price: 13000, note: "onwards" },
      { name: "Up to Waist", price: 15000, note: "onwards" },
    ],
  },
  hairSpa: {
    title: "Professional Hair Spa",
    items: [
      { name: "Shea Hair Retention — Men", price: 2000, note: "onwards" },
      { name: "Shea Hair Retention — Women Shoulder", price: 3000, note: "onwards" },
      { name: "Shea Hair Retention — Women Extra Long", price: 3500, note: "onwards" },
      { name: "Shea Hair Curl — Men", price: 2000, note: "onwards" },
      { name: "Shea Hair Curl — Women Shoulder", price: 3000, note: "onwards" },
      { name: "Shea Hair Curl — Women Extra Long", price: 3500, note: "onwards" },
      { name: "System Pro Re-Born — Men", price: 2000, note: "onwards" },
      { name: "System Pro Re-Born — Women Shoulder", price: 2500, note: "onwards" },
      { name: "System Pro Re-Born — Women Extra Long", price: 3000, note: "onwards" },
      { name: "Sebastian Professional — Men", price: 2000, note: "onwards" },
      { name: "Sebastian Professional — Women Shoulder", price: 2500, note: "onwards" },
      { name: "Sebastian Professional — Women Extra Long", price: 3000, note: "onwards" },
      { name: "Wellaplex Care Spa", price: 3500, note: "onwards" },
    ],
  },
  // ── Chakra Urban Spa services ─────────────────────────────────────────────
  reflexology: {
    title: "Reflexology",
    items: [
      { name: "Foot / Shoulder & Back — 30 min", price: 1000 },
      { name: "Foot / Shoulder & Back — 60 min", price: 1500 },
      { name: "Head Oil Massage Men — 30 min", price: 700 },
      { name: "Head Oil Massage Men — 60 min", price: 1200 },
      { name: "Head Oil Massage Women — 30 min", price: 1200, note: "incl. Hair Wash & Blast Dry" },
      { name: "Head Oil Massage Women — 60 min", price: 1500, note: "incl. Hair Wash & Blast Dry" },
    ],
  },
  massages: {
    title: "Massages",
    note: "*Available at select outlets",
    items: [
      { name: "Swedish Therapy (Oil) — 60 min", price: 2500 },
      { name: "Swedish Therapy (Oil) — 90 min", price: 3000 },
      { name: "Balinese Therapy (Dry & Oil) — 60 min", price: 2700 },
      { name: "Balinese Therapy (Dry & Oil) — 90 min", price: 3100 },
      { name: "Deep Tissue Therapy (Oil) — 60 min", price: 2700 },
      { name: "Deep Tissue Therapy (Oil) — 90 min", price: 3100 },
    ],
  },
  scrubsWraps: {
    title: "Scrubs & Wraps",
    note: "*Available at select outlets",
    items: [
      { name: "Chakra Herbal Scrub & Wrap — 90 min", price: 3250 },
    ],
  },
  skinCare: {
    title: "Skin Care",
    sothys: [
      { name: "Clean Up Ritual", price: 2499 },
      { name: "Hydra Comfort Soothing Ritual", price: 3799 },
      { name: "Clear Balance Purifying Ritual", price: 3799 },
      { name: "Brightening Ritual", price: 4499 },
      { name: "FirmLift Youth Ritual", price: 4199 },
      { name: "Purifying Treatment", price: 4799 },
      { name: "Skin Brightening Treatment", price: 5999 },
      { name: "FirmLift Youth Treatment", price: 5999 },
    ],
    dermalogica: [
      { name: "Clean Up Ritual", price: 2799 },
      { name: "Pro Hydrating Facial", price: 3799 },
      { name: "Pro Clear Facial", price: 3799 },
      { name: "Pro Calm Facial", price: 3799 },
      { name: "Pro Bright Treatment", price: 4499 },
      { name: "Pro Age Smart Treatment", price: 4999 },
    ],
    skeyndor: [
      { name: "Under Eye Treatment", price: 2199 },
      { name: "Clean Up Ritual", price: 3299 },
      { name: "Hydration Ritual", price: 4499 },
      { name: "Pure Defence Facial", price: 4499 },
      { name: "Power Retinol Treatment", price: 5999 },
      { name: "Clear Balance Treatment", price: 5999 },
      { name: "Aquatherm Treatment", price: 6499 },
      { name: "Power Oxygen Treatment", price: 6499 },
      { name: "Corrective Treatment", price: 9999 },
    ],
  },
  manicure: {
    title: "Manicure",
    items: [
      { name: "Deluxe Manicure", price: 1000, note: "Cut & File, Cuticle cleaning, Scrub and Massage" },
      { name: "Candle Manicure", price: 1300, note: "Cut & File, Cuticle cleaning, Scrub, Massage (candle) and pack" },
      { name: "Classic Manicure", price: 1500, note: "Cut & File, Cuticle cleaning, Salt Soak Scrub, Massage and pack" },
      { name: "Luxury Manicure", price: 1600, note: "Cut & File, Cuticle cleaning, DeTan, Scrub, Massage and pack" },
      { name: "Cut & File", price: 200 },
      { name: "Nail Paint", price: 250 },
    ],
  },
  pedicure: {
    title: "Pedicure",
    items: [
      { name: "Deluxe Pedicure", price: 1300, note: "Cut & File, Cuticle cleaning, Scrub and Massage" },
      { name: "Candle Pedicure", price: 1600, note: "Cut & File, Cuticle cleaning, Scrub, Massage (candle) and pack" },
      { name: "Classic Pedicure", price: 1800, note: "Cut & File, Cuticle cleaning, Salt Soak Scrub, Massage and pack" },
      { name: "Luxury Pedicure", price: 2000, note: "Cut & File, Cuticle cleaning, DeTan, Scrub, Massage and pack" },
      { name: "Cut & File", price: 200 },
      { name: "Nail Paint", price: 250 },
    ],
  },
  nailExtension: {
    title: "Nail Extension & Art",
    items: [
      { name: "Jewellery (per piece)", price: 50 },
      { name: "Nail Art (per finger)", price: 200 },
      { name: "5D or Cat Eye (per finger)", price: 200 },
      { name: "Holographic Gel Polish (per finger)", price: 200 },
      { name: "Chrome (per finger)", price: 200 },
      { name: "Gel Polish (per finger)", price: 120 },
      { name: "Gel Polish Removal", price: 600 },
      { name: "Gel Polish French", price: 1350 },
      { name: "Soft Gel Extension (gel polish incl.)", price: 2300 },
      { name: "Soft Gel Extension (overlay incl.)", price: 2300 },
      { name: "French Tip Extension", price: 2800 },
      { name: "Acrylic Extension (gel polish incl.)", price: 3500 },
      { name: "Gel Extension (gel polish incl.)", price: 3500 },
      { name: "Extension Removal", price: 850 },
      { name: "Overlay", price: 1850 },
      { name: "Refill (gel polish incl.)", price: 2250 },
    ],
  },
  deTan: {
    title: "De-TAN",
    items: [
      { name: "Nape", price: 500 },
      { name: "Feet", price: 750 },
      { name: "Underarms", price: 550 },
      { name: "Face & Neck", price: 1100 },
      { name: "Half Arms", price: 750 },
      { name: "Full Arms", price: 1100 },
      { name: "Half Legs", price: 1000 },
      { name: "Full Legs", price: 1400 },
      { name: "Upper Back", price: 900 },
      { name: "Lower Back", price: 900 },
      { name: "Full Back", price: 1250 },
      { name: "Midriff", price: 900 },
    ],
  },
  threading: {
    title: "Threading",
    items: [
      { name: "Eyebrows", price: 100 },
      { name: "Upper Lip", price: 100 },
      { name: "Lower Lip", price: 100 },
      { name: "Chin", price: 100 },
      { name: "Forehead", price: 100 },
      { name: "Sides", price: 100 },
      { name: "Neck", price: 120 },
      { name: "Full Face", price: 500 },
    ],
  },
  waxing: {
    title: "Waxing",
    note: "Men's waxing 25% extra",
    premiumWax: [
      { name: "Half Arms", price: 600 },
      { name: "Full Arms", price: 1000 },
      { name: "Half Legs", price: 800 },
      { name: "Full Legs", price: 1200 },
      { name: "Full Front / Back", price: 1000 },
      { name: "Upper / Lower Back", price: 750 },
      { name: "Midriff", price: 800 },
      { name: "Butt", price: 800 },
      { name: "Full Body (Without Bikini)", price: 4250 },
      { name: "Full Body (With Bikini)", price: 5250 },
    ],
    brazilianWax: [
      { name: "Upper Lip", price: 150 },
      { name: "Chin", price: 150 },
      { name: "Sides", price: 275 },
      { name: "Neck", price: 275 },
      { name: "Ears", price: 275 },
      { name: "Nape", price: 150 },
      { name: "Nose", price: 150 },
      { name: "Underarms", price: 500 },
      { name: "Full Face", price: 600, note: "*Selective Outlets" },
      { name: "Bikini Line", price: 1150 },
      { name: "Bikini Wax", price: 2800 },
      { name: "Butt Crack", price: 750 },
      { name: "Full Body (With Bikini)", price: 7000 },
    ],
    luxuryWax: [
      { name: "Half Arms", price: 700 },
      { name: "Full Arms", price: 1200 },
      { name: "Half Legs", price: 1000 },
      { name: "Full Legs", price: 1450 },
      { name: "Full Front / Back", price: 1300 },
      { name: "Upper / Lower Back", price: 900 },
      { name: "Midriff", price: 1150 },
      { name: "Butt", price: 1500 },
      { name: "Full Body (Without Bikini)", price: 5250 },
      { name: "Full Body (With Bikini)", price: 6500 },
    ],
    luxuryBrazilianWax: [
      { name: "Upper Lip", price: 275 },
      { name: "Chin", price: 275 },
      { name: "Sides", price: 500 },
      { name: "Neck", price: 500 },
      { name: "Ears", price: 500 },
      { name: "Nape", price: 275 },
      { name: "Nose", price: 450 },
      { name: "Underarms", price: 750 },
      { name: "Full Face", price: 800 },
      { name: "Bikini Line", price: 1250 },
      { name: "Bikini Wax", price: 3000 },
      { name: "Butt Crack", price: 1250 },
      { name: "Full Body (With Bikini)", price: 7000 },
    ],
    intimateCare: 1500,
  },
};

export const stylists = [
  {
    name: "Simick",
    speciality: "Unisex Hairdresser",
    image: "https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=900&q=80",
    bio: "Colour transformations, highlights, and personalized hair makeovers."
  },
  {
    name: "Sumit",
    speciality: "Unisex Top Stylist",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80",
    bio: "Precision cuts, wearable shape, and polished finish."
  },
  {
    name: "Arnik",
    speciality: "Unisex Hairstylist",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    bio: "Treatments, smoothening work, and detailed styling."
  },
  {
    name: "Pavitra",
    speciality: "Senior Beautician",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    bio: "Facials, threading, manicure, pedicure, and grooming services."
  }
];

export const heroServiceOptions = [
  {
    label: "Men's cut & styling",
    meta: "45 min · from ₹800",
    href: "/book?service=mens-cut"
  },
  {
    label: "Women's cut & blow dry",
    meta: "60 min · from ₹1,200",
    href: "/book?service=womens-cut"
  },
  {
    label: "Straight blow dry",
    meta: "45 min · ₹900",
    href: "/book?service=straight-blowdry"
  },
  {
    label: "Global colour",
    meta: "Men from ₹2,000 · Women from ₹6,000",
    href: "/book?service=colour"
  },
  {
    label: "Highlights",
    meta: "Full head from ₹7,000 · Half head from ₹5,000",
    href: "/book?service=highlights"
  },
  {
    label: "Balayage / Advance Colour",
    meta: "from ₹8,000 · Ombré, Lumi-Ombré",
    href: "/book?service=balayage"
  },
  {
    label: "Keratin / Cysteine",
    meta: "from ₹4,500 · Frizz-free treatment",
    href: "/book?service=keratin"
  },
  {
    label: "Botox / Botoliss",
    meta: "from ₹5,000 · Sleek & smooth",
    href: "/book?service=botox"
  },
  {
    label: "Straightening / Rebonding",
    meta: "from ₹3,000 · Permanent solution",
    href: "/book?service=straightening"
  },
  {
    label: "Professional hair spa",
    meta: "from ₹2,000 · System Pro, Sebastian, Wellaplex",
    href: "/book?service=hair-spa"
  },
  {
    label: "Facials & skin care",
    meta: "Sothys, Dermalogica, Skeyndor · from ₹2,199",
    href: "/book?service=facial"
  },
  {
    label: "Manicure & pedicure",
    meta: "from ₹1,000 · Nail extensions available",
    href: "/book?service=mani-pedi"
  },
  {
    label: "Threading & waxing",
    meta: "Threading from ₹100 · Brazilian wax available",
    href: "/book?service=threading"
  },
  {
    label: "Massage & reflexology",
    meta: "from ₹700 · Swedish, Balinese, Deep Tissue",
    href: "/book?service=massage"
  },
];

export const heroStylistOptions = [
  {
    label: "Pavitra",
    meta: "Senior beautician",
    href: "/book?stylist=pavitra"
  },
  {
    label: "Simick",
    meta: "Unisex hairdresser",
    href: "/book?stylist=simick"
  },
  {
    label: "Sumit",
    meta: "Unisex top stylist",
    href: "/book?stylist=sumit"
  },
  {
    label: "Arnik",
    meta: "Unisex hairstylist",
    href: "/book?stylist=arnik"
  }
];

export const testimonials = [
  {
    name: "Priya Menon",
    avatar: "https://ui-avatars.com/api/?name=Priya+Menon&background=c9a84c&color=0a0a0a&size=128&bold=true",
    rating: 5,
    date: "2 weeks ago",
    text: "Best salon experience in Whitefield, hands down. Simick did my balayage and the colour is absolutely stunning — exactly what I'd been looking for after three disappointing salons. The space itself is beautiful, very premium feel."
  },
  {
    name: "Rahul Sharma",
    avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=2a2a2a&color=c9a84c&size=128&bold=true",
    rating: 5,
    date: "1 month ago",
    text: "Sumit gave me the cleanest taper fade I've ever had. He actually listened to what I wanted and didn't just do what was easiest. Staff is professional, salon is spotless. Coming back every 3 weeks."
  },
  {
    name: "Deepika Agarwal",
    avatar: "https://ui-avatars.com/api/?name=Deepika+Agarwal&background=c9a84c&color=0a0a0a&size=128&bold=true",
    rating: 5,
    date: "3 weeks ago",
    text: "Pavitra is a gem — did my bridal trial here and I was blown away. She understood my reference immediately and the result was so elegant. The ambience is like nothing else in Hopefarm. Highly recommend for any occasion styling."
  },
  {
    name: "Aakash Verma",
    avatar: "https://ui-avatars.com/api/?name=Aakash+Verma&background=1a1a1a&color=f6f1e8&size=128&bold=true",
    rating: 4,
    date: "1 month ago",
    text: "Got a keratin treatment done by Arnik. Took a while but the results were worth every minute — hair is silky smooth and the frizz is completely gone. Pricing is fair for the quality. Would've given 5 stars but parking is a bit tricky."
  },
  {
    name: "Sneha Krishnan",
    avatar: "https://ui-avatars.com/api/?name=Sneha+Krishnan&background=c9a84c&color=0a0a0a&size=128&bold=true",
    rating: 5,
    date: "5 days ago",
    text: "Finally a Toni & Guy that lives up to the brand. The consultation before my haircut was thorough and Sumit's precision is unreal. My hair hasn't looked this good in years. The System Professional products they use are top tier too."
  },
  {
    name: "Vikram Nair",
    avatar: "https://ui-avatars.com/api/?name=Vikram+Nair&background=2a2a2a&color=c9a84c&size=128&bold=true",
    rating: 5,
    date: "2 months ago",
    text: "Walked in on a Saturday without an appointment and they fit me in seamlessly. Great service, great cut. The vibe is calm and upscale — very different from the chaotic salons in the area. This is my permanent salon now."
  }
];

export const galleryImages = [
  {
    src: "https://picsum.photos/seed/toni-guy-01/900/1200",
    caption: "Dimensional colour finish"
  },
  {
    src: "https://picsum.photos/seed/toni-guy-02/900/700",
    caption: "Salon texture study"
  },
  {
    src: "https://picsum.photos/seed/toni-guy-03/900/1100",
    caption: "Precision cut detail"
  },
  {
    src: "https://picsum.photos/seed/toni-guy-04/900/800",
    caption: "Bridal styling trial"
  },
  {
    src: "https://picsum.photos/seed/toni-guy-05/900/1250",
    caption: "Treatment finish"
  },
  {
    src: "https://picsum.photos/seed/toni-guy-06/900/760",
    caption: "Whitefield salon atmosphere"
  }
];
