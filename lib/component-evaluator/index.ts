/**
 * ComponentEvaluator Module
 * Public API exports
 */

// Types - only essential public types
export type {
  VirtualFile,
  FileRegistryState,
  CompileOutput,
  ExportInfo,
  CompileTimeError,
  RuntimeError,
  EvaluatorError,
  SerializedError,
  ExecuteOutput,
  RenderState,
  ComponentEvaluatorState,
} from "./types"

// React Components - public rendering API
export { ComponentErrorBoundary } from "./error-boundary"
export { ComponentRenderer } from "./renderer"

// Main Hook - primary public API
export { useComponentEvaluator } from "./use-component-evaluator"
export type { UseComponentEvaluatorReturn } from "./use-component-evaluator"

// Internal utilities - exposed for advanced use only
export { compile, getImportResolver, normalizeToCapability } from "./compiler"
export { execute, extractComponent, findBestExport } from "./executor"
export {
  createFileRegistry,
  createFile,
  updateFile,
  deleteFile,
  setActiveFile,
  getActiveFile,
  getAllFiles,
} from "./file-registry"
