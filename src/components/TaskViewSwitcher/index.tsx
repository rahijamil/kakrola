import React, {
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { SectionType, Task } from "@/types/project";
import ListView from "./ListView";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ViewTypes } from "@/types/viewTypes";

interface TaskViewSwitcherProps {
  tasks: Task[];
  view: ViewTypes["view"];
  onTaskUpdate: (updatedTask: Task) => void;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
}

const TaskViewSwitcher: React.FC<TaskViewSwitcherProps> = ({
  tasks,
  view,
  onTaskUpdate,
  showShareOption,
  setShowShareOption,
}) => {
  const [showAddTask, setShowAddTask] = useState<number | null>(null);
  const { sections, activeProject } = useTaskProjectDataProvider();
  const [activeProjectSections, setActiveProjectSections] = useState<
    SectionType[]
  >([]);
  const [unGroupedTasks, setUnGroupedTasks] = useState<Task[]>([]);

  const [showUngroupedAddTask, setShowUngroupedAddTask] =
    useState<boolean>(false);
  const [showUngroupedAddSection, setShowUngroupedAddSection] =
    useState<boolean>(false);

  const { groupedTasks, unSectionedTasks } = useMemo(() => {
    const grouped: Record<number, Task[]> = {};
    const ungrouped: Task[] = [];

    tasks
      .filter((task) => task.project?.id === activeProject?.id)
      .forEach((task) => {
        if (task.section) {
          if (!grouped[task.section.id]) {
            grouped[task.section.id] = [];
          }
          grouped[task.section.id].push(task);
        } else {
          ungrouped.push(task);
        }
      });

    return { groupedTasks: grouped, unSectionedTasks: ungrouped };
  }, [tasks, activeProject?.id]);

  // Update the state outside of useMemo
  useEffect(() => {
    setUnGroupedTasks(unSectionedTasks);
  }, [unGroupedTasks]);

  useEffect(() => {
    setActiveProjectSections(
      sections.filter((s) => s.project.id == activeProject?.id)
    );
  }, [activeProject?.id, sections]);

  switch (view) {
    case "List":
      return (
        <ListView
          activeProjectSections={activeProjectSections}
          groupedTasks={groupedTasks}
          unGroupedTasks={unGroupedTasks}
          onTaskUpdate={onTaskUpdate}
          showAddTask={showAddTask}
          setShowAddTask={setShowAddTask}
          showUngroupedAddSection={showUngroupedAddSection}
          setShowUngroupedAddSection={setShowUngroupedAddSection}
          showUngroupedAddTask={showUngroupedAddTask}
          setShowUngroupedAddTask={setShowUngroupedAddTask}
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
        />
      );
    case "Board":
      return (
        <BoardView
          activeProjectSections={activeProjectSections}
          groupedTasks={groupedTasks}
          unGroupedTasks={unGroupedTasks}
          onTaskUpdate={onTaskUpdate}
          showAddTask={showAddTask}
          setShowAddTask={setShowAddTask}
          showUngroupedAddSection={showUngroupedAddSection}
          setShowUngroupedAddSection={setShowUngroupedAddSection}
          showUngroupedAddTask={showUngroupedAddTask}
          setShowUngroupedAddTask={setShowUngroupedAddTask}
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
        />
      );
    case "Calendar":
      return <CalendarView tasks={tasks} onTaskUpdate={onTaskUpdate} />;
    default:
      return <div>Invalid view selected</div>;
  }
};

export default TaskViewSwitcher;
