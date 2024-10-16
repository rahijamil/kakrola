import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { TabItem } from "@/types/types.utils";

const TabSwitcher = ({
  activeTab,
  setActiveTab,
  tabItems,
}: {
  activeTab: TabItem['id'] | null;
  setActiveTab: Dispatch<SetStateAction<TabItem['id'] | null>>;
  tabItems: TabItem[];
}) => {
  const [hoverItem, setHoverItem] = useState<TabItem | null>(null);

  return (
    <ul className="flex items-center gap-1 relative border-b border-text-200">
      {tabItems.map((item) => (
        <li key={item.id} className="relative flex-1">
          <button
            className={`flex items-center justify-center gap-1 cursor-pointer flex-1 transition px-2 p-1 w-full ${
              activeTab === item.id ? "text-text-700" : "text-text-500"
            }`}
            onClick={() => {
              setActiveTab(item.id);
            }}
            onMouseOver={() => setHoverItem(item)}
            onMouseLeave={() => setHoverItem(null)}
          >
            {item.icon}
            <span className="capitalize">{item.name}</span>
          </button>

          {hoverItem?.id === item.id && (
            <motion.span
              layoutId="hoverIndicator"
              className="absolute top-0 left-1/2 translate-x-1/2 h-1 w-1 rounded-full bg-text-700"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}

          {activeTab === item.id && (
            <motion.span
              layoutId="activeIndicator"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-text-700"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default TabSwitcher;
