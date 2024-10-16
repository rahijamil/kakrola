import { ReactNode } from "react";

enum ProductId {
  PRO = "pro_01j8wqee2kcdsxsezwdpk22rc5",
  BUSINESS = "pro_01j8wqq3n58nykxgrmxkhqe0f4",
}

export interface Tier {
  name: string;
  id: "free" | "plus" | "business";
  product_id: ProductId | null;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  price: (isAnnual: boolean) => "$0" | "$10" | "$12" | "$15" | "$18";
  period: "forever" | "per seat/month";
  cta: "Sign up" | "Get started";
  highlighted?: boolean;
  businessHighlight?: boolean;
  priceId: {
    month: string;
    year: string;
  };
  badge?: "Popular";
  price1: ReactNode;
  price2?: string;
  featureHeading?: "Everything in Free +" | "Everything in Plus +";
}

export const pricingTiers: Tier[] = [
  {
    name: "Free",
    id: "free",
    product_id: null,
    icon: "/assets/icons/price-tiers/free-icon.svg",
    description: "For individuals to organize personal projects and life",
    features: [
      // "1 workspace",
      "Personal space with unlimited projects and pages",
      "1 teamspace",
      "Up to 3 projects per teamspace",
      "Up to 5 pages per teamspace",
      "1 channel per teamspace",
      "Thread discussions in channels",
      "Up to 5 team members",
      "List and Board views for projects",
      "Unlimited tasks",
      "Direct messaging",
      "Basic page editor",
      // "100MB file storage",
      // "Email support",
    ],
    featured: false,
    price: () => "$0",
    period: "forever",
    cta: "Sign up",
    highlighted: false,
    priceId: {
      month: "",
      year: "",
    },
    price1: <>$0 per member / month</>,
  },
  {
    name: "Plus",
    id: "plus",
    product_id: ProductId.PRO,
    icon: "/assets/icons/price-tiers/basic-icon.svg",
    description: "For small teams and professionals to work together",
    features: [
      // "Up to 3 workspaces",
      // "Unlimited teamspaces per workspace",
      "Unlimited teamspaces",
      "Unlimited projects, pages and channels per teamspace",
      // "Up to 50 team members per workspace",
      // "Custom permissions for roles",
      // "Calendar, Dashboard Views",
      "Dashboard Views",
      "Advanced page editor with collaborative editing",
      // "5GB file storage per workspace",
      // "Custom project templates",
      // "Task dependencies",
      // "Recurring tasks",
      // "Time tracking",
      // "Basic integrations (Google Drive, Dropbox)",
      // "Priority email support",
    ],
    featureHeading: "Everything in Free +",
    featured: true,
    price: (isAnnual) => (isAnnual ? "$10" : "$12"),
    period: "per seat/month",
    cta: "Get started",
    highlighted: true,
    priceId: {
      month: "pri_01j8wqm8x8w7gnmbax9wdeqpjf",
      year: "pri_01j8wqntqppsyw4ce6z65yc9ry",
    },
    badge: "Popular",
    price1: (
      <>
        $10 per member / month <br /> billed annually
      </>
    ),
    price2: "$12 billed monthly",
  },
  {
    name: "Business",
    id: "business",
    product_id: ProductId.BUSINESS,
    icon: "/assets/icons/price-tiers/pro-icon.svg",
    description: "For organizations that need more control and support",
    features: [
      // "Unlimited workspaces",
      "Unlimited team members",
      // "Guest access with limited permissions",
      // "Single Sign-On (SSO)",
      // "Advanced security features",
      // "Unlimited file storage",
      // "Custom fields for tasks and projects",
      // "Advanced reporting and analytics",
      // "Workload management",
      // "Goal tracking",
      // "Advanced integrations (Salesforce, Jira, etc.)",
      // "API access for custom integrations",
      // "Dedicated account manager",
      // "24/7 priority support",
      // "Custom onboarding and training",
    ],
    featureHeading: "Everything in Plus +",
    featured: false,
    price: (isAnnual) => (isAnnual ? "$15" : "$18"),
    period: "per seat/month",
    cta: "Get started",
    businessHighlight: true,
    priceId: {
      month: "pri_01j8wqqssqgy137net5xa76djm",
      year: "pri_01j8wqrmqq2s336f4ehjwpxzqj",
    },
    price1: (
      <>
        $15 per member / month <br /> billed annually
      </>
    ),
    price2: "$18 billed monthly",
  },
];
