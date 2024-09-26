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
  profile_id: string;
  emoji: string;
  type: "thread" | "thread_reply" | "dm";
  thread_id?: number;
  thread_reply_id?: number;
  dm_id?: number;
}

export interface ThreadReactionType extends ReactionType {
  thread_id: number;
}

export interface ThreadReplyReactionType extends ReactionType {
  thread_id: number;
  thread_reply_id: number;
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

export interface DmType {
  id: number;
  created_at?: string;
  updated_at?: string;
  sender_profile_id: string;
  receiver_profile_id: string;
  content: string;
  is_edited: boolean;
}

export interface DmReactionType extends ReactionType {
  dm_id: number;
}
