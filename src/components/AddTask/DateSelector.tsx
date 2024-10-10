import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { TaskType } from "@/types/project";
import {
  ArrowRight,
  Calendar,
  CalendarRange,
  ChevronDown,
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
  isBefore,
  isEqual,
  formatISO,
} from "date-fns";
import { Input } from "../ui/input";
import MonthCalendar from "../ui/MonthCalendar";
import Dropdown from "../ui/Dropdown";
import CustomSelect from "../ui/CustomSelect";
import { ToggleSwitch } from "../ui/ToggleSwitch";

// all time options from 12:00am to 11:30pm
const timeOptions = Array.from({ length: 24 }).map((_, i) => {
  const hour = i % 12 || 12;
  const minute = (i % 2) * 30;
  return `${hour < 10 ? "0" : ""}${hour}:${minute ? "30" : "00"}${
    i >= 12 ? " PM" : " AM"
  }`;
});

const reminderOptions = [
  {
    value: "none",
    label: "None",
  },
  {
    value: "0", // At end date
    label: "At time of end date",
  },
  {
    value: "5", // 5 minutes before
    label: "5 Minutes before",
  },
  {
    value: "10", // 10 minutes before
    label: "10 Minutes before",
  },
  {
    value: "15", // 15 minutes before
    label: "15 Minutes before",
  },
  {
    value: "30", // 30 minutes before
    label: "30 Minutes before",
  },
  {
    value: "60", // 1 hour before
    label: "1 Hour before",
  },
  {
    value: "120", // 2 hours before
    label: "2 Hours before",
  },
  {
    value: "1440", // 1 day before
    label: "1 Day before",
  },
  {
    value: "2880", // 2 days before
    label: "2 Days before",
  },
];

