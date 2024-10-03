import KakrolaLogo from "@/app/kakrolaLogo";
import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ViewSkeleton from "./ViewSkeleton";
import { projectViewsToSelect } from "@/data/project_views";
import { ViewTypes } from "@/types/viewTypes";
import { TaskPriority } from "@/types/project";
import AnimatedCircleCheck from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import useScreen from "@/hooks/useScreen";
import { Dialog } from "./ui";

const AuthWrapper = ({
  content,
  type,
  onClose,
}: {
  content: ReactNode;
  type: "signup" | "login" | "forgotPassword" | "updatePassword";
  onClose?: () => void;
}) => {
  const [activeView, setActiveView] = useState<ViewTypes["view"]>("List");
  const { screenWidth } = useScreen();

  return onClose ? (
    <Dialog onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full md:flex justify-center relative`}
      >
        {content}

        <button
          className="absolute top-2 right-2 transition text-text-500 hover:text-text-700 text-xs"
          onClick={onClose}
        >
          Cancel
        </button>
      </motion.div>
    </Dialog>
  ) : (
    <div className="bg-background fixed inset-0 z-20 flex flex-col">
      <div className="flex items-center p-3 md:px-6">
        {/* <button
          onClick={() => router.back()}
          className="p-1 rounded-lg transition"
          onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
          onTouchEnd={(ev) => ev.currentTarget.classList.remove("bg-text-100")}
        >
          <ChevronLeft strokeWidth={1.5} size={24} />
        </button> */}

        <Link href="/">
          <KakrolaLogo size="md" isTitle />
        </Link>

        <div className="w-7 h-7"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full md:flex justify-center`}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default AuthWrapper;
