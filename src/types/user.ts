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
