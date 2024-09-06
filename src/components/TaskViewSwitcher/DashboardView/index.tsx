import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { SectionType, TaskType } from "@/types/project";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Tag,
  ListTodo,
} from "lucide-react";

interface DashboardViewProps {
  tasks: TaskType[];
  sections: SectionType[];
}

const COLORS = {
  primary: "#005c83",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  info: "#6366F1",
};

const DashboardView: React.FC<DashboardViewProps> = ({ tasks, sections }) => {
  const analytics = useMemo(() => {
    const tasksPerSection = sections.map((section) => ({
      name: section.name,
      count: tasks.filter((task) => task.section_id === section.id).length,
    }));

    const tasksPerDueDate = [
      {
        name: "Overdue",
        value: tasks.filter(
          (task) => task.dates.end_date && new Date(task.dates.end_date) < new Date()
        ).length,
      },
      { 
        name: "Today",
        value: tasks.filter(
          (task) =>
            task.dates.end_date &&
            new Date(task.dates.end_date).toDateString() === new Date().toDateString()
        ).length,
      },
      {
        name: "Upcoming",
        value: tasks.filter(
          (task) => task.dates.end_date && new Date(task.dates.end_date) > new Date()
        ).length,
      },
      {
        name: "No Due Date",
        value: tasks.filter((task) => !task.dates.end_date).length,
      },
    ];

    const tasksPerPriority = ["P1", "P2", "P3", "P4"].map((priority) => ({
      name: priority,
      count: tasks.filter((task) => task.priority === priority).length,
    }));

    const taskCompletionTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: tasks.filter(
          (task) =>
            task.is_completed &&
            new Date(task.completed_at!).toDateString() === date.toDateString()
        ).length,
      };
    }).reverse();

    return {
      tasksPerSection,
      tasksPerDueDate,
      tasksPerPriority,
      taskCompletionTrend,
    };
  }, [tasks, sections]);

  return (
    <div className="px-6 md:px-8 pb-8">
      <div className="wrapper space-y-6 p-6bg-whiterounded-2xlshadow-lgborderborder-gray-200overflow-y-automax-h-[calc(100vh-110px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <OverviewCard
            title="Total Tasks"
            value={tasks.length}
            icon={<ListTodo size={20} />}
            color="bg-primary-100 text-primary-700 border-primary-300"
          />
          <OverviewCard
            title="Completed Tasks"
            value={tasks.filter((task) => task.is_completed).length}
            icon={<CheckCircle size={20} />}
            color="bg-green-100 text-green-700 border-green-300"
          />
          <OverviewCard
            title="Overdue Tasks"
            value={
              analytics.tasksPerDueDate.find((t) => t.name === "Overdue")
                ?.value || 0
            }
            icon={<Clock size={20} />}
            color="bg-red-100 text-red-700 border-red-300"
          />
          <OverviewCard
            title="High Priority Tasks"
            value={
              analytics.tasksPerPriority.find((t) => t.name === "P1")?.count ||
              0
            }
            icon={<AlertTriangle size={20} />}
            color="bg-yellow-100 text-yellow-700 border-yellow-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Tasks per Section"
            icon={<Tag size={20} className="text-primary-500" />}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.tasksPerSection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Tasks by Due Date"
            icon={<Clock size={20} className="text-green-500" />}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.tasksPerDueDate}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill={COLORS.secondary}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analytics.tasksPerDueDate.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        Object.values(COLORS)[
                          index % Object.values(COLORS).length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Tasks by Priority"
            icon={<ArrowUpRight size={20} className="text-yellow-500" />}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.tasksPerPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS.accent} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Task Completion Trend"
            icon={<TrendingUp size={20} className="text-purple-500" />}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.taskCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke={COLORS.info}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
  <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:scale-105">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      <div>{icon}</div>
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
    className={`p-4 rounded-2xl shadow-md border ${color} transition-transform transform hover:scale-105`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default DashboardView;
