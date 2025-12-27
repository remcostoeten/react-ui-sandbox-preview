"use client"

import type { ExportInfo } from "@/lib/component-evaluator"
import { cn } from "@/lib/utils"

interface ExportSelectorProps {
  exports: ExportInfo[]
  selected: string | null
  onSelect: (exportName: string) => void
}

export function ExportSelector({ exports, selected, onSelect }: ExportSelectorProps) {
  if (exports.length <= 1) return null

  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <span className="text-[10px] text-[#8b8b98]/60 mr-1">Export</span>
      <div className="flex gap-1 flex-wrap">
        {exports.map((exp) => (
          <button
            key={exp.name}
            onClick={() => onSelect(exp.name)}
            className={cn(
              "px-2 py-0.5 text-[10px] font-mono rounded transition-colors",
              selected === exp.name
                ? "bg-[#1a1a1f] text-[#e4e4e7]"
                : "text-[#8b8b98] hover:text-[#e4e4e7] hover:bg-[#1a1a1f]/50",
            )}
          >
            {exp.name}
          </button>
        ))}
      </div>
    </div>
  )
}
