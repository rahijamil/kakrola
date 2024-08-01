import { ReactNode } from "react";

export interface ProjectType {
  id: number;
  name: string;
  slug: string;
  icon: ReactNode;
  color: string;
}

export interface SectionType {
  id: number;
  name: string;
  project: ProjectType;
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
}
