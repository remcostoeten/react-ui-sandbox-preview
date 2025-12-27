/**
 * Virtual File Registry
 * In-memory file storage for component source code
 */

import type { VirtualFile, FileRegistryState } from "./types"

// Generate unique file ID
function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// Create initial registry state
export function createFileRegistry(): FileRegistryState {
  return {
    files: new Map(),
    activeFileId: null,
  }
}

// Create a new virtual file
export function createFile(
  registry: FileRegistryState,
  name: string,
  content = "",
): { registry: FileRegistryState; file: VirtualFile } {
  const now = Date.now()
  const file: VirtualFile = {
    id: generateId(),
    name,
    content,
    createdAt: now,
    updatedAt: now,
  }

  const newFiles = new Map(registry.files)
  newFiles.set(file.id, file)

  return {
    registry: {
      files: newFiles,
      activeFileId: file.id,
    },
    file,
  }
}

// Update file content
export function updateFile(registry: FileRegistryState, fileId: string, content: string): FileRegistryState {
  const file = registry.files.get(fileId)
  if (!file) return registry

  const newFiles = new Map(registry.files)
  newFiles.set(fileId, {
    ...file,
    content,
    updatedAt: Date.now(),
  })

  return {
    ...registry,
    files: newFiles,
  }
}

// Delete a file
export function deleteFile(registry: FileRegistryState, fileId: string): FileRegistryState {
  const newFiles = new Map(registry.files)
  newFiles.delete(fileId)

  return {
    files: newFiles,
    activeFileId: registry.activeFileId === fileId ? null : registry.activeFileId,
  }
}

// Set active file
export function setActiveFile(registry: FileRegistryState, fileId: string | null): FileRegistryState {
  if (fileId && !registry.files.has(fileId)) return registry
  return {
    ...registry,
    activeFileId: fileId,
  }
}

// Get active file
export function getActiveFile(registry: FileRegistryState): VirtualFile | null {
  if (!registry.activeFileId) return null
  return registry.files.get(registry.activeFileId) ?? null
}

// Get all files as array
export function getAllFiles(registry: FileRegistryState): VirtualFile[] {
  return Array.from(registry.files.values())
}
