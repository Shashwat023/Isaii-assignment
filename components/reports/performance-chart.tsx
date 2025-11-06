"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function PerformanceChart() {
  const data = [
    { week: "Week 1", problems: 4, interviews: 1, avgScore: 70 },
    { week: "Week 2", problems: 6, interviews: 2, avgScore: 75 },
    { week: "Week 3", problems: 5, interviews: 1, avgScore: 80 },
    { week: "Week 4", problems: 9, interviews: 4, avgScore: 82 },
  ]

  const categoryData = [
    { name: "Arrays", value: 6, color: "#3b82f6" },
    { name: "Strings", value: 5, color: "#8b5cf6" },
    { name: "Trees", value: 7, color: "#ec4899" },
    { name: "Graphs", value: 3, color: "#f59e0b" },
    { name: "DP", value: 3, color: "#10b981" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend />
            <Bar dataKey="problems" fill="var(--color-primary)" name="Problems Solved" />
            <Bar dataKey="interviews" fill="var(--color-accent)" name="Interviews" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Average Interview Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend />
            <Line type="monotone" dataKey="avgScore" stroke="var(--color-primary)" name="Avg Score %" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Problems by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="var(--color-primary)"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
