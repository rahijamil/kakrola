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
}