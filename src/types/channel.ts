import { JSONContent } from "novel";

export interface ChannelType {
  id: number;
  created_at?: string;
  updated_at?: string;
  profile_id: string;
  team_id: number;
  name: string;
  slug: string;
  description: string;
  is_archived: boolean;
  is_private: boolean;
  settings: {
    color: string;
  };
}

export interface ReactionType {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  profile_id: string;
  thread_id: number;
  thread_reply_id: number | null;
  emoji: string;
}

export interface ThreadType {
  id: number;
  created_at?: string;
  updated_at?: string;
  profile_id: string;
  channel_id: number;
  title: string;
  slug: string;
  content: string;
  is_edited: boolean;
}

export interface ThreadReplyType {
  id: number | string;
  created_at?: string;
  updated_at?: string;
  profile_id: string;
  thread_id: number;
  content: string;
  is_edited: boolean;
}
