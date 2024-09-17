export interface PageType {
  id: number;
  created_at?: string;
  updated_at: string;
  team_id: number | null;
  profile_id: string; // UUID
  title: string;
  slug: string;
  content: string;
  is_archived: boolean;
  settings: {
    color: string;
  };
}
