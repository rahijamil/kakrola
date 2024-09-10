import React, { useState, useEffect, useRef } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  PanelRight,
} from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Dropdown from "@/components/ui/Dropdown";
import AnimatedTaskCheckbox from "../AnimatedCircleCheck";
import { TaskPriority, TaskType } from "@/types/project";
import AddTaskModal from "@/components/AddTask/AddTaskModal";

const CalendarView = ({
  tasks,
  setShowNoDateTasks,
  showNoDateTasks,
}: {
  tasks: TaskType[];
  showNoDateTasks?: boolean;
  setShowNoDateTasks?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"Weeks" | "Months">("Weeks");

  const getDateRange = () => {
    if (viewMode === "Weeks") {
      return {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      };
    } else {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    }
  };

  const { start, end } = getDateRange();
  const daysToShow = eachDayOfInterval({ start, end });

  const navigatePrev = () => {
    setCurrentDate((prev) =>
      viewMode === "Weeks" ? subWeeks(prev, 1) : subMonths(prev, 1)
    );
  };

  const navigateNext = () => {
    setCurrentDate((prev) =>
      viewMode === "Weeks" ? addWeeks(prev, 1) : addMonths(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 mb-4">
        <div className="space-x-2">
          <span className="font-bold">{format(currentDate, "MMMM")}</span>
          <span>{format(currentDate, "yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-medium rounded-lg border border-text-200 text-xs flex items-center gap-1 text-text-600 overflow-hidden">
            <button
              onClick={navigatePrev}
              className="hover:bg-text-100 transition p-0.5"
            >
              <ChevronLeft strokeWidth={1.5} size={20} />
            </button>
            <button
              onClick={goToToday}
              className="hover:bg-text-100 transition px-2 py-1"
            >
              Today
            </button>
            <button
              onClick={navigateNext}
              className="hover:bg-text-100 transition p-0.5"
            >
              <ChevronRight strokeWidth={1.5} size={20} />
            </button>
          </div>

          <Dropdown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerRef={triggerRef}
            Label={({ onClick }) => (
              <button
                ref={triggerRef}
                onClick={onClick}
                className="px-2 py-0.5 hover:bg-text-100 transition rounded-lg border border-text-200 text-xs font-medium text-text-600 flex items-center gap-2"
              >
                <CalendarPlus strokeWidth={1.5} size={20} />
                {viewMode}
              </button>
            )}
            items={[
              {
                id: 1,
                label: "Weeks",
                onClick: () => setViewMode("Weeks"),
                rightContent: viewMode === "Weeks" && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => setViewMode("Weeks")}
                    is_completed={viewMode === "Weeks"}
                  />
                ),
              },
              {
                id: 2,
                label: "Months",
                onClick: () => setViewMode("Months"),
                rightContent: viewMode === "Months" && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => setViewMode("Months")}
                    is_completed={viewMode === "Months"}
                  />
                ),
              },
            ]}
          />

          {setShowNoDateTasks && (
            <button
              onClick={() => setShowNoDateTasks((prev) => !prev)}
              className={`p-2 py-0.5 transition rounded-lg border border-text-200 text-xs flex items-center gap-2 ${
                showNoDateTasks
                  ? "bg-text-50 text-text-700 font-bold"
                  : "text-text-600 hover:bg-text-100 font-medium"
              }`}
            >
              <span>
                No date:{" "}
                {
                  tasks.filter(
                    (task) => !task.dates.start_date || !task.dates.end_date
                  ).length
                }
              </span>
              <div className={`${showNoDateTasks && "bg-text-300 rounded-lg"}`}>
                <PanelRight strokeWidth={1.5} size={20} />
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="px-3 flex flex-col flex-1">
        <div className="grid grid-cols-7 place-items-center border border-text-300 border-r-0 bg-text-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, _index) => (
              <div
                key={day}
                className="text-right text-text-500 border-r border-text-300 w-full p-2 flex flex-col gap-1 items-end"
              >
                {day}
                {viewMode == "Weeks" &&
                  daysToShow
                    .filter((date, _) => _ == _index)
                    .map((date) => (
                      <span
                        key={date.toISOString()}
                        className={`text-base ${
                          isToday(date) &&
                          "bg-primary-500 text-surface rounded-lg w-6 h-6 inline-flex items-center justify-center"
                        }`}
                      >
                        {format(date, "d")}
                      </span>
                    ))}
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-7 border-l border-text-200 flex-[.9]">
          {daysToShow.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            return (
              <Droppable
                key={index}
                droppableId={day.toISOString()}
                type="calendarview_task"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${
                      viewMode == "Weeks" ? "min-h-full" : "min-h-32"
                    }`}
                  >
                    <div
                      onClick={() => setSelectedDay(day)}
                      className={`h-full w-full p-2 text-right border-r border-b border-text-200 cursor-crosshair transition space-y-1 ${
                        selectedDay?.getDate() === day.getDate() &&
                        "bg-text-100"
                      } ${!isCurrentMonth && "opacity-50"}`}
                    >
                      {viewMode == "Months" && (
                        <span
                          className={`${
                            isToday(day) &&
                            "bg-primary-500 text-surface rounded-lg w-6 h-6 inline-flex items-center justify-center"
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                      )}

                      <ul className="text-left space-y-[2px]">
                        {tasks
                          .filter(
                            (task) =>
                              (task.dates.start_date &&
                                isSameDay(
                                  new Date(task.dates.start_date),
                                  day
                                )) ||
                              (task.dates.end_date &&
                                isSameDay(new Date(task.dates.end_date), day))
                          )
                          .sort((a, b) => a.order - b.order)
                          .map((task, taskIndex) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id?.toString()}
                              index={taskIndex}
                            >
                              {(draggableProvided) => (
                                <li
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  className="bg-text-50 hover:bg-text-100 transition p-1 flex items-center gap-1 border border-text-200 rounded-lg"
                                  onClick={(ev) => ev.stopPropagation()}
                                >
                                  <AnimatedTaskCheckbox
                                    priority={task.priority}
                                    playSound={false}
                                    handleCheckSubmit={() => {}}
                                    is_completed={task.is_completed}
                                  />
                                  {task.title}
                                </li>
                              )}
                            </Draggable>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <AddTaskModal
          endDate={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
