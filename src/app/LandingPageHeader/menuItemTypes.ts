import { ReactNode } from "react";

export interface MenuItem {
  id: number;
  label: string;
  path: string;
  subItems?: {
    id: number;
    label: string;
    summary: string;
    path: string;
    onClick: () => void;
    icon: ReactNode;
  }[];
}
