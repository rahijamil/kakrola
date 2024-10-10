import { TaskType } from "./project";
import { ProfileType } from "./user";

// Comment structure
export interface TaskCommentType {
  id: string | number; // Unique identifier for the comment
  task_id: TaskType['id'] // The task or entity to which the comment is attached
  profile_id: ProfileType['id']; // User ID of the comment's author
  content: string; // The main text of the comment
  parent_comment_id?: TaskCommentType['id'] | null; // If the comment is a reply, link to the parent comment
  is_edited?: boolean; // Flag to check if the comment was edited
  created_at?: string; // Timestamp when the comment was created
  updated_at?: string; // Timestamp of the last update to the comment
}