import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { FileText, Link, X } from "lucide-react";
import React from "react";

const ExportCSVModal = ({ onClose }: { onClose: () => void }) => {
  const [checked, setChecked] = React.useState(true);

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/20 flex items-start pt-40 justify-center z-30"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-4 pb-6 space-y-6 w-[420px] whitespace-normal"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Export as CSV</h3>

          <button
            onClick={onClose}
            className="p-1 hover:bg-text-100 transition rounded-full"
          >
            <X strokeWidth={1.5} size={20} />
          </button>
        </div>

        <p>Please pick the template type:</p>

        <div className="space-y-4">
          <Button fullWidth size="sm">
            <FileText strokeWidth={1.5} size={20} />
            <span>Export as CSV file</span>
          </Button>

          <Button fullWidth size="sm">
            <Link strokeWidth={1.5} size={20} />
            <span>Export as shareable URL</span>
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setChecked(!checked)}>
            <ToggleSwitch checked={checked} onCheckedChange={setChecked} />
            <span>Use relative dates</span>
          </div>

          <p className="text-black/60 text-xs">Relative means &quot;Tomorrow&quot; will get turned into &quot;+1 day&quot;</p>
        </div>
      </div>
    </div>
  );
};

export default ExportCSVModal;
