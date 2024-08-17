"use client";
import React, { useEffect } from "react";
import { TaskType } from "@/types/project";
import AddTaskForm from "./AddTaskForm";
import { motion } from "framer-motion";
import { supabaseBrowser } from "@/utils/supabase/client";

interface AddTaskModalProps {
  onClose: () => void;
}

const AddTaskModal = ({ onClose }: AddTaskModalProps) => {
  const [tasks, setTasks] = React.useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabaseBrowser
        .from("tasks")
        .select("*")
        .is("project_id", null)
        .eq("is_inbox", true);

      if (error) {
        console.log(error);
      } else {
        setTasks(data);
      }
    };

    fetchTasks();
    return () => {
      setTasks([]);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-start pt-40 z-10 justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-md shadow-[1px_1px_32px_1px_rgba(0,0,0,0.3)] p-2 w-[550px]"
        onClick={(ev) => ev.stopPropagation()}
      >
        <AddTaskForm
          onClose={onClose}
          project={null}
          setTasks={setTasks}
          tasks={tasks}
        />
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
