/**
 * Browser-based TSX Compiler
 * Compiles React TSX with strict import validation
 */

import { transform } from "sucrase"
import type { CompileOutput, ExportInfo, CompileTimeError } from "./types"
import { ALLOWED_IMPORTS, FORBIDDEN_PATTERNS, STRIP_DIRECTIVES, CAPABILITY_MAP } from "./constants"

const importMap = new Map<string, Record<string, unknown>>()
const capabilityToExports = new Map<string, Record<string, unknown>>()

ALLOWED_IMPORTS.forEach(({ module, capabilityId, exports }) => {
  importMap.set(module, exports)
  capabilityToExports.set(capabilityId, exports)
})

/**
 * Normalize a module path to its capability ID
 * Returns null if the module is not allowed
 */
export function normalizeToCapability(modulePath: string): string | null {
  return CAPABILITY_MAP[modulePath] ?? null
}

/**
 * Create a serializable compile-time error
 */
function createCompileError(message: string, source?: string): CompileTimeError {
  return {
    type: "compile",
    message,
    source,
  }
}

/**
 * Validate imports against allowlist
 * Returns error if any disallowed imports are found
 */
function validateImports(source: string): CompileTimeError | null {
  // Check for forbidden patterns first
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(source)) {
      const match = source.match(pattern)
      return createCompileError(`Forbidden pattern detected: ${match?.[0] ?? pattern.toString()}`, match?.[0])
    }
  }

  // Extract all import statements
  const importRegex =
    /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null

  while ((match = importRegex.exec(source)) !== null) {
    const moduleName = match[1]
    if (!CAPABILITY_MAP[moduleName]) {
      return createCompileError(
        `Import not allowed: "${moduleName}". Only predefined modules are permitted.`,
        moduleName,
      )
    }
  }

  return null
}

/**
 * Detect exports from source code and return info + unique identifiers for anonymous exports
 */
function detectExports(source: string): { exports: ExportInfo[]; hasDefaultExport: boolean } {
  const exports: ExportInfo[] = []
  let hasDefaultExport = false

  // Detect `export default function Name()` or `export default function()`
  const defaultFunctionMatch = source.match(/export\s+default\s+function\s*(\w*)\s*\(/)
  if (defaultFunctionMatch) {
    hasDefaultExport = true
    exports.push({
      name: defaultFunctionMatch[1] || "__DefaultExport__",
      isDefault: true,
      type: "component",
    })
  }

  // Detect `export default class Name` or `export default class`
  const defaultClassMatch = source.match(/export\s+default\s+class\s*(\w*)/)
  if (defaultClassMatch && !hasDefaultExport) {
    hasDefaultExport = true
    exports.push({
      name: defaultClassMatch[1] || "__DefaultExport__",
      isDefault: true,
      type: "component",
    })
  }

  // Detect `export default identifier` (not function/class)
  const defaultIdentifierMatch = source.match(/export\s+default\s+(?!function|class)(\w+)/)
  if (defaultIdentifierMatch && !hasDefaultExport) {
    hasDefaultExport = true
    exports.push({
      name: defaultIdentifierMatch[1],
      isDefault: true,
      type: "component",
    })
  }

  // Detect named exports: `export function Name()`, `export const Name`, `export class Name`
  const namedExportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g
  let match: RegExpExecArray | null
  while ((match = namedExportRegex.exec(source)) !== null) {
    const name = match[1]
    // Check if it looks like a component (PascalCase)
    const isComponent = /^[A-Z]/.test(name)
    exports.push({
      name,
      isDefault: false,
      type: isComponent ? "component" : "function",
    })
  }

  // Detect `export { ... }` syntax
  const exportListRegex = /export\s+\{([^}]+)\}/g
  while ((match = exportListRegex.exec(source)) !== null) {
    const names = match[1].split(",").map((n) => {
      const trimmed = n.trim()
      // Handle `name as alias` - use the alias as the exported name
      const asMatch = trimmed.match(/^\w+\s+as\s+(\w+)$/)
      return asMatch ? asMatch[1] : trimmed
    })
    names.forEach((name) => {
      if (name && !exports.find((e) => e.name === name)) {
        exports.push({
          name,
          isDefault: false,
          type: /^[A-Z]/.test(name) ? "component" : "function",
        })
      }
    })
  }

  return { exports, hasDefaultExport }
}

/**
 * Preprocess source code
 * - Strip directives
 * - Prepare for compilation
 */
function preprocess(source: string): string {
  let processed = source

  // Strip directives
  for (const directive of STRIP_DIRECTIVES) {
    processed = processed.replace(directive, "")
  }

  return processed.trim()
}

/**
 * Transform ES module syntax to CommonJS-like for sandbox execution
 * This handles ALL import and export variations
 */
