import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  LegacyRef,
  ReactNode,
} from "react";
import { TaskType } from "@/types/project";
import {
  Armchair,
  Calendar,
  CalendarArrowDown,
  CircleSlash,
  Plus,
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
import DueDateButton from "../TaskViewSwitcher/DueDateButton";

const DueDateSelector = ({
  task,
  setTask,
  isSmall,
  forTaskModal,
}: {
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
  forTaskModal?: boolean;
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
          className="w-4 h-4 text-primary-600"
        />
      ),
    },
    {
      label: "No Date",
      date: undefined,
      icon: <CircleSlash strokeWidth={1.5} className="w-4 h-4 text-text-600" />,
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

  const triggerRef = useRef(null);

  return (
    <Dropdown
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) =>
        forTaskModal ? (
          <div>
            <button
              onClick={() => task.due_date == null && setIsOpen(true)}
              className={`flex items-center justify-between rounded-lg transition p-[6px] px-2 group w-full ${
                task.due_date == null
                  ? isOpen
                    ? "bg-primary-100 cursor-pointer"
                    : "hover:bg-primary-100 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <p
                className={`font-semibold text-xs ${
                  task.due_date !== null && "cursor-text"
                }`}
              >
                Due date
              </p>

              {task.due_date == null && (
                <Plus strokeWidth={1.5} className="w-4 h-4" />
              )}
            </button>

            {task.due_date !== null && (
              <DueDateButton
                taskData={task}
                setTaskData={setTask}
                setShowDueDateSelector={setIsOpen}
                showDueDateSelector={isOpen}
              />
            )}
          </div>
        ) : (
          <div
            ref={triggerRef}
            className={`flex items-center gap-1 cursor-pointer p-1 text-xs rounded-lg border border-text-200 ${
              isOpen ? "bg-text-50" : "hover:bg-primary-50"
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
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-primary-50 rounded-lg"
                >
                  <X strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                </button>
              </>
            ) : (
              <>
                <Calendar strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                {!isSmall && <span className="text-text-700">Due date</span>}
              </>
            )}
          </div>
        )
      }
      content={
        <div>
          <div className="p-2 border-b border-text-200">
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
                className="flex items-center justify-between p-2 hover:bg-primary-50 cursor-pointer text-xs"
                onClick={() => handleDateSelect(item.date)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.date && (
                  <span className="text-text-500">
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
                <div className="border-t border-b py-1 px-2 border-text-200 space-y-2 sticky top-0 bg-surface">
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
                          className="text-center font-medium text-text-500 text-[11px]"
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
