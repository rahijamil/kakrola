// Profile type
export interface ProfileType {
  id: string; // UUID
  username: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at?: Date;
  updated_at?: Date;
  last_login_at?: Date;
  is_onboarded?: boolean;
  metadata?: {
    last_active_contact_profile_id?: string | null;
  };
  linked_accounts?: {
    profile_id: string;
    username?: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  }[];
}

export enum OAuthTokenProvider {
  NOTION = "notion",
  TRELLO = "trello",
  SLACK = "slack",
  ASANA = "asana",
}

export interface OAuthTokenType {
  id: string; // UUID
  profile_id: ProfileType["id"]; // Foreign key to Profiles table
  provider: OAuthTokenProvider;
  token: string; // Access token
  refresh_token?: string; // Refresh token, if needed
  expires_at: Date | null; // Token expiration date, if available
  metadata?: {
    workspace_name?: string; // Optional: name of workspace or account
    linked_at?: Date; // When the account was linked
  };
}
