"use client"

import { X, Pin } from "lucide-react"
import type { VirtualFile } from "../types"
import { cn } from "@/utils"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface TabBarProps {
    openFiles: VirtualFile[]
    activeFileId: string | null
    onSelectFile: (fileId: string) => void
    onCloseFile: (fileId: string) => void
    onCloseOthers: (fileId: string) => void
    onCloseAll: () => void
    onCloseLeft: (fileId: string) => void
    onCloseRight: (fileId: string) => void
    onCloseAllButThis: (fileId: string) => void
    pinnedFileIds: string[]
    onPinFile: (fileId: string) => void
}

interface ContextMenuPosition {
    x: number
    y: number
}

interface ContextMenuState {
    isOpen: boolean
    position: ContextMenuPosition
    fileId: string | null
}

export function TabBar({
    openFiles,
    activeFileId,
    onSelectFile,
    onCloseFile,
    onCloseOthers,
    onCloseAll,
    onCloseLeft,
    onCloseRight,
    onCloseAllButThis,
    pinnedFileIds,
    onPinFile,
}: TabBarProps) {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        isOpen: false,
        position: { x: 0, y: 0 },
        fileId: null,
    })

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => {
            if (contextMenu.isOpen) {
                setContextMenu(prev => ({ ...prev, isOpen: false }))
            }
        }
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [contextMenu.isOpen])

    const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
        e.preventDefault()
        setContextMenu({
            isOpen: true,
            position: { x: e.clientX, y: e.clientY },
            fileId,
        })
    }

    const handlePinFile = (fileId: string) => {
        onPinFile(fileId)
        setContextMenu(prev => ({ ...prev, isOpen: false }))
    }

    if (openFiles.length === 0) return null

    return (
        <div className="flex bg-[#0a0a0a] border-b border-[#27272a] h-9 overflow-x-auto no-scrollbar">
            {openFiles.map((file) => {
                const isActive = file.id === activeFileId
                const isPinned = pinnedFileIds.includes(file.id)
                return (
                    <div
                        key={file.id}
                        onClick={() => onSelectFile(file.id)}
                        onContextMenu={(e) => handleContextMenu(e, file.id)}
                        className={cn(
                            "group flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] h-full text-[13px] border-r border-[#27272a] cursor-pointer select-none transition-colors",
                            isActive
                                ? "bg-[#1a1a1f] text-[#e4e4e7]"
                                : "text-[#71717a] hover:bg-[#1a1a1f] hover:text-[#a1a1aa]"
                        )}
                    >
                        {isPinned && <Pin className="w-3 h-3 text-[#a1a1aa]" />}
                        <span className="truncate flex-1 font-mono">{file.name}</span>
                        {!isPinned && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onCloseFile(file.id)
                                }}
                                className={cn(
                                    "p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#2a2a2f] transition-all",
                                    isActive && "opacity-100"
                                )}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )
            })}

            {/* Context Menu Portal */}
            {contextMenu.isOpen && createPortal(
                <div
                    className="fixed z-50 w-48 bg-[#111111] border border-[#27272a] rounded-md shadow-xl py-1"
                    style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
                >
                    {contextMenu.fileId && (
                        <>
                            <button
                                onClick={() => handlePinFile(contextMenu.fileId!)}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors flex items-center gap-2"
                            >
                                <Pin className="w-3 h-3" />
                                {pinnedFileIds.includes(contextMenu.fileId) ? 'Unpin' : 'Pin'}
                            </button>
                            <div className="h-px bg-[#27272a] my-1" />
                            <button
                                onClick={() => contextMenu.fileId && onCloseLeft(contextMenu.fileId)}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors"
                            >
                                Close Left
                            </button>
                            <button
                                onClick={() => contextMenu.fileId && onCloseRight(contextMenu.fileId)}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors"
                            >
                                Close Right
                            </button>
                            <button
                                onClick={() => contextMenu.fileId && onCloseAllButThis(contextMenu.fileId)}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors"
                            >
                                Close All But This
                            </button>
                            <div className="h-px bg-[#27272a] my-1" />
                            <button
                                onClick={() => contextMenu.fileId && onCloseFile(contextMenu.fileId)}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => contextMenu.fileId && onCloseOthers(contextMenu.fileId)}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors"
                            >
                                Close Others
                            </button>
                            <button
                                onClick={onCloseAll}
                                className="w-full text-left px-3 py-2 text-[13px] text-[#e4e4e7] hover:bg-[#27272a] transition-colors"
                            >
                                Close All
                            </button>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    )
}
