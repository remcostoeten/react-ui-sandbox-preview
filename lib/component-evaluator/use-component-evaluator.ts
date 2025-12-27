"use client"

import type React from "react"

/**
 * useComponentEvaluator Hook
 * Unified state management and orchestration for the ComponentEvaluator module
 */

import { useState, useCallback, useMemo } from "react"
import type { ComponentEvaluatorState, VirtualFile, RenderState, EvaluatorError, ExportInfo } from "./types"
import {
  createFileRegistry,
  createFile,
  updateFile,
  deleteFile,
  setActiveFile,
  getActiveFile,
  getAllFiles,
} from "./file-registry"
import { compile } from "./compiler"
import { execute, extractComponent, findBestExport } from "./executor"

const initialRenderState: RenderState = {
  status: "idle",
  selectedExport: null,
  component: null,
  error: null,
}

export interface UseComponentEvaluatorReturn {
  // State
  state: ComponentEvaluatorState
  files: VirtualFile[]
  activeFile: VirtualFile | null
  availableExports: ExportInfo[]

  // File operations
  createFile: (name: string, content?: string) => VirtualFile
  updateFileContent: (fileId: string, content: string) => void
  removeFile: (fileId: string) => void
  selectFile: (fileId: string | null) => void

  // Evaluation
  evaluate: () => void
  selectExport: (exportName: string) => void

  // Render state
  renderState: RenderState
  component: React.ComponentType | null
  error: EvaluatorError | null
  isLoading: boolean

  // Error handling
  clearError: () => void
  handleRuntimeError: (error: EvaluatorError) => void
}

export function useComponentEvaluator(): UseComponentEvaluatorReturn {
  const [registry, setRegistry] = useState(() => createFileRegistry())
  const [renderState, setRenderState] = useState<RenderState>(initialRenderState)
  const [availableExports, setAvailableExports] = useState<ExportInfo[]>([])
  const [cachedExports, setCachedExports] = useState<Record<string, unknown>>({})

  // Derived state
  const files = useMemo(() => getAllFiles(registry), [registry])
  const activeFile = useMemo(() => getActiveFile(registry), [registry])
  const isLoading = renderState.status === "compiling" || renderState.status === "executing"

  // File operations
  const handleCreateFile = useCallback(
    (name: string, content = "") => {
      const result = createFile(registry, name, content)
      setRegistry(result.registry)
      // Reset render state for new file
      setRenderState(initialRenderState)
      setAvailableExports([])
      return result.file
    },
    [registry],
  )

  const handleUpdateFileContent = useCallback((fileId: string, content: string) => {
    setRegistry((prev) => updateFile(prev, fileId, content))
  }, [])

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      setRegistry((prev) => deleteFile(prev, fileId))
      if (registry.activeFileId === fileId) {
        setRenderState(initialRenderState)
        setAvailableExports([])
      }
    },
    [registry.activeFileId],
  )

  const handleSelectFile = useCallback((fileId: string | null) => {
    setRegistry((prev) => setActiveFile(prev, fileId))
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
      })
      return
    }

    // Start compilation
    setRenderState((prev) => ({ ...prev, status: "compiling", error: null }))

    try {
      // Compile
      const compileResult = compile(file.content)

      if (!compileResult.success) {
        setRenderState({
          status: "error",
          selectedExport: null,
          component: null,
          error: compileResult.error,
        })
        return
      }

      setRenderState((prev) => ({ ...prev, status: "executing" }))

      // Execute
      const execResult = execute(compileResult.code, compileResult.exports)

      if (!execResult.success) {
        setRenderState({
          status: "error",
          selectedExport: null,
          component: null,
          error: execResult.error,
        })
        return
      }

      // Store exports and find best one to render
      setCachedExports(execResult.exports)
      setAvailableExports(execResult.detectedExports)

      const bestExport = findBestExport(execResult.detectedExports)
      const component = bestExport ? extractComponent(execResult.exports, bestExport) : null

      setRenderState({
        status: "rendering",
        selectedExport: bestExport,
        component,
        error: null,
      })
    } catch (err) {
      const error = err as Error
      setRenderState({
        status: "error",
        selectedExport: null,
        component: null,
        error: { type: "runtime", message: error.message },
      })
    }
  }, [registry])

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
    updateFileContent: handleUpdateFileContent,
    removeFile: handleRemoveFile,
    selectFile: handleSelectFile,

    evaluate,
    selectExport,

    renderState,
    component: renderState.component,
    error: renderState.error,
    isLoading,

    clearError,
    handleRuntimeError,
  }
}
