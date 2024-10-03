import { TaskType } from "@/types/project";
import { supabaseBrowser } from "./supabase/client";

export const fetchTodayUpcomingTasks = async (
  profile_id: string
): Promise<{ today: TaskType[]; upcoming: TaskType[] }> => {
  const { data, error } = await supabaseBrowser.rpc(
    "fetch_today_upcoming_tasks",
    {
      _profile_id: profile_id,
    }
  );

  if (error) {
    console.error("Error fetching tasks:", error);
    return { today: [], upcoming: [] };
  }

  console.log(data);

  return { today: data.today, upcoming: data.upcoming };
};
