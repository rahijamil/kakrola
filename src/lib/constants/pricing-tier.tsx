import { ReactNode } from "react";

enum ProductId {
  PRO = "pro_01j8wqee2kcdsxsezwdpk22rc5",
  BUSINESS = "pro_01j8wqq3n58nykxgrmxkhqe0f4",
}

export interface Tier {
  name: string;
  id: "plus" | "business";
  product_id: ProductId | null;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  featureHeading?: string;
  price: string;
  period: string;
  cta: "Start 14-day trial" | "Contact sales";
  highlighted?: boolean;
  priceId: string;
  badge?: string;
  price1: ReactNode;
  idealFor?: string;
}

export const pricingTiers: Tier[] = [
  {
    name: "Plus",
    id: "plus",
    product_id: ProductId.PRO,
    icon: "/icons/price-tiers/plus.svg",
    description: "The complete workspace that grows with your team",
    idealFor: "Perfect for teams of 5-100 looking to centralize their work",
    features: [
      "Project Management",
      "• Unlimited projects and tasks",
      "• Multiple views (List, Board, Calendar)",
      "• Custom task fields and labels",
      "• Due dates and priorities",
      "• Subtasks and dependencies",

      "Document Collaboration",
      "• Rich-text page editor",
      "• Real-time collaboration",
      "• Page organization & hierarchy",
      "• Custom page templates",

      "Team Communication",
      "• Public & private channels",
      "• Direct messages",
      "• Thread discussions",
      "• Emoji reactions",
      "• File sharing",

      "General Features",
      "• Up to 100 team members",
      "• 10 GB storage per workspace",
      "• Basic automation",
      "• Standard integrations",
      "• Community support",
    ],
    featured: true,
    price: "$120",
    period: "per seat/year",
    cta: "Start 14-day trial",
    priceId: "pri_01j8wqntqppsyw4ce6z65yc9ry",
    price1: <>$120 per member / year</>,
  },
  {
    name: "Business",
    id: "business",
    product_id: ProductId.BUSINESS,
    icon: "/icons/price-tiers/business.svg",
    description: "Advanced features for scaling organizations",
    idealFor: "Ideal for teams of 50+ needing advanced tools",
    features: [
      "Advanced Project Management",
      "• Custom project databases",
      "• Advanced Gantt charts",
      "• Resource management",
      "• Workload balancing",
      "• Time tracking",
      "• Custom project templates",

      "Enhanced Collaboration",
      "• Advanced page permissions",
      "• Version history",
      "• Page analytics",
      "• Multi-team management",

      "Team Administration",
      "• Advanced team roles",
      "• Audit logs",
      "• Usage analytics",
      "• Custom workflows",
      "• Advanced automations",

      "Additional Features",
      "• Unlimited team members",
      "• Unlimited storage",
      "• API access",
      "• Priority bug fixes",
      "• Early access to new features",
      "• Private feedback channel",
    ],
    featureHeading: "Everything in Plus +",
    featured: false,
    price: "$180",
    period: "per seat/year",
    cta: "Start 14-day trial",
    highlighted: true,
    badge: "Most popular",
    priceId: "pri_01j8wqrmqq2s336f4ehjwpxzqj",

    price1: <>$180 per member / year</>,
  },
];
