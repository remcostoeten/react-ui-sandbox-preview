/**
 * ComponentEvaluator Constants
 * Defines the import allowlist and other static configuration
 */

import * as React from "react"
import * as jsxRuntime from "react/jsx-runtime"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { cn } from "@/lib/utils"

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
  },
  {
    module: "react/jsx-runtime",
    capabilityId: "cap:react-jsx",
    exports: jsxRuntime,
  },
  {
    module: "framer-motion",
    capabilityId: "cap:framer-motion",
    exports: { motion, AnimatePresence },
  },
  {
    module: "clsx",
    capabilityId: "cap:clsx",
    exports: { default: clsx, clsx },
  },
  {
    module: "@/lib/utils",
    capabilityId: "cap:utils",
    exports: { cn },
  },
  {
    module: "@/components/ui/button",
    capabilityId: "cap:ui-button",
    exports: { Button },
  },
  {
    module: "@/components/ui/card",
    capabilityId: "cap:ui-card",
    exports: { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter },
  },
  {
    module: "@/components/ui/input",
    capabilityId: "cap:ui-input",
    exports: { Input },
  },
  {
    module: "@/components/ui/label",
    capabilityId: "cap:ui-label",
    exports: { Label },
  },
  {
    module: "@/components/ui/badge",
    capabilityId: "cap:ui-badge",
    exports: { Badge },
  },
  {
    module: "@/components/ui/avatar",
    capabilityId: "cap:ui-avatar",
    exports: { Avatar, AvatarImage, AvatarFallback },
  },
  {
    module: "@/components/ui/separator",
    capabilityId: "cap:ui-separator",
    exports: { Separator },
  },
  {
    module: "@/components/ui/switch",
    capabilityId: "cap:ui-switch",
    exports: { Switch },
  },
  {
    module: "@/components/ui/checkbox",
    capabilityId: "cap:ui-checkbox",
    exports: { Checkbox },
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
  "alert",
  "confirm",
  "prompt",
  "open",
  "close",
  "postMessage",
  "importScripts",
] as const

/**
 * Patterns that are explicitly forbidden
 * These will cause immediate compilation failure
 */
export const FORBIDDEN_PATTERNS = [
  /import\s+.*\s+from\s+['"]next\//, // next/* imports
  /import\s+.*\s+from\s+['"]\.\.?\//, // relative imports
  /import\s*\(/, // dynamic imports
  /require\s*\(/, // CommonJS require
  /process\./, // process access
  /window\./, // window access (will be blocked at runtime too)
  /document\./, // document access
  /localStorage/, // storage access
  /sessionStorage/, // storage access
  /cookie/i, // cookie access
  /history\./, // history API
  /fetch\s*\(/, // network access
  /XMLHttpRequest/, // network access
  /WebSocket/, // network access
  /eval\s*\(/, // eval access
  /Function\s*\(/, // Function constructor access
]

/**
 * Directives to strip from source code
 */
export const STRIP_DIRECTIVES = [/['"]use client['"]\s*;?/g, /['"]use server['"]\s*;?/g]
