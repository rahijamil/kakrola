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
    project_id: activeProject?.id || null,
    section_id: null,
    parent_task_id: 0 || null,
    profile_id: "",
    assigned_to_id: "",
    due_date: new Date(),
    reminder_time: null,
    is_inbox: activeProject ? false : true,
    is_completed: false,
    order: 0,
    completed_at: null,
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
