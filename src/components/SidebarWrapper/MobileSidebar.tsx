'use client'

import React, { Dispatch, SetStateAction } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthProvider } from "@/context/AuthContext"
import { Home, Calendar, MessagesSquare, Plus, User } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Component({
  setShowAddTaskModal,
}: {
  setShowAddTaskModal: Dispatch<SetStateAction<boolean>>
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuthProvider()

  const menuItems = [
    { id: 1, icon: Home, text: "Home", path: "/app/home" },
    { id: 2, icon: Calendar, text: "Tasks", path: "/app" },
    { id: 3, icon: MessagesSquare, text: "DMs", path: "/app/dm" },
    { id: 4, icon: User, text: "Profile", path: "/app/more" },
  ]

  return (
    <motion.aside
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-20 bg-primary-10 shadow-lg rounded-t-xl"
    >
      <nav className="px-4 py-2">
        <ul className="flex justify-around items-center">
          {menuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center p-2 transition-colors duration-200"
              >
                <item.icon
                  strokeWidth={1.5}
                  className={`w-6 h-6 ${
                    pathname === item.path ? "text-primary-500" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs mt-1 font-medium ${
                    pathname === item.path ? "text-primary-500" : "text-gray-500"
                  }`}
                >
                  {item.text}
                </span>
                {pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="bg-primary-500 text-surface p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              <Plus strokeWidth={2} className="w-6 h-6" />
            </button>
          </li>
        </ul>
      </nav>
    </motion.aside>
  )
}