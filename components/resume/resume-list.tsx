"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2 } from "lucide-react"

interface Resume {
  id: string
  title: string
  headline: string
  createdAt: string
  updatedAt: string
}

interface ResumeListProps {
  resumes: Resume[]
  onDelete: (id: string) => void
}

export function ResumeList({ resumes, onDelete }: ResumeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumes.map((resume) => (
        <Card key={resume.id} className="border-border bg-card p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(resume.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-1">{resume.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resume.headline}</p>

          <div className="space-y-2 mb-4 text-xs text-muted-foreground">
            <div>Created: {new Date(resume.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Edit
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </Card>
      ))}

      {resumes.length === 0 && (
        <div className="col-span-full text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No resumes created yet. Create your first resume to get started!</p>
        </div>
      )}
    </div>
  )
}
