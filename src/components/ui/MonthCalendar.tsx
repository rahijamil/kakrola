import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const MonthCalendar = ({
  month,
  selected,
  onSelect,
}: {
  month: Date;
  selected?: Date;
  onSelect: (date: Date) => void;
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

  return (
    <div className="p-2">
      {/* <div className="font-semibold mb-2 pb-2 border-b border-gray-200 text-xs">
        {format(month, "MMM")}
      </div> */}
      <div className="grid grid-cols-7 place-items-center gap-1">
        {calendarDays.map((day, index) => {
          // Check if the day belongs to the current month
          const isCurrentMonth = isSameMonth(day, month);

          return (
            <div key={index} className="w-7 h-7">
              {isCurrentMonth ? (
                <button
                  type="button"
                  onClick={() => onSelect(day)}
                  className={`rounded-full text-xs w-7 h-7 ${
                    selected && isSameDay(day, selected)
                      ? "bg-indigo-500 text-white"
                      : "hover:bg-indigo-50"
                  }`}
                >
                  {format(day, "d")}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`rounded-full text-xs w-7 h-7 opacity-40`}
                >
                  {format(day, "d")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
