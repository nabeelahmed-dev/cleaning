// All copy lives here so the brand, contact details and content can be
// changed in one place.
//
// From the client's flyer: business name, phone, email, service area and the
// six services. Everything else (stats, hours, claims, reviews) is placeholder
// content carried over from the design and is UNCONFIRMED with the client.

export const site = {
  name: "Top Notch",
  tagline: "Reliable Cleaning LLC",
  legalName: "Top Notch Reliable Cleaning LLC",
  phone: "380-241-9558",
  phoneHref: "tel:+13802419558",
  email: "tnreliablecleaning@gmail.com",
  area: "Columbus & Surrounding Areas",
  hours: "Mon – Sat, 7am – 7pm",
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "More than just cleaning",
  // The last line is shown in the lighter gradient.
  lines: ["A Cleaner", "Space for a", "Brighter You"],
  text: "Professional cleaning services for homes and businesses. Reliable. Detail-oriented. Always on time.",
  cta: "Get a Free Quote",
  bookCta: "Book Online",
};

export const heroFeatures = [
  { icon: "building", label: "Office Cleaning" },
  { icon: "store", label: "Commercial Cleaning" },
  { icon: "leaf", label: "Eco-Friendly Products" },
  { icon: "shield", label: "Trusted & Insured" },
] as const;

// The four tools the 3D hero kit unpacks into, in label order (01 – 04).
export const kit = [
  { name: "Squeegee", text: "Streak-free glass, mirrors and shower screens" },
  { name: "Eco spray", text: "Plant-based solution, safe around kids and pets" },
  { name: "Microfibre cloths", text: "Colour-coded per room, washed after every job" },
  { name: "Sponge & pads", text: "The right abrasive for each surface, never scratchy" },
];

// The six services are the ones listed on the flyer; the descriptions and
// bullet points are draft wording.
// Options for the online booking form (/booking). No prices: the business
// confirms the price by quote. The size bands and extras are draft options.
export const booking = {
  frequencies: ["One-Time", "Every Week", "Every 2 Weeks", "Every 4 Weeks"],
  commercialSize: [
    { label: "Floor area", options: ["Under 1,000 sq ft", "1,000 – 2,499 sq ft", "2,500 – 4,999 sq ft", "5,000 – 9,999 sq ft", "10,000+ sq ft"] },
    { label: "Rooms / offices", options: ["1 – 2", "3 – 5", "6 – 10", "More than 10"] },
    { label: "Restrooms", options: ["1", "2", "3", "4 or more"] },
  ],
  apartmentSize: [
    { label: "Bedrooms", options: ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"] },
    { label: "Bathrooms", options: ["1 Bathroom", "2 Bathrooms", "3+ Bathrooms"] },
    { label: "Floor area", options: ["Under 1,000 sq ft", "1,000 – 1,499 sq ft", "1,500 – 1,999 sq ft", "2,000+ sq ft"] },
  ],
  extras: [
    "Restrooms",
    "Floor care",
    "Trash removal",
    "Interior windows",
    "Inside fridge",
    "Inside oven",
    "Break room",
    "Carpets",
  ],
  arrivalWindows: ["Morning (8am – 11am)", "Midday (11am – 2pm)", "Afternoon (2pm – 5pm)", "After hours (5pm onwards)"],
} as const;

export const services = [
  {
    icon: "building",
    title: "Office Cleaning",
    text: "Regular cleaning that keeps your workplace ready for staff and visitors.",
    points: ["Desks & workstations", "Meeting rooms", "Break rooms & kitchens"],
  },
  {
    icon: "store",
    title: "Commercial Spaces",
    text: "Cleaning for commercial premises, planned around how your space is used.",
    points: ["Lobbies & entrances", "Shared areas", "Glass & surfaces"],
  },
  {
    icon: "house",
    title: "Apartment Move-In / Move-Out Cleaning",
    text: "Hand over the keys with confidence, or start fresh in a spotless new place.",
    points: ["Kitchens & appliances", "Bathrooms", "Floors & cupboards"],
  },
  {
    icon: "sparkles",
    title: "Deep Cleaning",
    text: "A top-to-bottom reset for the corners a regular clean never reaches.",
    points: ["Built-up dirt & grime", "Hard-to-reach areas", "Detailed finish"],
  },
  {
    icon: "trash",
    title: "Restrooms, Floors & Trash Removal",
    text: "The essentials every building needs handled, every visit.",
    points: ["Restroom cleaning", "Floor care", "Trash removal"],
  },
  {
    icon: "calendar",
    title: "One-Time & Recurring Cleaning",
    text: "Book a single clean, or set up a regular schedule that suits you.",
    points: ["One-time cleans", "Recurring schedules", "Free quotes"],
  },
] as const;

// Placeholder figures from the design. Replace with real numbers.
export const stats = [
  { value: 5000, suffix: "+", label: "Happy clients" },
  { value: 100, suffix: "%", label: "Satisfaction guarantee" },
  { value: 12, suffix: " yrs", label: "In business" },
  { value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
];

export const reasons = [
  {
    title: "Vetted, trained cleaners",
    text: "Every team member is background-checked, insured and trained on our checklist.",
  },
  {
    title: "Eco-friendly products",
    text: "Plant-based, low-odour products that are safe around children and pets.",
  },
  {
    title: "On time, every time",
    text: "You get an arrival window and a text when the team is on the way.",
  },
  {
    title: "Not happy? We re-clean",
    text: "Tell us within 24 hours and we come back to put it right at no charge.",
  },
];

export const steps = [
  {
    title: "Get a free quote",
    text: "Tell us about your space and we send a fixed price, usually the same day.",
  },
  {
    title: "Pick a time",
    text: "Choose a slot that suits you. No need to be home while we work.",
  },
  {
    title: "Enjoy the sparkle",
    text: "Our team arrives with everything needed and leaves your space spotless.",
  },
];

// Placeholder testimonials. Replace with real, attributable reviews before launch.
export const reviews = [
  {
    name: "Sarah M.",
    role: "Homeowner",
    text: "The house has never looked this good. They even got the shower glass clear again.",
  },
  {
    name: "David R.",
    role: "Office manager",
    text: "Reliable every single week. Our team notices the difference on Monday mornings.",
  },
  {
    name: "Priya K.",
    role: "Landlord",
    text: "Booked a move-out clean and got the unit re-let within days. Worth every dollar.",
  },
  {
    name: "James T.",
    role: "Homeowner",
    text: "Friendly, punctual and thorough. The eco products were a big plus with our dog.",
  },
  {
    name: "Elena G.",
    role: "Café owner",
    text: "They work around our opening hours and the place is spotless when we arrive.",
  },
  {
    name: "Marcus L.",
    role: "Homeowner",
    text: "Easy quote, fair price, and the windows are completely streak-free.",
  },
];
