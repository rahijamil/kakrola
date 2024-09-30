import { createClient } from "@/utils/supabase/server";

export async function getCustomerId() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user?.id) {
    const customersData = await supabase
      .from("profiles")
      .select("customer_id,email")
      .eq("id", user.data.user.id)
      .single();
    if (customersData?.data?.customer_id) {
      return customersData?.data?.customer_id as string;
    }
  }
  return "";
}
