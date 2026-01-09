import Link from "next/link"

type Props = {
    executionState: 'idle' | 'loading' | 'success' | 'error'
    line?: number
    column?: number
    language?: string
}

    export function StatusBar({
    executionState,
    line = 1,
    column = 1,
    language = "TypeScript"
}: Props) {
    return (
        <footer className="h-7 bg-[#0a0a0a] border-t border-[#27272a] flex items-center justify-between px-4 text-[11px]">
            <div className="flex items-center gap-4">
                <span className="text-[#71717a]">
                    Ln {line}, Col {column}
                </span>
                <span className="text-[#71717a]">
                    UTF-8
                </span>
                <span className="text-[#71717a]">
                    {language}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {executionState === 'success' && (
                    <span className="text-[#22c55e]">Execution successful</span>
                )}
                {executionState === 'error' && (
                    <span className="text-[#ef4444]">Execution failed</span>
                )}
                <span className="text-[#71717a]">&gt; v0.0.1</span>
                <span className="text-[#71717a]">by <Link href="https://github.com/remcostoeten">@remcostoeten</Link></span>
            </div>
        </footer>
    )
}
