/**
 * Evaluator Feature
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

// Main Hook - primary public API
export { useComponentEvaluator } from "./hooks/use-component-evaluator"
export type { UseComponentEvaluatorReturn } from "./hooks/use-component-evaluator"

// Components - public UI components
export { EvaluatorWorkspace } from "./components/evaluator-workspace"
export { CodeEditor } from "./components/code-editor"
export { FileTree } from "./components/file-tree"
export { PreviewCanvas } from "./components/preview-canvas"
export { TopBar } from "./components/top-bar"
export { ErrorDisplay } from "./components/error-display"
export { ExportSelector } from "./components/export-selector"

// Internal utilities - exposed for advanced use only
export { compile, getImportResolver, normalizeToCapability } from "./lib/compiler"
export { execute, extractComponent, findBestExport } from "./lib/executor"
export {
    createFileRegistry,
    createFile,
    updateFile,
    deleteFile,
    setActiveFile,
    getActiveFile,
    getAllFiles,
} from "./lib/file-registry"
