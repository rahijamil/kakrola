import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

const AddTaskTextButton = ({
  handleAddTask,
}: {
  handleAddTask: () => void;
}) => {
  return (
    <button
      className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm"
      onClick={handleAddTask}
    >
      <div className="w-5 h-5 bg-blue-600 rounded-full">
        <PlusIcon className="w-5 h-5 text-white" />
      </div>
      Add Task
    </button>
  );
};

export default AddTaskTextButton;