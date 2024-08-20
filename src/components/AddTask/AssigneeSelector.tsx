import React, {
  Dispatch,
  LegacyRef,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Check, User, UserPlus, X } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import { TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";

const AssigneeSelector = ({
  task,
  setTask,
  isSmall,
}: {
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
}) => {
  const { profile } = useAuthProvider();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ ref, onClick }) => (
        <div
          ref={ref as LegacyRef<HTMLDivElement>}
          className={`flex items-center gap-1 cursor-pointer text-xs p-1 rounded-lg border border-gray-200 ${
            isOpen ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={onClick}
        >
          {task.assigned_to_id ? (
            <>
              <div className="flex items-center gap-1">
                <Image
                  src={profile?.avatar_url || "/default_avatar.png"}
                  width={18}
                  height={18}
                  alt={profile?.full_name || profile?.username || "avatar"}
                  className="rounded-full"
                />
                {profile?.full_name.split(" ")[0]}{" "}
                {profile?.full_name.split(" ")[1][0] &&
                  profile?.full_name.split(" ")[1][0] + "."}
              </div>

              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  setTask({ ...task, assigned_to_id: null });
                }}
                className="text-gray-500 hover:text-gray-700 p-[2px] hover:bg-gray-200 rounded-lg"
              >
                <X strokeWidth={1.5} className="w-3 h-3 text-gray-500" />
              </button>
            </>
          ) : (
            <>
              <User strokeWidth={1.5} className="w-4 h-4 text-gray-500" />
              {!isSmall && <span className="text-gray-700">Assignee</span>}
            </>
          )}
        </div>
      )}
      content={
        <div>
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
                  profile?.full_name.split(" ")[1][0] + "."}
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
                <UserPlus
                  strokeWidth={1.5}
                  size={18}
                  className="text-gray-500"
                />
                Invite to people
              </div>
            </li>
          </ul>
        </div>
      }
      contentWidthClass="w-[250px] text-xs"
    />
  );
};

export default AssigneeSelector;
