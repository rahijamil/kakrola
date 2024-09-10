import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Check, Plus, Tag, User, UserPlus, X } from "lucide-react";
import { ProjectType, TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";
import { debounce } from "lodash";

const LabelSelector = ({
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300); // 300ms debounce delay

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);

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
              ref={triggerRef}
              onClick={onClick}
              className={`flex items-center justify-between rounded-lg transition p-[6px] px-2 group w-full ${
                task.assignees.length === 0
                  ? isOpen
                    ? "bg-primary-100 cursor-pointer"
                    : "hover:bg-text-100 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <p
                className={`font-semibold text-xs ${
                  task.assignees.length > 0 && "cursor-text"
                }`}
              >
                Assignee
              </p>

              {task.assignees.length === 0 && (
                <Plus strokeWidth={1.5} className="w-4 h-4" />
              )}
            </button>

            {task.assignees.map((assignee) => (
              <button
                key={assignee.id}
                onClick={() => setIsOpen(true)}
                className={`flex items-center relative rounded-lg transition py-[6px] px-2 group w-full text-xs ${
                  task.assignees.length > 0
                    ? isOpen
                      ? "bg-primary-100 cursor-pointer"
                      : "hover:bg-text-100 cursor-pointer"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={"/default_avatar.png"}
                    width={18}
                    height={18}
                    alt={"avatar"}
                    className="rounded-md object-cover max-w-[18px] max-h-[18px]"
                  />
                </div>

                <div
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTask({ ...task, assignees: [] });
                  }}
                  className="p-1 rounded-lg hover:bg-surface absolute top-1/2 -translate-y-1/2 right-1"
                >
                  <X strokeWidth={1.5} size={16} />
                </div>
              </button>
            ))}
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
                    src={"/default_avatar.png"}
                    width={20}
                    height={20}
                    alt={"avatar"}
                    className="rounded-md object-cover max-w-5 max-h-5"
                  />
                  {/* {getProfileById(assignee.profile_id)?.full_name.split(" ")[0]}
                  {getProfileById(assignee.profile_id)?.full_name.split(" ")[1] // Check if the second name exists
                    ? " " +
                      getProfileById(assignee.profile_id)?.full_name.split(
                        " "
                      )[1][0] +
                      "." // Display the initial of the second name
                    : ""} */}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1">
                <Tag strokeWidth={1.5} className="w-4 h-4 text-text-500" />
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
                <div key={assignee.id} className="flex items-center gap-1">
                  <Image
                    src={"/default_avatar.png"}
                    width={20}
                    height={20}
                    alt={"avatar"}
                    className="rounded-md object-cover max-w-5 max-h-5"
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1">
                <div className="rounded-lg w-5 h-5 flex items-center justify-center bg-surface text-text-500">
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
      items={[]}
      beforeItemsContent={
        <Input
          placeholder="Search labels..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-2"
          howBig="xs"
        />
      }
    />
  );
};

export default LabelSelector;