const DateSelector = ({
  task,
  setTask,
  isSmall,
  forTaskModal,
  forListView,
  dataFromElement,
  endDate,
}: {
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
  forTaskModal?: boolean;
  forListView?: boolean;
  dataFromElement?: boolean;
  endDate?: Date | null;
}) => {
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showEndDate, setShowEndDate] = useState(
    task.dates.end_date ? true : false
  );
  const [focusedInput, setFocusedInput] = useState<"start" | "end">("start");

  const [dates, setDates] = useState<TaskType["dates"]>({
    start_date:
      task.dates.start_date ||
      formatISO(new Date(), { representation: "date" }),
    start_time: task.dates.start_time || null,
    end_date: task.dates.end_date || null,
    end_time: task.dates.end_time || null,
    reminder: task.dates.reminder || null,
  });

  const [initialRender, setInitialRender] = useState<boolean>(true);

  const today = startOfDay(new Date());
  // const initialDate = task.dates.end_date
  //   ? new Date(task.dates.end_date)
  //   : today;

  const [months, setMonths] = useState<Date[]>([
    startOfMonth(today),
    ...Array.from({ length: 11 }, (_, i) =>
      addMonths(startOfMonth(today), i + 1)
    ),
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endDate) {
      setTask((prev) => ({
        ...prev,
        dates: {
          ...prev.dates,
          start_date: formatISO(new Date(), { representation: "date" }),
          end_date: formatISO(endDate, { representation: "date" }),
        },
      }));

      setDates((prev) => ({
        ...prev,
        start_date: formatISO(new Date(), { representation: "date" }),
        end_date: formatISO(endDate, { representation: "date" }),
      }));

      setShowEndDate(true);
    }
  }, [endDate]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    const formattedDate = formatISO(newDate, { representation: "date" });
    let newStartDate = dates.start_date;
    let newEndDate = dates.end_date;

    if (focusedInput === "start") {
      if (
        !dates.end_date ||
        isBefore(newDate, new Date(dates.end_date)) ||
        isEqual(newDate, new Date(dates.end_date))
      ) {
        newStartDate = formattedDate;
      } else {
        // If new start date is after end date, swap them
        newStartDate = dates.end_date;
        newEndDate = formattedDate;
      }
    } else {
      // end date
      if (
        !dates.start_date ||
        isBefore(new Date(dates.start_date), newDate) ||
        isEqual(new Date(dates.start_date), newDate)
      ) {
        newEndDate = formattedDate;
      } else {
        // If new end date is before start date, swap them
        newEndDate = dates.start_date;
        newStartDate = formattedDate;
      }
    }

    setDates((prev) => ({
      ...prev,
      start_date: newStartDate,
      end_date: newEndDate,
    }));

    setTask((prevTask) => ({
      ...prevTask,
      dates: {
        ...prevTask.dates,
        start_date: newStartDate,
        end_date: newEndDate,
      },
    }));

    // Update focus to the other input after selection
    if (focusedInput === "start" && showEndDate) {
      setFocusedInput("end");
      endInputRef.current?.focus();
    } else {
      setFocusedInput("start");
      startInputRef.current?.focus();
    }
  };

  const handleTimeSelect = (time: string, timeType: "start" | "end") => {
    if (timeType === "start") {
      setDates((prev) => ({
        ...prev,
        start_time: time,
      }));

      setTask((prevTask) => ({
        ...prevTask,
        dates: {
          ...prevTask.dates,
          start_time: time,
        },
      }));
    } else {
      setDates((prev) => ({
        ...prev,
        end_time: time,
      }));

      setTask((prevTask) => ({
        ...prevTask,
        dates: {
          ...prevTask.dates,
          end_time: time,
        },
      }));
    }
  };

  const handleReminderSelect = (value: string) => {
    setDates((prev) => ({
      ...prev,
      reminder: value,
    }));
    setTask((prevTask) => ({
      ...prevTask,
      dates: {
        ...prevTask.dates,
        reminder_datetime: value !== "none" ? value : null,
      },
    }));
  };

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
    if (scrollRef.current && dates.end_date) {
      const monthIndex = months.findIndex(
        (month) =>
          month.getFullYear() === new Date(dates.end_date!).getFullYear() &&
          month.getMonth() === new Date(dates.end_date!).getMonth()
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
  }, [dates.end_date, months, initialRender]);

  const triggerRef = useRef(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const getInitialEndDate = () => {
    if (!dates.start_date) return null;

    setDates((prev) => ({
      ...prev,
      end_date: dates.start_date,
    }));

    return new Date(dates.start_date);
  };

  useEffect(() => {
    if (showEndDate) {
      endInputRef.current?.focus();
    } else {
      startInputRef.current?.focus();
    }
  }, [showEndDate]);

  return (
    <Dropdown
      title="Dates"
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) =>
        forTaskModal ? (
          <div
            onClick={onClick}
            className={`rounded-lg transition py-2 px-4 group w-full flex items-center justify-between  ${
              isOpen
                ? "bg-primary-50 cursor-pointer"
                : "hover:bg-text-100 cursor-pointer"
            }`}
          >
            <button
              ref={triggerRef}
              className={`flex items-center justify-between`}
            >
              {task.dates.start_date || task.dates.end_date ? (
                <>
                  <div className="flex items-center gap-1">
                    {task.dates.start_date && (
                      <span>{format(task.dates.start_date, "dd LLL")}</span>
                    )}

                    {task.dates.start_date && task.dates.end_date && (
                      <div>-</div>
                    )}

                    {task.dates.end_date && (
                      <span>{format(task.dates.end_date, "dd LLL")}</span>
                    )}
                  </div>

                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setTask({
                        ...task,
                        dates: {
                          start_date: null,
                          start_time: null,
                          end_date: null,
                          end_time: null,
                          reminder: null,
                        },
                      });
                    }}
                    className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-100 rounded-lg hidden group-data-[state=due-date]:group-hover:inline-block absolute top-1/2 -translate-y-1/2 right-2"
                  >
                    <X strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                  </button>
                </>
              ) : (
                <span className="text-text-500">No dates</span>
              )}
            </button>

            <ChevronDown
              strokeWidth={1.5}
              className={`w-4 h-4 transition text-text-500 ${
                !isOpen && "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
        ) : forListView ? (
          <div
            ref={triggerRef}
            data-form-element={dataFromElement}
            data-state="due-date"
            className={`flex items-center justify-between gap-1 cursor-pointer h-10 px-2 w-full text-xs group relative ring-1 ${
              isOpen
                ? "ring-primary-300 bg-primary-10"
                : "hover:ring-primary-300 ring-transparent"
            }`}
            onClick={onClick}
          >
            {task.dates.start_date || task.dates.end_date ? (
              <>
                <div className="flex items-center gap-1">
                  {task.dates.start_date && (
                    <span>{format(task.dates.start_date, "dd LLL")}</span>
                  )}

                  {task.dates.start_date && task.dates.end_date && <div>-</div>}

                  {task.dates.end_date && (
                    <span>{format(task.dates.end_date, "dd LLL")}</span>
                  )}
                </div>

                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTask({
                      ...task,
                      dates: {
                        start_date: null,
                        start_time: null,
                        end_date: null,
                        end_time: null,
                        reminder: null,
                      },
                    });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-100 rounded-lg hidden group-data-[state=due-date]:group-hover:inline-block absolute top-1/2 -translate-y-1/2 right-2"
                >
                  <X strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <CalendarRange
                  strokeWidth={1.5}
                  className="w-4 h-4 text-text-500"
                />
                {/* {!isSmall && <span className="text-text-700">Dates</span>} */}
              </div>
            )}
          </div>
        ) : (
          <div
            ref={triggerRef}
            className={`flex items-center gap-1 cursor-pointer p-1 px-1.5 text-[11px] rounded-lg border border-text-100 text-text-600 ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            {task.dates.start_date || task.dates.end_date ? (
              <>
                <div className="flex items-center gap-1">
                  {task.dates.start_date && (
                    <span>{format(task.dates.start_date, "dd LLL")}</span>
                  )}

                  {task.dates.start_date && task.dates.end_date && (
                    <span>-</span>
                  )}

                  {task.dates.end_date && (
                    <span>{format(task.dates.end_date, "dd LLL")}</span>
                  )}
                </div>

                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTask({
                      ...task,
                      dates: {
                        start_date: null,
                        start_time: null,
                        end_date: null,
                        end_time: null,
                        reminder: null,
                      },
                    });
                  }}
                  className="text-text-500 hover:text-text-900 p-[2px] hover:bg-text-100 rounded-lg"
                >
                  <X strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                </button>
              </>
            ) : (
              <>
                <CalendarRange
                  strokeWidth={1.5}
                  className="w-4 h-4 text-text-500"
                />
                {!isSmall && <span className="text-text-500">Dates</span>}
              </>
            )}
          </div>
        )
      }
      content={
        <div data-form-element={dataFromElement} className="cursor-default">
          <div className="px-4 md:px-2 p-2 space-y-2 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-medium text-text-500">
                Start date
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 w-full">
                  <Input
                    type="text"
                    howBig="xs"
                    onFocus={() => setFocusedInput("start")}
                    value={dates.start_date || ""}
                    autoFocus={focusedInput === "start"}
                    ref={startInputRef}
                    className="flex-1 w-full"
                    readOnly
                    showFocusInMobile
                  />
                </div>

                {showTimeInput && (
                  <div className="w-full flex-1">
                    <CustomSelect
                      height="h-8"
                      id="start-time"
                      options={timeOptions.map((time) => ({
                        label: time,
                        value: time,
                      }))}
                      value={dates.start_time}
                      onChange={({ target: { value } }) => {
                        handleTimeSelect(value, "start");
                      }}
                      placeholder="Time"
                      showFocusInMobile
                    />
                  </div>
                )}
              </div>
            </div>

            {showEndDate && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-text-500">
                  End date
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 w-full">
                    <Input
                      type="text"
                      howBig="xs"
                      value={dates.end_date || ""}
                      onFocus={() => setFocusedInput("end")}
                      autoFocus={focusedInput === "end" || showEndDate}
                      ref={endInputRef}
                      readOnly
                      showFocusInMobile
                    />
                  </div>

                  {showTimeInput && (
                    <div className="w-full flex-1">
                      <CustomSelect
                        height="h-8"
                        id="end-time"
                        options={timeOptions.map((time) => ({
                          label: time,
                          value: time,
                        }))}
                        value={dates.end_time}
                        onChange={({ target: { value } }) => {
                          handleTimeSelect(value, "end");
                        }}
                        placeholder="Time"
                        showFocusInMobile
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-text-100 pt-1 grid grid-cols-7 gap-1 place-items-center mt-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-text-500 text-[11px]"
              >
                {day}
              </div>
            ))}
          </div>

          <div
            ref={scrollRef}
            className={`max-h-[280px] overflow-y-auto ${
              !initialRender && "scroll-smooth"
            }`}
            id="scrollable"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
          >
            {months.map((month, index) => (
              <div key={index}>
                <div className="border-b py-1 px-2 border-text-100 space-y-2 sticky top-0 bg-surface z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {format(month, "MMM yyyy")}
                    </span>
                  </div>
                </div>

                <MonthCalendar
                  key={month.toISOString()}
                  month={month}
                  startDate={
                    dates.start_date ? new Date(dates.start_date) : undefined
                  }
                  endDate={
                    showEndDate
                      ? dates.end_date
                        ? new Date(dates.end_date)
                        : dates.start_date
                        ? getInitialEndDate()
                        : null
                      : null
                  }
                  onSelect={(date) => {
                    handleDateSelect(date);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1 pb-4 md:pb-0">
            <div className="border-y border-text-100 py-1">
              <CustomSelect
                options={reminderOptions}
                onChange={({ target: { value } }) => {
                  handleReminderSelect(value);
                }}
                forListView
                id="reminder"
                height="h-8"
                placeholder="Set end date reminder"
                value={dates.reminder ? dates.reminder : "none"}
              />
            </div>

            <button
              className="flex items-center justify-between w-full px-4 py-2.5 md:py-1.5 hover:bg-text-100 transition md:rounded-lg"
              type="button"
              onClick={() => setShowEndDate((prev) => !prev)}
            >
              <span className="text-text-500">End date</span>

              <ToggleSwitch
                checked={showEndDate}
                onCheckedChange={(value) => setShowEndDate((prev) => !prev)}
                size="sm"
              />
            </button>

            <button
              className="flex items-center justify-between w-full px-4 py-2.5 md:py-1.5 hover:bg-text-100 transition md:rounded-lg"
              type="button"
              onClick={() => setShowTimeInput((prev) => !prev)}
            >
              <span className="text-text-500">Include time</span>

              <ToggleSwitch
                checked={showTimeInput}
                onCheckedChange={(value) => setShowTimeInput((prev) => !prev)}
                size="sm"
              />
            </button>
          </div>
        </div>
      }
      contentWidthClass={`w-72 pb-1`}
    />
  );
};

export default DateSelector;
