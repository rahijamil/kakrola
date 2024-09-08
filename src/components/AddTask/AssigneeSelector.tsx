import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Check, ChevronDown, Plus, User, UserPlus, X } from "lucide-react";
import { ProjectType, TaskPriority, TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";
import { useQuery } from "@tanstack/react-query";
import { fetchAssigneeProfiles } from "@/lib/queries";
import { v4 as uuidv4 } from "uuid";
import AnimatedTaskCheckbox from "../TaskViewSwitcher/AnimatedCircleCheck";
import { ProfileType } from "@/types/user";
import { debounce } from "lodash";
import useAssignee from "@/hooks/useAssignee";

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
  }, 300); // 300ms debounce delay

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef(null);

  const { assigneeProfiles } = useAssignee({ project_id: project?.id });

  const getAssigneeProfileById = (profileId: string | null) => {
    return assigneeProfiles.find((profile) => profile.id === profileId);
  };

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
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) =>
        forTaskModal ? (
          <div
            onClick={onClick}
            className={`rounded-full transition p-2 px-4 group w-full flex items-center justify-between ${
              isOpen
                ? "bg-primary-50 cursor-pointer"
                : "hover:bg-text-100 cursor-pointer"
            }`}
          >
            <button
              ref={triggerRef}
              className={`flex items-center justify-between`}
            >
              {task.assignees.length === 0 ? (
                <span>No assignee</span>
              ) : (
                task.assignees.map((assignee) => (
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        getAssigneeProfileById(assignee.profile_id)?.avatar_url ||
                        "/default_avatar.png"
                      }
                      width={18}
                      height={18}
                      alt={
                        getAssigneeProfileById(assignee.profile_id)?.full_name ||
                        getAssigneeProfileById(assignee.profile_id)?.username ||
                        "avatar"
                      }
                      className="rounded-full object-cover max-w-[18px] max-h-[18px]"
                    />
                    {
                      getAssigneeProfileById(assignee.profile_id)?.full_name.split(
                        " "
                      )[0]
                    }
                    {getAssigneeProfileById(assignee.profile_id)?.full_name.split(
                      " "
                    )[1] // Check if the second name exists
                      ? " " +
                        getAssigneeProfileById(assignee.profile_id)?.full_name.split(
                          " "
                        )[1][0] +
                        "." // Display the initial of the second name
                      : ""}
                  </div>
                ))
              )}
            </button>

            <ChevronDown
              strokeWidth={1.5}
              className={`w-4 h-4 transition ${
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
                <div className="flex items-center gap-1">
                  <Image
                    src={
                      getAssigneeProfileById(assignee.profile_id)?.avatar_url ||
                      "/default_avatar.png"
                    }
                    width={20}
                    height={20}
                    alt={
                      getAssigneeProfileById(assignee.profile_id)?.full_name ||
                      getAssigneeProfileById(assignee.profile_id)?.username ||
                      "avatar"
                    }
                    className="rounded-full object-cover max-w-5 max-h-5"
                  />
                  {/* {getAssigneeProfileById(assignee.profile_id)?.full_name.split(" ")[0]}
                  {getAssigneeProfileById(assignee.profile_id)?.full_name.split(" ")[1] // Check if the second name exists
                    ? " " +
                      getAssigneeProfileById(assignee.profile_id)?.full_name.split(
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
            className={`flex items-center justify-between gap-1 cursor-pointer text-xs px-2 h-10 group relative ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            {task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <>
                  <div className="flex items-center gap-1">
                    <Image
                      src={
                        getAssigneeProfileById(assignee.profile_id)?.avatar_url ||
                        "/default_avatar.png"
                      }
                      width={20}
                      height={20}
                      alt={
                        getAssigneeProfileById(assignee.profile_id)?.full_name ||
                        getAssigneeProfileById(assignee.profile_id)?.username ||
                        "avatar"
                      }
                      className="rounded-full object-cover max-w-5 max-h-5"
                    />
                    {
                      getAssigneeProfileById(assignee.profile_id)?.full_name.split(
                        " "
                      )[0]
                    }
                    {getAssigneeProfileById(assignee.profile_id)?.full_name.split(
                      " "
                    )[1] // Check if the second name exists
                      ? " " +
                        getAssigneeProfileById(assignee.profile_id)?.full_name.split(
                          " "
                        )[1][0] +
                        "." // Display the initial of the second name
                      : ""}
                  </div>
                </>
              ))
            ) : (
              <div className="flex items-center gap-1">
                <div className="rounded-full w-5 h-5 flex items-center justify-center bg-surface text-text-500">
                  <UserPlus size={16} />
                </div>
                <p className="text-xs">Assign</p>
              </div>
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
                className="rounded-full object-cover max-w-5 max-h-5"
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
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-2"
          howBig="xs"
        />
      }
    />
  );
};

export default AssigneeSelector;
