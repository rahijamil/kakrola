import { Calendar, Sun, Armchair } from "lucide-react";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isToday,
  isTomorrow,
  startOfWeek,
} from "date-fns";

export const getDateInfo = (dateString: string | null) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  const today = new Date();

  // Calculate the upcoming Sunday
  const upcomingSunday = addDays(startOfWeek(today, { weekStartsOn: 0 }), 6);

  if (isToday(date)) {
    return {
      label: "Today",
      icon: <Calendar strokeWidth={1.5} className="w-4 h-4 text-green-600" />,
      color: "text-green-600",
    };
  } else if (isTomorrow(date)) {
    return {
      label: "Tomorrow",
      icon: <Sun strokeWidth={1.5} className="w-4 h-4 text-orange-600" />,
      color: "text-orange-600",
    };
  } else if (date.getTime() === upcomingSunday.getTime()) {
    return {
      label: "This weekend",
      icon: <Armchair strokeWidth={1.5} className="w-4 h-4 text-purple-600" />,
      color: "text-purple-600",
    };
  }
  // Check if the date is within this week (excluding today, tomorrow, and weekend)
  else if (differenceInCalendarDays(date, new Date()) <= 7) {
    return {
      label: format(date, "EEEE"), // "EEEE" gives the full day name (e.g., "Monday")
      icon: <Calendar strokeWidth={1.5} className="w-4 h-4 text-indigo-600" />,
      color: "text-indigo-600",
    };
  } else {
    return {
      label: format(date, "d MMM"),
      icon: <Calendar strokeWidth={1.5} className="w-4 h-4 text-gray-600" />,
      color: "text-gray-600",
    };
  }
};
