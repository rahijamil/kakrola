import { ProjectType, TaskType } from "@/types/project";

const parseDate = (dateString: string): Date | null => {
  const today = new Date();
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  if (dateString === "today") return today;
  if (dateString === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
  if (dateString === "next week") {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek;
  }

  const parts = dateString.toLowerCase().split(" ");
  if (parts.length === 2) {
    const day = parseInt(parts[0], 10);
    const monthIndex = months.indexOf(parts[1].slice(0, 3));
    if (!isNaN(day) && monthIndex !== -1) {
      const date = new Date(today.getFullYear(), monthIndex, day);
      if (date < today) date.setFullYear(date.getFullYear() + 1);
      return date;
    }
  }

  // Fallback to original date parsing logic
  const [month, day, year] = dateString.split("/").map(Number);
  if (!isNaN(month) && !isNaN(day)) {
    return new Date(year || today.getFullYear(), month - 1, day);
  }

  return null;
};

export const parseInput = (input: string, projects: ProjectType[]) => {
  const parsedData: Partial<TaskType> = {};
  let title = input;

  // Parse due date
  const dateRegex =
    /\s(today|tomorrow|next week|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))/i;
  const dateMatch = input.match(dateRegex);
  if (dateMatch) {
    const dateString = dateMatch[1].toLowerCase();
    const dueDate = parseDate(dateString);
    if (dueDate) {
      // parsedData.dates?.end_date = dueDate.toISOString();
    }
  }

  // Parse assignee
  const assigneeRegex = /\s\+(\w+)/;
  const assigneeMatch = input.match(assigneeRegex);
  if (assigneeMatch) {
    // parsedData.assignees?.push(assigneeMatch[1])
  }

  // Parse priority
  const priorityRegex = /\s!([1-4])/;
  const priorityMatch = input.match(priorityRegex);
  if (priorityMatch) {
    const priorityMap: { [key: string]: TaskType["priority"] } = {
      "1": "P1",
      "2": "P2",
      "3": "P3",
      "4": "Priority",
    };
    parsedData.priority = priorityMap[priorityMatch[1]];
  }

  // Parse project
  const projectRegex = /\s#(\w+)/;
  const projectMatch = input.match(projectRegex);
  if (projectMatch) {
    const projectName = projectMatch[1];
    const project = projects.find(
      (p) => p.name.toLowerCase() === projectName.toLowerCase()
    );
    if (project) {
      parsedData.project_id = project.id;
      parsedData.is_inbox = false;
    }
  }

  // Remove all special syntax from the title
  title = title
    .replace(dateRegex, "")
    .replace(assigneeRegex, "")
    .replace(priorityRegex, "")
    .replace(projectRegex, "")
    .trim();

  return { ...parsedData, title };
};
