"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Target } from "lucide-react"

export function DetailedStats() {
  const stats = [
    {
      label: "Current Streak",
      value: "7 days",
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Longest Streak",
      value: "14 days",
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      label: "Level",
      value: "Advanced",
      icon: Target,
      color: "text-green-500",
    },
  ]

  return (
    <Card className="border-border bg-card p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground pl-6">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Strengths</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-green-500/30 text-green-500">
            Arrays
          </Badge>
          <Badge variant="outline" className="border-green-500/30 text-green-500">
            Sorting
          </Badge>
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">
            Trees
          </Badge>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Areas to Focus</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-orange-500/30 text-orange-500">
            DP
          </Badge>
          <Badge variant="outline" className="border-orange-500/30 text-orange-500">
            Graphs
          </Badge>
        </div>
      </div>
    </Card>
  )
}
