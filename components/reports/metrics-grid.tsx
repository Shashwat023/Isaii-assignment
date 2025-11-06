"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Target, Trophy, Clock } from "lucide-react"

export function MetricsGrid() {
  const metrics = [
    {
      title: "Total Problems",
      value: "24",
      icon: Target,
      color: "bg-blue-500/10 text-blue-500",
      change: "+4 this week",
    },
    {
      title: "Success Rate",
      value: "78%",
      icon: Trophy,
      color: "bg-green-500/10 text-green-500",
      change: "+5% improvement",
    },
    {
      title: "Interviews Completed",
      value: "8",
      icon: TrendingUp,
      color: "bg-purple-500/10 text-purple-500",
      change: "Avg score: 82%",
    },
    {
      title: "Time Spent",
      value: "24.5h",
      icon: Clock,
      color: "bg-orange-500/10 text-orange-500",
      change: "Last 30 days",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="border-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{metric.value}</span>
              <span className="text-xs text-green-500">{metric.change}</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
