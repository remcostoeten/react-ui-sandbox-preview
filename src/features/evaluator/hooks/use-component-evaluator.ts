"use client"

import type React from "react"

/**
 * useComponentEvaluator Hook
 * Unified state management and orchestration for the ComponentEvaluator module
 */

import { useState, useCallback, useMemo, useEffect } from "react"
import type {
  ComponentEvaluatorState,
  VirtualFile,
  RenderState,
  EvaluatorError,
  ExportInfo,
  ExecutionMode,
  ConsoleOutput,
  ExecutionMetrics,
  EvaluatorConfig,
  FileRegistryState
} from "../types"
import {
  createFileRegistry,
  createFile,
  createFolder,
  updateFile,
  moveNode,
  deleteFile,
  setActiveFile,
  getActiveFile,
  getAllFiles,
} from "../lib/file-registry"
import { compile } from "../lib/compiler"
import { execute, extractComponent, findBestExport, detectExecutionMode } from "../lib/executor"

const initialRenderState: RenderState = {
  status: "idle",
  selectedExport: null,
  component: null,
  error: null,
  executionMode: "component",
  executionResult: undefined,
  consoleOutput: [],
  executionMetrics: undefined,
}

export interface UseComponentEvaluatorReturn {
  // State
  state: ComponentEvaluatorState
  files: VirtualFile[]
  activeFile: VirtualFile | null
  availableExports: ExportInfo[]

  // File operations
  createFile: (name: string, content?: string, parentId?: string | null) => VirtualFile
  createFolder: (name: string, parentId?: string | null) => VirtualFile
  updateFileContent: (fileId: string, content: string) => void
  removeFile: (fileId: string) => void
  selectFile: (fileId: string | null) => void
  moveNode: (nodeId: string, targetParentId: string | null) => void

  // Evaluation
  evaluate: () => void
  selectExport: (exportName: string) => void

  // Render state
  renderState: RenderState
  component: React.ComponentType | null
  error: EvaluatorError | null
  isLoading: boolean
  executionMode: ExecutionMode
  executionResult: unknown
  consoleOutput: ConsoleOutput[]
  executionMetrics?: ExecutionMetrics

  // Error handling
  clearError: () => void
  handleRuntimeError: (error: EvaluatorError) => void
}

