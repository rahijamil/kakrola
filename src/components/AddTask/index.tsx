import React, { Dispatch, SetStateAction } from "react";
import AddTaskForm from "./AddTaskForm";
import { ProjectType, SectionType, TaskType } from "@/types/project";

interface AddTaskProps {
  onClose: () => void;
  isSmall?: boolean;
  section_id?: SectionType["id"] | null;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void
  tasks: TaskType[];
  addTaskAboveBellow?: { position: "above" | "below"; task: TaskType } | null;
  taskForEdit?: TaskType;
}

const AddTask: React.FC<AddTaskProps> = ({
  onClose,
  isSmall,
  section_id,
  project,
  setTasks,
  tasks,
  addTaskAboveBellow,
  taskForEdit,
}) => {
  return (
    <div
      className={`rounded-lg border border-text-200 focus-within:border-text-400 bg-surface ${
        addTaskAboveBellow?.position == "above" ? "mb-2" : "mt-2"
      }`}
    >
      <AddTaskForm
        onClose={onClose}
        isSmall={isSmall}
        section_id={section_id}
        project={project}
        setTasks={setTasks}
        tasks={tasks}
        addTaskAboveBellow={addTaskAboveBellow}
        taskForEdit={taskForEdit}
      />
    </div>
  );
};

export default AddTask;
