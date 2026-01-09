/**
 * ComponentEvaluator Constants
 * Defines the import allowlist and other static configuration
 */

import * as React from "react"
import * as jsxRuntime from "react/jsx-runtime"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { cn } from "@/utils"

// shadcn/ui components - add more as needed
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

import type { AllowedImport } from "./types"

/**
 * Capability ID mapping
 * Maps path aliases and module names to internal capability identifiers
 */
export const CAPABILITY_MAP: Record<string, string> = {
  // Core libraries
  react: "cap:react",
  "react/jsx-runtime": "cap:react-jsx",
  "framer-motion": "cap:framer-motion",
  clsx: "cap:clsx",
  // Utility
  "@/lib/utils": "cap:utils",
  // UI Components
  "@/components/ui/button": "cap:ui-button",
  "@/components/ui/card": "cap:ui-card",
  "@/components/ui/input": "cap:ui-input",
  "@/components/ui/label": "cap:ui-label",
  "@/components/ui/badge": "cap:ui-badge",
  "@/components/ui/avatar": "cap:ui-avatar",
  "@/components/ui/separator": "cap:ui-separator",
  "@/components/ui/switch": "cap:ui-switch",
  "@/components/ui/checkbox": "cap:ui-checkbox",
}

/**
 * Strict import allowlist
 * Only these modules can be imported in evaluated components
 * Any other import will hard-fail compilation
 */
export const ALLOWED_IMPORTS: AllowedImport[] = [
  {
    module: "react",
    capabilityId: "cap:react",
    exports: React,
    category: "react",
    description: "React library for building user interfaces",
    examples: [
      "import { useState, useEffect } from 'react'",
      "import React from 'react'"
    ]
  },
  {
    module: "react/jsx-runtime",
    capabilityId: "cap:react-jsx",
    exports: jsxRuntime,
    category: "react",
    description: "React JSX runtime for automatic JSX transformation",
    examples: [
      "// Automatically available when using JSX"
    ]
  },
  {
    module: "framer-motion",
    capabilityId: "cap:framer-motion",
    exports: { motion, AnimatePresence },
    category: "react",
    description: "Animation library for React components",
    examples: [
      "import { motion, AnimatePresence } from 'framer-motion'"
    ]
  },
  {
    module: "clsx",
    capabilityId: "cap:clsx",
    exports: { default: clsx, clsx },
    category: "utilities",
    description: "Utility for constructing className strings conditionally",
    examples: [
      "import clsx from 'clsx'"
    ]
  },
  {
    module: "@/lib/utils",
    capabilityId: "cap:utils",
    exports: { cn },
    category: "utilities",
    description: "Utility function for combining Tailwind CSS classes",
    examples: [
      "import { cn } from '@/lib/utils'"
    ]
  },
  {
    module: "@/components/ui/button",
    capabilityId: "cap:ui-button",
    exports: { Button },
    category: "react",
    description: "Reusable button component with multiple variants",
    examples: [
      "import { Button } from '@/components/ui/button'"
    ]
  },
  {
    module: "@/components/ui/card",
    capabilityId: "cap:ui-card",
    exports: { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter },
    category: "react",
    description: "Card container components for organizing content",
    examples: [
      "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'"
    ]
  },
  {
    module: "@/components/ui/input",
    capabilityId: "cap:ui-input",
    exports: { Input },
    category: "react",
    description: "Input field component with styling and variants",
    examples: [
      "import { Input } from '@/components/ui/input'"
    ]
  },
  {
    module: "@/components/ui/label",
    capabilityId: "cap:ui-label",
    exports: { Label },
    category: "react",
    description: "Label component for form inputs",
    examples: [
      "import { Label } from '@/components/ui/label'"
    ]
  },
  {
    module: "@/components/ui/badge",
    capabilityId: "cap:ui-badge",
    exports: { Badge },
    category: "react",
    description: "Badge component for status indicators and tags",
    examples: [
      "import { Badge } from '@/components/ui/badge'"
    ]
  },
  {
    module: "@/components/ui/avatar",
    capabilityId: "cap:ui-avatar",
    exports: { Avatar, AvatarImage, AvatarFallback },
    category: "react",
    description: "Avatar component for user profile images",
    examples: [
      "import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'"
    ]
  },
  {
    module: "@/components/ui/separator",
    capabilityId: "cap:ui-separator",
    exports: { Separator },
    category: "react",
    description: "Visual separator component for dividing content",
    examples: [
      "import { Separator } from '@/components/ui/separator'"
    ]
  },
  {
    module: "@/components/ui/switch",
    capabilityId: "cap:ui-switch",
    exports: { Switch },
    category: "react",
    description: "Toggle switch component for boolean settings",
    examples: [
      "import { Switch } from '@/components/ui/switch'"
    ]
  },
  {
    module: "@/components/ui/checkbox",
    capabilityId: "cap:ui-checkbox",
    exports: { Checkbox },
    category: "react",
    description: "Checkbox component for multi-select options",
    examples: [
      "import { Checkbox } from '@/components/ui/checkbox'"
    ]
  },
]

