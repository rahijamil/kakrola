import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import ListView from "./ListView";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import { ViewTypes } from "@/types/viewTypes";
import DashboardView from "./DashboardView";

interface TaskViewSwitcherProps {
  project: ProjectType | null;
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  sections: SectionType[];
  setSections: (updatedSections: SectionType[]) => void;
  view: ViewTypes["view"];
  showNoDateTasks?: boolean;
  setShowNoDateTasks?: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const TaskViewSwitcher: React.FC<TaskViewSwitcherProps> = ({
  project,
  tasks,
  setTasks,
  view,
  sections,
  setSections,
  showNoDateTasks,
  setShowNoDateTasks,
  isLoading,
}) => {
  const [showAddTask, setShowAddTask] = useState<string | number | null>(null);

  const [showUngroupedAddTask, setShowUngroupedAddTask] =
    useState<boolean>(false);
  const [showUngroupedAddSection, setShowUngroupedAddSection] =
    useState<boolean>(false);

  const { groupedTasks, unGroupedTasks } = useMemo(() => {
    const grouped: Record<number, TaskType[]> = {};
    const ungrouped: TaskType[] = [];

    tasks
      .filter((task) => (project ? task.project_id === project.id : true))
      .forEach((task) => {
        if (task.section_id) {
          if (!grouped[task.section_id as number]) {
            grouped[task.section_id as number] = [];
          }
          grouped[task.section_id as number].push(task);
        } else {
          ungrouped.push(task);
        }
      });

    return { groupedTasks: grouped, unGroupedTasks: ungrouped };
  }, [tasks, project]);

  switch (view) {
    case "List":
      return (
        <ListView
          sections={sections}
          setSections={setSections}
          groupedTasks={groupedTasks}
          unGroupedTasks={unGroupedTasks}
          showAddTask={showAddTask}
          setShowAddTask={setShowAddTask}
          showUngroupedAddSection={showUngroupedAddSection}
          setShowUngroupedAddSection={setShowUngroupedAddSection}
          showUngroupedAddTask={showUngroupedAddTask}
          setShowUngroupedAddTask={setShowUngroupedAddTask}
          project={project}
          setTasks={setTasks}
          tasks={tasks}
          isLoading={isLoading}
        />
      );
    case "Board":
      return (
        <BoardView
          tasks={tasks}
          sections={sections}
          setSections={setSections}
          groupedTasks={groupedTasks}
          unGroupedTasks={unGroupedTasks}
          showAddTask={showAddTask}
          setShowAddTask={setShowAddTask}
          showUngroupedAddSection={showUngroupedAddSection}
          setShowUngroupedAddSection={setShowUngroupedAddSection}
          showUngroupedAddTask={showUngroupedAddTask}
          setShowUngroupedAddTask={setShowUngroupedAddTask}
          project={project}
          setTasks={setTasks}
          isLoading={isLoading}
        />
      );
    case "Calendar":
      return (
        <CalendarView
          tasks={tasks}
          setTasks={setTasks}
          showNoDateTasks={showNoDateTasks}
          setShowNoDateTasks={setShowNoDateTasks}
          project={project}
        />
      );
    case "Dashboard":
      return (
        <DashboardView tasks={tasks} sections={sections} project={project} />
      );
    default:
      return <div>Invalid view selected</div>;
  }
};

export default TaskViewSwitcher;
