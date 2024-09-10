import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useRef } from "react";

const MonthCalendar = ({
  month,
  selected,
  onSelect,
  startDate,
  endDate,
}: {
  month: Date;
  selected?: Date | null;
  onSelect: (date: Date) => void;
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  // Get the first day of the calendar grid (may include days from the previous month)
  const calendarStart = startOfWeek(monthStart);

  // Generate all the days to display in the calendar, including the leading and trailing days from adjacent months
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: addDays(monthEnd, 6 - getDay(monthEnd)),
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  const handleSelect = (day: Date) => {
    onSelect(day);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop click events from bubbling up
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop touch events from bubbling up
  };

  // Function to determine the class for each day
  const getDayClass = (day: Date) => {
    if (startDate) {
      if (isSameDay(day, startDate)) return "bg-primary-500 text-surface";
      if (endDate && isSameDay(day, endDate))
        return "bg-primary-500 text-surface";
      if (endDate && day > startDate && day < endDate) return "bg-primary-200";
    }

    if (isSameDay(day, selected!)) return "bg-primary-500 text-surface";

    return "";
  };

  return (
    <div
      className="p-2"
      ref={calendarRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="grid grid-cols-7 place-items-center gap-1">
        {calendarDays.map((day, index) => {
          // Check if the day belongs to the current month
          const isCurrentMonth = isSameMonth(day, month);
          const today = isToday(day);

          // Determine the base class based on the day
          const baseDayClass = getDayClass(day);

          // Final class determination for today
          const todayClass = today
            ? baseDayClass
              ? baseDayClass
              : "bg-red-500 text-surface"
            : baseDayClass;

          return (
            <div key={index} className="w-7 h-7">
              {isCurrentMonth ? (
                <button
                  type="button"
                  className={`w-full h-full rounded-lg flex items-center justify-center ring-1 ring-transparent hover:ring-primary-300 transition ${todayClass}`}
                  onClick={() => handleSelect(day)}
                >
                  <span className="text-xs">{format(day, "d")}</span>
                </button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
