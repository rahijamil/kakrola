import { ReactNode } from "react";
import { ViewTypes } from "./viewTypes";

export interface ProjectType {
  id: number;
  name: string;
  slug: string;
  icon: ReactNode;
  color: string;
  isFavorite: boolean;
  view: ViewTypes["view"];
}

export interface SectionType {
  id: number;
  name: string;
  project: ProjectType;
  isCollapsed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "P1" | "P2" | "P3" | "Priority";
  project: ProjectType | null;
  section: SectionType | null;
  isInbox?: boolean;
  dueDate: Date;
  reminderTime?: Date;
  isCompleted: boolean;
  subTasks: Task[];
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: [];
  created_at: Date;
}

export interface CommentType {
  id: number;
  text: string;
  author: UserType;
}