/**
 * Globals to actively shadow during execution
 * These are injected as undefined into the sandbox scope
 *
 * NOTE: eval, Function, and arguments are NOT shadowed because
 * shadowing them as function parameters breaks strict mode execution.
 * They are already blocked via regex patterns in FORBIDDEN_PATTERNS.
 */
export const SHADOWED_GLOBALS = [
  "window",
  "document",
  "globalThis",
  "self",
  "global",
  "process",
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "EventSource",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "history",
  "location",
  "navigator",
  "screen",
  "alert",
  "confirm",
  "prompt",
  "open",
  "close",
  "setTimeout",
  "clearTimeout",
  "setInterval",
  "clearInterval",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "requestIdleCallback",
  "cancelIdleCallback",
]

/**
 * Forbidden patterns that will cause compilation to fail
 * These are dangerous or unsupported operations
 */
export const FORBIDDEN_PATTERNS = [
  // Direct eval usage
  /\beval\s*\(/,
  /\bFunction\s*\(/,
  /\barguments\s*\[/,

  // Prototype manipulation
  /\.__proto__/,
  /\.prototype\./,
  /\bconstructor\s*\./,

  // Global object access
  /\bwindow\./,
  /\bdocument\./,
  /\bglobal\./,
  /\bglobalThis\./,
  /\bprocess\./,

  // Network operations
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\s*\(/,
  /\bWebSocket\s*\(/,
  /\bEventSource\s*\(/,

  // Storage operations
  /\blocalStorage\./,
  /\bsessionStorage\./,
  /\bindexedDB\./,

  // Browser APIs
  /\bnavigator\./,
  /\blocation\./,
  /\bscreen\./,
  /\bhistory\./,

  // File system access
  /\brequire\s*\(/,
  /\bimport\s*\(/,
  /\bimport\s*\.meta/,

  // Worker creation
  /\bWorker\s*\(/,
  /\bSharedWorker\s*\(/,
  /\bServiceWorker\s*\(/,

  // Module manipulation
  /\bimport\s*\.reflect/,
  /\bReflect\./,
]

/**
 * Directives to strip from source code before compilation
 * These are typically used for tooling and should not affect execution
 */
export const STRIP_DIRECTIVES = [
  /^["']use strict["'];?/,
  /^["']use asm["'];?/,
  /^\/\/# sourceMappingURL=/,
  /^\/\/@ sourceMappingURL=/,
  /\/\/# sourceMappingURL=.+$/,
  /\/\/@ sourceMappingURL=.+$/,
]

/**
 * Default file content for new files
 */
export const DEFAULT_FILE_CONTENT = `// Welcome to the React UI Sandbox Preview
// Start coding your React components or JavaScript utilities here

export function Example() {
  return <div>Hello World!</div>
}
`

/**
 * Default file name for new files
 */
export const DEFAULT_FILE_NAME = "example.tsx"
