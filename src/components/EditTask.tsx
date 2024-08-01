import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Textarea,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import { CalendarIcon, FlagIcon, TagIcon } from "lucide-react";
import { Task } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";

interface EditTaskProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const EditTask: React.FC<EditTaskProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const { projects } = useTaskProjectDataProvider();

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <Dialog>
      <DialogContent className="">
        <DialogHeader onClose={onClose}>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            placeholder="Task name"
            className="col-span-3"
          />
          <Textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            placeholder="Description"
            className="col-span-3"
          />
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-gray-500" size={20} />
            <Input
              type="date"
              name="dueDate"
              value={editedTask.dueDate.toISOString().split("T")[0]}
              onChange={handleChange}
              className="col-span-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <FlagIcon className="text-gray-500" size={20} />
            <Select
              onValueChange={(value) => handleSelectChange("priority", value)}
              defaultValue={editedTask.priority}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <TagIcon className="text-gray-500" size={20} />
            <Select
              onValueChange={(value) => handleSelectChange("categories", value)}
              defaultValue={editedTask.project?.name}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.slug}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
