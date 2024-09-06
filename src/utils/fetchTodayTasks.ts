import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";

// Function to fetch tasks due today
export const fetchTodayTasks = async (profile_id: ProfileType['id']) => {
  const { data, error } = await supabaseBrowser
    .from("tasks")
    .select("*")
    .eq('profile_id', profile_id)
    .eq("dates->end_date", new Date().toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching today's tasks:", error.message);
    return [];
  }

  return data;
};
