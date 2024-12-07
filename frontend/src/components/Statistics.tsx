"use client";

import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useAdminAuth } from "@/contexts/auth/AdminAuthContext";

export function Statistics() {
  const { stats } = useAdminAuth();
  console.log(stats);
  

  const chartData = [
    {
      users: stats.totalUsers || 0,
      interviews: stats.totalInterviews || 0,
      revenue: stats.totalRevanue || 0,
    },
  ];

  const chartConfig = {
    users: {
      label: "Users",
      color: "#60a5fa",
    },
    interviews: {
      label: "Interviews",
      color: "#10b981",
    },
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <Bar
            dataKey="users"
            fill={chartConfig.users.color}
            name="Users"
            radius={4}
          />
          <Bar
            dataKey="interviews"
            fill={chartConfig.interviews.color}
            name="Interviews"
            radius={4}
          />
          <Bar
            dataKey="revenue"
            fill={chartConfig.revenue.color}
            name="Revenue"
            radius={4}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
