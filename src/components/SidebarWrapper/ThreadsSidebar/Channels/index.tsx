import { ChevronRight, Plus } from "lucide-react";
import React, { useState } from "react";

const Channels = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const [showChannels, setShowChannels] = useState(false);
  return (
    <div className="mt-4 px-2">
      <div className="relative rounded-lg transition">
        <div
          className={`w-full flex items-center justify-between pl-2 py-[6px] gap-1`}
        >
          <div
            className={`flex items-center ${
              sidebarWidth > 220 ? "gap-2" : "gap-1"
            }`}
          >
            <div
              className={`flex items-center ${
                sidebarWidth > 220 ? "gap-2" : "gap-1"
              }`}
            >
              <span
                className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
              >
                Channels
              </span>
            </div>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition flex items-center absolute right-0 top-1/2 -translate-y-1/2">
          <button
            className="p-1 hover:bg-text-100 rounded-lg transition"
            //   onClick={() => setShowAddProjectModal(true)}
          >
            <Plus
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform`}
            />
          </button>
          <button
            className="p-1 hover:bg-text-100 rounded-lg transition"
            onClick={() => setShowChannels(!showChannels)}
          >
            <ChevronRight
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform transform ${
                showChannels ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Channels;
