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
  addMonths,
  subMonths,
  isFirstDayOfMonth,
  subWeeks,
  addWeeks,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  PanelRight,
} from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "@/components/ui/Dropdown";
import AnimatedTaskCheckbox from "../AnimatedCircleCheck";
import { ProjectType, TaskPriority, TaskType } from "@/types/project";
import AddTaskModal from "@/components/AddTask/AddTaskModal";
import { debounce } from "lodash";
import TaskItemModal from "../TaskItemModal";
import useCheckClick from "@/hooks/useCheckClick";

const CalendarView = ({
  tasks,
  setTasks,
  setShowNoDateTasks,
  showNoDateTasks,
  project,
}: {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  showNoDateTasks?: boolean;
  setShowNoDateTasks?: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType | null;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"Weeks" | "Months">("Weeks");
  const [direction, setDirection] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const [showTaskDetails, setShowTaskDetails] = useState<TaskType | null>(null);

  const { handleCheckClickDebounced } = useCheckClick({
    task: showTaskDetails,
    tasks,
    setTasks,
  });

  // const getDateRange = () => {
  //   if (viewMode === "Weeks") {
  //     return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
  //   } else {
  //     return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
  //   }
  // };

  const handleWheel = debounce((event: any) => {
    if (event.deltaY < 0 || event.deltaX < 0) {
      // Scrolling up
      navigatePrev();
    } else if (event.deltaY > 0 || event.deltaX > 0) {
      // Scrolling down
      navigateNext();
    }
  }, 50);

  const getDateRange = () => {
    if (viewMode === "Weeks") {
      return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
    } else {
      const startMonth = startOfMonth(currentDate);
      const endMonth = endOfMonth(currentDate);
      const start = startOfWeek(startMonth);
      const end = endOfWeek(endMonth);

      // Extend the range to include days from the next month
      return { start, end };
    }
  };

  const { start, end } = getDateRange();
  const daysToShow = eachDayOfInterval({ start, end });

  const navigatePrev = () => {
    setDirection(-1);

    if (viewMode == "Months") {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (viewMode == "Weeks") {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const navigateNext = () => {
    setDirection(1);

    if (viewMode == "Months") {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const goToToday = () => {
    setDirection(0);
    setCurrentDate(new Date());
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="font-medium rounded-lg border border-text-200 text-xs flex items-center gap-1 text-text-600 overflow-hidden">
            <motion.button
              onClick={navigatePrev}
              className="hover:bg-text-100 transition p-0.5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft strokeWidth={1.5} size={20} />
            </motion.button>
            <motion.button
              onClick={goToToday}
              className="hover:bg-text-100 transition px-2 py-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>
            <motion.button
              onClick={navigateNext}
              className="hover:bg-text-100 transition p-0.5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight strokeWidth={1.5} size={20} />
            </motion.button>
          </div>

          {viewMode == "Months" ? (
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentDate.toISOString()}
                custom={direction}
                variants={calendarVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="space-x-2"
              >
                <span className="font-bold">{format(currentDate, "MMMM")}</span>
                <span>{format(currentDate, "yyyy")}</span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div key={currentDate.toISOString()} className="space-x-2">
              <span className="font-bold">{format(currentDate, "MMMM")}</span>
              <span>{format(currentDate, "yyyy")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Dropdown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerRef={triggerRef}
            Label={({ onClick }) => (
              <motion.button
                ref={triggerRef}
                onClick={onClick}
                className="px-2 py-0.5 hover:bg-text-100 transition rounded-lg border border-text-200 text-xs font-medium text-text-600 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CalendarPlus strokeWidth={1.5} size={20} />
                {viewMode}
              </motion.button>
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
            <motion.button
              onClick={() => setShowNoDateTasks((prev) => !prev)}
              className={`p-2 py-0.5 transition rounded-lg border border-text-200 text-xs flex items-center gap-2 font-medium ${
                showNoDateTasks
                  ? "bg-text-100 text-text-700"
                  : "hover:bg-text-100 text-text-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                No date:{" "}
                {
                  tasks.filter(
                    (task) => !task.dates.start_date || !task.dates.end_date
                  ).length
                }
              </span>
              <PanelRight strokeWidth={1.5} size={20} />
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={calendarVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="flex flex-col flex-1 rounded-lg overflow-hidden mb-4"
          onWheel={handleWheel}
        >
          <div className="grid grid-cols-7 place-items-center bg-text-100 border border-text-200 rounded-t-lg">
            {days.map((day, _index) => (
              <div
                key={day}
                className={`text-right text-text-500 border-text-300 w-full p-2 flex flex-col gap-1 items-end font-medium ${
                  _index === days.length - 1 ? "border-r-0" : "border-r"
                }`}
              >
                {day}
                {viewMode === "Weeks" &&
                  daysToShow
                    .filter((date, _) => _ === _index)
                    .map((date) => (
                      <motion.span
                        key={date.toISOString()}
                        className={`text-lg ${
                          isToday(date) &&
                          "bg-primary-500 text-surface rounded-lg w-6 h-6 inline-flex items-center justify-center"
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: _index * 0.05 }}
                      >
                        {format(date, "d")}
                      </motion.span>
                    ))}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l border-text-200 flex-1 rounded-b-lg">
            {daysToShow.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              return (
                <Droppable
                  key={index}
                  droppableId={format(day, "dd LLL yyyy")}
                  type="calendarview_task"
                >
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${
                        viewMode === "Weeks" ? "min-h-full" : "min-h-32"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <div
                        onClick={() =>
                          !snapshot.isDraggingOver && setSelectedDay(day)
                        }
                        className={`h-full w-full p-2 border-r border-b border-text-200 cursor-crosshair transition space-y-1 ${
                          selectedDay?.getDate() === day.getDate() &&
                          selectedDay.getMonth() === day.getMonth() &&
                          "bg-text-100"
                        }`}
                      >
                        {viewMode === "Months" && (
                          <div
                            className={`flex items-center justify-end gap-2 text-base ${
                              !isCurrentMonth && "text-text-400"
                            }`}
                          >
                            {isFirstDayOfMonth(day) && (
                              <span>{format(day, "LLL")}</span>
                            )}
                            <span
                              className={`${
                                isToday(day) &&
                                "bg-primary-500 text-surface rounded-lg w-6 h-6 inline-flex items-center justify-center"
                              }`}
                            >
                              {format(day, "d")}
                            </span>
                          </div>
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
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <li
                                      ref={draggableProvided.innerRef}
                                      {...draggableProvided.draggableProps}
                                      {...draggableProvided.dragHandleProps}
                                      className="bg-text-50 hover:bg-text-100 transition p-1 flex items-center gap-1 border border-text-200 rounded-lg"
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        setShowTaskDetails(task);
                                      }}
                                    >
                                      <AnimatedTaskCheckbox
                                        priority={task.priority}
                                        playSound={false}
                                        handleCheckSubmit={() => {}}
                                        is_completed={task.is_completed}
                                      />
                                      {task.title}
                                    </li>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}

                          {provided.placeholder}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {selectedDay && (
        <AddTaskModal
          endDate={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {showTaskDetails && (
        <TaskItemModal
          setTasks={setTasks}
          task={showTaskDetails}
          tasks={tasks}
          onClose={() => setShowTaskDetails(null)}
          onCheckClick={handleCheckClickDebounced}
          project={project}
          subTasks={tasks.filter((t) => t.parent_task_id == showTaskDetails.id)}
        />
      )}
    </div>
  );
};

export default CalendarView;
