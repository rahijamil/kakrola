import { BubbleMenu as BMenu, Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Code, Link } from "lucide-react";
import React from "react";

const TiptapBubbleMenu: React.FC<{ content: Content }> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Task name" }),
    ],
    content,
  });

  return (
    <>
      {editor && (
        <BMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center justify-center gap-1 rounded-md bg-black text-white">
            <div className="flex items-center justify-center gap-1 p-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${
                  editor.isActive("bold") ? "bg-white/30" : "hover:bg-white/30"
                } w-6 h-6 flex items-center justify-center rounded-md transition duration-200`}
                title="Bold"
              >
                <Bold strokeWidth={1.5} width={16} height={16} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${
                  editor.isActive("italic")
                    ? "bg-white/30"
                    : "hover:bg-white/30"
                } w-6 h-6 flex items-center justify-center rounded-md transition duration-200`}
                title="Italic"
              >
                <Italic strokeWidth={1.5} width={16} height={16} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`${
                  editor.isActive("code") ? "bg-white/30" : "hover:bg-white/30"
                } w-6 h-6 flex items-center justify-center rounded-md transition duration-200`}
                title="Code"
              >
                <Code strokeWidth={1.5} width={16} height={16} />
              </button>
            </div>

            <div className="w-[1px] h-7 bg-white/40"></div>

            <div className="flex items-center justify-center gap-1 p-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${
                  editor.isActive("link") ? "bg-white/30" : "hover:bg-white/30"
                } p-1 flex items-center justify-center gap-1 rounded-md transition duration-200`}
                title="Link"
              >
                <Link strokeWidth={1.5} width={16} height={16} />
                <span className="text-xs">Link</span>
              </button>
            </div>
          </div>
        </BMenu>
      )}
      <EditorContent
        editor={editor}
        className={`py-1 border-none cursor-text font-medium text-lg`}
      />
    </>
  );
};

export default TiptapBubbleMenu;
