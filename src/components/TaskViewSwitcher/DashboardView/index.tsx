import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  ProjectType,
  SectionType,
  TaskType,
  TaskPriority,
  TaskStatus,
} from "@/types/project";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Tag,
  ListTodo,
  Users,
  Calendar,
} from "lucide-react";
import useAssignee from "@/hooks/useAssignee";

interface DashboardViewProps {
  project: ProjectType | null;
  tasks: TaskType[];
  sections: SectionType[];
}

const COLORS = {
  primary: "#796eff",
  secondary: "#00c7e6",
  accent: "#ffa800",
  danger: "#ff5263",
  success: "#36B37E",
  info: "#4573d2",
  p1: "#FF5630",
  p2: "#FFAB00",
  p3: "#36B37E",
  p4: "#4573d2",
};

const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  tasks,
  sections,
}) => {
  const { assigneeProfiles } = useAssignee({ project_id: project?.id });

  const getAssigneeProfileById = (profileId: string | null) => {
    return assigneeProfiles.find((profile) => profile.id === profileId);
  };

  const analytics = useMemo(() => {
    const tasksPerSection = sections.map((section) => ({
      name: section.name,
      count: tasks.filter((task) => task.section_id === section.id).length,
    }));

    const tasksPerStatus = Object.values(TaskStatus).map((status) => ({
      name: status,
      count: tasks.filter((task) => task.status === status).length,
    }));

    const tasksPerPriority = Object.values(TaskPriority).map((priority) => ({
      name: priority,
      count: tasks.filter((task) => task.priority === priority).length,
    }));

    const taskCompletionTrend = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        completed: tasks.filter(
          (task) =>
            task.is_completed &&
            new Date(task.completed_at!).toDateString() === date.toDateString()
        ).length,
      };
    }).reverse();

    const upcomingDeadlines = tasks
      .filter(
        (task) =>
          task.dates.end_date &&
          new Date(task.dates.end_date) > new Date() &&
          new Date(task.dates.end_date) <=
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      .sort(
        (a, b) =>
          new Date(a.dates.end_date!).getTime() -
          new Date(b.dates.end_date!).getTime()
      )
      .slice(0, 5);

    const topContributors = Object.entries(
      tasks.reduce((acc, task) => {
        task.assignees.forEach((assignee) => {
          const assigneeProfile = getAssigneeProfileById(assignee.profile_id);
          const fullName = assigneeProfile?.full_name || "Unknown";

          acc[fullName] = (acc[fullName] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>) // Ensure type is string -> number map
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      tasksPerSection,
      tasksPerStatus,
      tasksPerPriority,
      taskCompletionTrend,
      upcomingDeadlines,
      topContributors,
    };
  }, [tasks, sections]);

  return (
    <div className="px-6">
      <div className="max-h-[calc(100vh_-_160px)] overflow-y-auto rounded-lg bg-text-50">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <OverviewCard
              title="Total Tasks"
              value={tasks.length}
              icon={<ListTodo size={24} />}
              color="text-primary-600"
            />
            <OverviewCard
              title="Completed Tasks"
              value={tasks.filter((task) => task.is_completed).length}
              icon={<CheckCircle size={24} />}
              color="text-green-600"
            />
            <OverviewCard
              title="Overdue Tasks"
              value={
                tasks.filter(
                  (task) =>
                    task.dates.end_date &&
                    new Date(task.dates.end_date) < new Date()
                ).length
              }
              icon={<Clock size={24} />}
              color="text-red-600"
            />
            <OverviewCard
              title="High Priority Tasks"
              value={
                tasks.filter((task) => task.priority === TaskPriority.P1).length
              }
              icon={<AlertTriangle size={24} />}
              color="text-yellow-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard title="Tasks per Status" icon={<Tag size={20} />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.tasksPerStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fill: "#718096" }} />
                  <YAxis tick={{ fill: "#718096" }} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Tasks by Priority"
              icon={<ArrowUpRight size={20} />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.tasksPerPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill={COLORS.secondary}
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analytics.tasksPerPriority.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            entry.name.toLowerCase() as keyof typeof COLORS
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard
              title="Task Completion Trend"
              icon={<TrendingUp size={20} />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.taskCompletionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fill: "#718096" }} />
                  <YAxis tick={{ fill: "#718096" }} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke={COLORS.info}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Contributors" icon={<Users size={20} />}>
              <div className="space-y-4">
                {analytics.topContributors.map(([name, count], index) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-text-200 flex items-center justify-center mr-3">
                        {name.charAt(0)}
                      </div>
                      <span className="text-text-700">{name}</span>
                    </div>
                    <span className="text-text-600">{count} tasks</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Upcoming Deadlines" icon={<Calendar size={20} />}>
            <div className="space-y-4">
              {analytics.upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-lg mr-3 bg-[${
                        COLORS[
                          task.priority.toLowerCase() as keyof typeof COLORS
                        ]
                      }]`}
                    ></div>
                    <span className="text-text-700">{task.title}</span>
                  </div>
                  <span className="text-text-600">
                    {new Date(task.dates.end_date!).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className="bg-surface p-6 rounded-lg shadow-sm border border-text-200 transition-shadow duration-300 ease-in-out hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-text-800">{title}</h2>
      <div className="text-text-500">{icon}</div>
    </div>
    {children}
  </div>
);

const OverviewCard: React.FC<{
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}> = ({ title, value, color, icon }) => (
  <div
    className={`bg-surface p-6 rounded-lg shadow-sm border border-text-200 transition-shadow duration-300 ease-in-out hover:shadow-md ${color}`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium text-text-500">{title}</h3>
      <div className="text-text-400">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-text-900">{value}</p>
  </div>
);

export default DashboardView;
