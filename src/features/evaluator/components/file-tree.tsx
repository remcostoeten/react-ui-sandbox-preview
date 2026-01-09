"use client"

import type React from "react"
import { Plus, X, FileCode, Folder, FolderOpen, ChevronRight, ChevronDown, FolderPlus } from "lucide-react"
import { useState, useMemo } from "react"
import type { VirtualFile } from "../types"
import { cn } from "@/utils"

interface FileTreeProps {
  files: VirtualFile[]
  activeFileId: string | null
  onSelectFile: (fileId: string) => void
  onCreateFile: (name: string, parentId?: string | null) => void
  onCreateFolder: (name: string, parentId?: string | null) => void
  onDeleteFile: (fileId: string) => void
  onMoveNode: (nodeId: string, targetParentId: string | null) => void
}

export function FileTree({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onMoveNode
}: FileTreeProps) {
  const [isCreating, setIsCreating] = useState<{ type: 'file' | 'folder', parentId: string | null } | null>(null)
  const [newName, setNewName] = useState("")

  const handleCreate = () => {
    if (newName.trim()) {
      if (isCreating?.type === 'file') {
        const name = newName.endsWith(".tsx") || newName.includes('.') ? newName : `${newName}.tsx`
        onCreateFile(name, isCreating.parentId)
      } else {
        onCreateFolder(newName, isCreating?.parentId)
      }
      setNewName("")
      setIsCreating(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate()
    if (e.key === "Escape") {
      setIsCreating(null)
      setNewName("")
    }
  }

  // Organize files into a tree structure for rendering
  const rootFiles = useMemo(() => files.filter(f => !f.parentId), [files])

  const renderNodes = (parentId: string | null, depth = 0) => {
    const nodes = files.filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
        return a.name.localeCompare(b.name)
      })

    return (
      <>
        {nodes.map(node => (
          <FileTreeItem
            key={node.id}
            node={node}
            depth={depth}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            onMoveNode={onMoveNode}
            onCreateFile={(parentId) => setIsCreating({ type: 'file', parentId })}
            onCreateFolder={(parentId) => setIsCreating({ type: 'folder', parentId })}
            renderChildren={() => renderNodes(node.id, depth + 1)}
          />
        ))}
        {isCreating?.parentId === parentId && (
          <div className="px-3 py-1.5" style={{ paddingLeft: `${depth * 12 + 12}px` }}>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newName.trim()) setIsCreating(null)
              }}
              placeholder={isCreating.type === 'folder' ? "folder name..." : "component.tsx"}
              className="w-full h-7 px-2 text-[13px] font-mono bg-[#0a0a0a] border border-[#27272a] rounded outline-none text-[#e4e4e7] placeholder:text-[#52525b] focus:border-[#3b82f6]"
            />
          </div>
        )}
      </>
    )
  }

  return (
    <div
      className="flex flex-col h-full"
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const nodeId = e.dataTransfer.getData('nodeId')
        if (nodeId) onMoveNode(nodeId, null)
      }}
    >
      <div className="flex items-center justify-end px-3 py-1 gap-1">
        <button
          onClick={() => setIsCreating({ type: 'folder', parentId: null })}
          className="p-1 rounded text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#1a1a1f] transition-colors"
          title="New Folder"
        >
          <FolderPlus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setIsCreating({ type: 'file', parentId: null })}
          className="p-1 rounded text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#1a1a1f] transition-colors"
          title="New File"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderNodes(null)}
        {files.length === 0 && !isCreating && (
          <div className="px-3 py-6 text-center text-[11px] text-[#52525b]">
            No files yet
          </div>
        )}
      </div>
    </div>
  )
}

function FileTreeItem({
  node,
  depth,
  activeFileId,
  onSelectFile,
  onDeleteFile,
  onMoveNode,
  onCreateFile,
  onCreateFolder,
  renderChildren
}: {
  node: VirtualFile,
  depth: number,
  activeFileId: string | null,
  onSelectFile: (id: string) => void,
  onDeleteFile: (id: string) => void,
  onMoveNode: (id: string, targetId: string | null) => void,
  onCreateFile: (parentId: string) => void,
  onCreateFolder: (parentId: string) => void,
  renderChildren: () => React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const isSelected = activeFileId === node.id

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('nodeId', node.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (node.type === 'folder') {
      e.preventDefault()
      setIsDragOver(true)
      e.dataTransfer.dropEffect = 'move'
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (node.type === 'folder') {
      e.preventDefault()
      setIsDragOver(false)
      const nodeId = e.dataTransfer.getData('nodeId')
      if (nodeId && nodeId !== node.id) {
        onMoveNode(nodeId, node.id)
      }
    }
  }

  return (
    <div className="flex flex-col">
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group flex items-center gap-2 h-7 px-3 cursor-pointer select-none",
          "transition-colors relative",
          isSelected
            ? "bg-[#1a1a1f] text-[#e4e4e7]"
            : "text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#e4e4e7]",
          isDragOver && "bg-[#1e1e24] ring-1 ring-[#3b82f6] shadow-sm z-10"
        )}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            setIsOpen(!isOpen)
          } else {
            onSelectFile(node.id)
          }
        }}
      >
        {node.type === 'folder' ? (
          <>
            <div className="w-4 h-4 flex items-center justify-center text-[#71717a]">
              {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
            {isOpen ? <FolderOpen className="h-4 w-4 shrink-0 text-[#3b82f6]" /> : <Folder className="h-4 w-4 shrink-0 text-[#3b82f6]" />}
          </>
        ) : (
          <>
            <div className="w-4 h-4" />
            <FileCode className="h-4 w-4 shrink-0 text-[#71717a]" />
          </>
        )}

        <span className="flex-1 truncate font-mono text-[13px]">{node.name}</span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.type === 'folder' && (
            <>
              <button
                className="p-0.5 rounded hover:bg-[#252530] text-[#71717a] hover:text-[#e4e4e7]"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateFolder(node.id)
                }}
                title="New folder in this folder"
              >
                <FolderPlus className="h-3 w-3" />
              </button>
              <button
                className="p-0.5 rounded hover:bg-[#252530] text-[#71717a] hover:text-[#e4e4e7]"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateFile(node.id)
                }}
                title="New file in this folder"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button
            className="p-0.5 rounded hover:bg-[#252530] text-[#71717a] hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteFile(node.id)
            }}
            aria-label={`Delete ${node.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {node.type === 'folder' && isOpen && (
        <div className="flex flex-col">
          {renderChildren()}
        </div>
      )}
    </div>
  )
}
