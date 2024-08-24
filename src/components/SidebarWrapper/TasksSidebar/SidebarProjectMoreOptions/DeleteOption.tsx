import { Trash2 } from "lucide-react";
import React from "react";

const DeleteOption = ({
  onClick,
}: {
  onClick: () => void;
}) => {


  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-primary-50 transition flex items-center"
    >
      <Trash2 strokeWidth={1.5} className="w-4 h-4 mr-2" /> Delete
    </button>
  );
};

export default DeleteOption;
