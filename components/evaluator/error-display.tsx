"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import type { EvaluatorError } from "@/lib/component-evaluator"

interface ErrorDisplayProps {
  error: EvaluatorError
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false)

  const errorText = [`[${error.type.toUpperCase()}] ${error.message}`, error.stack].filter(Boolean).join("\n\n")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(errorText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-red-400/70">{error.type}</span>
        <button
          onClick={handleCopy}
          className="p-1 rounded text-[#8b8b98] hover:text-[#e4e4e7] hover:bg-[#1a1a1f] transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-green-500/70" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <pre className="text-[11px] font-mono text-red-400/80 whitespace-pre-wrap break-words leading-relaxed">
          {error.message}
        </pre>
        {error.stack && (
          <pre className="mt-3 text-[10px] font-mono text-[#8b8b98]/40 whitespace-pre-wrap break-words leading-relaxed">
            {error.stack}
          </pre>
        )}
      </div>
    </div>
  )
}