export function useComponentEvaluator(config?: EvaluatorConfig): UseComponentEvaluatorReturn {
  const [registry, setRegistry] = useState(() => createFileRegistry())
  const [renderState, setRenderState] = useState<RenderState>(initialRenderState)
  const [availableExports, setAvailableExports] = useState<ExportInfo[]>([])
  const [cachedExports, setCachedExports] = useState<Record<string, unknown>>({})

  // Local Storage Persistence
  const STORAGE_KEY = "evaluator-registry-v1"

  // Load from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        // We'd ideally need a proper deserialization here to Map/Set if we used them extensively
        // But FileRegistryState uses simple objects and Maps for files
        // Since JSON.stringify/parse handles objects, we just need to ensure Map reconstruction
        const parsed = JSON.parse(saved)

        // Reconstruct Map for files
        if (parsed.files && typeof parsed.files === 'object') {
          const filesMap = new Map<string, VirtualFile>()
          Object.entries(parsed.files).forEach(([k, v]) => filesMap.set(k, v as VirtualFile))

          setRegistry({
            files: filesMap,
            activeFileId: parsed.activeFileId
          })
        }
      }
    } catch (e) {
      console.warn("Failed to load registry from storage:", e)
    }
  }, [])

  // Save to storage on change (debounced)
  useEffect(() => {
    if (registry.files.size === 0) return

    const timer = setTimeout(() => {
      try {
        // Convert Map to object for JSON stringify
        const serialized = {
          files: Object.fromEntries(registry.files),
          activeFileId: registry.activeFileId
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
      } catch (e) {
        console.warn("Failed to save registry to storage:", e)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [registry])

  // Derived state
  const files = useMemo(() => getAllFiles(registry), [registry])
  const activeFile = useMemo(() => getActiveFile(registry), [registry])
  const isLoading = renderState.status === "compiling" || renderState.status === "executing"

  // File operations
  const handleCreateFile = useCallback(
    (name: string, content = "", parentId: string | null = null) => {
      const result = createFile(registry, name, content, parentId)
      setRegistry(result.registry)
      // Reset render state for new file
      setRenderState(initialRenderState)
      setAvailableExports([])
      return result.file
    },
    [registry],
  )

  const handleCreateFolder = useCallback(
    (name: string, parentId: string | null = null) => {
      const result = createFolder(registry, name, parentId)
      setRegistry(result.registry)
      return result.folder
    },
    [registry],
  )

  const handleUpdateFileContent = useCallback((fileId: string, content: string) => {
    setRegistry((prev: FileRegistryState) => updateFile(prev, fileId, content))
  }, [])

  const handleMoveNode = useCallback((nodeId: string, targetParentId: string | null) => {
    setRegistry((prev: FileRegistryState) => moveNode(prev, nodeId, targetParentId))
  }, [])

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      setRegistry((prev: FileRegistryState) => deleteFile(prev, fileId))
      if (registry.activeFileId === fileId) {
        setRenderState(initialRenderState)
        setAvailableExports([])
      }
    },
    [registry.activeFileId],
  )

  const handleSelectFile = useCallback((fileId: string | null) => {
    setRegistry((prev: FileRegistryState) => setActiveFile(prev, fileId))
    // Reset render state when switching files
    setRenderState(initialRenderState)
    setAvailableExports([])
  }, [])

  // Evaluation pipeline
  const evaluate = useCallback(() => {
    const file = getActiveFile(registry)
    if (!file) {
      setRenderState({
        status: "error",
        selectedExport: null,
        component: null,
        error: { type: "compile", message: "No file selected" },
        executionMode: "component",
        executionResult: undefined,
        consoleOutput: [],
      })
      return
    }

    // Detect execution mode
    const mode = detectExecutionMode(file.content)

    // Start compilation with strict option
    setRenderState((prev) => ({ ...prev, status: "compiling", error: null, executionMode: mode }))

    try {
      // Compile with mode and strict option
      const compileResult = compile(file.content, mode, { strict: config?.strict })

      if (!compileResult.success) {
        setRenderState({
          status: "error",
          selectedExport: null,
          component: null,
          error: compileResult.error,
          executionMode: mode,
          executionResult: undefined,
          consoleOutput: [],
        })
        return
      }

      setRenderState((prev) => ({ ...prev, status: "executing" }))

      // Execute with mode
      const execResult = execute(compileResult.code, compileResult.exports, mode)

      if (!execResult.success) {
        setRenderState({
          status: "error",
          selectedExport: null,
          component: null,
          error: execResult.error,
          executionMode: mode,
          executionResult: undefined,
          consoleOutput: [],
        })
        return
      }

      // Handle different execution modes
      if (mode === "script") {
        // Script mode - show return value and console output
        const metrics: ExecutionMetrics = {
          compilationTime: compileResult.compilationTime || 0,
          executionTime: execResult.metrics?.executionTime || 0,
          totalTime: (compileResult.compilationTime || 0) + (execResult.metrics?.executionTime || 0),
          mode
        }

        setRenderState({
          status: "rendering",
          selectedExport: null,
          component: null,
          error: null,
          executionMode: mode,
          executionResult: execResult.returnValue,
          consoleOutput: execResult.consoleOutput || [],
          executionMetrics: metrics,
        })
        setAvailableExports([])
      } else {
        // Component mode - existing logic
        const metrics: ExecutionMetrics = {
          compilationTime: compileResult.compilationTime || 0,
          executionTime: execResult.metrics?.executionTime || 0,
          totalTime: (compileResult.compilationTime || 0) + (execResult.metrics?.executionTime || 0),
          mode
        }

        setCachedExports(execResult.exports)
        setAvailableExports(execResult.detectedExports)

        const bestExport = findBestExport(execResult.detectedExports)
        const component = bestExport ? extractComponent(execResult.exports, bestExport) : null

        setRenderState({
          status: "rendering",
          selectedExport: bestExport,
          component,
          error: null,
          executionMode: mode,
          executionResult: undefined,
          consoleOutput: execResult.consoleOutput || [],
          executionMetrics: metrics,
        })
      }
    } catch (err) {
      const error = err as Error
      setRenderState({
        status: "error",
        selectedExport: null,
        component: null,
        error: { type: "runtime", message: error.message },
        executionMode: "component",
        executionResult: undefined,
        consoleOutput: [],
      })
    }
  }, [registry, config?.strict])

  // Implement Auto-run
  useEffect(() => {
    if (!config?.autoRun || !activeFile) return

    const timer = setTimeout(() => {
      evaluate()
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [activeFile?.content, config?.autoRun, evaluate])

  // Export selection
  const selectExport = useCallback(
    (exportName: string) => {
      const component = extractComponent(cachedExports, exportName)
      setRenderState((prev) => ({
        ...prev,
        selectedExport: exportName,
        component,
      }))
    },
    [cachedExports],
  )

  // Error handling
  const clearError = useCallback(() => {
    setRenderState((prev) => ({ ...prev, error: null, status: "idle" }))
  }, [])

  const handleRuntimeError = useCallback((error: EvaluatorError) => {
    setRenderState((prev) => ({
      ...prev,
      status: "error",
      error,
    }))
  }, [])

  // Combined state for external consumption
  const state: ComponentEvaluatorState = useMemo(
    () => ({
      registry,
      render: renderState,
    }),
    [registry, renderState],
  )

  return {
    state,
    files,
    activeFile,
    availableExports,

    createFile: handleCreateFile,
    createFolder: handleCreateFolder,
    updateFileContent: handleUpdateFileContent,
    removeFile: handleRemoveFile,
    selectFile: handleSelectFile,
    moveNode: handleMoveNode,

    evaluate,
    selectExport,

    renderState,
    component: renderState.component,
    error: renderState.error,
    isLoading,
    executionMode: renderState.executionMode,
    executionResult: renderState.executionResult,
    consoleOutput: renderState.consoleOutput || [],
    executionMetrics: renderState.executionMetrics,

    clearError,
    handleRuntimeError,
  }
}
