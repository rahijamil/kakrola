import { AlignLeft } from "lucide-react";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropdown from "../ui/Dropdown";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"], // remove formatting button
  ],
};

const formats = [
  "header",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "link",
  "image",
  "align",
  "color",
  "background",
];

const TaskDescription = () => {
  const [editorState, setEditorState] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const triggerRef = useRef(null);

  const handleChange = (value: any) => {
    setEditorState(value);

    console.log(value);
  };

  return (
    <div className={`grid grid-cols-[20%_80%] items-start`}>
      <div className="flex items-center gap-2 mt-2">
        <AlignLeft strokeWidth={2} size={16} />
        <p className="font-semibold text-xs">Description</p>
      </div>

      {/* <Dropdown
        isOpen={isEdit}
        setIsOpen={setIsEdit}
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <div
            onClick={onClick}
            className="cursor-pointer hover:bg-text-100 transition rounded-2xl p-2 px-4 w-full text-left"
          >
            <div
              ref={triggerRef}
              className="text-text-600 text-xs line-clamp-1"
              dangerouslySetInnerHTML={{
                  __html: editorState || "No description"
              }}
            ></div>
          </div>
        )}
        content={
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={editorState}
            onChange={handleChange}
            placeholder="What is this task about?"
            className="custom-quill-editor"
          />
        }
        contentWidthClass="w-[90%] max-w-[600px] py-1"
      /> */}
    </div>
  );
};

export default TaskDescription;
