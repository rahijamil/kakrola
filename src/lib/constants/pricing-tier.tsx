enum ProductId {
  PLUS = "pro_01j8wqee2kcdsxsezwdpk22rc5",
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
  cta: "Start 7-day trial" | "Contact sales";
  highlighted?: boolean;
  priceId: string;
  badge?: string;
  idealFor?: string;
}

export const pricingTiersForFure: Tier[] = [
  {
    name: "Plus",
    id: "plus",
    product_id: ProductId.PLUS,
    icon: "/icons/price-tiers/plus.svg",
    description: "The complete workspace that grows with your team",
    idealFor: "Perfect for teams of 5-100 looking to centralize their work",
    features: [
      "Project Management",
      "• Unlimited projects and tasks",
      "• Multiple views (List, Board, Dashboard)",
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
    featured: false,
    price: "$10",
    period: "per member/month",
    cta: "Start 7-day trial",
    priceId: "pri_01j8wqntqppsyw4ce6z65yc9ry",
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
    featured: true,
    price: "$15",
    period: "per member/month",
    cta: "Start 7-day trial",
    badge: "Most popular",
    priceId: "pri_01j8wqrmqq2s336f4ehjwpxzqj",
  },
];

export const pricingTiers: Tier[] = [
  {
    name: "Plus",
    id: "plus",
    product_id: ProductId.PLUS,
    icon: "/icons/price-tiers/plus.svg",
    description: "Essential workspace tools for growing teams",
    idealFor: "Perfect for teams of 2-20 looking to streamline their work",
    features: [
      "Project Management",
      "• Unlimited projects and tasks",
      "• List Board, Dashboard views",
      "• Basic task fields and priorities",
      "• Due dates and reminder",
      "• Subtasks, assignees, labels",
      "• Project templates",

      "Document Basics",
      "• Block page editor",
      "• Headings, Lists, Toggle Lists, Tables, Columns, etc",
      "• Real-time collaboration",
      "• Basic page organization",
      "• Starter templates",

      "Team Communication",
      "• Public channels",
      "• Direct messages",
      "• Thread discussions",
      "• Emoji reactions",

      "General Features",
      "• Up to 20 team members",
      "• 5 GB storage per workspace",
      "• Email support",
    ],
    featured: true,
    badge: "Most popular",
    price: "$8",
    period: "per member/month",
    cta: "Start 7-day trial",
    priceId: "pri_01j8wqntqppsyw4ce6z65yc9ry",
  },
];
