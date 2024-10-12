import React, { useEffect, useRef } from "react";
import { Textarea } from "../ui";
import { TaskType } from "@/types/project";

const DescriptionInput = ({
  taskData,
  setTaskData,
}: {
  taskData: TaskType;
  setTaskData: React.Dispatch<React.SetStateAction<TaskType>>;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [taskData.description]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  // const handleDescriptionChange = (
  //   e: React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //   setTaskData({ ...taskData, description: e.target.value });
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     setTaskData({
  //       ...taskData,
  //       description: taskData.description + "\n",
  //     });
  //   }
  // };

  return (
    <>
      {/* <Textarea
      ref={textareaRef}
      placeholder="Description"
      value={taskData.description}
      onChange={handleDescriptionChange}
      onKeyDown={handleKeyDown}
      rows={1}
      className="text-xs max-h-60 overflow-y-auto"
    /> */}
    </>
  );
};

export default DescriptionInput;
