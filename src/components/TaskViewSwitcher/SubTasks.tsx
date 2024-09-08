import { Plus, Workflow } from "lucide-react";
import React, { useState } from "react";
import AddTaskForm from "../AddTask/AddTaskForm";
import TaskItem from "./TaskItem";
import { ProjectType, TaskType } from "@/types/project";
import { motion } from "framer-motion";

const SubTasks = ({
  task,
  project,
  setTasks,
  tasks,
  subTasks,
}: {
  task: TaskType;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
  subTasks: TaskType[];
}) => {
  const [showAddSubtask, setShowAddSubtask] = useState<boolean>(false);
  return (
    <div className={`grid grid-cols-[20%_80%] items-start`}>
      <div className="flex items-center gap-2 mt-2">
        <Workflow strokeWidth={2} size={16} />
        <p className="font-semibold text-xs">Subtasks</p>
      </div>

      <div>
        <div>
          {!showAddSubtask && (
            <button
              className="text-xs flex items-center gap-2 py-[6px] text-text-600 cursor-pointer hover:bg-text-100 transition rounded-2xl p-2 px-4 w-full text-left"
              onClick={() => setShowAddSubtask(true)}
            >
              <Plus strokeWidth={1.5} className="w-4 h-4" />

              <span className="text-xs">Add subtask</span>
            </button>
          )}
          {showAddSubtask && (
            <motion.div
              initial={{
                scaleY: 0.8,
                y: -10, // Upwards for top-right, downwards for bottom-left
                opacity: 0,
                transformOrigin: "top", // Change origin
              }}
              animate={{
                scaleY: 1,
                y: [0, -5, 0], // Subtle bounce in the respective direction
                opacity: 1,
                transformOrigin: "top",
              }}
              exit={{
                scaleY: 0.8,
                y: -10,
                opacity: 0,
                transformOrigin: "top",
              }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
                y: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                },
              }}
              className="rounded-2xl border border-text-200 focus-within:border-text-400 bg-surface"
            >
              <AddTaskForm
                onClose={() => setShowAddSubtask(false)}
                parentTaskIdForSubTask={task.id}
                project={project}
                setTasks={setTasks}
                tasks={tasks}
                section_id={task.section_id}
              />
            </motion.div>
          )}
        </div>

        <ul>
          {subTasks.map((subTask, index) => (
            <li key={subTask.id}>
              <TaskItem
                task={subTask}
                setTasks={setTasks}
                index={index}
                project={project}
                subTasks={tasks
                  .map((t) => (t.parent_task_id == subTask.id ? t : null))
                  .filter((t) => t != null)}
                tasks={tasks}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubTasks;
