"use client"

import { useCallback, useMemo } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { EditorView, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Dark theme matching our color system
const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "#0b0b0d",
    color: "#e4e4e7",
    fontSize: "13px",
    height: "100%",
  },
  ".cm-content": {
    padding: "16px 0",
    caretColor: "#e4e4e7",
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
  ".cm-cursor": {
    borderLeftColor: "#e4e4e7",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#2a2a2f !important",
  },
  ".cm-activeLine": {
    backgroundColor: "#1a1a1f",
  },
  ".cm-gutters": {
    backgroundColor: "#0b0b0d",
    color: "#8b8b98",
    border: "none",
    borderRight: "1px solid #2a2a2f50",
    paddingRight: "8px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 8px 0 16px",
    minWidth: "40px",
    color: "#8b8b9860",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#1a1a1f",
    color: "#8b8b98",
  },
  ".cm-foldGutter": {
    width: "0",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
  // Syntax highlighting
  ".cm-keyword": { color: "#c792ea" },
  ".cm-string": { color: "#c3e88d" },
  ".cm-number": { color: "#f78c6c" },
  ".cm-comment": { color: "#8b8b98", fontStyle: "italic" },
  ".cm-variableName": { color: "#82aaff" },
  ".cm-typeName": { color: "#ffcb6b" },
  ".cm-propertyName": { color: "#e4e4e7" },
  ".cm-punctuation": { color: "#89ddff" },
  ".cm-bracket": { color: "#89ddff" },
  ".cm-operator": { color: "#89ddff" },
  ".cm-tagName": { color: "#f07178" },
  ".cm-attributeName": { color: "#c792ea" },
  ".cm-attributeValue": { color: "#c3e88d" },
  // JSX specific
  ".cm-tag": { color: "#f07178" },
})

export function CodeEditor({ value, onChange, disabled }: CodeEditorProps) {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val)
    },
    [onChange],
  )

  const extensions = useMemo(
    () => [javascript({ jsx: true, typescript: true }), keymap.of([indentWithTab]), EditorView.lineWrapping, darkTheme],
    [],
  )

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.4)" }}>
      <CodeMirror
        value={value}
        onChange={handleChange}
        extensions={extensions}
        theme="dark"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: true,
          searchKeymap: true,
        }}
        editable={!disabled}
        className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:h-full"
        placeholder="// Write your component here..."
      />
    </div>
  )
}
