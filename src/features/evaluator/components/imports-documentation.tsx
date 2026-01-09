import { ALLOWED_IMPORTS } from "../lib/constants"
import type { AllowedImport } from "../types"

export function ImportsDocumentation() {
  const groupedImports = ALLOWED_IMPORTS.reduce((acc: Record<string, AllowedImport[]>, importConfig: AllowedImport) => {
    const category = importConfig.category || "other"
    if (!acc[category]) acc[category] = []
    acc[category].push(importConfig)
    return acc
  }, {} as Record<string, AllowedImport[]>)

  const formatExports = (exports: Record<string, unknown>): string => {
    return Object.keys(exports)
      .sort()
      .join(", ")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#e4e4e7]">Available Imports</h1>
        <p className="text-[#8b8b98]">
          These are the modules and functions you can import and use in your code. 
          All imports are sandboxed for security.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedImports).map(([category, imports]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#e4e4e7] capitalize">
              {category === "react" ? "React & UI" : 
               category === "utilities" ? "Utility Functions" :
               category === "date" ? "Date & Time" :
               category}
            </h2>
            <div className="grid gap-4">
              {imports.map((importConfig: AllowedImport) => (
                <div 
                  key={importConfig.module}
                  className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-mono text-sm font-medium text-[#e4e4e7]">
                        {importConfig.module}
                      </h3>
                      {importConfig.description && (
                        <p className="text-xs text-[#8b8b98] mt-1">
                          {importConfig.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 bg-[#2a2a2f] text-[#8b8b98] rounded">
                      {importConfig.capabilityId}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[#8b8b98] uppercase tracking-wide">
                      Available Exports
                    </div>
                    <div className="font-mono text-xs text-[#e4e4e7] bg-[#0a0a0d] p-2 rounded border border-[#2a2a2f]/50">
                      {formatExports(importConfig.exports)}
                    </div>
                  </div>

                  {importConfig.examples && importConfig.examples.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-[#8b8b98] uppercase tracking-wide">
                        Example Usage
                      </div>
                      <div className="space-y-2">
                        {importConfig.examples.map((example: string, index: number) => (
                          <pre 
                            key={index}
                            className="font-mono text-xs text-[#e4e4e7] bg-[#0a0a0d] p-2 rounded border border-[#2a2a2f]/50 whitespace-pre-wrap"
                          >
                            {example}
                          </pre>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-[#e4e4e7]">Security Notes</h3>
        <ul className="text-sm text-[#8b8b98] space-y-1 list-disc list-inside">
          <li>All imports run in a secure sandbox environment</li>
          <li>Browser APIs like `fetch`, `localStorage`, etc. are not available</li>
          <li>File system access is restricted for security</li>
          <li>Network requests are blocked in the sandbox</li>
          <li>Only the modules listed above are available for import</li>
        </ul>
      </div>

      <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-[#e4e4e7]">Import Syntax</h3>
        <div className="space-y-2">
          <div className="font-mono text-xs text-[#e4e4e7] bg-[#0a0a0d] p-2 rounded border border-[#2a2a2f]/50">
            {`// Named imports
import { useState, useEffect } from "react"

// Default import
import Button from "@/components/ui/button"

// Mixed imports
import { useState, default as Button } from "@/components/ui/button"

// Namespace import
import * as UI from "@/components/ui/button"`}
          </div>
        </div>
      </div>
    </div>
  )
}
