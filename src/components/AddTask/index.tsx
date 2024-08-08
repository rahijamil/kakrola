import React from "react";
import AddTaskForm from "./AddTaskForm";
import { ProjectType, SectionType } from "@/types/project";

interface AddTaskProps {
  onClose: () => void;
  isSmall?: boolean;
  section?: SectionType;
  project: ProjectType | null;
}

const AddTask: React.FC<AddTaskProps> = ({ onClose, isSmall, section, project }) => {
  return (
    <div className="rounded-lg border border-gray-200 focus-within:border-gray-400 mb-6 bg-white">
      <AddTaskForm onClose={onClose} isSmall={isSmall} section={section} project={project} />
    </div>
  );
};

export default AddTask;
