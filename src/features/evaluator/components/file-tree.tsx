"use client"

import type React from "react"
import { Plus, X, FileCode } from "lucide-react"
import { useState } from "react"
import type { VirtualFile } from "../types"
import { cn } from "@/utils"

interface FileTreeProps {
  files: VirtualFile[]
  activeFileId: string | null
  onSelectFile: (fileId: string) => void
  onCreateFile: (name: string) => void
  onDeleteFile: (fileId: string) => void
}

export function FileTree({ files, activeFileId, onSelectFile, onCreateFile, onDeleteFile }: FileTreeProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState("")

  const handleCreate = () => {
    if (newFileName.trim()) {
      const name = newFileName.endsWith(".tsx") ? newFileName : `${newFileName}.tsx`
      onCreateFile(name)
      setNewFileName("")
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate()
    if (e.key === "Escape") {
      setIsCreating(false)
      setNewFileName("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[10px] font-medium text-[#8b8b98] uppercase tracking-wider">Files</span>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 rounded text-[#8b8b98] hover:text-[#e4e4e7] hover:bg-[#1a1a1f] transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 cursor-pointer",
              "transition-colors",
              activeFileId === file.id
                ? "bg-[#1a1a1f] text-[#e4e4e7]"
                : "text-[#8b8b98] hover:bg-[#1a1a1f]/50 hover:text-[#e4e4e7]",
            )}
            onClick={() => onSelectFile(file.id)}
          >
            <FileCode className="h-3 w-3 shrink-0 opacity-50" />
            <span className="flex-1 truncate font-mono text-[11px]">{file.name}</span>
            <button
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#2a2a2f] transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteFile(file.id)
              }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}

        {isCreating && (
          <div className="px-3 py-1.5">
            <input
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newFileName.trim()) setIsCreating(false)
              }}
              placeholder="component.tsx"
              className="w-full h-6 px-2 text-[11px] font-mono bg-[#0b0b0d] border border-[#2a2a2f] rounded outline-none text-[#e4e4e7] placeholder:text-[#8b8b98]/50 focus:border-[#8b8b98]/50"
            />
          </div>
        )}

        {files.length === 0 && !isCreating && (
          <div className="px-3 py-8 text-center text-[11px] text-[#8b8b98]/60">No files</div>
        )}
      </div>
    </div>
  )
}
