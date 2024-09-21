import React, { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github.css";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import useAssignee from "@/hooks/useAssignee";
import { TaskType } from "@/types/project";
import { ProfileType } from "@/types/user";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { CommentType } from "@/types/comment";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import Spinner from "../ui/Spinner";
import { useRole } from "@/context/RoleContext";

const icons = Quill.import("ui/icons");
// Link icons
icons[
  "link"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

// Image icons
icons[
  "image"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

// Video icons
icons[
  "video"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;

// Blockquote icons
icons[
  "blockquote"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>`;

// Code icons
icons[
  "code"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

// Code Block icons
icons[
  "code-block"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-code"><path d="M10 9.5 8 12l2 2.5"/><path d="m14 9.5 2 2.5-2 2.5"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ["bold", "italic", "underline", "strike"],
    ["link", "image", "video"],
    [{ align: [] }],
    ["blockquote", "code", "code-block"],
    ["clean"], // remove formatting button
  ],
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
};

const formats = [
  "header",
  "list",
  "bold",
  "italic",
  "underline",
  "strike",
  "link",
  "image",
  "video",
  "align",
  "blockquote",
  "code",
  "code-block",
];

const MentionInput = ({
  content,
  setContent,
  assigneeProfiles,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  assigneeProfiles: ProfileType[];
}) => {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileType[]>([]);
  const [showMentionList, setShowMentionList] = useState<boolean>(false);

  const quillRef = useRef<any>(null);

  // Extract text content from HTML content
  const getTextContent = (htmlContent: string) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;
    return tempElement.innerText;
  };

  useEffect(() => {
    if (quillRef.current) {
      console.log(quillRef.current.editor.root.focus());
    }
  }, []);

  useEffect(() => {
    if (mentionQuery) {
      const filtered = assigneeProfiles.filter(
        (profile) =>
          profile.full_name
            .toLowerCase()
            .includes(mentionQuery.toLowerCase()) ||
          profile.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
          profile.email.toLowerCase().includes(mentionQuery.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles([]);
    }
  }, [mentionQuery, assigneeProfiles]);

  const handleEditorChange = (value: string) => {
    setContent(value);

    // Get plain text from the HTML content
    const plainText = getTextContent(value);

    // Match for @mentions in the plain text
    const mentionMatch = plainText.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentionList(true);
    } else {
      setMentionQuery(null);
      setShowMentionList(false);
    }
  };

  const handleMentionClick = (profile: ProfileType) => {
    const newContent = content.replace(/@\w*$/, `@${profile.full_name} `);
    setContent(newContent);
    setMentionQuery(null);
    setShowMentionList(false);
  };

  return (
    <div className="relative">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={content}
        onChange={handleEditorChange}
        formats={formats}
        placeholder="Write a comment..."
        className="custom-quill-editor bg-background"
      />

      {showMentionList && filteredProfiles.length > 0 && (
        <ul className="absolute bg-background border border-text-100 shadow-md mb-2 max-h-40 overflow-y-auto w-full z-10 rounded-lg bottom-full">
          {filteredProfiles.map((profile) => (
            <li
              key={profile.id}
              className="p-2 cursor-pointer hover:bg-text-100"
              onClick={() => handleMentionClick(profile)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={profile.avatar_url || "/default_avatar.png"}
                  alt={profile.full_name}
                  className="w-6 h-6 rounded-lg"
                />
                <div>
                  <p className="font-semibold">{profile.full_name}</p>
                  <p className="text-sm text-text-500">@{profile.username}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AddComentForm = ({
  onCancelClick,
  task,
}: {
  onCancelClick?: () => void;
  task: TaskType;
}) => {
  const { assigneeProfiles } = useAssignee({
    project_id: task.project_id,
  });
  const { profile } = useAuthProvider();

  const [content, setContent] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const handleComment = async () => {
    if (!content || !profile) return;

    setIsCommenting(true);

    try {
      const commentData: Omit<CommentType, "id"> = {
        task_id: task.id,
        author_id: profile.id,
        content,
        mentions: [],
        parent_comment_id: null,
        reactions: [],
        is_edited: false,
      };

      const { data, error } = await supabaseBrowser
        .from("comments")
        .insert(commentData)
        .select()
        .single();

      if (error) throw error;

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.ADDED_COMMENT,
        entity_id: data.id,
        entity_type: EntityType.COMMENT,
        metadata: {},
      });
    } catch (error) {
      console.error(`Error adding comment: ${error}`);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <motion.div
      initial={{
        scaleY: 0.8,
        y: -10, // Upwards for top-right, downwards for bottom-left
        opacity: 0,
        transformOrigin: "bottom", // Change origin
        height: 0,
      }}
      animate={{
        scaleY: 1,
        y: [0, -5, 0], // Subtle bounce in the respective direction
        opacity: 1,
        transformOrigin: "bottom",
        height: "auto",
      }}
      exit={{
        scaleY: 0.8,
        y: -10,
        opacity: 0,
        transformOrigin: "bottom",
        height: 0,
      }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
        y: {
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      }}
      className="space-y-4 w-full"
    >
      <MentionInput
        content={content}
        setContent={setContent}
        assigneeProfiles={assigneeProfiles}
      />

      <div className="flex justify-end gap-2 text-xs">
        {onCancelClick && (
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={onCancelClick}
          >
            Cancel
          </Button>
        )}
        <Button
          disabled={isCommenting}
          type="button"
          size="sm"
          onClick={handleComment}
        >
          {isCommenting ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner color="white" />
              <span>Comment</span>
            </div>
          ) : (
            "Comment"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default AddComentForm;
