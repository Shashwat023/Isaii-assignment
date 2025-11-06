"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

export function FeatureCard({ title, description, icon: Icon, href, color }: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative p-6 flex flex-col h-full">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} w-fit mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 flex-grow">{description}</p>

        <Link href={href} className="inline-block">
          <Button
            variant="outline"
            className="w-full group/btn border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
