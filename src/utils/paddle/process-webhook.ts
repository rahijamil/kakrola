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

    try {
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
          console.warn("Unhandled event type:", eventData.eventType);
      }
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }

  private async handleSubscriptionCreated(eventData: SubscriptionCreatedEvent) {
    console.log("Handling subscription created:", eventData.data.id);

    const supabase = createClient();
    const profileId = (eventData.data.customData as any)?.profile_id;
    const workspaceId = (eventData.data.customData as any)?.workspace_id;

    if (!profileId || !workspaceId) {
      console.error("Missing profile_id or workspace_id in customData");
      return;
    }

    const subscriptionData: Omit<Subscription, "id"> = {
      subscription_id: eventData.data.id,
      subscription_status: eventData.data.status,
      price_id: eventData.data.items[0]?.price?.id ?? "",
      product_id: eventData.data.items[0]?.price?.productId ?? "",
      scheduled_change: eventData.data.scheduledChange?.effectiveAt,
      customer_id: eventData.data.customerId,
      customer_profile_id: profileId,
      seats: eventData.data.items[0]?.quantity ?? 1,
      workspace_id: workspaceId,
    };

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert(subscriptionData)
        .select("id")
        .single();

      if (error) {
        throw new Error(`Error inserting subscription: ${error.message}`);
      }

      console.log("Subscription created with ID:", data.id);

    } catch (error) {
      console.error("Error in handleSubscriptionCreated:", error);
    }
  }

  private async handleSubscriptionUpdated(eventData: SubscriptionUpdatedEvent) {
    console.log("Handling subscription updated:", eventData.data.id);

    const supabase = createClient();
    const profileId = (eventData.data.customData as any)?.profile_id;

    if (!profileId) {
      console.error("No profile_id found in customData");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0]?.price?.id ?? "",
          product_id: eventData.data.items[0]?.price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt,
          customer_id: eventData.data.customerId,
        })
        .eq("subscription_id", eventData.data.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating subscription: ${error.message}`);
      }

      console.log("Subscription updated successfully:", data);
    } catch (error) {
      console.error("Error in handleSubscriptionUpdated:", error);
    }
  }

  private async updateCustomerData(
    eventData: CustomerCreatedEvent | CustomerUpdatedEvent
  ) {
    console.log("Updating customer data:", eventData.data.id);

    const supabase = createClient();
    const profileId = (eventData.data.customData as any)?.profile_id;

    if (!profileId) {
      console.error("No profile_id found in customData");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          customer_id: eventData.data.id,
        })
        .eq("customer_profile_id", profileId)
        .select();

      if (error) {
        throw new Error(`Error updating customer data: ${error.message}`);
      }

      console.log("Customer data updated successfully:", data);
    } catch (error) {
      console.error("Error in updateCustomerData:", error);
    }
  }
}
