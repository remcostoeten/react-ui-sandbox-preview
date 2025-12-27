"use client"

import { useComponentEvaluator } from "@/lib/component-evaluator"
import { FileTree } from "./file-tree"
import { CodeEditor } from "./code-editor"
import { PreviewCanvas } from "./preview-canvas"
import { TopBar } from "./top-bar"

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

export function EvaluatorWorkspace() {
  const {
    files,
    activeFile,
    availableExports,
    createFile,
    updateFileContent,
    removeFile,
    selectFile,
    evaluate,
    selectExport,
    renderState,
    component,
    error,
    isLoading,
    handleRuntimeError,
  } = useComponentEvaluator()

  const handleLoadSnippet = (code: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, code)
    } else {
      createFile("snippet.tsx", code)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0b0b0d] text-[#e4e4e7]">
      <TopBar status={renderState.status} onEvaluate={evaluate} disabled={!activeFile || isLoading} />

      <div className="flex flex-1 min-h-0">
        {/* Left Column: File Tree */}
        <div className="w-52 shrink-0 border-r border-[#2a2a2f] bg-[#111115] flex flex-col">
          <FileTree
            files={files}
            activeFileId={activeFile?.id ?? null}
            onSelectFile={selectFile}
            onCreateFile={createFile}
            onDeleteFile={removeFile}
          />

          <div className="mt-auto border-t border-[#2a2a2f] p-3">
            <div className="text-xs font-medium text-[#8b8b98] mb-2 uppercase tracking-wide">Test Snippets</div>
            <div className="flex flex-col gap-1">
              {TEST_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.name}
                  onClick={() => handleLoadSnippet(snippet.code)}
                  className="text-left text-xs px-2 py-1.5 rounded hover:bg-[#1a1a1f] text-[#8b8b98] hover:text-[#e4e4e7] transition-colors"
                >
                  {snippet.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Code Editor */}
        <div className="flex-1 min-w-0 border-r border-[#2a2a2f]">
          {activeFile ? (
            <CodeEditor
              value={activeFile.content}
              onChange={(content) => updateFileContent(activeFile.id, content)}
              disabled={isLoading}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-[#0b0b0d]">
              <span className="text-sm text-[#8b8b98]">Select or create a component</span>
            </div>
          )}
        </div>

        {/* Right Column: Preview Canvas */}
        <div className="w-[400px] shrink-0 bg-[#111115]">
          <PreviewCanvas
            component={component}
            error={error}
            isLoading={isLoading}
            status={renderState.status}
            exports={availableExports}
            selectedExport={renderState.selectedExport}
            onSelectExport={selectExport}
            onError={handleRuntimeError}
          />
        </div>
      </div>
    </div>
  )
}
