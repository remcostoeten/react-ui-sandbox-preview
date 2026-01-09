"use client"

import { useState, useMemo, useRef } from "react"
import { ChevronDown, ChevronsUpDown, FoldVertical } from "lucide-react"
import TreeView, { type TreeViewItem, type TreeViewRef } from "@/components/tree-view"
import type { VirtualFile } from "../types"
import { cn } from "@/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
    files: VirtualFile[]
    activeFileId: string | null
    onSelectFile: (fileId: string) => void
    onDeleteFile: (fileId: string) => void
    onMoveNode: (nodeId: string, targetParentId: string | null) => void
    testSnippets: Array<{ name: string; code: string }>
    onLoadSnippet: (name: string, code: string) => void
    config: {
        autoRun: boolean
        strict: boolean
        timeout: number
    }
    onConfigChange: (config: { autoRun: boolean; strict: boolean; timeout: number }) => void
}

interface FileNode {
    id: string
    name: string
    type: 'file' | 'folder'
    children?: FileNode[]
}

// Test snippets only
const testSnippetsFiles: FileNode[] = [
    {
        id: 'snippets',
        name: 'snippets',
        type: 'folder',
        children: [
            { id: 'simple-heading', name: 'simple-heading.tsx', type: 'file' },
            { id: 'counter', name: 'counter.tsx', type: 'file' },
            { id: 'data-transform', name: 'data-transform.ts', type: 'file' },
            { id: 'api-call', name: 'api-call.ts', type: 'file' },
        ],
    },
    { id: 'readme', name: 'README.md', type: 'file' },
]

const projects = [
    { id: 'snippets', name: 'Test Snippets', files: testSnippetsFiles },
]



export function Sidebar({
    testSnippets,
    onLoadSnippet,
    config,
    onConfigChange,
}: SidebarProps) {
    const treeRef = useRef<TreeViewRef>(null)
    const [configOpen, setConfigOpen] = useState(true)

    // Map snippet IDs to their code
    const snippetMap = useMemo(() => {
        const map: Record<string, string> = {}
        testSnippets.forEach((snippet, index) => {
            const ids = ['simple-heading', 'counter', 'data-transform', 'api-call', 'profile-card', 'animated-box']
            if (ids[index]) {
                map[ids[index]] = snippet.code
            }
        })
        return map
    }, [testSnippets])

    const handleSelectionChange = (selectedItems: TreeViewItem[]) => {
        if (selectedItems.length > 0) {
            const selectedItem = selectedItems[0];
            // Only load if it's a file (checking if it has code in map or is type file)
            if (selectedItem.type === 'file' && snippetMap[selectedItem.id]) {
                onLoadSnippet(selectedItem.name, snippetMap[selectedItem.id]);
            }
        }
    }

    // Cast FileNode to TreeViewItem as they are compatible
    const treeData = projects[0].files as unknown as TreeViewItem[];

    return (
        <aside className="w-full h-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            {/* Project Header */}
            <div className="border-b border-[#27272a] p-1.5">
                <div className="w-full h-7 px-2 flex items-center bg-[#1a1a1f] border border-[#27272a] rounded text-[11px] text-[#e4e4e7]">
                    <span className="truncate font-medium">{projects[0].name}</span>
                </div>
            </div>

            {/* FILES Section */}
            <div className="border-b border-[#27272a] flex-1 overflow-y-auto">
                <div className="w-full h-7 px-3 flex items-center justify-between text-[9px] font-semibold tracking-wider text-[#71717a] uppercase select-none">
                    <span>Files</span>
                    <div className="flex items-center gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-[#71717a] hover:text-[#e4e4e7] hover:bg-transparent"
                            onClick={() => treeRef.current?.collapseAll()}
                            title="Collapse All"
                        >
                            <FoldVertical className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-[#71717a] hover:text-[#e4e4e7] hover:bg-transparent"
                            onClick={() => treeRef.current?.expandAll()}
                            title="Expand All"
                        >
                            <ChevronsUpDown className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <div className="pb-1">
                    <TreeView
                        ref={treeRef}
                        data={treeData}
                        className="w-full"
                        onSelectionChange={handleSelectionChange}
                        selectionText="files selected"
                        searchPlaceholder="Filter files..."
                        showCheckboxes={false}
                    />
                </div>
            </div>

            {/* CONFIGURATION Section */}
            <div className="border-b border-[#27272a]">
                <button
                    onClick={() => setConfigOpen(!configOpen)}
                    className="w-full h-7 px-3 flex items-center justify-between text-[9px] font-semibold tracking-wider text-[#71717a] hover:text-[#a1a1aa] uppercase transition-colors"
                    aria-expanded={configOpen}
                >
                    Configuration
                    <ChevronDown className={cn(
                        "w-3 h-3 text-[#71717a] transition-transform",
                        configOpen && "rotate-180"
                    )} />
                </button>

                {configOpen && (
                    <div className="p-2 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[#a1a1aa]">Auto-run</label>
                            <input
                                type="checkbox"
                                checked={config.autoRun}
                                onChange={(e) => onConfigChange({ ...config, autoRun: e.target.checked })}
                                className="w-3 h-3 rounded border-[#27272a] bg-[#1a1a1f] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[#a1a1aa]">Strict mode</label>
                            <input
                                type="checkbox"
                                checked={config.strict}
                                onChange={(e) => onConfigChange({ ...config, strict: e.target.checked })}
                                className="w-3 h-3 rounded border-[#27272a] bg-[#1a1a1f] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-[#a1a1aa] block mb-1">Timeout (ms)</label>
                            <input
                                type="number"
                                value={config.timeout}
                                onChange={(e) => onConfigChange({ ...config, timeout: parseInt(e.target.value) || 5000 })}
                                className="w-full px-2 py-1 text-[10px] bg-[#1a1a1f] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                min="1000"
                                max="30000"
                                step="1000"
                            />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}
