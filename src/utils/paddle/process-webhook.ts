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
  async processEvent(eventData: EventEntity, profile_id: string) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData, profile_id);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
    }
  }

  private async updateSubscriptionData(
    eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent,
    profile_id: string
  ) {
    try {
      const response = await createClient()
        .from("subscriptions")
        .upsert({
          subscription_id: eventData.data.id,
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? "",
          product_id: eventData.data.items[0].price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt,
          customer_id: eventData.data.customerId,
          customer_profile_id: profile_id,
        })
        .select();
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  private async updateCustomerData(
    eventData: CustomerCreatedEvent | CustomerUpdatedEvent
  ) {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        throw new Error("User not found");
      }

      const response = await supabase
        .from("profiles")
        .update({
          customer_id: eventData.data.id,
        })
        .eq("id", user.id)
        .select();
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }
}
