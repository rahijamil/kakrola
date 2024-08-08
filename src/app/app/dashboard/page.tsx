"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import LayoutWrapper from "../../../components/LayoutWrapper";

const DashboardPage = () => {
  const { tasks } = useTaskProjectDataProvider();

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;

  const statusData = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "To Do", value: todoTasks },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const priorityData = [
    {
      name: "High",
      value: tasks.filter((task) => task.priority === "high").length,
    },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "medium").length,
    },
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "low").length,
    },
  ];

  const overdueTasks = tasks.filter(
    (task) => new Date(task.due_date) < new Date()
  ).length;

  return (
    <LayoutWrapper headline="Dashboard">
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Task Status Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Task Priority Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-indigo-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{tasks.length}</p>
              <p className="text-gray-600">Total Tasks</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {completedTasks}
              </p>
              <p className="text-gray-600">Completed Tasks</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {inProgressTasks}
              </p>
              <p className="text-gray-600">In Progress Tasks</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              <p className="text-gray-600">Overdue Tasks</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default DashboardPage;
