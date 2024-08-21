import { TaskType } from "@/types/project";
import React from "react";

const BoardViewForToday = ({
  tasks,
  setTasks,
}: {
  tasks: TaskType[];
  setTasks: (updatedTasks: TaskType[]) => void;
}) => {
  return <div>BoardViewForToday</div>;
};

export default BoardViewForToday;
