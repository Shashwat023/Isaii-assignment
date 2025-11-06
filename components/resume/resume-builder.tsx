"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ResumeBuilderProps {
  onSave: (data: { title: string; headline: string }) => void
  onCancel: () => void
}

export function ResumeBuilder({ onSave, onCancel }: ResumeBuilderProps) {
  const [title, setTitle] = useState("")
  const [headline, setHeadline] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && headline.trim()) {
      onSave({ title, headline })
      setTitle("")
      setHeadline("")
    }
  }

  return (
    <Card className="border-border bg-card p-6 mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">Create New Resume</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Resume Title</label>
          <Input
            placeholder="e.g., Senior Engineer Resume"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Professional Headline</label>
          <Textarea
            placeholder="e.g., Senior Full Stack Developer | React & Node.js Expert"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-border text-foreground hover:bg-secondary bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!title.trim() || !headline.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Resume
          </Button>
        </div>
      </form>
    </Card>
  )
}
