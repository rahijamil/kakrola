"use client";
import React, { useMemo } from "react";
import AddTaskForm from "./AddTaskForm";
import { motion } from "framer-motion";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { TaskType } from "@/types/project";

interface AddTaskModalProps {
  onClose: () => void;
  dueDate?: Date | null;
}

const AddTaskModal = ({ onClose, dueDate }: AddTaskModalProps) => {
  const { tasks, setTasks } = useTaskProjectDataProvider();

  const inboxTasks = useMemo(() => {
    return tasks.filter((t) => t.is_inbox).sort((a, b) => a.order - b.order);
  }, [tasks]);

  const setInboxTasks = (updatedTasks: TaskType[]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.is_inbox
          ? updatedTasks.find((t) => t.id === task.id) || task
          : task
      )
    );
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-start pt-40 z-20 justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-[550px]"
        onClick={(ev) => ev.stopPropagation()}
      >
        <AddTaskForm
          onClose={onClose}
          project={null}
          setTasks={setInboxTasks}
          tasks={inboxTasks}
          biggerTitle
          dueDate={dueDate}
        />
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
