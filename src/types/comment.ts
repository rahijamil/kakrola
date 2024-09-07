// Comment structure
export interface CommentType {
  id: string | number; // Unique identifier for the comment
  task_id: string | number; // The task or entity to which the comment is attached
  author_id: string; // User ID of the comment's author
  content: string; // The main text of the comment
  mentions: string[]; // List of user IDs mentioned in the comment
  created_at: string; // Timestamp when the comment was created
  updated_at?: string; // Timestamp of the last update to the comment
  parent_comment_id?: string | number; // If the comment is a reply, link to the parent comment
  attachments?: AttachmentType[]; // Array of attachments linked to the comment (files, images, etc.)
  reactions?: ReactionType[]; // Array of reactions (like emojis, thumbs up, etc.)
  is_edited?: boolean; // Flag to check if the comment was edited
}

// Attachment structure for handling comment attachments
export interface AttachmentType {
  id: string | number;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

// Reaction structure to support user reactions to comments
export interface ReactionType {
  user_id: string;
  emoji: string;
}
