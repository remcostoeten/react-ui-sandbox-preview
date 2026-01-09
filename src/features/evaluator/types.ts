import type React from "react"
/**
 * ComponentEvaluator Module Types
 * Defines all state shapes and interfaces for the isolated component sandbox
 */

// Virtual node representation (file or folder)
export interface VirtualFile {
  id: string
  name: string
  content: string // Empty for folders
  type: 'file' | 'folder'
  parentId: string | null
  createdAt: number
  updatedAt: number
}

// Drag and drop move operation
export interface MoveOperation {
  nodeId: string
  targetParentId: string | null
}

// File registry state
export interface FileRegistryState {
  files: Map<string, VirtualFile>
  activeFileId: string | null
}

// Compilation result
export interface CompilationResult {
  success: true
  code: string
  exports: ExportInfo[]
  compilationTime?: number // ms
}

export interface CompilationError {
  success: false
  error: CompileTimeError
}

export type CompileOutput = CompilationResult | CompilationError

// Export detection
export interface ExportInfo {
  name: string
  isDefault: boolean
  type: "function" | "component" | "unknown"
}

// Execution mode
export type ExecutionMode = "component" | "script"

// Error types - all errors are serializable JSON objects
export interface CompileTimeError {
  readonly type: "compile"
  readonly message: string
  readonly line?: number
  readonly column?: number
  readonly source?: string
}

export interface RuntimeError {
  readonly type: "runtime"
  readonly message: string
  readonly componentStack?: string
  readonly stack?: string
}

export type EvaluatorError = CompileTimeError | RuntimeError

/**
 * Serializable error representation for external consumers
 */
export interface SerializedError {
  type: "compile" | "runtime"
  message: string
  details?: Record<string, unknown>
}

// Execution result
export interface ExecutionResult {
  success: true
  exports: Record<string, unknown>
  detectedExports: ExportInfo[]
  returnValue?: unknown
  consoleOutput?: ConsoleOutput[]
  metrics?: ExecutionMetrics
}

export interface ExecutionError {
  success: false
  error: RuntimeError
}

export type ExecuteOutput = ExecutionResult | ExecutionError

// Console output capture
export interface ConsoleOutput {
  type: "log" | "error" | "warn" | "info"
  args: unknown[]
  timestamp: number
}

// Execution performance metrics
export interface ExecutionMetrics {
  compilationTime: number // ms
  executionTime: number // ms
  totalTime: number // ms
  mode: ExecutionMode
}

// Render state
export interface RenderState {
  status: "idle" | "compiling" | "executing" | "rendering" | "error"
  selectedExport: string | null
  component: React.ComponentType | null
  error: EvaluatorError | null
  executionMode: ExecutionMode
  executionResult?: unknown
  consoleOutput?: ConsoleOutput[]
  executionMetrics?: ExecutionMetrics
}

// Module state shape
export interface ComponentEvaluatorState {
  registry: FileRegistryState
  render: RenderState
}

// Allowed import configuration
export interface AllowedImport {
  module: string
  capabilityId: string
  exports: Record<string, unknown>
  category?: string
  description?: string
  examples?: string[]
}

// Configuration options
export interface EvaluatorConfig {
  autoRun: boolean
  strict: boolean
  timeout: number
}
