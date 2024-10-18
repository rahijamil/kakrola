export interface Subscription {
  id: number;
  created_at?: string;
  subscription_id: string;
  subscription_status: string;
  price_id: string;
  product_id: string;
  scheduled_change: string | undefined;
  customer_id: string;
  customer_profile_id: string;
  seats: number;
}

enum SubscriptionPlan {
  FREE = "FREE",
  PLUS = "PLUS",
  BUSINESS = "BUSINESS",
}

enum SubscriptionPermission {}

// Define role permissions
const PlanPermission: Record<SubscriptionPlan, SubscriptionPermission[]> = {
  [SubscriptionPlan.FREE]: [],
  [SubscriptionPlan.PLUS]: [],
  [SubscriptionPlan.BUSINESS]: [],
};
