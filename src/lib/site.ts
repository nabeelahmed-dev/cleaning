// All copy lives here so the brand, contact details and content can be
// changed in one place.
//
// This is a demo for an unnamed cleaning company: the name, contact details,
// stats, hours, claims, reviews and prices are all placeholders. Replace them
// with the real business's details before using the site.

export const site = {
  name: "Your Company",
  tagline: "Cleaning Services",
  legalName: "Your Company Cleaning Services",
  url: "https://cleaning-ten-rho.vercel.app",
  phone: "(555) 555-0123",
  phoneHref: "tel:+15555550123",
  email: "hello@example.com",
  area: "Your City & Surrounding Areas",
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

// Options and prices for the online booking form (/booking).
//
// The price model follows a reference residential-cleaning booking form, read
// on 2026-10-07. The figures are placeholders: replace them with the real
// business's price list. Sales tax, tips, coupons and card payment are left out.
export const booking = {
  // discount applies to the repeat visits; the first visit is full price.
  frequencies: [
    { label: "One-Time", discount: 0 },
    { label: "Every Week", discount: 0.2 },
    { label: "Every 2 Weeks", discount: 0.1 },
    { label: "Every 4 Weeks", discount: 0.05 },
  ],
  // base = smallest space (1 room, 1 bathroom, under 1,000 sq ft);
  // perRoom is added for each room after the first.
  tiers: {
    standard: { base: 150, perRoom: 25 },
    deep: { base: 225, perRoom: 50 },
    move: { base: 300, perRoom: 75 },
  },
  perBathroom: 25, // each bathroom after the first
  perHalfBath: 12.5,
  perAreaBand: 25, // each floor-area band above the smallest
  rooms: ["1", "2", "3"],
  bathrooms: ["1", "2", "3"],
  halfBaths: ["0", "1", "2", "3"],
  areas: ["1 – 999 sq ft", "1,000 – 1,499 sq ft", "1,500 – 1,999 sq ft", "2,000 – 2,499 sq ft", "2,500 – 2,999 sq ft"],
  // price is per booking, or per unit when `unit` is set. A price list is
  // indexed by number of rooms (1, 2, 3). firstVisitOnly extras are not
  // charged again on repeat visits.
  extras: [
    { name: "Initial / Heavy Duty Clean", price: [75, 100, 125], firstVisitOnly: true },
    { name: "Additional Room", price: 25 },
    { name: "Interior Windows", price: 2.5, unit: "window" },
    { name: "Inside Fridge", price: 37.5 },
    { name: "Inside Oven", price: 37.5 },
    { name: "Hourly Organization", price: 50 },
    { name: "Sink Of Dishes", price: 25 },
    { name: "Dog(s)", price: 20 },
    { name: "Cat(s)", price: 20 },
  ],
  arrivalWindows: ["Morning (8am – 11am)", "Midday (11am – 2pm)", "Afternoon (2pm – 5pm)", "After hours (5pm onwards)"],
} as const;

export type PricingTier = keyof typeof booking.tiers;

// `tier` picks the booking price tier for each service.
export const services = [
  {
    icon: "building",
    title: "Office Cleaning",
    tier: "standard",
    text: "Regular cleaning that keeps your workplace ready for staff and visitors.",
    points: ["Desks & workstations", "Meeting rooms", "Break rooms & kitchens"],
  },
  {
    icon: "store",
    title: "Commercial Spaces",
    tier: "standard",
    text: "Cleaning for commercial premises, planned around how your space is used.",
    points: ["Lobbies & entrances", "Shared areas", "Glass & surfaces"],
  },
  {
    icon: "house",
    title: "Apartment Move-In / Move-Out Cleaning",
    tier: "move",
    text: "Hand over the keys with confidence, or start fresh in a spotless new place.",
    points: ["Kitchens & appliances", "Bathrooms", "Floors & cupboards"],
  },
  {
    icon: "sparkles",
    title: "Deep Cleaning",
    tier: "deep",
    text: "A top-to-bottom reset for the corners a regular clean never reaches.",
    points: ["Built-up dirt & grime", "Hard-to-reach areas", "Detailed finish"],
  },
  {
    icon: "trash",
    title: "Restrooms, Floors & Trash Removal",
    tier: "standard",
    text: "The essentials every building needs handled, every visit.",
    points: ["Restroom cleaning", "Floor care", "Trash removal"],
  },
  {
    icon: "calendar",
    title: "One-Time & Recurring Cleaning",
    tier: "standard",
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
