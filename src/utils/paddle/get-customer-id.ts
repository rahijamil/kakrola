import { createClient } from "@/utils/supabase/server";

export async function getCustomerId() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user?.id) {
    const customersData = await supabase
      .from("subscriptions")
      .select("customer_id")
      .eq("customer_profile_id", user.data.user.id)
      .single();
    if (customersData?.data?.customer_id) {
      return customersData?.data?.customer_id as string;
    }
  }
  return "";
}
