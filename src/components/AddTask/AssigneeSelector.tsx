import React, {
  Dispatch,
  LegacyRef,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Check, Plus, User, UserPlus, X } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import { TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";
import { useGlobalOption } from "@/context/GlobalOptionContext";

const AssigneeSelector = ({
  task,
  setTask,
  isSmall,
  forTaskModal,
  forListView,
  dataFromElement,
}: {
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
  forTaskModal?: boolean;
  forListView?: boolean;
  dataFromElement?: boolean;
}) => {
  const { profile } = useAuthProvider();
  const { setShowShareOption } = useGlobalOption();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const triggerRef = useRef(null);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) =>
        forTaskModal ? (
          <div>
            <button
              onClick={() => task.assigned_to_id == null && setIsOpen(true)}
              className={`flex items-center justify-between rounded-full transition p-[6px] px-2 group w-full ${
                task.assigned_to_id == null
                  ? isOpen
                    ? "bg-primary-100 cursor-pointer"
                    : "hover:bg-text-100 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <p
                className={`font-semibold text-xs ${
                  task.assigned_to_id !== null && "cursor-text"
                }`}
              >
                Assignee
              </p>

              {task.assigned_to_id == null && (
                <Plus strokeWidth={1.5} className="w-4 h-4" />
              )}
            </button>

            {task.assigned_to_id !== null && (
              <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center relative rounded-full transition py-[6px] px-2 group w-full text-xs ${
                  task.assigned_to_id !== null
                    ? isOpen
                      ? "bg-primary-100 cursor-pointer"
                      : "hover:bg-text-100 cursor-pointer"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={profile?.avatar_url || "/default_avatar.png"}
                    width={18}
                    height={18}
                    alt={profile?.full_name || profile?.username || "avatar"}
                    className="rounded-full object-cover max-w-[18px] max-h-[18px]"
                  />
                  {profile?.full_name.split(" ")[0]}
                  {profile?.full_name.split(" ")[1] // Check if the second name exists
                    ? " " + profile?.full_name.split(" ")[1][0] + "." // Display the initial of the second name
                    : ""}
                </div>

                <div
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTask({ ...task, assigned_to_id: null });
                  }}
                  className="p-1 rounded-full hover:bg-surface absolute top-1/2 -translate-y-1/2 right-1"
                >
                  <X strokeWidth={1.5} size={16} />
                </div>
              </button>
            )}
          </div>
        ) : forListView ? (
          <div
            data-form-element={dataFromElement}
            ref={triggerRef}
            data-state={"assignee"}
            className={`flex items-center justify-between gap-1 cursor-pointer text-xs px-2 h-10 group relative ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            {task.assigned_to_id ? (
              <>
                <div className="flex items-center gap-1">
                  <Image
                    src={profile?.avatar_url || "/default_avatar.png"}
                    width={20}
                    height={20}
                    alt={profile?.full_name || profile?.username || "avatar"}
                    className="rounded-full object-cover max-w-5 max-h-5"
                  />
                  {profile?.full_name.split(" ")[0]}
                  {profile?.full_name.split(" ")[1] // Check if the second name exists
                    ? " " + profile?.full_name.split(" ")[1][0] + "." // Display the initial of the second name
                    : ""}
                </div>

                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTask({ ...task, assigned_to_id: null });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-200 rounded-full hidden group-data-[state=assignee]:group-hover:inline-block absolute top-1/2 -translate-y-1/2 right-2"
                >
                  <X strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 flex items-center justify-center border border-text-400 border-dashed rounded-full">
                  <User strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                </div>
                {/* {!isSmall && <span className="text-text-700">Assignee</span>} */}
              </div>
            )}
          </div>
        ) : (
          <div
            ref={triggerRef}
            className={`flex items-center gap-1 cursor-pointer text-xs px-2 p-1 rounded-full border border-text-200 ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
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
                    className="rounded-full object-cover max-w-[18px] max-h-[18px]"
                  />
                  {profile?.full_name.split(" ")[0]}
                  {profile?.full_name.split(" ")[1] // Check if the second name exists
                    ? " " + profile?.full_name.split(" ")[1][0] + "." // Display the initial of the second name
                    : ""}
                </div>

                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTask({ ...task, assigned_to_id: null });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-100 rounded-full"
                >
                  <X strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                </button>
              </>
            ) : (
              <>
                <User strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                {!isSmall && <span className="text-text-700">Assignee</span>}
              </>
            )}
          </div>
        )
      }
      content={
        <div data-form-element={dataFromElement}>
          <div className="p-2 border-b border-text-200">
            <Input
              howBig="xs"
              fullWidth
              type="text"
              placeholder="Type an assignee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="py-1">
            <li
              className="flex items-center justify-between p-2 px-3 transition-colors text-text-700 hover:bg-text-100 cursor-pointer rounded-2xl"
              onClick={() => {
                setTask({
                  ...task,
                  assigned_to_id: null,
                });
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <User strokeWidth={1.5} size={18} className="text-text-500" />
                Unassigned
              </div>

              {task.assigned_to_id == null && (
                <Check strokeWidth={2.5} className="w-4 h-4 text-primary-600" />
              )}
            </li>
            <li
              className="flex items-center justify-between p-2 px-3 transition-colors text-text-700 hover:bg-text-100 cursor-pointer rounded-2xl"
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
                  className="rounded-full object-cover max-w-[18px] max-h-[18px]"
                />
                Me ({profile?.full_name.split(" ")[0]}
                {profile?.full_name.split(" ")[1] // Check if the second name exists
                  ? " " + profile?.full_name.split(" ")[1][0] + "." // Display the initial of the second name
                  : ""}
                )
              </div>

              {task.assigned_to_id == profile?.id && (
                <Check strokeWidth={2.5} className="w-4 h-4 text-primary-600" />
              )}
            </li>
            <li
              className="flex items-center justify-between p-2 px-3 transition-colors text-text-700 hover:bg-text-100 cursor-pointer rounded-2xl"
              onClick={() => {
                setShowShareOption(true);
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <UserPlus
                  strokeWidth={1.5}
                  size={18}
                  className="text-text-500"
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
