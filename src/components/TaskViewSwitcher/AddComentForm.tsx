import React, {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { TaskType } from "@/types/project";
import { ProfileType } from "@/types/user";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TaskCommentType } from "@/types/comment";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import Spinner from "../ui/Spinner";
import { useRole } from "@/context/RoleContext";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { PersonalMemberForProjectType } from "@/types/team";
import dynamic from "next/dynamic";
import {
  NotificationTypeEnum,
  RelatedEntityTypeEnum,
} from "@/types/notification";
import { createNotification } from "@/types/notification";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { getTextFromContent } from "@/lib/getTextFromContent";
const NovelEditor = dynamic(() => import("@/components/NovelEditor"), {
  ssr: false,
});

const MentionInput = ({
  content,
  setContent,
  assigneeProfiles,
  editorRef,
}: {
  content: string | null;
  setContent: React.Dispatch<React.SetStateAction<string | null>>;
  assigneeProfiles: ProfileType[];
  editorRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileType[]>([]);
  const [showMentionList, setShowMentionList] = useState<boolean>(false);

  const [charsCount, setCharsCount] = useState(0);
  const ProseMirror = (editorRef.current as any)?.querySelector(".ProseMirror");

  // Extract text content from HTML content
  const getTextContent = (htmlContent: string) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;
    return tempElement.innerText;
  };

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
    const newContent = content?.replace(/@\w*$/, `@${profile.full_name} `);
    setContent(newContent || null);
    setMentionQuery(null);
    setShowMentionList(false);
  };

  return (
    <div className="relative">
      <div className="comment-editor hide-some-command relative rounded-lg transition cursor-text border border-text-200 focus-within:border-text-300 focus-within:shadow bg-background">
        <NovelEditor
          editorRef={editorRef}
          content={content ? JSON.parse(content) : null}
          handleSave={(saveContent) => setContent(JSON.stringify(saveContent))}
          setCharsCount={setCharsCount}
          hideContentItemMenu
        />
      </div>

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

interface CommentWithProfile extends TaskCommentType {
  profiles: {
    id: ProfileType["id"];
    avatar_url: ProfileType["avatar_url"];
    full_name: ProfileType["full_name"];
    email: ProfileType["email"];
  };
}

interface MemberData extends PersonalMemberForProjectType {
  profile: ProfileType;
}

const AddComentForm = ({
  onCancelClick,
  task,
}: {
  onCancelClick?: () => void;
  task: TaskType;
}) => {
  const { profile } = useAuthProvider();

  const [content, setContent] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);
  const ProseMirror = (editorRef.current as any)?.querySelector(".ProseMirror");

  const { projects } = useSidebarDataProvider();

  const handleComment = async () => {
    if (!content || !profile) return;

    try {
      const tempId = uuidv4();
      const createdAt = new Date().toISOString();
      const commentData: Omit<TaskCommentType, "id"> = {
        task_id: task.id,
        profile_id: profile.id,
        content,
        parent_comment_id: null,
        is_edited: false,
      };

      queryClient.setQueryData(
        ["task_comments", task.id],
        (oldData: CommentWithProfile[] = []) => [
          ...oldData,
          {
            ...commentData,
            id: tempId,
            created_at: createdAt,
            profiles: {
              id: profile.id,
              avatar_url: profile.avatar_url,
              full_name: profile.full_name,
              email: profile.email,
            },
          },
        ]
      );

      ProseMirror.innerHTML = `<p data-placeholder="Press '/' for commands" class="is-empty is-editor-empty"><br class="ProseMirror-trailingBreak"></p>`;

      const { data, error } = await supabaseBrowser
        .from("task_comments")
        .insert(commentData)
        .select()
        .single();

      if (error) throw error;

      queryClient.setQueryData(
        ["task_comments", task.id],
        (oldData: CommentWithProfile[] = []) =>
          oldData.map((item) =>
            item.id == tempId
              ? {
                  ...item,
                  id: data.id,
                  created_at: data.created_at,
                }
              : item
          )
      );

      createNotification({
        recipients: task.assignees.map((a) => ({
          profile_id: a.profile_id,
          is_read: false,
        })),
        triggered_by: {
          id: profile.id,
          first_name:
            profile.full_name?.split(" ")[0] || profile.email?.split("@")[0],
          avatar_url: profile.avatar_url,
        },
        type: NotificationTypeEnum.COMMENT,
        related_entity_type: RelatedEntityTypeEnum.COMMENT,
        redirect_url: `/app/project/${
          projects.find((pro) => pro.id == task.project_id)?.slug
        }?task=${task.id}`,
        api_url: null,
        data: {
          triggered_by:
            profile.full_name?.split(" ")[0] || profile.email?.split("@")[0],
          entityName: getTextFromContent(JSON.parse(commentData.content)).slice(0, 20),
        },
      });
    } catch (error) {
      console.error(`Error adding comment: `, error);
    } finally {
      setIsCommenting(false);
    }
  };

  const assignees: MemberData[] =
    queryClient.getQueryData(["membersData", task.project_id, undefined]) || [];

  const assigneeProfiles = useMemo(() => {
    if (assignees) {
      return assignees.map((item) => item.profile);
    } else {
      return [];
    }
  }, [assignees]);

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
        editorRef={editorRef}
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
