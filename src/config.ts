// Centrale instellingen. Zet `indexable` pas op true bij livegang.
export const SITE = {
  name: "Go Smart finance",
  slogan: "Time is Gold",
  email: "info@gosmartfinance.com",
  city: "Zoetermeer",
  indexable: true,
  // Accent: "gold" of "teal". Keuze nog open (zie stijlgids).
  accent: "gold" as "gold" | "teal",
};

export const NAV = [
  { href: "/diensten", label: "Diensten" },
  { href: "/demo", label: "Demo" },
  { href: "/over", label: "Over" },
  { href: "/contact", label: "Contact" },
];

export const CTA = { href: "/contact", label: "Plan een gratis gesprek" };
