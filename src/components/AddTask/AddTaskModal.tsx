"use client";
import React, { useEffect, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import { AnimatePresence, motion } from "framer-motion";
import useScreen from "@/hooks/useScreen";
import useFoundFixedDropdown from "@/hooks/useFoundFixedDropdown";

interface AddTaskModalProps {
  onClose: () => void;
  endDate?: Date | null;
}

const AddTaskModal = ({ onClose, endDate }: AddTaskModalProps) => {
  const { screenWidth } = useScreen();
  const { foundFixedDropdown } = useFoundFixedDropdown();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    // Disable touch scrolling
    const preventScroll = (e: TouchEvent) => {
      if (!foundFixedDropdown) {
        e.preventDefault();
      }
    };

    document.body.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, [foundFixedDropdown]);

  const [appHeight, setAppHeight] = useState(window.innerHeight);

  useEffect(() => {
    const adjustHeight = () => {
      if (window.visualViewport) {
        setAppHeight(window.visualViewport.height);
      }
    };

    // Adjust height on load and when viewport changes (keyboard opens/closes)
    window.visualViewport?.addEventListener("resize", adjustHeight);
    adjustHeight(); // Initial adjustment

    return () => {
      window.visualViewport?.removeEventListener("resize", adjustHeight);
    };
  }, []);

  return screenWidth > 768 ? (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-start pt-40 z-50 justify-center"
      onClick={onClose}
    >
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-surface rounded-lg shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-[550px]"
          onClick={(ev) => ev.stopPropagation()}
        >
          <AddTaskForm
            onClose={onClose}
            project={null}
            biggerTitle
            endDate={endDate}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  ) : (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-end z-50 justify-center overflow-hidden"
        onClick={onClose}
        style={{ height: `${appHeight}px` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: "100%" }} // Start off-screen and scaled down
          animate={{ opacity: 1, scale: 1, y: 0 }} // Fade in, scale up, and slide in
          exit={{ opacity: 0, scale: 0.5, y: "100%" }} // Reverse animation for exit
          className="bg-surface rounded-t-lg shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-full"
          onClick={(ev) => ev.stopPropagation()}
        >
          <AddTaskForm
            onClose={onClose}
            project={null}
            biggerTitle
            endDate={endDate}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTaskModal;
