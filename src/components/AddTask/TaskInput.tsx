import React, { useState, useEffect, useRef } from "react";
import { ProjectType, TaskType } from "@/types/project";
import { parseInput } from "@/utils/parseInput";

export const TaskInput: React.FC<{
  projects: ProjectType[];
  taskData: TaskType;
  setTaskData: React.Dispatch<React.SetStateAction<TaskType>>;
  biggerTitle?: boolean;
}> = ({ projects, biggerTitle, setTaskData }) => {
  const [inputValue, setInputValue] = useState("");
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsedData = parseInput(inputValue, projects);
    setTaskData((prevData) => ({ ...prevData, ...parsedData }));
  }, [inputValue, projects, setTaskData]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setShowPlaceholder(false);
    const text = e.currentTarget.textContent || "";
    setInputValue(text);
    setShowPlaceholder(text.length === 0);
  };

  const handleBlur = () => {
    setShowPlaceholder(inputValue.length === 0);
  };

  const highlightCommands = (text: string) => {
    const regex =
      /(today|tomorrow|next week|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|\+\w+|!\d|#\w+)/gi;
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-indigo-200 rounded-md px-1 py-0.5 text-indigo-700"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div className="relative w-full max-w-xl mx-auto">
        <div
          ref={contentEditableRef}
          contentEditable
          className={`relative font-medium bg-white border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            biggerTitle ? "text-lg" : "text-base"
          }`}
          onInput={handleInput}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: inputValue }}
        />
        {showPlaceholder && (
          <div className="absolute top-0 left-0 p-3 text-gray-400 pointer-events-none select-none">
            Task name (Try: Buy milk tomorrow +John #Groceries !1)
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none p-3">
          {highlightCommands(inputValue)}
        </div>
      </div>
    </>
  );
};
