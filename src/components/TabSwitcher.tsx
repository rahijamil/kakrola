import React from "react";
import { motion } from "framer-motion";
import { TabItem } from "@/types/types.utils";

const TabSwitcher = ({
  tabItems,
  hideBottomBorder,
  layoutId = "activeIndicator",
  activeTab,
  size = "sm",
}: {
  tabItems: TabItem[];
  hideBottomBorder?: boolean;
  layoutId?: string;
  activeTab: string;
  size?: "sm" | "md" | "lg";
}) => {
  // const [hoverItem, setHoverItem] = useState<TabItem | null>(null);

  return (
    <ul
      className={`flex items-center gap-1 relative overflow-hidden ${
        !hideBottomBorder && "border-b border-text-200"
      }`}
    >
      {tabItems.map((item) => (
        <li key={item.id} className="relative flex-1">
          <button
            className={`flex items-center justify-center gap-1 cursor-pointer flex-1 transition w-full z-10 relative ${
              activeTab === item.id ? "text-text-700" : "text-text-500"
            } ${size == "lg" ? "px-2 p-1 md:py-4 md:text-xl md:font-medium" : "px-2 p-1"}`}
            onClick={item.onClick}
            // onMouseOver={() => setHoverItem(item)}
            // onMouseLeave={() => setHoverItem(null)}
          >
            {item.icon}
            <span className="capitalize">{item.name}</span>
          </button>
          {/* 
          {hoverItem?.id === item.id && (
            <motion.span
              layoutId="hoverIndicator"
              className="absolute top-1 left-1/2 translate-x-1/2 h-1 w-1 rounded-full bg-primary-500 z-10"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: size == "lg" ? 0.5 : 0.2,
              }}
            />
          )} */}

          {activeTab === item.id && (
            <>
              {/* <motion.span
                layoutId={layoutId}
                className={`absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-white via-primary-50 to-white`}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: size == "lg" ? 0.5 : 0.2,
                }}
              /> */}

              <motion.span
                layoutId={`${layoutId}-bottom`}
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-text-700`}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: size == "lg" ? 0.5 : 0.2,
                }}
              />
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TabSwitcher;
