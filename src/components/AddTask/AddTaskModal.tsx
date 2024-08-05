"use client";
import React, { useState } from "react";
import { Dialog } from "../ui";
import { Task } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import AddTaskForm from "./AddTaskForm";

interface AddTaskModalProps {
  onClose: () => void;
  addTask: (task: Task) => void;
}

const AddTaskModal = ({ onClose, addTask }: AddTaskModalProps) => {
  const [taskData, setTaskData] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    priority: "Priority",
    project: null,
    section: null,
    dueDate: new Date(),
    isInbox: false,
    isCompleted: false,
    subTasks: [],
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
      <div
        className="bg-white rounded-md shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-[550px]"
        onClick={(ev) => ev.stopPropagation()}
      >
        <AddTaskForm onClose={onClose} />
      </div>
    </div>
  );
};

export default AddTaskModal;
