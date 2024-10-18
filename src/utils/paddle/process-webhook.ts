import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import { createClient } from "@/utils/supabase/server";
import { Subscription } from "@/types/subscription";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    console.log("Processing event:", eventData.eventType);
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        await this.handleSubscriptionCreated(
          eventData as SubscriptionCreatedEvent
        );
        break;
      case EventName.SubscriptionUpdated:
        await this.handleSubscriptionUpdated(
          eventData as SubscriptionUpdatedEvent
        );
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
      default:
        console.log("Unhandled event type:", eventData.eventType);
    }
  }

  private async handleSubscriptionCreated(eventData: SubscriptionCreatedEvent) {
    console.log("Handling subscription created:", eventData.data.id);
    try {
      const supabase = createClient();

      if ((eventData.data.customData as any).profile_id) {
        console.log(
          "Profile ID found:",
          (eventData.data.customData as any).profile_id
        );

        const subscriptionData: Omit<Subscription, "id"> = {
          subscription_id: eventData.data.id,
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? "",
          product_id: eventData.data.items[0].price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt,
          customer_id: eventData.data.customerId,
          customer_profile_id: (eventData.data.customData as any).profile_id,
          seats: eventData.data.items[0].quantity,
        };

        const { data, error } = await supabase
          .from("subscriptions")
          .insert(subscriptionData)
          .select();

        if (error) {
          console.error("Error inserting subscription:", error);
        } else {
          console.log("Successfully inserted subscription:", data);
        }
      } else {
        console.error("No profile_id found in customData");
        throw new Error("No profile_id found in customData");
      }
    } catch (e) {
      console.error("Error in handleSubscriptionCreated:", e);
    }
  }

  private async handleSubscriptionUpdated(eventData: SubscriptionUpdatedEvent) {
    console.log("Handling subscription updated:", eventData.data.id);
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
            subscription_status: eventData.data.status,
            price_id: eventData.data.items[0].price?.id ?? "",
            product_id: eventData.data.items[0].price?.productId ?? "",
            scheduled_change: eventData.data.scheduledChange?.effectiveAt,
            customer_id: eventData.data.customerId,
          })
          .eq("subscription_id", eventData.data.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating subscription:", error);
        } else {
          console.log("Successfully updated subscription:", data);
        }
      } else {
        console.error("No profile_id found in customData");
        throw new Error("No profile_id found in customData");
      }
    } catch (e) {
      console.error("Error in handleSubscriptionUpdated:", e);
    }
  }

  private async updateCustomerData(
    eventData: CustomerCreatedEvent | CustomerUpdatedEvent
  ) {
    console.log("Updating customer data:", eventData.data.id);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          customer_id: eventData.data.id,
        })
        .eq(
          "customer_profile_id",
          (eventData.data.customData as any).profile_id
        )
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
