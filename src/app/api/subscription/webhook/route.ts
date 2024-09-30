import { NextRequest } from "next/server";
import { ProcessWebhook } from "@/utils/paddle/process-webhook";
import { getPaddleInstance } from "@/utils/paddle/get-paddle-instance";
import { createClient } from "@/utils/supabase/server";

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature") || "";
  const rawRequestBody = await request.text();
  const privateKey = process.env["PADDLE_NOTIFICATION_WEBHOOK_SECRET"] || "";

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  let status, eventName;
  try {
    if (!user) {
      status = 401;
      console.log("Unauthorized");
      return Response.json({ status, eventName });
    }

    if (signature && rawRequestBody) {
      const paddle = getPaddleInstance();
      const eventData = paddle.webhooks.unmarshal(
        rawRequestBody,
        privateKey,
        signature
      );
      status = 200;
      eventName = eventData?.eventType ?? "Unknown event";
      if (eventData) {
        await webhookProcessor.processEvent(eventData, user.id);
      }
    } else {
      status = 400;
      console.log("Missing signature from header");
    }
  } catch (e) {
    // Handle error
    status = 500;
    console.log(e);
  }
  return Response.json({ status, eventName });
}
