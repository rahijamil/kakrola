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
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
    }
  }

  private async updateSubscriptionData(
    eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent
  ) {
    try {
      const supabase = createClient();

      if ((eventData.data.customData as any).profile_id) {
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
          // if the subscription is not found, create a new one
          if (error.code === "PGRST116") {
            const response = await supabase
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

            console.log({ response });
          }
        }

        console.log({ data });

        console.log({ customData: eventData.data.customData });
      }
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
