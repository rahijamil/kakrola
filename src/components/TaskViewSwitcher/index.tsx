import React, {
  useState,
  useMemo,
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
  sections?: SectionType[];
  view: ViewTypes["view"];
  onTaskUpdate: (updatedTask: Task) => void;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
}

const TaskViewSwitcher: React.FC<TaskViewSwitcherProps> = ({
  tasks,
  view,
  sections,
  onTaskUpdate,
  showShareOption,
  setShowShareOption,
}) => {
  const [showAddTask, setShowAddTask] = useState<number | null>(null);
  const { activeProject } = useTaskProjectDataProvider();

  const [showUngroupedAddTask, setShowUngroupedAddTask] = useState<boolean>(false);
  const [showUngroupedAddSection, setShowUngroupedAddSection] = useState<boolean>(false);

  const { groupedTasks, unGroupedTasks } = useMemo(() => {
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

    return { groupedTasks: grouped, unGroupedTasks: ungrouped };
  }, [tasks, activeProject?.id]);


  switch (view) {
    case "List":
      return (
        <ListView
          activeProjectSections={sections}
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
          sections={sections || []}
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