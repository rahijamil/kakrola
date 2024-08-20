import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  LegacyRef,
} from "react";
import { TaskType } from "@/types/project";
import {
  Armchair,
  Calendar,
  CalendarArrowDown,
  CircleSlash,
  Sun,
  X,
} from "lucide-react";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  startOfDay,
  isWeekend,
} from "date-fns";
import { Input } from "../ui/input";
import MonthCalendar from "../ui/MonthCalendar";
import Dropdown from "../ui/Dropdown";
import { getDateInfo } from "@/utils/getDateInfo";

const DueDateSelector = ({
  task,
  setTask,
  isSmall,
}: {
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
}) => {
  const [date, setDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );

  const [initialRender, setInitialRender] = useState<boolean>(true);

  const today = startOfDay(new Date());
  const initialDate = task.due_date ? new Date(task.due_date) : today;

  const [months, setMonths] = useState<Date[]>([
    startOfMonth(today),
    ...Array.from({ length: 11 }, (_, i) =>
      addMonths(startOfMonth(today), i + 1)
    ),
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setTask((prevTask) => ({
      ...prevTask,
      due_date: newDate ? newDate.toISOString() : null,
    }));

    onClose();
  };

  const predefinedDates = [
    {
      label: "Today",
      date: today,
      icon: <Calendar strokeWidth={1.5} className="w-4 h-4 text-green-600" />,
    },
    {
      label: "Tomorrow",
      date: addDays(today, 1),
      icon: <Sun strokeWidth={1.5} className="w-4 h-4 text-orange-600" />,
    },
    {
      label: `This Weekend`,
      date: isWeekend(today) ? today : addDays(today, (6 - today.getDay()) % 7),
      icon: <Armchair strokeWidth={1.5} className="w-4 h-4 text-purple-600" />,
    },
    {
      label: `Next Week`,
      date: addWeeks(today, 1),
      icon: (
        <CalendarArrowDown
          strokeWidth={1.5}
          className="w-4 h-4 text-indigo-600"
        />
      ),
    },
    {
      label: "No Date",
      date: undefined,
      icon: <CircleSlash strokeWidth={1.5} className="w-4 h-4 text-gray-600" />,
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (atBottom) {
        setMonths((prevMonths) => [
          ...prevMonths,
          addMonths(prevMonths[prevMonths.length - 1], 1),
        ]);
      }
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current && date) {
      const monthIndex = months.findIndex(
        (month) =>
          month.getFullYear() === date.getFullYear() &&
          month.getMonth() === date.getMonth()
      );

      if (monthIndex !== -1) {
        const monthElement = scrollRef.current.children[
          monthIndex
        ] as HTMLDivElement;

        if (monthElement) {
          if (initialRender) {
            // Scroll to selected date only on initial render
            scrollRef.current.scrollTop =
              monthElement.offsetTop - scrollRef.current.clientHeight / 2 - 30;
            setInitialRender(false); // Update flag after initial scroll
          }
        }
      }
    }
  }, [date, months, initialRender]);

  const dateInfo = getDateInfo(task.due_date);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ ref, onClick }) => (
        <div
          ref={ref as LegacyRef<HTMLDivElement>}
          className={`flex items-center gap-1 cursor-pointer p-1 text-xs rounded-lg border border-gray-200 ${
            isOpen ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={onClick}
        >
          {task.due_date ? (
            <>
              <div className="flex items-center gap-1">
                {dateInfo?.icon}
                <span className={dateInfo?.color}>{dateInfo?.label}</span>
              </div>

              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  setTask({ ...task, due_date: null });
                }}
                className="text-gray-500 hover:text-gray-700 p-[2px] hover:bg-gray-200 rounded-lg"
              >
                <X strokeWidth={1.5} className="w-3 h-3 text-gray-500" />
              </button>
            </>
          ) : (
            <>
              <Calendar strokeWidth={1.5} className="w-4 h-4 text-gray-500" />
              {!isSmall && <span className="text-gray-700">Due date</span>}
            </>
          )}
        </div>
      )}
      content={
        <div>
          <div className="p-2 border-b border-gray-200">
            <Input
              howBig="sm"
              type="text"
              placeholder="Type a due date"
              value={
                task.due_date ? format(new Date(task.due_date), "dd MMM") : ""
              }
              readOnly
              className="text-xs"
            />
          </div>

          <ul className="max-h-[250px] overflow-y-auto">
            {predefinedDates.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer text-xs"
                onClick={() => handleDateSelect(item.date)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.date && (
                  <span className="text-gray-500">
                    {format(item.date, "EEE")}{" "}
                    {item.label == "Next Week" &&
                      format(addWeeks(today, 1), "d MMM")}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div
            ref={scrollRef}
            className={`max-h-[300px] overflow-y-auto ${
              !initialRender && "scroll-smooth"
            }`}
            id="scrollable"
          >
            {months.map((month, index) => (
              <div key={index}>
                <div className="border-t border-b py-1 px-2 border-gray-200 space-y-2 sticky top-0 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {format(month, "MMM yyyy")}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 place-items-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center font-medium text-gray-500 text-[11px]"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <MonthCalendar
                  month={month}
                  selected={date}
                  onSelect={handleDateSelect}
                />
              </div>
            ))}
          </div>
        </div>
      }
      contentWidthClass={`w-[250px]`}
    />
  );
};

export default DueDateSelector;
