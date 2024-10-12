import moment from "moment";
import { FlagIcon } from "@heroicons/react/16/solid";
import { Flag } from "lucide-react";

export const formatDate = (dateString: string | undefined, isAmPm: boolean) => {
  if (!dateString) return "Unknown date";
  return moment(dateString).format(isAmPm ? "h:mm A" : "h:mm");
};

export const priorities = [
  { value: "P1", label: "Priority 1", color: "text-red-500" },
  { value: "P2", label: "Priority 2", color: "text-orange-500" },
  { value: "P3", label: "Priority 3", color: "text-primary-600" },
  { value: "Priority", label: "Priority 4", color: "text-text-500" },
];

export const PriorityIcon = ({ priority }: { priority: string }) => {
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
