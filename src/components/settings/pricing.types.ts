import { ReactNode } from "react";

export type PricingPlanForSettings = {
    id: "free" | "pro" | "business";
    name: string;
    price: (isAnnual: boolean) => string;
    price1: ReactNode;
    description: string;
    features: string[];
    highlighted?: boolean;
    price2?: string;
    cta?: string;
    badge?: string;
    businessHighlight?: boolean;
    priceId: Record<string, string>;
  };