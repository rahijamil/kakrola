import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { formatISO } from "date-fns";

// Function to fetch tasks due today
export const fetchTodayTasks = async (profile_id: ProfileType["id"]) => {
  const today = JSON.stringify(
    formatISO(new Date(), { representation: "date" })
  );

  const { data, error } = await supabaseBrowser
    .from("tasks")
    .select("*")
    .filter("assignees", "cs", JSON.stringify([{ profile_id }]))
    .filter("dates->start_date", "lte", today)
    .filter("dates->end_date", "gte", today)
    // .or(
    //   `dates->end_date.lte.${today},` +
    //     `dates->start_date.gte.${today},` +
    //     `dates->end_date.gte.${today},` +
    //     `dates->start_date.lte.${today}`
    // )
    .order("dates->end_date", { ascending: true });

  if (error) {
    console.error("Error fetching today's tasks:", error);
    return [];
  }

  return data;
};
