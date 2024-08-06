// Profile type
export interface ProfileType {
  id: string; // UUID
  username: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at?: Date;
  updated_at?: Date;
  last_login_at?: Date;
}

// Team type
export interface TeamType {
  id: number;
  name: string;
  avatar_url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Team member type
export interface TeamMemberType {
  id: number;
  teamId: number;
  profileId: string; // UUID
  role: Role;
  joinedAt: Date;
}

// Comment structure
export interface CommentType {
  id: number;
  text: string;
  author: ProfileType;
}
