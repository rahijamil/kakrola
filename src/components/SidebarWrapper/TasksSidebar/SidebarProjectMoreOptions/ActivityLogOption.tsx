import { Logs } from "lucide-react";
import React from "react";

const ActivityLogOption = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-primary-50 transition flex items-center"
    >
      <Logs strokeWidth={1.5} className="w-4 h-4 mr-2" /> Activity log
    </button>
  );
};

export default ActivityLogOption;
