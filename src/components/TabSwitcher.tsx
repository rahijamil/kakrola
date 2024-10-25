'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TabItem } from "@/types/types.utils"

interface TabSwitcherProps {
  tabItems: TabItem[]
  hideBottomBorder?: boolean
  layoutId?: string
  activeTab: string
  size?: "sm" | "md" | "lg"
}

export default function TabSwitcher({
  tabItems,
  hideBottomBorder = false,
  layoutId = "activeIndicator",
  activeTab,
  size = "sm",
}: TabSwitcherProps) {
  return (
    <Tabs value={activeTab}>
      <TabsList 
        className={cn(
          "flex items-center gap-1 relative overflow-hidden w-full h-auto bg-transparent p-0 shadow-none rounded-none",
          !hideBottomBorder && "border-b border-border"
        )}
      >
        {tabItems.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            onClick={item.onClick}
            className={cn(
              "flex items-center justify-center gap-1 cursor-pointer flex-1 transition w-full z-10 relative data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground rounded-none",
              size === "lg" ? "px-2 p-1 md:py-4 md:text-xl md:font-medium" : "px-2 p-1"
            )}
          >
            {item.icon}
            <span className="capitalize">{item.name}</span>
            {activeTab === item.id && (
              <motion.span
                layoutId={`${layoutId}-bottom`}
                className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: size === "lg" ? 0.5 : 0.2,
                }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}