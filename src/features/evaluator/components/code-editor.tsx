import { useCallback, useMemo } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { EditorView, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { tokyoNight } from "../lib/editor-theme"

import { Extension } from "@codemirror/state"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  theme?: Extension
}

export function CodeEditor({ value, onChange, disabled, theme = tokyoNight }: CodeEditorProps) {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val)
    },
    [onChange],
  )

  const extensions = useMemo(
    () => [
      javascript({ jsx: true, typescript: true }),
      keymap.of([indentWithTab]),
      EditorView.lineWrapping,
      theme
    ],
    [theme],
  )

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1a1b26]" style={{ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.4)" }}>
      <CodeMirror
        value={value}
        onChange={handleChange}
        extensions={extensions}
        // theme is now part of extensions
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
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
        className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:h-full [&_.cm-content]:bg-transparent [&_.cm-editor]:bg-transparent text-[13px]"
        style={{
          backgroundColor: 'transparent',
        }}
        placeholder="// Write your component here..."
      />
    </div>
  )
}
