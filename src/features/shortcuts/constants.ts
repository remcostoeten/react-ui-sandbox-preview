import { KeyboardShortcut, ShortcutCategory } from './types'

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  // File operations
  {
    id: 'file.new',
    name: 'New File',
    description: 'Create a new file',
    key: 'n',
    modifiers: ['ctrl'],
    category: 'file',
    action: () => {},
  },
  {
    id: 'file.save',
    name: 'Save File',
    description: 'Save the current file',
    key: 's',
    modifiers: ['ctrl'],
    category: 'file',
    action: () => {},
  },
  {
    id: 'file.delete',
    name: 'Delete File',
    description: 'Delete the current file',
    key: 'Delete',
    modifiers: ['shift'],
    category: 'file',
    action: () => {},
  },

  // Edit operations
  {
    id: 'edit.undo',
    name: 'Undo',
    description: 'Undo last action',
    key: 'z',
    modifiers: ['ctrl'],
    category: 'edit',
    action: () => {},
  },
  {
    id: 'edit.redo',
    name: 'Redo',
    description: 'Redo last action',
    key: 'y',
    modifiers: ['ctrl'],
    category: 'edit',
    action: () => {},
  },
  {
    id: 'edit.format',
    name: 'Format Code',
    description: 'Format the current code',
    key: 'f',
    modifiers: ['ctrl', 'shift'],
    category: 'edit',
    action: () => {},
  },

  // View operations
  {
    id: 'view.toggle-file-tree',
    name: 'Toggle File Tree',
    description: 'Show or hide the file tree',
    key: 'b',
    modifiers: ['ctrl'],
    category: 'view',
    action: () => {},
  },
  {
    id: 'view.toggle-preview',
    name: 'Toggle Preview',
    description: 'Show or hide the preview panel',
    key: 'p',
    modifiers: ['ctrl'],
    category: 'view',
    action: () => {},
  },
  {
    id: 'view.reset-layout',
    name: 'Reset Layout',
    description: 'Reset panel sizes to default',
    key: '0',
    modifiers: ['ctrl'],
    category: 'view',
    action: () => {},
  },

  // Run operations
  {
    id: 'run.evaluate',
    name: 'Run Component',
    description: 'Evaluate and run the current component',
    key: 'Enter',
    modifiers: ['ctrl'],
    category: 'run',
    action: () => {},
  },
  {
    id: 'run.refresh',
    name: 'Refresh Preview',
    description: 'Refresh the component preview',
    key: 'r',
    modifiers: ['ctrl'],
    category: 'run',
    action: () => {},
  },

  // Navigation
  {
    id: 'nav.next-file',
    name: 'Next File',
    description: 'Go to next file in the tree',
    key: 'ArrowRight',
    modifiers: ['ctrl'],
    category: 'navigation',
    action: () => {},
  },
  {
    id: 'nav.prev-file',
    name: 'Previous File',
    description: 'Go to previous file in the tree',
    key: 'ArrowLeft',
    modifiers: ['ctrl'],
    category: 'navigation',
    action: () => {},
  },
  {
    id: 'nav.shortcuts',
    name: 'Show Shortcuts',
    description: 'Show keyboard shortcuts reference',
    key: 'k',
    modifiers: ['ctrl'],
    category: 'navigation',
    action: () => {},
  },
]

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    name: 'File',
    shortcuts: DEFAULT_SHORTCUTS.filter(s => s.category === 'file')
  },
  {
    name: 'Edit',
    shortcuts: DEFAULT_SHORTCUTS.filter(s => s.category === 'edit')
  },
  {
    name: 'View',
    shortcuts: DEFAULT_SHORTCUTS.filter(s => s.category === 'view')
  },
  {
    name: 'Run',
    shortcuts: DEFAULT_SHORTCUTS.filter(s => s.category === 'run')
  },
  {
    name: 'Navigation',
    shortcuts: DEFAULT_SHORTCUTS.filter(s => s.category === 'navigation')
  },
]

export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const modifierMap = {
    'ctrl': 'Ctrl',
    'alt': 'Alt',
    'shift': 'Shift',
    'meta': 'Cmd'
  }
  
  const modifiers = shortcut.modifiers.map(mod => modifierMap[mod]).join(' + ')
  const key = shortcut.key === ' ' ? 'Space' : shortcut.key
  
  return modifiers ? `${modifiers} + ${key}` : key
}
