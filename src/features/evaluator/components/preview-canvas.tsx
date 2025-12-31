"use client"

import type React from "react"
import { ComponentRenderer } from "@/services/evaluator"
import type { EvaluatorError, ExportInfo } from "../types"
import { ExportSelector } from "./export-selector"
import { ErrorDisplay } from "./error-display"

interface PreviewCanvasProps {
  component: React.ComponentType | null
  error: EvaluatorError | null
  isLoading: boolean
  status: string
  exports: ExportInfo[]
  selectedExport: string | null
  onSelectExport: (name: string) => void
  onError: (error: EvaluatorError) => void
}

export function PreviewCanvas({
  component,
  error,
  isLoading,
  status,
  exports,
  selectedExport,
  onSelectExport,
  onError,
}: PreviewCanvasProps) {
  return (
    <div className="flex flex-col h-full">
      <ExportSelector exports={exports} selected={selectedExport} onSelect={onSelectExport} />

      <div className="flex-1 relative m-3 mt-0 rounded bg-[#0b0b0d]/50 ring-1 ring-inset ring-[#2a2a2f]/50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="h-3 w-3 rounded-full border border-[#8b8b98]/30 border-t-[#8b8b98] animate-spin" />
          </div>
        )}

        {error ? (
          <ErrorDisplay error={error} />
        ) : status === "idle" ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[11px] text-[#8b8b98]/60">Click Evaluate to render</span>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <ComponentRenderer component={component} onError={(e) => onError({ type: "runtime", ...e })} />
          </div>
        )}
      </div>
    </div>
  )
}
