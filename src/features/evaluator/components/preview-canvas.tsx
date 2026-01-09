"use client"

import type React from "react"
import { ComponentRenderer } from "@/services/evaluator"
import type { EvaluatorError, ExportInfo, ExecutionMode, ConsoleOutput, ExecutionMetrics } from "../types"
import { ExportSelector } from "./export-selector"
import { ErrorDisplay } from "./error-display"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface PreviewCanvasProps {
  component: React.ComponentType | null
  error: EvaluatorError | null
  isLoading: boolean
  status: string
  exports: ExportInfo[]
  selectedExport: string | null
  onSelectExport: (name: string) => void
  onError: (error: EvaluatorError) => void
  executionMode: ExecutionMode
  executionResult: unknown
  consoleOutput: ConsoleOutput[]
  executionMetrics?: ExecutionMetrics
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
  executionMode,
  executionResult,
  consoleOutput,
  executionMetrics,
}: PreviewCanvasProps) {
  const [copied, setCopied] = useState(false)

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }

  const formatConsoleOutput = (output: ConsoleOutput): string => {
    const args = output.args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg)
        } catch {
          return String(arg)
        }
      }
      return String(arg)
    }).join(' ')
    return args
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getSyntaxLanguage = (value: unknown): string => {
    if (typeof value === 'object' && value !== null) return 'json'
    if (typeof value === 'string') return 'javascript'
    return 'javascript'
  }

  const formatTime = (ms: number): string => {
    if (ms < 1) return '< 1ms'
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <div className="flex flex-col h-full">
      {executionMode === "component" && (
        <ExportSelector exports={exports} selected={selectedExport} onSelect={onSelectExport} />
      )}

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
            <span className="text-[11px] text-[#8b8b98]/60">Click Evaluate to run</span>
          </div>
        ) : executionMode === "script" ? (
          <div className="h-full overflow-auto">
            <div className="p-4 space-y-4">
              {executionMetrics && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#8b8b98] uppercase tracking-wide">Performance</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[#8b8b98]">Compilation</span>
                      <span className="text-[#e4e4e7] font-mono">{formatTime(executionMetrics.compilationTime)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#8b8b98]">Execution</span>
                      <span className="text-[#e4e4e7] font-mono">{formatTime(executionMetrics.executionTime)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#8b8b98]">Total</span>
                      <span className="text-[#e4e4e7] font-mono">{formatTime(executionMetrics.totalTime)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {consoleOutput.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#8b8b98] uppercase tracking-wide">Console Output</div>
                  {consoleOutput.map((output, index) => (
                    <div key={index} className="font-mono text-xs">
                      <span className="text-[#8b8b98]">[{output.type}]</span>
                      <span className="text-[#e4e4e7] ml-2">{formatConsoleOutput(output)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {executionResult !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-[#8b8b98] uppercase tracking-wide">Return Value</div>
                    <button
                      onClick={() => handleCopy(formatValue(executionResult))}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-[#8b8b98] hover:text-[#e4e4e7] hover:bg-[#2a2a2f] rounded transition-colors"
                    >
                      {copied ? (
                        <><Check className="size-3" /> Copied!</>
                      ) : (
                        <><Copy className="size-3" /> Copy</>
                      )}
                    </button>
                  </div>
                  <div className="relative rounded overflow-hidden">
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(executionResult)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '12px',
                        fontSize: '11px',
                        lineHeight: '1.4',
                        background: 'transparent',
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        }
                      }}
                    >
                      {formatValue(executionResult)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>
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
