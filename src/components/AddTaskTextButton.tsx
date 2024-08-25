import { Plus } from "lucide-react";
import React from "react";

const AddTaskTextButton = () => {
  return (
    <button className="flex items-center gap-2 text-primary-600 font-semibold transition-colors text-sm">
      <div className="w-5 h-5 bg-primary-500 rounded-full">
        <Plus className="w-5 h-5 text-surface" strokeWidth={1.5} />
      </div>
      Add Task
    </button>
  );
};

export default AddTaskTextButton;
