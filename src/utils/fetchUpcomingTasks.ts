import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { formatISO } from "date-fns";

export const fetchUpcomingTasks = async (profile_id: ProfileType["id"]) => {
  const today = JSON.stringify(
    formatISO(new Date(), { representation: "date" })
  );

  const { data, error } = await supabaseBrowser
    .from("tasks")
    .select("*")
    .filter("assignees", "cs", JSON.stringify([{ profile_id }]))
    .filter("dates->start_date", "gt", today)
    .order("dates->start_date", { ascending: true });

  if (error) {
    console.error("Error fetching upcoming tasks:", error);
    return [];
  }

  return data;
};
