import React, { Dispatch, SetStateAction } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronRight } from 'lucide-react';
import { ProjectType, SectionType, TaskType } from '@/types/project';
import TaskItemForListView from './TaskItemForListView';

const ResponsiveTable = ({
  sections,
  groupedTasks,
  project,
  tasks,
  setTasks,
  showTaskItemModal,
  setShowTaskItemModal,
}: {
  sections:  {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
}[];
  groupedTasks: Record<string, TaskType[]>;
  project: ProjectType | null;
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  showTaskItemModal: string | null;
  setShowTaskItemModal: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr className="border-y border-text-200 text-xs font-medium">
            <th className="p-2 text-left w-[40%]">Task name</th>
            <th className="p-2 text-left w-[15%]">Assignee</th>
            <th className="p-2 text-left w-[15%]">Due date</th>
            <th className="p-2 text-left w-[15%]">Priority</th>
            <th className="p-2 text-left w-[15%]">Labels</th>
          </tr>
        </thead>
        <tbody>
          {sections
            .filter((c) => c.id !== "ungrouped")
            .map((column, columnIndex) => (
              <React.Fragment key={column.id}>
                <tr className="bg-gray-50">
                  <td colSpan={5} className="p-2">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <span className="font-bold">{column.title}</span>
                    </div>
                  </td>
                </tr>
                <Droppable droppableId={column.id.toString()} type="task">
                  {(provided) => (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {(groupedTasks[column.id] || [])
                            .filter((t) => !t.parent_task_id)
                            .map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TaskItemForListView
                                      task={task}
                                      subTasks={(groupedTasks[column.id] || []).filter(
                                        (t) => t.parent_task_id == task.id
                                      )}
                                      index={index}
                                      project={project}
                                      setTasks={setTasks}
                                      tasks={tasks}
                                      setShowModal={setShowTaskItemModal}
                                      showModal={showTaskItemModal}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      </td>
                    </tr>
                  )}
                </Droppable>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;