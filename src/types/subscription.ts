import { WorkspaceType } from "./workspace";

export interface Subscription {
  id: number | string;
  created_at?: string;
  subscription_id: string;
  subscription_status: string;
  price_id: string;
  product_id: string;
  scheduled_change: string | undefined;
  customer_id: string;
  customer_profile_id: string;
  seats: number;
  workspace_id: WorkspaceType["id"];
}

enum SubscriptionPlan {
  PLUS = "PLUS",
  BUSINESS = "BUSINESS",
}

enum SubscriptionPermission {}

const PlanPermission: Record<SubscriptionPlan, SubscriptionPermission[]> = {
  [SubscriptionPlan.PLUS]: [
    // SubscriptionPermission.CREATE_PROJECTS,
    // SubscriptionPermission.INVITE_MEMBERS,
  ],
  [SubscriptionPlan.BUSINESS]: [
    // SubscriptionPermission.CREATE_PROJECTS,
    // SubscriptionPermission.INVITE_MEMBERS,
    // SubscriptionPermission.ACCESS_ADVANCED_FEATURES,
  ],
};
