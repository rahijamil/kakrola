import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddTaskModal from "../../AddTask/AddTaskModal";
import { TaskType } from "@/types/project";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  PanelRight,
} from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

const CalendarView = ({
  tasks,
  setShowNoDateTasks,
  showNoDateTasks,
}: {
  tasks: TaskType[];
  showNoDateTasks?: boolean;
  setShowNoDateTasks?: Dispatch<SetStateAction<boolean>>;
}) => {
  const today = startOfDay(new Date());

  const [month, setMonth] = useState<Date>(startOfMonth(today));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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
    <>
      <div className="h-full">
        <div className="flex items-center justify-between px-3 mb-4">
          <div className="space-x-2">
            <span className="font-bold">{format(month, "MMMM")}</span>
            <span>{format(month, "yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium rounded-lg border border-gray-200 text-xs flex items-center gap-1 text-gray-600">
              <button className="hover:bg-gray-100 transition p-0.5">
                <ChevronLeft strokeWidth={1.5} size={20} />
              </button>
              <span>Today</span>
              <button className="hover:bg-gray-100 transition p-0.5">
                <ChevronRight strokeWidth={1.5} size={20} />
              </button>
            </div>

            {setShowNoDateTasks && (
              <button
                onClick={() => setShowNoDateTasks((prev) => !prev)}
                className={`p-2 py-0.5 transition rounded-lg border border-gray-200 text-xs flex items-center gap-1 ${
                  showNoDateTasks
                    ? "bg-gray-100 text-gray-700 font-bold"
                    : "text-gray-600 hover:bg-gray-100 font-medium"
                }`}
              >
                <span>
                  No date: {tasks.filter((task) => !task.due_date).length}
                </span>

                <div
                  className={`${showNoDateTasks && "bg-gray-300 rounded-lg"}`}
                >
                  <PanelRight strokeWidth={1.5} size={20} />
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 place-items-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-gray-200">
          {calendarDays.map((day, index) => {
            // Check if the day belongs to the current month
            const isCurrentMonth = isSameMonth(day, month);

            return (
              <Droppable
                key={index}
                droppableId={day.toISOString()}
                type={"calendarview_task"}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    key={index}
                    className="min-h-32"
                  >
                    {isCurrentMonth ? (
                      <div
                        onClick={() => setSelectedDay(day)}
                        className={`h-full w-full p-2 text-right border-r border-b cursor-default transition space-y-1 ${
                          selectedDay?.getDate() == day.getDate() &&
                          "bg-indigo-50"
                        }`}
                      >
                        <span
                          className={`${
                            isToday(day) &&
                            "bg-indigo-600 text-white rounded-lg w-6 h-6 inline-flex items-center justify-center"
                          }`}
                        >
                          {format(day, "d")}
                        </span>

                        <ul className="text-left space-y-[2px]">
                          {tasks
                            .filter(
                              (task) =>
                                task.due_date &&
                                new Date(task.due_date).getDate() ==
                                  day.getDate()
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
                                    key={task.id}
                                    className="bg-gray-100 hover:bg-gray-200 transition p-1 flex items-center gap-1 border rounded-lg"
                                    onClick={(ev) => ev.stopPropagation()}
                                  >
                                    <div
                                      // onClick={handleCheckClick}
                                      className={`p-1 self-start group cursor-pointer h-fit `}
                                    >
                                      <Circle
                                        size={20}
                                        strokeWidth={1.5}
                                        className={`${
                                          task.priority == "P1"
                                            ? "text-red-500"
                                            : task.priority == "P2"
                                            ? "text-orange-500"
                                            : task.priority == "P3"
                                            ? "text-indigo-500"
                                            : "text-gray-500"
                                        } ${
                                          task.is_completed
                                            ? "hidden"
                                            : "group-hover:hidden"
                                        }`}
                                      />
                                      <CircleCheck
                                        size={20}
                                        strokeWidth={1.5}
                                        className={`transition rounded-full ${
                                          task.priority == "P1"
                                            ? "text-red-500"
                                            : task.priority == "P2"
                                            ? "text-orange-500"
                                            : task.priority == "P3"
                                            ? "text-indigo-500"
                                            : "text-gray-500"
                                        } ${
                                          !task.is_completed
                                            ? "hidden group-hover:block"
                                            : `text-white ${
                                                task.priority == "P1"
                                                  ? "bg-red-500"
                                                  : task.priority == "P2"
                                                  ? "bg-orange-500"
                                                  : task.priority == "P3"
                                                  ? "bg-indigo-500"
                                                  : "bg-gray-500"
                                              }`
                                        }`}
                                      />
                                    </div>

                                    {task.title}
                                  </li>
                                )}
                              </Draggable>
                            ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="h-full w-full p-2 text-right border-r border-b">
                        <span className="opacity-40">{format(day, "d")}</span>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <AddTaskModal
          dueDate={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
};

export default CalendarView;
