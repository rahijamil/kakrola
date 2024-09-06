"use client";
import React, { useMemo } from "react";
import AddTaskForm from "./AddTaskForm";
import { motion } from "framer-motion";

interface AddTaskModalProps {
  onClose: () => void;
  dueDate?: Date | null;
}

const AddTaskModal = ({
  onClose,
  dueDate,
}: AddTaskModalProps) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-start pt-40 z-20 justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-surface rounded-2xl shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-[550px]"
        onClick={(ev) => ev.stopPropagation()}
      >
        <AddTaskForm
          onClose={onClose}
          project={null}
          biggerTitle
        />
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
