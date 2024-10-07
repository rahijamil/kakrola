import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Plus, SquarePen, Tag, UserPlus, X } from "lucide-react";
import { TaskLabelType, TaskPriority, TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";
import { debounce } from "lodash";
import AnimatedTaskCheckbox from "../TaskViewSwitcher/AnimatedCircleCheck";
import { Button } from "../ui/button";
import ColorSelector from "../AddEditProject/ColorSelector";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { generateSlug } from "@/utils/generateSlug";
import Spinner from "../ui/Spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileType } from "@/types/user";
import { colors } from "@/utils/colors";
import useTheme from "@/hooks/useTheme";
import { Theme } from "@/lib/theme.types";
import { v4 as uuidv4 } from "uuid";

const fetchTaskLabels = async (
  profile_id?: ProfileType["id"]
): Promise<TaskLabelType[]> => {
  try {
    if (!profile_id) return [];

    const { data, error } = await supabaseBrowser
      .from("task_labels")
      .select("id, name, slug, color, is_favorite, profile_id")
      .eq("profile_id", profile_id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(`Error fetching task labels: `, error);
    return [];
  }
};

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
  const { profile } = useAuthProvider();

  const { data: taskLabels = [] } = useQuery({
    queryKey: ["task_labels", profile?.id],
    queryFn: async () => await fetchTaskLabels(profile?.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 0); // 0ms debounce delay

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [createLabel, setCreateLabel] = useState(false);
  const [editLabelId, setLabelId] = useState<TaskLabelType["id"] | null>(null);

  const triggerRef = useRef(null);

  const findLabelById = useMemo(() => {
    return taskLabels.find((label) => label.id == editLabelId);
  }, [taskLabels, editLabelId]);

  const [labelData, setLabelData] = useState<Omit<TaskLabelType, "id">>({
    name: "",
    slug: "",
    color: "gray-500",
    profile_id: profile?.id || "",
    is_favorite: false,
  });

  useEffect(() => {
    if (editLabelId && findLabelById) {
      setLabelData(findLabelById);
    }
  }, [findLabelById, editLabelId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const handleClose = () => {
    setCreateLabel(false);
    setLabelId(null);
    setLabelData({
      name: "",
      slug: "",
      color: "gray-500",
      profile_id: profile?.id || "",
      is_favorite: false,
    });
  };

  const handleSubmit = async () => {
    if (!labelData.name.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (profile) {
        if (editLabelId) {
          const optimisticData: TaskLabelType = {
            ...labelData,
            id: editLabelId,
          };

          queryClient.setQueryData(
            ["task_labels", profile.id],
            (oldData: TaskLabelType[]) =>
              oldData.map((item) =>
                item.id == editLabelId ? optimisticData : item
              )
          );

          const { data, error } = await supabaseBrowser
            .from("task_labels")
            .update({
              name: labelData.name,
              color: labelData.color,
            })
            .eq("id", editLabelId)
            .select()
            .single();

          if (error) throw error;
        } else {
          const tempId = uuidv4();
          const dataToInsert: Omit<TaskLabelType, "id"> = {
            color: labelData.color,
            name: labelData.name.trim(),
            slug: generateSlug(labelData.name.trim()),
            is_favorite: false,
            profile_id: profile.id,
          };

          queryClient.setQueryData(
            ["task_labels", profile.id],
            (oldData: TaskLabelType[]) => [
              ...oldData,
              { ...dataToInsert, id: tempId },
            ]
          );

          const { data, error } = await supabaseBrowser
            .from("task_labels")
            .insert(dataToInsert)
            .select("id")
            .single();

          if (error) throw error;

          queryClient.setQueryData(
            ["task_labels", profile.id],
            (oldData: TaskLabelType[]) =>
              oldData.map((item) =>
                item.id == tempId ? { ...item, id: data.id } : item
              )
          );
        }

        // createActivityLog({
        //   actor_id: profile.id,
        //   action: ActivityAction.CREATED_LABEL,
        //   entity_type: EntityType.LABEL,
        //   entity_id: data.id,
        //   metadata: {
        //     new_data: data,
        //   },
        // });
      }
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dropdown
      title={
        createLabel ? "Create label" : editLabelId ? "Edit label" : "Labels"
      }
      titleRightAction={
        (createLabel || editLabelId) && (
          <button
            className="text-text-500 hover:text-text-700 transition"
            onClick={handleClose}
          >
            <X strokeWidth={1.5} className="w-4 h-4" />
          </button>
        )
      }
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
            {task.task_labels && task.task_labels.length > 0 ? (
              task.task_labels.map((label) => (
                <div
                  key={label.id}
                  style={{
                    backgroundColor:
                      colors.find((c) => c.value == label.color)?.color +
                      (theme == Theme.DARK ? "80" : "a0"),
                  }}
                  className="px-1 rounded-md font-medium text-text-900"
                >
                  {label.name}
                </div>
              ))
            ) : (
              <div>
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
      items={
        createLabel || editLabelId
          ? []
          : taskLabels
              .filter((label) =>
                label.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase().trim())
              )
              .map((label, index) => ({
                id: index,
                icon: (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => {}}
                    disabled
                    is_completed={
                      task.task_labels?.find((l) => l.id == label.id)
                        ? true
                        : false
                    }
                  />
                ),
                onClick: () =>
                  setTask({
                    ...task,
                    task_labels: task.task_labels?.find((l) => l.id == label.id)
                      ? task.task_labels.filter((l) => l.id != label.id)
                      : [...(task.task_labels || []), label],
                  }),
                label: label.name,
                className: `group`,
                textColor: "text-text-900",
                bgColor: `px-1 rounded-md font-medium`,
                style: {
                  backgroundColor:
                    colors.find((c) => c.value == label.color)?.color +
                    (theme == Theme.DARK ? "80" : "a0"),
                },
                rightContent: (
                  <button
                    className="transition text-text-500 dark:text-text-600 hover:text-text-900 opacity-0 group-hover:opacity-100"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setLabelId(label.id);
                    }}
                  >
                    <SquarePen strokeWidth={1.5} className="w-4 h-4" />
                  </button>
                ),
              }))
      }
      beforeItemsContent={
        !createLabel &&
        !editLabelId && (
          <div className="p-2">
            <Input
              placeholder="Search labels..."
              value={searchQuery}
              onChange={handleSearchChange}
              howBig="xs"
            />
          </div>
        )
      }
      content={
        createLabel || editLabelId ? (
          <div className="px-4 pb-2 pt-1 space-y-2">
            <Input
              label="Name"
              howBig="xs"
              placeholder="Name"
              value={labelData.name}
              onChange={(ev) =>
                setLabelData((prev) => ({ ...prev, name: ev.target.value }))
              }
            />
            <ColorSelector
              onChange={(color) => setLabelData((prev) => ({ ...prev, color }))}
              value={labelData.color}
              height="h-8"
              Icon={Tag}
            />

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <div className="flex items-center justify-end gap-4 border-t border-text-100 pt-2">
              {/* <Button
                type="button"
                variant="secondary"
                disabled={loading}
                size="xs"
                onClick={() => setCreateLabel(false)}
              >
                Cancel
              </Button> */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={labelData.name.trim().length == 0 || loading}
                size="xs"
                fullWidth
              >
                {loading ? (
                  <Spinner color="white" />
                ) : editLabelId ? (
                  "Edit"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-2 px-4">
            <Button
              onClick={() => setCreateLabel(true)}
              variant="ghost"
              size="sm"
              fullWidth
            >
              Create New Label
            </Button>
          </div>
        )
      }
    />
  );
};

export default LabelSelector;
