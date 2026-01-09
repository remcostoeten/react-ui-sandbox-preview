"use client"

import { useEffect, useCallback, useRef } from 'react'
import { KeyboardShortcut } from '../types'
import { DEFAULT_SHORTCUTS } from '../constants'

interface UseKeyboardShortcutsOptions {
  shortcuts?: KeyboardShortcut[]
  enabled?: boolean
  onShortcutPressed?: (shortcut: KeyboardShortcut) => void
}

export function useKeyboardShortcuts({
  shortcuts = DEFAULT_SHORTCUTS,
  enabled = true,
  onShortcutPressed
}: UseKeyboardShortcutsOptions = {}) {
  const pressedKeys = useRef<Set<string>>(new Set())
  const lastPressedShortcut = useRef<string | null>(null)

  const normalizeKey = (key: string): string => {
    const keyMap: Record<string, string> = {
      ' ': 'Space',
      'ArrowUp': 'ArrowUp',
      'ArrowDown': 'ArrowDown',
      'ArrowLeft': 'ArrowLeft',
      'ArrowRight': 'ArrowRight',
      'Enter': 'Enter',
      'Escape': 'Escape',
      'Delete': 'Delete',
      'Backspace': 'Backspace',
      'Tab': 'Tab',
    }
    return keyMap[key] || key
  }

  const matchesShortcut = useCallback((event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    const eventKey = normalizeKey(event.key)
    const shortcutKey = normalizeKey(shortcut.key)
    
    if (eventKey !== shortcutKey) return false
    
    const eventModifiers = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey
    }
    
    const shortcutModifiers = {
      ctrl: shortcut.modifiers.includes('ctrl'),
      alt: shortcut.modifiers.includes('alt'),
      shift: shortcut.modifiers.includes('shift'),
      meta: shortcut.modifiers.includes('meta')
    }
    
    return Object.keys(eventModifiers).every(
      mod => eventModifiers[mod as keyof typeof eventModifiers] === shortcutModifiers[mod as keyof typeof shortcutModifiers]
    )
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return
    
    // Ignore shortcuts when typing in input fields
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }

    const matchingShortcut = shortcuts.find(shortcut => 
      shortcut.enabled !== false && matchesShortcut(event, shortcut)
    )

    if (matchingShortcut) {
      event.preventDefault()
      event.stopPropagation()
      matchingShortcut.action()
      lastPressedShortcut.current = matchingShortcut.id
      onShortcutPressed?.(matchingShortcut)
    }
  }, [enabled, shortcuts, matchesShortcut, onShortcutPressed])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    shortcuts.push(shortcut)
  }, [shortcuts])

  const unregisterShortcut = useCallback((id: string) => {
    const index = shortcuts.findIndex(s => s.id === id)
    if (index > -1) {
      shortcuts.splice(index, 1)
    }
  }, [shortcuts])

  return {
    registerShortcut,
    unregisterShortcut,
    lastPressedShortcut: lastPressedShortcut.current
  }
}
