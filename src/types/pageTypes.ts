import { JSONContent } from "novel";
import { WorkspaceType } from "./workspace";
import { TeamType } from "./team";

export interface PageType {
  id: number | string;
  created_at?: string;
  updated_at?: string;
  team_id: TeamType['id'] | null;
  profile_id: string; // UUID
  title: string;
  slug: string;
  content: JSONContent | null;
  is_archived: boolean;
  settings: {
    color: string;
    banner_url?: string;
    order_in_team?: number;
  };
  workspace_id: WorkspaceType["id"];
}
