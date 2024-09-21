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

const AuthWrapper = ({
  content,
  type,
}: {
  content: ReactNode;
  type: "signup" | "login" | "forgotPassword" | "updatePassword";
}) => {
  const [activeView, setActiveView] = useState<ViewTypes["view"]>("List");
  const { screenWidth } = useScreen();

  return (
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

      <div className={`w-full md:w-11/12 mx-auto flex flex-1 gap-16`}>
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full space-y-8 mt-6 md:mt-20 md:flex justify-center`}
        >
          {content}
        </motion.div>

        {screenWidth > 768 && type == "signup" && (
          <>
            {/* Right Side */}
            <div className="w-full space-y-8">
              <ViewSkeleton activeView={activeView} />

              <ul className="flex gap-4 items-center justify-center">
                {projectViewsToSelect.map((v) => (
                  <li
                    key={v.id}
                    tabIndex={0}
                    className={`flex items-center justify-center cursor-pointer rounded-lg px-4 border w-20 h-20 relative ${
                      activeView === v.name
                        ? "border-primary-500 bg-primary-25"
                        : "border-text-100 hover:bg-text-50"
                    } focus:outline-none`}
                    onClick={() => setActiveView(v.name)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {v.icon}
                      <span className="text-text-700">{v.name}</span>
                    </div>

                    <div className="absolute top-1.5 right-1.5">
                      <AnimatedCircleCheck
                        handleCheckSubmit={() => setActiveView(v.name)}
                        priority={TaskPriority.P3}
                        is_completed={activeView === v.name}
                        playSound={false}
                        disabled
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthWrapper;
