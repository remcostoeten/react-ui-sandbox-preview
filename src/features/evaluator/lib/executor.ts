import type React from "react"
/**
 * Sandboxed Code Executor
 * Executes compiled code in isolation with controlled dependencies
 */

import type { ExecuteOutput, ExportInfo, RuntimeError } from "./types"
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
 * Execute compiled module code
 * Runs in a sandboxed context with only allowed dependencies
 */
export function execute(compiledCode: string, detectedExports: ExportInfo[]): ExecuteOutput {
  try {
    // Create isolated exports object
    const exports: Record<string, unknown> = {}

    // Get the import resolver
    const requireFn = getImportResolver()

    const sandboxScope = buildSandboxScope()

    const scopeKeys = Object.keys(sandboxScope)
    const scopeValues = Object.values(sandboxScope)

    // The compiled code is a self-invoking function that takes __require and __exports
    // We wrap it in another function that shadows all dangerous globals
    const wrappedCode = `
      return function(${scopeKeys.join(", ")}) {
        "use strict";
        return (${compiledCode});
      }
    `

    const wrapperFn = new Function(wrappedCode)()
    const moduleFn = wrapperFn(...scopeValues)
    moduleFn(requireFn, exports)

    return {
      success: true,
      exports,
      detectedExports,
    }
  } catch (err) {
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
