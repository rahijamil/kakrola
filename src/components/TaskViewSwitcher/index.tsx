import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import ListView from "./ListView";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import { ViewTypes } from "@/types/viewTypes";

interface TaskViewSwitcherProps {
  project: ProjectType | null;
  tasks: TaskType[];
  sections: SectionType[];
  setSections: Dispatch<SetStateAction<SectionType[]>>;
  view: ViewTypes["view"];
  onTaskUpdate: (updatedTask: TaskType) => void;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
}

const TaskViewSwitcher: React.FC<TaskViewSwitcherProps> = ({
  project,
  tasks,
  view,
  sections,
  setSections,
  onTaskUpdate,
  showShareOption,
  setShowShareOption,
}) => {
  const [showAddTask, setShowAddTask] = useState<number | null>(null);

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
          if (!grouped[task.section_id]) {
            grouped[task.section_id] = [];
          }
          grouped[task.section_id].push(task);
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
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
          project={project}
        />
      );
    case "Board":
      return (
        <BoardView
          sections={sections}
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
          project={project}
        />
      );
    case "Calendar":
      return <CalendarView />;
    default:
      return <div>Invalid view selected</div>;
  }
};

export default TaskViewSwitcher;
