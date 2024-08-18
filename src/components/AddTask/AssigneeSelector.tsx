import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Check, User, UserPlus } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import { TaskType } from "@/types/project";

const AssigneeSelector = ({
  onClose,
  positionClassNames,
  task,
  setTask,
}: {
  onClose: () => void;
  positionClassNames?: string;
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
}) => {
  const { profile } = useAuthProvider();
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <>
      <div
        className={`absolute bg-white border rounded-md overflow-hidden z-[20] text-xs w-[250px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] ${
          positionClassNames ? positionClassNames : "top-full left-1/2 -translate-x-1/2"
        }`}
      >
        <div className="p-2 border-b border-gray-200">
          <Input
            howBig="sm"
            fullWidth
            type="text"
            placeholder="Type an assignee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ul>
          <li
            className="flex items-center justify-between p-2 px-3 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setTask({
                ...task,
                assigned_to_id: null,
              });
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <User strokeWidth={1.5} size={18} className="text-gray-500" />
              Unassigned
            </div>

            {task.assigned_to_id == null && (
              <Check strokeWidth={2.5} className="w-4 h-4 text-indigo-600" />
            )}
          </li>
          <li
            className="flex items-center justify-between p-2 px-3 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setTask({
                ...task,
                assigned_to_id: profile?.id!,
              });
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <Image
                src={profile?.avatar_url || "/default_avatar.png"}
                alt={profile?.full_name || profile?.username || "avatar"}
                width={18}
                height={18}
                className="rounded-full"
              />
              Me ({profile?.full_name.split(" ")[0]}{" "}
              {profile?.full_name.split(" ")[1][0] &&
                profile?.full_name.split(" ")[1][0]+"."}
              )
            </div>

            {task.assigned_to_id == profile?.id && (
              <Check strokeWidth={2.5} className="w-4 h-4 text-indigo-600" />
            )}
          </li>
          <li
            className="flex items-center justify-between p-2 px-3 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <UserPlus strokeWidth={1.5} size={18} className="text-gray-500" />
              Invite to people
            </div>
          </li>
        </ul>
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default AssigneeSelector;
