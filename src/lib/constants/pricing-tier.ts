export interface Tier {
  name: string;
  id: "free" | "pro" | "business";
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}

export const PricingTier: Tier[] = [
  {
    name: "Free",
    id: "free",
    icon: "/assets/icons/price-tiers/free-icon.svg",
    description: "For individuals getting started",
    features: [
      "Up to 5 active projects",
      "Basic task management",
      "100MB file storage",
      "3 team members",
      "Basic integrations",
      "2-factor authentication",
    ],
    featured: false,
    priceId: {
      month: "",
      year: "",
    },
  },
  {
    name: "Pro",
    id: "pro",
    icon: "/assets/icons/price-tiers/basic-icon.svg",
    description: "For power users and small teams",
    features: [
      "Unlimited active projects",
      "Advanced task management",
      "5GB file storage per user",
      "Unlimited team members",
      "Advanced integrations",
      "Priority support",
      "Custom fields",
      "Gantt charts",
      "Time tracking",
    ],
    featured: true,
    priceId: {
      month: "pri_01j8wqm8x8w7gnmbax9wdeqpjf",
      year: "pri_01j8wqntqppsyw4ce6z65yc9ry",
    },
  },
  {
    name: "Business",
    id: "business",
    icon: "/assets/icons/price-tiers/pro-icon.svg",
    description: "For organizations that need more control and support",
    features: [
      "Everything in Pro",
      "Unlimited file storage",
      "Advanced security features",
      "Admin & owner roles",
      "Team billing",
      "Custom workflows",
      "Workload management",
      "24/7 customer support",
      "SSO (SAML)",
    ],
    featured: false,
    priceId: {
      month: "pri_01j8wqqssqgy137net5xa76djm",
      year: "pri_01j8wqrmqq2s336f4ehjwpxzqj",
    },
  },
];