function transformModuleSyntax(source: string): { code: string; exportCapture: string } {
  let transformed = source
  const exportedNames: { local: string; exported: string; isDefault: boolean }[] = []

  // ============================================
  // STEP 1: Transform all import statements
  // ============================================

  // Handle: import Default, { named } from 'module'
  transformed = transformed.replace(
    /import\s+(\w+)\s*,\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, defaultName, namedImports, module) => {
      const fixedNamed = namedImports
        .split(",")
        .map((imp: string) => {
          const trimmed = imp.trim()
          const asMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/)
          return asMatch ? `${asMatch[1]}: ${asMatch[2]}` : trimmed
        })
        .join(", ")
      return `const ${defaultName} = __require("${module}").default || __require("${module}");\nconst { ${fixedNamed} } = __require("${module}");`
    },
  )

  // Handle: import { named, foo as bar } from 'module'
  transformed = transformed.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, imports: string, module: string) => {
      const fixedImports = imports
        .split(",")
        .map((imp: string) => {
          const trimmed = imp.trim()
          const asMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/)
          return asMatch ? `${asMatch[1]}: ${asMatch[2]}` : trimmed
        })
        .join(", ")
      return `const { ${fixedImports} } = __require("${module}");`
    },
  )

  // Handle: import * as Name from 'module'
  transformed = transformed.replace(
    /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g,
    (_, name, module) => `const ${name} = __require("${module}");`,
  )

  // Handle: import Default from 'module'
  transformed = transformed.replace(
    /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g,
    (_, name, module) => `const ${name} = __require("${module}").default || __require("${module}");`,
  )

  // Handle: import 'module' (side-effect only)
  transformed = transformed.replace(/import\s+['"]([^'"]+)['"]\s*;?/g, (_, module) => `__require("${module}");`)

  // ============================================
  // STEP 2: Transform all export statements
  // ============================================

  // Handle: export default function Name() or export default function()
  transformed = transformed.replace(/export\s+default\s+function\s*(\w*)\s*\(/g, (_, name) => {
    const localName = name || "__DefaultExport__"
    exportedNames.push({ local: localName, exported: "default", isDefault: true })
    return `function ${localName}(`
  })

  // Handle: export default class Name or export default class
  transformed = transformed.replace(/export\s+default\s+class\s*(\w*)/, (_, name) => {
    const localName = name || "__DefaultExport__"
    exportedNames.push({ local: localName, exported: "default", isDefault: true })
    return `class ${localName}`
  })

  // Handle: export default expression (must come after function/class)
  transformed = transformed.replace(/export\s+default\s+(?!function|class)(\w+)\s*;?/g, (_, name) => {
    exportedNames.push({ local: name, exported: "default", isDefault: true })
    return "" // Remove the export statement, we'll capture it at the end
  })

  // Handle: export function Name()
  transformed = transformed.replace(/export\s+function\s+(\w+)\s*\(/g, (_, name) => {
    exportedNames.push({ local: name, exported: name, isDefault: false })
    return `function ${name}(`
  })

  // Handle: export class Name
  transformed = transformed.replace(/export\s+class\s+(\w+)/g, (_, name) => {
    exportedNames.push({ local: name, exported: name, isDefault: false })
    return `class ${name}`
  })

  // Handle: export const/let/var Name = ...
  transformed = transformed.replace(/export\s+(const|let|var)\s+(\w+)/g, (_, keyword, name) => {
    exportedNames.push({ local: name, exported: name, isDefault: false })
    return `${keyword} ${name}`
  })

  // Handle: export { name1, name2 as alias }
  transformed = transformed.replace(/export\s+\{([^}]+)\}\s*;?/g, (_, names: string) => {
    names.split(",").forEach((n: string) => {
      const trimmed = n.trim()
      const asMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/)
      if (asMatch) {
        exportedNames.push({ local: asMatch[1], exported: asMatch[2], isDefault: false })
      } else {
        exportedNames.push({ local: trimmed, exported: trimmed, isDefault: false })
      }
    })
    return "" // Remove the export statement
  })

  // Generate export capture code
  const exportCapture = exportedNames
    .map(({ local, exported, isDefault }) => {
      if (isDefault) {
        return `if (typeof ${local} !== 'undefined') __exports.default = ${local};`
      }
      return `if (typeof ${local} !== 'undefined') __exports["${exported}"] = ${local};`
    })
    .join("\n")

  return { code: transformed, exportCapture }
}

/**
 * Compile TSX source to JavaScript
 */
export function compile(source: string): CompileOutput {
  try {
    // Validate imports first
    const importError = validateImports(source)
    if (importError) {
      return { success: false, error: importError }
    }

    // Detect exports before transformation (for UI purposes)
    const { exports } = detectExports(source)

    // Preprocess (strip directives)
    const preprocessed = preprocess(source)

    // Run Sucrase to transform JSX and TypeScript
    const result = transform(preprocessed, {
      transforms: ["typescript", "jsx"],
      jsxRuntime: "automatic",
      jsxImportSource: "react",
      production: true,
    })

    // Transform all module syntax (imports AND exports)
    const { code: transformedCode, exportCapture } = transformModuleSyntax(result.code)

    // Wrap in module pattern
    const moduleCode = `
      (function(__require, __exports) {
        "use strict";
        ${transformedCode}
        ${exportCapture}
      })
    `

    return {
      success: true,
      code: moduleCode,
      exports,
    }
  } catch (err) {
    const error = err as Error
    return {
      success: false,
      error: createCompileError(error.message),
    }
  }
}

/**
 * Get the import resolver function for runtime
 * Resolves module names to their exports via capability IDs
 */
export function getImportResolver(): (moduleName: string) => Record<string, unknown> {
  return (moduleName: string) => {
    // First try direct module lookup
    let moduleExports = importMap.get(moduleName)

    // If not found, try capability-based lookup
    if (!moduleExports) {
      const capabilityId = CAPABILITY_MAP[moduleName]
      if (capabilityId) {
        moduleExports = capabilityToExports.get(capabilityId)
      }
    }

    if (!moduleExports) {
      throw new Error(`Module not found: ${moduleName}`)
    }
    return moduleExports
  }
}
