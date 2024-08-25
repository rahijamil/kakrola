import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { FileText, Link, X } from "lucide-react";
import React from "react";

const ImportCSVModal = ({ onClose }: { onClose: () => void }) => {
  const [checked, setChecked] = React.useState(true);

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/20 flex items-start pt-40 justify-center z-30"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg p-4 pb-6 space-y-6 w-[420px] whitespace-normal"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Import from CSV</h3>

          <button
            onClick={onClose}
            className="p-1 hover:bg-text-100 transition rounded-lg"
          >
            <X strokeWidth={1.5} size={20} />
          </button>
        </div>

        <div className="border border-dashed border-text-2000 rounded-lg space-y-6 p-10 flex flex-col items-center justify-center">
          <p>Drag and drop a CSV file</p>

          <p className="font-bold text-xs">Upload from your computer</p>
        </div>

        <p>
          Import tasks from a template, use this to create a new project by
          duplicating an existing one.
        </p>

        <p>
          Your CSV file must be UTF-8 encoded.{" "}
          <span className="hover:underline">Learn more.</span>
        </p>
      </div>
    </div>
  );
};

export default ImportCSVModal;