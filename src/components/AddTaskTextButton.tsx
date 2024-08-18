import { Plus } from "lucide-react";
import React from "react";

const AddTaskTextButton = () => {
  return (
    <button className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors text-sm">
      <div className="w-5 h-5 bg-indigo-600 rounded-full">
        <Plus className="w-5 h-5 text-white" strokeWidth={1.5} />
      </div>
      Add Task
    </button>
  );
};

export default AddTaskTextButton;
