"use client"

import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopBarProps {
  status: string
  onEvaluate: () => void
  disabled: boolean
}

const statusLabels: Record<string, string> = {
  idle: "Ready",
  compiling: "Compiling",
  executing: "Executing",
  rendering: "Rendered",
  error: "Error",
}

export function TopBar({ status, onEvaluate, disabled }: TopBarProps) {
  return (
    <div className="flex items-center justify-between h-9 px-3 border-b border-[#2a2a2f] bg-[#111115]">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[#e4e4e7]">Evaluator</span>
        <span className="text-[10px] text-[#8b8b98]">{statusLabels[status] || status}</span>
      </div>

      <button
        onClick={onEvaluate}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 h-6 px-2.5 text-[11px] font-medium rounded",
          "border border-[#2a2a2f] bg-transparent text-[#e4e4e7]",
          "hover:bg-[#1a1a1f] hover:border-[#8b8b98]/30 transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#2a2a2f]",
        )}
      >
        <Play className="h-2.5 w-2.5" />
        Evaluate
      </button>
    </div>
  )
}
