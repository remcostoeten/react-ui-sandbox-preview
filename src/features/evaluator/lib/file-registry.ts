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
  parentId: string | null = null
): { registry: FileRegistryState; file: VirtualFile } {
  const now = Date.now()
  const file: VirtualFile = {
    id: generateId(),
    name,
    content,
    type: 'file',
    parentId,
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

// Create a new virtual folder
export function createFolder(
  registry: FileRegistryState,
  name: string,
  parentId: string | null = null
): { registry: FileRegistryState; folder: VirtualFile } {
  const now = Date.now()
  const folder: VirtualFile = {
    id: generateId(),
    name,
    content: "",
    type: 'folder',
    parentId,
    createdAt: now,
    updatedAt: now,
  }

  const newFiles = new Map(registry.files)
  newFiles.set(folder.id, folder)

  return {
    registry: {
      ...registry,
      files: newFiles,
    },
    folder,
  }
}

// Update file content
export function updateFile(registry: FileRegistryState, fileId: string, content: string): FileRegistryState {
  const file = registry.files.get(fileId)
  if (!file || file.type === 'folder') return registry

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

// Move a file or folder
export function moveNode(
  registry: FileRegistryState,
  nodeId: string,
  targetParentId: string | null
): FileRegistryState {
  const node = registry.files.get(nodeId)
  if (!node) return registry

  // Prevent moving into itself or its children
  if (targetParentId === nodeId) return registry

  // Basic check for circularity (could be more robust)
  let parent = targetParentId
  while (parent) {
    if (parent === nodeId) return registry
    parent = registry.files.get(parent)?.parentId ?? null
  }

  const newFiles = new Map(registry.files)
  newFiles.set(nodeId, {
    ...node,
    parentId: targetParentId,
    updatedAt: Date.now(),
  })

  return {
    ...registry,
    files: newFiles,
  }
}

// Delete a node (and its contents if it's a folder)
export function deleteFile(registry: FileRegistryState, nodeId: string): FileRegistryState {
  const newFiles = new Map(registry.files)

  const deleteRecursive = (id: string) => {
    const node = newFiles.get(id)
    if (!node) return

    if (node.type === 'folder') {
      // Find and delete all children
      const children = (Array.from(newFiles.values()) as VirtualFile[]).filter(f => f.parentId === id)
      children.forEach(child => deleteRecursive(child.id))
    }

    newFiles.delete(id)
  }

  deleteRecursive(nodeId)

  return {
    files: newFiles,
    activeFileId: (registry.activeFileId === nodeId || !newFiles.has(registry.activeFileId ?? ""))
      ? null
      : registry.activeFileId,
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
