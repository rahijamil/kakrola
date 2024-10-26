export enum FeedbackEnum {
  BUG = "BUG",
  FEATURE = "FEATURE",
  FEEDBACK = "FEEDBACK",
}

export interface FeedbackItem {
  id: string;
  type: FeedbackEnum;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  created_at: string;
  updated_at: string;
  profile_id: string;
  metadata: {
    browser?: string;
    os?: string;
    url?: string;
    workspace_id?: string;
    team_id?: number | null;
    screenshots?: string[];
  };
  votes: number;
}
