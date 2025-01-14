import React, { useState, useEffect, useRef } from "react";
import { ProjectType, TaskType } from "@/types/project";
import { parseInput } from "@/utils/parseInput";

export const TaskInput: React.FC<{
  projects: ProjectType[];
  taskData: TaskType;
  setTaskData: React.Dispatch<React.SetStateAction<TaskType>>;
  biggerTitle?: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  titleEditableRef: React.RefObject<HTMLDivElement>;
  className?: string;
}> = ({
  projects,
  biggerTitle,
  taskData,
  setTaskData,
  handleSubmit,
  titleEditableRef,
  className,
}) => {
  const [inputValue, setInputValue] = useState(taskData.title);

  const cursorOffsetRef = useRef(0);
  const firstRenderRef = useRef(true); // Track if it's the first render

  useEffect(() => {
    // const parsedData = parseInput(inputValue, projects);
    // setTaskData((prevData) => ({ ...prevData, ...parsedData }));
    setTaskData((prevData) => ({ ...prevData, title: inputValue }));
  }, [inputValue, setTaskData]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || "";
    setInputValue(text);
  };

  const highlightCommands = (text: string) => {
    const regex =
      /(today|tomorrow|next week|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|\+\w+|!\d|#\w+)/gi;
    const parts = text.split(regex);
    return parts
      .map((part, index) =>
        regex.test(part)
          ? `<span class="bg-primary-200 rounded px-1 py-0.5 text-primary-700">${part}</span>`
          : part
      )
      .join("");
  };

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(titleEditableRef.current!);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorOffsetRef.current = preCaretRange.toString().length;
    }
  };

  const restoreCursorPosition = () => {
    const el = titleEditableRef.current;
    const selection = window.getSelection();
    if (el && selection) {
      let charIndex = 0;
      const range = document.createRange();
      range.setStart(el, 0);
      range.collapse(true);

      const nodeStack: Node[] = [el];
      let node: Node | null = null;
      let foundStart = false;

      while (!foundStart && (node = nodeStack.pop()!)) {
        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharIndex = charIndex + (node.textContent?.length || 0);
          if (
            firstRenderRef.current ||
            cursorOffsetRef.current <= nextCharIndex
          ) {
            range.setStart(node, cursorOffsetRef.current - charIndex);
            foundStart = true;
          } else {
            charIndex = nextCharIndex;
          }
        } else {
          for (let i = node.childNodes.length - 1; i >= 0; i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      if (foundStart) {
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  useEffect(() => {
    saveCursorPosition();
    const el = titleEditableRef.current;

    if (el) {
      // Highlight the commands and update the content
      // const highlightedText = highlightCommands(inputValue);
      // el.innerHTML = highlightedText;

      // Set cursor position at the end of the text on the first render
      if (firstRenderRef.current) {
        if (inputValue) {
          cursorOffsetRef.current = inputValue.length;
        }

        setTimeout(() => {
          el.focus(); // Ensure the element is focused
        }, 0);

        firstRenderRef.current = false; // Disable first render flag after first use
      }

      // Restore cursor position
      restoreCursorPosition();
    }
  }, [inputValue]);

  return (
    <>
      <div
        ref={titleEditableRef}
        contentEditable
        className={`py-1 outline-none cursor-text w-full ${
          biggerTitle ? "text-lg font-medium" : "text-sm font-normal"
        } ${className}`}
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.innerHTML = "";
            handleSubmit(e);
          }
        }}
        aria-placeholder="Task name"
      />

      {/* <TiptapBubbleMenu content={inputValue} /> */}
    </>
  );
};
