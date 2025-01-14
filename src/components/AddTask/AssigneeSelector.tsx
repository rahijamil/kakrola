import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Check, ChevronDown, Plus, User, UserPlus, X } from "lucide-react";
import { ProjectType, TaskPriority, TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import AnimatedTaskCheckbox from "../TaskViewSwitcher/AnimatedCircleCheck";
import { ProfileType } from "@/types/user";
import { debounce } from "lodash";
import { PersonalMemberForProjectType } from "@/types/team";

interface MemberData extends PersonalMemberForProjectType {
  profile: ProfileType;
}

const AssigneeSelector = ({
  task,
  setTask,
  isSmall,
  forTaskModal,
  forListView,
  dataFromElement,
  project,
}: {
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
  forTaskModal?: boolean;
  forListView?: boolean;
  dataFromElement?: boolean;
  project: ProjectType | null;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 0); // 300ms debounce delay

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef(null);
  const queryClient = useQueryClient();

  const assignees: MemberData[] = queryClient.getQueryData([
    "membersData",
    project?.id,
    undefined,
  ]) || [];

  const assigneeProfiles = useMemo(() => {
    if (assignees) {
      return assignees.map((item) => item.profile);
    }
    else {
      return []
    }
  }, [assignees]);

  const handleProfileClick = (profile: ProfileType) => {
    const isExistAssignee = task.assignees.some(
      (assignee) => assignee.profile_id === profile.id
    );
    if (!isExistAssignee) {
      setTask({
        ...task,
        assignees: [
          ...task.assignees,
          {
            profile_id: profile.id,
            id: uuidv4(),
            name: profile.full_name,
            avatar_url: profile.avatar_url,
            created_at: new Date().toISOString(),
          },
        ],
      });
    } else {
      setTask({
        ...task,
        assignees: task.assignees.filter(
          (assignee) => assignee.profile_id !== profile.id
        ),
      });
    }
  };

  return (
    <Dropdown
      title="Select Assignee"
      fullMode
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) =>
        forTaskModal ? (
          <div
            onClick={onClick}
            className={`rounded-lg transition p-2 px-4 group w-full flex items-center justify-between ${
              isOpen
                ? "bg-primary-50 cursor-pointer"
                : "hover:bg-text-100 cursor-pointer"
            }`}
          >
            <button ref={triggerRef} className={`flex items-center gap-2`}>
              {task.assignees.length === 0 ? (
                <span className="text-text-500">No assignee</span>
              ) : (
                task.assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-2">
                    <Image
                      src={assignee.avatar_url || "/default_avatar.png"}
                      width={18}
                      height={18}
                      alt={assignee.name || "avatar"}
                      className="rounded-md object-cover max-w-[18px] max-h-[18px]"
                    />
                    {assignee.name.split(" ")[0]}
                    {assignee.name.split(" ")[1] // Check if the second name exists
                      ? " " + assignee.name.split(" ")[1][0] + "." // Display the initial of the second name
                      : ""}
                  </div>
                ))
              )}
            </button>

            <ChevronDown
              strokeWidth={1.5}
              className={`w-4 h-4 transition text-text-500 ${
                !isOpen && "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
        ) : forListView ? (
          <div
            data-form-element={dataFromElement}
            ref={triggerRef}
            data-state={"assignee"}
            className={`flex items-center gap-1 cursor-pointer text-xs px-2 h-10 group relative ring-1 ${
              isOpen
                ? "ring-primary-300 bg-primary-10"
                : "hover:ring-primary-300 ring-transparent"
            }`}
            onClick={onClick}
          >
            {task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-1">
                  <Image
                    src={assignee.avatar_url || "/default_avatar.png"}
                    width={20}
                    height={20}
                    alt={assignee.name || "avatar"}
                    className="rounded-md object-cover max-w-5 max-h-5"
                  />
                  {/* {assignee.full_name.split(" ")[0]}
                  {assignee.full_name.split(" ")[1] // Check if the second name exists
                    ? " " +
                      assignee.full_name.split(
                        " "
                      )[1][0] +
                      "." // Display the initial of the second name
                    : ""} */}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1">
                <UserPlus strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                {/* {!isSmall && <span className="text-text-700">Assign</span>} */}
              </div>
            )}
          </div>
        ) : (
          <div
            data-form-element={dataFromElement}
            ref={triggerRef}
            data-state={"assignee"}
            className={`flex items-center gap-1 cursor-pointer p-1 px-2 text-[11px] rounded-lg border border-text-100 text-text-500 ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            {task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <Fragment key={assignee.id}>
                  <div className="flex items-center gap-1">
                    <Image
                      src={assignee.avatar_url || "/default_avatar.png"}
                      width={20}
                      height={20}
                      alt={assignee.name || "avatar"}
                      className="rounded-md object-cover max-w-5 max-h-5"
                    />
                    {assignee.name.split(" ")[0]}
                    {assignee.name.split(" ")[1] // Check if the second name exists
                      ? " " + assignee.name.split(" ")[1][0] + "." // Display the initial of the second name
                      : ""}
                  </div>

                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setTask({
                        ...task,
                        assignees: task.assignees.filter(
                          (a) => a.id != assignee.id
                        ),
                      });
                    }}
                    className="text-text-500 hover:text-text-900 p-[2px] hover:bg-text-100 rounded-lg"
                  >
                    <X strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                  </button>
                </Fragment>
              ))
            ) : (
              <>
                <UserPlus strokeWidth={1.5} className="w-4 h-4" />
                {!isSmall && <p className="text-xs">Assign</p>}
              </>
            )}
          </div>
        )
      }
      dataFromElement
      autoClose={false}
      items={[
        {
          id: 0,
          label: "Unassigned",
          icon: <User strokeWidth={1.5} className="w-4 h-4 text-text-500" />,
          onClick: () => {
            setTask({ ...task, assignees: [] });
            setIsOpen(false);
          },
        },
        ...assigneeProfiles
          .filter(
            (profile) =>
              profile.full_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase().trim()) ||
              profile.username
                .toLowerCase()
                .includes(searchQuery.toLowerCase().trim()) ||
              profile.email
                .toLowerCase()
                .includes(searchQuery.toLowerCase().trim())
          )
          .map((profile, index) => ({
            id: index + 1,
            label: profile.full_name,
            icon: (
              <Image
                src={profile.avatar_url || "/default_avatar.png"}
                width={20}
                height={20}
                alt={profile.full_name || profile.username || "avatar"}
                className="rounded-md object-cover max-w-5 max-h-5"
              />
            ),
            onClick: () => handleProfileClick(profile),
            rightContent: (
              <AnimatedTaskCheckbox
                priority={TaskPriority.P3}
                playSound={false}
                handleCheckSubmit={() => handleProfileClick(profile)}
                is_completed={task.assignees.some(
                  (assignee) => assignee.profile_id === profile.id
                )}
              />
            ),
          })),
      ]}
      beforeItemsContent={
        <div className="px-4 py-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            howBig="xs"
          />
        </div>
      }
    />
  );
};

export default AssigneeSelector;
