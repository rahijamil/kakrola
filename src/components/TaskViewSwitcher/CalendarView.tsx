import React from "react";
import { format, isSameDay } from "date-fns";
import TaskItem from "./TaskItem";
import { TaskType } from "@/types/project";

const CalendarView = ({
  tasks,
  onTaskUpdate,
}: {
  tasks: TaskType[];
  onTaskUpdate: (updatedTask: TaskType) => void;
}) => {
  const today = new Date();
  const weekDays = [...Array(7)].map((_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    return day;
  });

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => (
        <div key={day.toString()} className="border p-2">
          <h4 className="font-bold">{format(day, "EEE")}</h4>
          <p className="text-sm text-gray-500">{format(day, "d")}</p>
          <ul className="mt-2 space-y-1">
            {tasks
              .filter((task) => isSameDay(new Date(task.due_date), day))
              .map((task) => (
                <li key={task.id} className="text-sm">
                  <TaskItem
                    task={task}
                    onClick={() =>
                      onTaskUpdate({
                        ...task,
                        isCompleted: !task.isCompleted,
                      })
                    }
                  />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
