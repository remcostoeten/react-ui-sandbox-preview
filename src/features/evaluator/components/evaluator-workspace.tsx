"use client"

import { TabBar } from "./tab-bar"
import { useComponentEvaluator } from "../hooks/use-component-evaluator"
import { statusLabels, TopBar } from "./top-bar"
import { CodeEditor } from "./code-editor"
import { Sidebar } from "./sidebar"
import { PreviewCanvas } from "./preview-canvas"
import { StatusBar } from "./status-bar"
import { ImportsDocumentation } from "./imports-documentation"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"
import { useKeyboardShortcuts, ShortcutProvider, useShortcuts, ShortcutDialog } from "@/features/shortcuts"
import { ThemeSwitcher } from "@/components/dev/theme-switcher"
import { tokyoNight } from "../lib/editor-theme"
import { Extension } from "@codemirror/state"

const TEST_SNIPPETS = [
  {
    name: "Simple Heading",
    code: `export function Heading() {
  return (
    <h1 className="text-xl text-red-400">Hello World</h1>
  )
}`,
  },
  {
    name: "Counter",
    code: `import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <span className="text-2xl font-bold">{count}</span>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setCount(c => c - 1)}>-</Button>
        <Button variant="outline" onClick={() => setCount(c => c + 1)}>+</Button>
      </div>
    </div>
  )
}`,
  },
  {
    name: "Currency Formatter",
    code: `// Example: Testing a utility function
function formatCurrency(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

// Test cases
const tests = [
  formatCurrency(1234.56),
  formatCurrency(99.99, 'EUR'),
  formatCurrency(1000000),
];

console.log('Results:', tests);
return tests;`,
  },
  {
    name: "User Normalizer",
    code: `function normalizeUser(input) {
  return {
    id: String(input.id),
    name: input.name.trim(),
    email: input.email.toLowerCase(),
    active: Boolean(input.active),
  };
}

const users = [
  { id: 1, name: ' Alice ', email: 'ALICE@EXAMPLE.COM', active: 1 },
  { id: 2, name: 'Bob', email: 'bob@Example.com', active: 0 },
];

const result = users.map(normalizeUser);

console.log('Normalized users:', result);
return result;`,
  },
  {
    name: "Card Example",
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProfileCard() {
  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>John Doe</CardTitle>
          <Badge variant="secondary">Pro</Badge>
        </div>
        <CardDescription>Software Engineer</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Building cool stuff with React and TypeScript.
        </p>
      </CardContent>
    </Card>
  )
}`,
  },
  {
    name: "Animated Box",
    code: `import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function AnimatedBox() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <motion.div
        animate={{ 
          scale: isExpanded ? 1.5 : 1,
          rotate: isExpanded ? 180 : 0 
        }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-20 h-20 bg-blue-500 rounded-lg"
      />
      <Button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Shrink" : "Expand"}
      </Button>
    </div>
  )
}`,
  },
]

const PANEL_STORAGE_KEY = "evaluator-panel-sizes"
const DEFAULT_SIZES = {
  left: 20,
  center: 50,
  right: 30
}

function EvaluatorWorkspaceContent() {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showImports, setShowImports] = useState(false)
  const [panelSizes, setPanelSizes] = useState(DEFAULT_SIZES)
  const [openFileIds, setOpenFileIds] = useState<string[]>([])
  const [pinnedFileIds, setPinnedFileIds] = useState<string[]>([])
  const [config, setConfig] = useState({
    autoRun: false,
    strict: true,
    timeout: 5000,
  })

  // Theme state
  const [currentThemeName, setCurrentThemeName] = useState("Tokyo Night (Custom)")
  const [currentThemeExtension, setCurrentThemeExtension] = useState<Extension>(tokyoNight)

  const {
    state,
    files,
    activeFile,
    availableExports,
    createFile,
    createFolder,
    updateFileContent,
    removeFile,
    selectFile,
    moveNode,
    evaluate,
    selectExport,
    renderState,
    component,
    error,
    isLoading,
    executionMode,
    executionResult,
    consoleOutput,
    executionMetrics,
    clearError,
    handleRuntimeError,
  } = useComponentEvaluator(config)

  // Shortcuts state
  const { shortcuts, isAuthenticated, updateShortcut } = useShortcuts()

  // Load panel sizes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PANEL_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPanelSizes(parsed)
      }
    } catch (error) {
      console.warn("Failed to load panel sizes from localStorage:", error)
    }
  }, [])

  // Save panel sizes to localStorage when they change
  const handlePanelResize = (sizes: number[]) => {
    const newSizes = {
      left: sizes[0],
      center: sizes[1],
      right: sizes[2]
    }
    setPanelSizes(newSizes)
    try {
      localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(newSizes))
    } catch (error) {
      console.warn("Failed to save panel sizes to localStorage:", error)
    }
  }

  const handleReset = useCallback(() => {
    if (activeFile) {
      updateFileContent(activeFile.id, "")
    }
  }, [activeFile, updateFileContent])

  // Create shortcut actions
  const shortcutActions = {
    'file.new': () => createFile('new-component.tsx', ''),
    'file.save': () => {
      console.log('Save file')
    },
    'file.delete': () => {
      if (activeFile) {
        removeFile(activeFile.id)
      }
    },
    'edit.undo': () => {
      console.log('Undo')
    },
    'edit.redo': () => {
      console.log('Redo')
    },
    'view.toggle-file-tree': () => {
      console.log('Toggle file tree')
    },
    'view.toggle-preview': () => {
      console.log('Toggle preview')
    },
    'view.reset-layout': () => {
      setPanelSizes(DEFAULT_SIZES)
      localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(DEFAULT_SIZES))
    },
    'run.evaluate': () => evaluate(),
    'run.refresh': () => evaluate(),
    'nav.shortcuts': () => setShowShortcuts(true),
  }

  // Setup keyboard shortcuts with actions
  const shortcutsWithActions = shortcuts.map(shortcut => ({
    ...shortcut,
    action: shortcutActions[shortcut.id as keyof typeof shortcutActions] || shortcut.action
  }))

  useKeyboardShortcuts({
    shortcuts: shortcutsWithActions,
    onShortcutPressed: (shortcut) => {
      console.log('Shortcut pressed:', shortcut.name)
    }
  })

  const handleSelectFileWrapper = (fileId: string | null) => {
    if (fileId) {
      if (!openFileIds.includes(fileId)) {
        setOpenFileIds(prev => [...prev, fileId])
      }
      selectFile(fileId)
    } else {
      selectFile(null)
    }
  }

  const handleCloseFile = (fileId: string) => {
    const newOpenIds = openFileIds.filter(id => id !== fileId)
    setOpenFileIds(newOpenIds)

    if (activeFile?.id === fileId) {
      if (newOpenIds.length > 0) {
        selectFile(newOpenIds[newOpenIds.length - 1])
      } else {
        selectFile(null)
      }
    }
  }

  const handleCloseOthers = (fileId: string) => {
    setOpenFileIds([fileId])
    if (activeFile?.id !== fileId) {
      selectFile(fileId)
    }
  }

  const handleCloseAll = () => {
    setOpenFileIds([])
    selectFile(null)
  }

  const handleCloseLeft = (fileId: string) => {
    const fileIndex = openFileIds.indexOf(fileId)
    const newOpenIds = openFileIds.slice(fileIndex)
    setOpenFileIds(newOpenIds)

    if (activeFile?.id && fileIndex > openFileIds.indexOf(activeFile.id)) {
      selectFile(fileId)
    }
  }

  const handleCloseRight = (fileId: string) => {
    const fileIndex = openFileIds.indexOf(fileId)
    const newOpenIds = openFileIds.slice(0, fileIndex + 1)
    setOpenFileIds(newOpenIds)

    if (activeFile?.id && fileIndex < openFileIds.indexOf(activeFile.id)) {
      selectFile(fileId)
    }
  }

  const handleCloseAllButThis = (fileId: string) => {
    setOpenFileIds([fileId])
    selectFile(fileId)
  }

  const handlePinFile = (fileId: string) => {
    setPinnedFileIds(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleLoadSnippet = (name: string, code: string) => {
    // Check if we already have this snippet open by content (or name)
    const existingSnippet = files.find(f => f.content === code)
    if (existingSnippet) {
      handleSelectFileWrapper(existingSnippet.id)
    } else {
      const newFile = createFile(name, code)
      setOpenFileIds(prev => [...prev, newFile.id])
      selectFile(newFile.id)
    }
  }

  useEffect(() => {
    // Load first snippet by default
    if (files.length === 0 && TEST_SNIPPETS.length > 0) {
      handleLoadSnippet(TEST_SNIPPETS[0].name, TEST_SNIPPETS[0].code)
    }
  }, []) // Run once on mount

  // Map render state to execution state for StatusBar
  const getExecutionState = (): 'idle' | 'loading' | 'success' | 'error' => {
    if (renderState.status === 'executing' || renderState.status === 'compiling') return 'loading'
    if (renderState.status === 'error') return 'error'
    if (renderState.status === 'rendering') return 'success'
    return 'idle'
  }

  return (
    <div className="dark w-screen h-screen bg-[#0a0a0a] text-[#e4e4e7] flex flex-col overflow-hidden">
      <TopBar
        status={renderState.status}
        onEvaluate={evaluate}
        onReset={handleReset}
        onFormat={() => {
          console.log("Format requested")
        }}
        disabled={!activeFile || isLoading}
      >
        <ThemeSwitcher
          currentTheme={currentThemeName}
          onThemeChange={(name, theme) => {
            setCurrentThemeName(name)
            setCurrentThemeExtension(theme)
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowShortcuts(true)}
          className="h-8 px-3 text-[12px] font-medium text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#e4e4e7]"
        >
          <Keyboard className="size-3.5 mr-2" />
          Shortcuts
        </Button>
      </TopBar>

      <PanelGroup
        direction="horizontal"
        className="flex-1"
        onLayout={handlePanelResize}
      >
        {/* Left Panel: Sidebar */}
        <Panel
          defaultSize={panelSizes.left}
          minSize={15}
          maxSize={40}
          className="bg-[#111111]"
        >
          <Sidebar
            files={files}
            activeFileId={activeFile?.id ?? null}
            onSelectFile={handleSelectFileWrapper}
            onDeleteFile={(id) => {
              handleCloseFile(id)
              removeFile(id)
            }}
            onMoveNode={moveNode}
            testSnippets={TEST_SNIPPETS}
            onLoadSnippet={handleLoadSnippet}
            config={config}
            onConfigChange={setConfig}
          />
        </Panel>

        <PanelResizeHandle className="w-px bg-[#27272a] hover:bg-[#3f3f46] transition-colors cursor-col-resize" />

        {/* Center Panel: Code Editor */}
        <Panel
          defaultSize={panelSizes.center}
          minSize={30}
          className="bg-[#0a0a0a]"
        >
          <div className="h-full flex flex-col">
            <TabBar
              openFiles={files.filter(f => openFileIds.includes(f.id))}
              activeFileId={activeFile?.id ?? null}
              onSelectFile={handleSelectFileWrapper}
              onCloseFile={handleCloseFile}
              onCloseOthers={handleCloseOthers}
              onCloseAll={handleCloseAll}
              onCloseLeft={handleCloseLeft}
              onCloseRight={handleCloseRight}
              onCloseAllButThis={handleCloseAllButThis}
              pinnedFileIds={pinnedFileIds}
              onPinFile={handlePinFile}
            />
            {activeFile ? (
              <CodeEditor
                value={activeFile.content}
                onChange={(content) => updateFileContent(activeFile.id, content)}
                disabled={isLoading}
                theme={currentThemeExtension}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-[13px] text-[#71717a]">No file selected</div>
                  <div className="text-[11px] text-[#52525b]">
                    Create a file or select a test snippet to get started
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-[#27272a] hover:bg-[#3f3f46] transition-colors cursor-col-resize" />

        {/* Right Panel: Preview Canvas */}
        <Panel
          defaultSize={panelSizes.right}
          minSize={20}
          maxSize={50}
          className="bg-[#111111]"
        >
          <PreviewCanvas
            component={component}
            error={error}
            isLoading={isLoading}
            status={renderState.status}
            exports={availableExports}
            selectedExport={renderState.selectedExport}
            onSelectExport={selectExport}
            onError={handleRuntimeError}
            executionMode={renderState.executionMode}
            executionResult={renderState.executionResult}
            consoleOutput={renderState.consoleOutput || []}
            executionMetrics={renderState.executionMetrics}
          />
        </Panel>
      </PanelGroup>

      <StatusBar executionState={getExecutionState()} />

      <ShortcutDialog
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
        shortcuts={shortcuts}
        onUpdateShortcut={updateShortcut}
        isAuthenticated={isAuthenticated}
      />

      {/* Imports Documentation Dialog */}
      {showImports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowImports(false)} />
          <div className="relative bg-[#111111] border border-[#27272a] rounded-lg shadow-xl max-w-6xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
              <h2 className="text-lg font-semibold text-[#e4e4e7]">Available Imports</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowImports(false)}
                className="text-[#a1a1aa] hover:text-[#e4e4e7]"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-auto max-h-[60vh]">
              <ImportsDocumentation />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function EvaluatorWorkspace() {
  return (
    <ShortcutProvider>
      <EvaluatorWorkspaceContent />
    </ShortcutProvider>
  )
}
