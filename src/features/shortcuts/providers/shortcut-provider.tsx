"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { KeyboardShortcut } from '../types'
import { DEFAULT_SHORTCUTS } from '../constants'

interface ShortcutContextType {
  shortcuts: KeyboardShortcut[]
  updateShortcut: (id: string, updates: Partial<KeyboardShortcut>) => void
  resetShortcuts: () => void
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
}

const ShortcutContext = createContext<ShortcutContextType | undefined>(undefined)

interface ShortcutProviderProps {
  children: ReactNode
}

export function ShortcutProvider({ children }: ShortcutProviderProps) {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const updateShortcut = useCallback((id: string, updates: Partial<KeyboardShortcut>) => {
    if (!isAuthenticated) return
    
    setShortcuts(prev => prev.map(shortcut => 
      shortcut.id === id ? { ...shortcut, ...updates } : shortcut
    ))
  }, [isAuthenticated])

  const resetShortcuts = useCallback(() => {
    if (!isAuthenticated) return
    setShortcuts(DEFAULT_SHORTCUTS)
  }, [isAuthenticated])

  return (
    <ShortcutContext.Provider value={{
      shortcuts,
      updateShortcut,
      resetShortcuts,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </ShortcutContext.Provider>
  )
}

export function useShortcuts() {
  const context = useContext(ShortcutContext)
  if (context === undefined) {
    throw new Error('useShortcuts must be used within a ShortcutProvider')
  }
  return context
}
