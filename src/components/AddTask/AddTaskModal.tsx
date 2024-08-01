"use client";
import React, { useState } from "react";
import { Dialog } from "../ui";
import { Task } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import AddTaskForm from "./AddTaskForm";
import { ProjectType } from "@/types/project";

interface AddTaskModalProps {
  onClose: () => void;
  addTask: (task: Task) => void;
}

const AddTaskModal = ({ onClose, addTask }: AddTaskModalProps) => {
  const { projects } = useTaskProjectDataProvider();

  const [taskData, setTaskData] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    priority: "Priority",
    project: null,
    section: null,
    dueDate: new Date(),
    isInbox: false,
    isCompleted: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(taskData);
  };

  return (
    <Dialog>
      <AddTaskForm onClose={onClose} />
    </Dialog>
  );
};

export default AddTaskModal;
