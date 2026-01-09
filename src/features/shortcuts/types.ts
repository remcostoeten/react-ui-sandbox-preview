export interface KeyboardShortcut {
  id: string
  name: string
  description: string
  key: string
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  category: 'file' | 'edit' | 'view' | 'run' | 'navigation'
  action: () => void
  enabled?: boolean
}

export interface ShortcutCategory {
  name: string
  shortcuts: KeyboardShortcut[]
}

export interface ShortcutState {
  shortcuts: KeyboardShortcut[]
  isListening: boolean
  lastPressed: string | null
}
