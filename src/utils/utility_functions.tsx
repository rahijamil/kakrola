import moment from "moment";
import { FlagIcon } from "@heroicons/react/16/solid";
import { Flag } from "lucide-react";
import { TaskPriority, TaskStatus, TaskType } from "@/types/project";

export const formatDate = (dateString: string | undefined, isAmPm: boolean) => {
  if (!dateString) return "Unknown date";
  return moment(dateString).format(isAmPm ? "h:mm A" : "h:mm");
};

export const priorities: {
  value: TaskType["priority"];
  label: string;
  color: string;
}[] = [
  { value: TaskPriority.P1, label: "Priority 1", color: "text-red-500" },
  { value: TaskPriority.P2, label: "Priority 2", color: "text-orange-500" },
  { value: TaskPriority.P3, label: "Priority 4", color: "text-text-500" },
  { value: TaskPriority.Priority, label: "Priority 3", color: "text-primary-600" },
];

export const PriorityIcon = ({
  priority,
}: {
  priority: TaskType["priority"];
}) => {
  switch (priority) {
    case "P1":
    case "P2":
    case "P3":
      return (
        <FlagIcon
          className={`w-4 h-4 ${
            priorities.find((p) => p.value === priority)?.color
          }`}
        />
      );
    default:
      return (
        <Flag
          strokeWidth={1.5}
          className={`w-4 h-4 ${
            priorities.find((p) => p.value === priority)?.color
          }`}
        />
      );
  }
};

export enum TaskStatusColor {
  ON_TRACK = "#22c55e", // green
  AT_RISK = "#f97316", // orange
  OFF_TRACK = "#ef4444", // red
  ON_HOLD = "#3b82f6", // blue
  COMPLETE = "#22c55e", // green
}

export const taskStatus: {
  status: TaskStatus;
  label: "On track" | "At risk" | "Off track" | "On hold" | "Complete";
  color: TaskStatusColor;
}[] = [
  {
    status: TaskStatus.ON_TRACK,
    label: "On track",
    color: TaskStatusColor.ON_TRACK,
  },
  {
    status: TaskStatus.AT_RISK,
    label: "At risk",
    color: TaskStatusColor.AT_RISK,
  },
  {
    status: TaskStatus.OFF_TRACK,
    label: "Off track",
    color: TaskStatusColor.OFF_TRACK,
  },
  {
    status: TaskStatus.ON_HOLD,
    label: "On hold",
    color: TaskStatusColor.ON_HOLD,
  },
  {
    status: TaskStatus.COMPLETE,
    label: "Complete",
    color: TaskStatusColor.COMPLETE,
  },
];
