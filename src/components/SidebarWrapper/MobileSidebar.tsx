'use client'

import React, { Dispatch, SetStateAction, useMemo, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthProvider } from "@/context/AuthContext"
import {
  Home,
  Calendar,
  MessagesSquare,
  Plus,
  User,
  LucideIcon,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTransition } from "react"

interface MenuItem {
  id: number
  icon: LucideIcon
  text: string
  path: string
}

interface MobileSidebarProps {
  setShowAddTaskModal: Dispatch<SetStateAction<boolean>>
  className?: string
}

export default function MobileSidebar({
  setShowAddTaskModal,
  className = "",
}: MobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const menuItems: MenuItem[] = useMemo(
    () => [
      { id: 1, icon: Home, text: "Home", path: "/app/home" },
      { id: 2, icon: Calendar, text: "Tasks", path: "/app" },
      { id: 3, icon: MessagesSquare, text: "DMs", path: "/app/dm" },
      { id: 4, icon: User, text: "Profile", path: "/app/more" },
    ],
    []
  )

  const handleNavigation = (path: string) => {
    setActiveItem(path)
    startTransition(() => {
      router.push(path)
    })
  }

  useEffect(() => {
    if (!isPending) {
      setActiveItem(null)
    }
  }, [isPending])

  return (
    <motion.aside
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bottom-0 left-0 right-0 z-20 bg-primary-10 shadow-lg rounded-t-xl border-t border-primary-50 ${className}`}
    >
      <nav aria-label="Mobile navigation">
        <ul className="flex justify-around items-center px-4">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <Link
                href={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center p-2 transition-colors duration-200 py-4 ${
                  isPending && activeItem !== item.path ? 'pointer-events-none opacity-50' : ''
                }`}
                aria-current={pathname === item.path ? "page" : undefined}
              >
                {isPending && activeItem === item.path ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                ) : (
                  <item.icon
                    strokeWidth={1.5}
                    className={`w-6 h-6 ${
                      pathname === item.path ? "text-primary-500" : "text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs mt-1 font-medium ${
                    pathname === item.path ? "text-primary-500" : "text-gray-500"
                  }`}
                >
                  {item.text}
                </span>
                <AnimatePresence>
                  {pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 w-6 h-0.5 bg-primary-500 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            </li>
          ))}
          <li className="py-3 pb-4">
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="bg-primary-500 text-primary-10 p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              aria-label="Add new task"
            >
              <Plus strokeWidth={2} className="w-6 h-6" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>
    </motion.aside>
  )
}