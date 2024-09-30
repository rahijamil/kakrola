import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import { createClient } from "@/utils/supabase/server";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    console.log("Processing event:", eventData.eventType);
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
      default:
        console.log("Unhandled event type:", eventData.eventType);
    }
  }

  private async updateSubscriptionData(
    eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent
  ) {
    console.log("Updating subscription data:", eventData.data.id);
    try {
      const supabase = createClient();

      if ((eventData.data.customData as any).profile_id) {
        console.log(
          "Profile ID found:",
          (eventData.data.customData as any).profile_id
        );
        const { data, error } = await supabase
          .from("subscriptions")
          .update({
            subscription_id: eventData.data.id,
            subscription_status: eventData.data.status,
            price_id: eventData.data.items[0].price?.id ?? "",
            product_id: eventData.data.items[0].price?.productId ?? "",
            scheduled_change: eventData.data.scheduledChange?.effectiveAt,
            customer_id: eventData.data.customerId,
            customer_profile_id: (eventData.data.customData as any).profile_id,
          })
          .eq("subscription_id", eventData.data.id)
          .select();

        if (error) {
          console.error("Error updating subscription:", error);

          console.log("Attempting to insert new subscription");
          const { data: insertData, error: insertError } = await supabase
            .from("subscriptions")
            .insert({
              subscription_id: eventData.data.id,
              subscription_status: eventData.data.status,
              price_id: eventData.data.items[0].price?.id ?? "",
              product_id: eventData.data.items[0].price?.productId ?? "",
              scheduled_change: eventData.data.scheduledChange?.effectiveAt,
              customer_id: eventData.data.customerId,
              customer_profile_id: (eventData.data.customData as any)
                .profile_id,
            })
            .select();

          if (insertError) {
            console.error("Error inserting subscription:", insertError);
          } else {
            console.log("Successfully inserted subscription:", insertData);
          }
        } else {
          console.log("Successfully updated subscription:", data);
        }
      } else {
        console.error("No profile_id found in customData");
        throw new Error("No profile_id found in customData");
      }
    } catch (e) {
      console.error("Error in updateSubscriptionData:", e);
    }
  }

  private async updateCustomerData(
    eventData: CustomerCreatedEvent | CustomerUpdatedEvent
  ) {
    console.log("Updating customer data:", eventData.data.id);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }

      if (!user) {
        console.error("User not found");
        throw new Error("User not found");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          customer_id: eventData.data.id,
        })
        .eq("id", user.id)
        .select();

      if (error) {
        console.error("Error updating customer data:", error);
      } else {
        console.log("Successfully updated customer data:", data);
      }
    } catch (e) {
      console.error("Error in updateCustomerData:", e);
    }
  }
}
