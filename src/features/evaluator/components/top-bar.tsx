"use client"

import { Play, Loader, RotateCcw, Wand2 } from "lucide-react"
import { cn } from "@/utils"

interface TopBarProps {
  status: string
  onEvaluate: () => void
  onReset?: () => void
  onFormat?: () => void
  disabled: boolean
  children?: React.ReactNode
}

export const statusLabels: Record<string, string> = {
  idle: "Ready",
  compiling: "Compiling",
  executing: "Executing",
  rendering: "Rendered",
  error: "Error",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "executing":
    case "compiling":
      return "bg-[#f59e0b]"
    case "rendering":
      return "bg-[#22c55e]"
    case "error":
      return "bg-[#ef4444]"
    default:
      return "bg-[#22c55e]"
  }
}

export function TopBar({ status, onEvaluate, onReset, onFormat, disabled, children }: TopBarProps) {
  const isLoading = status === "executing" || status === "compiling"

  return (
    <header className="h-12 bg-[#0a0a0a] border-b border-[#27272a] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#3b82f6] rounded flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold">E</span>
          </div>
          <h1 className="text-[15px] font-medium text-[#e4e4e7]">Evaluator</h1>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            getStatusColor(status),
            isLoading && "animate-pulse"
          )} />
          <span className="text-[11px] font-medium text-[#a1a1aa]">
            {statusLabels[status] || status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {children}

        {/* Format button */}
        {onFormat && (
          <button
            onClick={onFormat}
            disabled={disabled}
            className={cn(
              "h-8 px-3 rounded-md flex items-center gap-2 text-[12px] font-medium",
              "text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#e4e4e7]",
              "transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            )}
            title="Format Code"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>
        )}

        {/* Reset button */}
        {onReset && (
          <button
            onClick={onReset}
            disabled={status === "idle"}
            className={cn(
              "h-8 px-3 rounded-md flex items-center gap-2 text-[12px] font-medium",
              "text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#e4e4e7]",
              "transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        {/* Execute button */}
        <button
          onClick={onEvaluate}
          disabled={disabled || isLoading}
          className={cn(
            "h-8 px-4 rounded-md flex items-center gap-2 text-[12px] font-medium",
            "bg-[#3b82f6] hover:bg-[#60a5fa] text-white",
            "transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <>
              <Loader className="w-3.5 h-3.5 animate-spin" />
              Running
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Execute
            </>
          )}
        </button>
      </div>
    </header>
  )
}
