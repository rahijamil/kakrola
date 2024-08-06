"use client";
import React, { useState } from "react";
import { Dialog } from "../ui";
import { TaskType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import AddTaskForm from "./AddTaskForm";
import { motion } from "framer-motion";

interface AddTaskModalProps {
  onClose: () => void;
  addTask: (task: TaskType) => void;
}

const AddTaskModal = ({ onClose, addTask }: AddTaskModalProps) => {
  const { activeProject } = useTaskProjectDataProvider();

  const [taskData, setTaskData] = useState<TaskType>({
    id: 0,
    title: "",
    description: "",
    priority: "Priority",
    projectId: activeProject?.id || null,
    sectionId: null,
    parentTaskId: 0 || null,
    createdById: "",
    assignedToId: "",
    dueDate: new Date().toString(),
    reminderTime: null,
    isInbox: activeProject ? false : true,
    isCompleted: false,
    order: 0,
    completedAt: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(taskData);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-start pt-40 z-10 justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-md shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-[550px]"
        onClick={(ev) => ev.stopPropagation()}
      >
        <AddTaskForm onClose={onClose} />
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
