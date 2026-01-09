import type React from "react"
/**
 * Sandboxed Code Executor
 * Executes compiled code in isolation with controlled dependencies
 */

import type { ExecuteOutput, ExportInfo, RuntimeError, ConsoleOutput, ExecutionMode, ExecutionMetrics } from "./types"
import { getImportResolver } from "./compiler"
import { SHADOWED_GLOBALS } from "./constants"

/**
 * Build sandbox scope with shadowed globals
 * All dangerous browser APIs are set to undefined
 */
function buildSandboxScope(): Record<string, undefined> {
  const shadowedScope: Record<string, undefined> = {}
  for (const global of SHADOWED_GLOBALS) {
    shadowedScope[global] = undefined
  }
  return shadowedScope
}

/**
 * Create a serializable runtime error
 */
function createRuntimeError(err: unknown): RuntimeError {
  const error = err as Error
  return {
    type: "runtime",
    message: String(error?.message ?? err),
    componentStack: typeof error?.stack === "string" ? error.stack : undefined,
  }
}

/**
 * Create console capture system
 */
function createConsoleCapture(): { console: Record<string, Function>, output: ConsoleOutput[] } {
  const output: ConsoleOutput[] = []
  
  const createConsoleMethod = (type: ConsoleOutput["type"]): Function => {
    return (...args: unknown[]) => {
      output.push({
        type,
        args,
        timestamp: Date.now()
      })
    }
  }
  
  return {
    console: {
      log: createConsoleMethod("log"),
      error: createConsoleMethod("error"),
      warn: createConsoleMethod("warn"),
      info: createConsoleMethod("info"),
    },
    output
  }
}

/**
 * Execute compiled module code with performance tracking
 * Runs in a sandboxed context with only allowed dependencies
 */
export function execute(compiledCode: string, detectedExports: ExportInfo[], mode: ExecutionMode = "component"): ExecuteOutput {
  const startTime = performance.now()
  
  try {
    // Create isolated exports object
    const exports: Record<string, unknown> = {}

    // Get the import resolver
    const requireFn = getImportResolver()

    const sandboxScope = buildSandboxScope()
    const consoleCapture = createConsoleCapture()

    const scopeKeys = Object.keys(sandboxScope)
    const scopeValues = Object.values(sandboxScope)

    const executionStartTime = performance.now()

    if (mode === "script") {
      // For script mode, execute the code directly and capture return value
      const scriptCode = `
        return function(${scopeKeys.join(", ")}, console) {
          "use strict";
          let result;
          const originalConsole = console;
          try {
            result = (function() {
              ${compiledCode}
            })();
          } finally {
            // Restore original console if needed
          }
          return { result, exports: {} };
        }
      `
      
      const wrapperFn = new Function(scriptCode)()
      const scriptFn = wrapperFn(...scopeValues, consoleCapture.console)
      const { result } = scriptFn
      
      const executionEndTime = performance.now()
      const totalTime = performance.now() - startTime
      
      return {
        success: true,
        exports: {},
        detectedExports: [],
        returnValue: result,
        consoleOutput: consoleCapture.output,
        metrics: {
          compilationTime: 0, // Not tracked in executor
          executionTime: executionEndTime - executionStartTime,
          totalTime,
          mode
        }
      }
    } else {
      // Component mode - existing logic
      const wrappedCode = `
        return function(${scopeKeys.join(", ")}) {
          "use strict";
          return (${compiledCode});
        }
      `

      const wrapperFn = new Function(wrappedCode)()
      const moduleFn = wrapperFn(...scopeValues)
      moduleFn(requireFn, exports)

      const executionEndTime = performance.now()
      const totalTime = performance.now() - startTime

      return {
        success: true,
        exports,
        detectedExports,
        consoleOutput: consoleCapture.output,
        metrics: {
          compilationTime: 0, // Not tracked in executor
          executionTime: executionEndTime - executionStartTime,
          totalTime,
          mode
        }
      }
    }
  } catch (err) {
    const totalTime = performance.now() - startTime
    
    return {
      success: false,
      error: createRuntimeError(err),
    }
  }
}

/**
 * Extract a renderable component from exports
 */
export function extractComponent(exports: Record<string, unknown>, exportName: string): React.ComponentType | null {
  const exported = exportName === "default" ? exports.default : exports[exportName]

  if (typeof exported === "function") {
    return exported as React.ComponentType
  }

  return null
}

/**
 * Find the best export to render
 * Priority: default export > first component-like export > first function
 */
export function findBestExport(detectedExports: ExportInfo[]): string | null {
  // Prefer default export
  const defaultExport = detectedExports.find((e) => e.isDefault)
  if (defaultExport) return defaultExport.name

  // Then prefer component-type exports
  const componentExport = detectedExports.find((e) => e.type === "component")
  if (componentExport) return componentExport.name

  // Fall back to first export
  return detectedExports[0]?.name ?? null
}

/**
 * Detect execution mode based on code content
 */
export function detectExecutionMode(code: string): ExecutionMode {
  // Check for React component patterns
  const reactPatterns = [
    /import.*React.*from/i,
    /import.*{.*Component.*}/i,
    /export.*function.*[A-Z]/,
    /export.*const.*[A-Z].*=.*\(/,
    /jsx-runtime/i,
    /className=/i,
    /<.*>/,
  ]
  
  // Check for module patterns (exports/imports)
  const modulePatterns = [
    /export\s+/,
    /import\s+.*from/,
    /module\.exports/,
  ]
  
  const hasReactPatterns = reactPatterns.some(pattern => pattern.test(code))
  const hasModulePatterns = modulePatterns.some(pattern => pattern.test(code))
  
  // If it has React patterns or module exports, treat as component
  if (hasReactPatterns || hasModulePatterns) {
    return "component"
  }
  
  // Otherwise, treat as script
  return "script"
}
