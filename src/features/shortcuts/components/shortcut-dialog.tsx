"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Keyboard, X, Edit2, Save, RotateCcw } from 'lucide-react'
import { KeyboardShortcut, ShortcutCategory } from '../types'
import { SHORTCUT_CATEGORIES, formatShortcut } from '../constants'

interface ShortcutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: KeyboardShortcut[]
  onUpdateShortcut: (id: string, shortcut: Partial<KeyboardShortcut>) => void
  isAuthenticated: boolean
}

export function ShortcutDialog({ 
  open, 
  onOpenChange, 
  shortcuts, 
  onUpdateShortcut,
  isAuthenticated 
}: ShortcutDialogProps) {
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null)
  const [tempKey, setTempKey] = useState('')
  const [tempModifiers, setTempModifiers] = useState<string[]>([])

  const handleEditShortcut = (shortcutId: string) => {
    if (!isAuthenticated) return
    
    const shortcut = shortcuts.find(s => s.id === shortcutId)
    if (!shortcut) return
    
    setEditingShortcut(shortcutId)
    setTempKey(shortcut.key)
    setTempModifiers(shortcut.modifiers)
  }

  const handleSaveShortcut = (shortcutId: string) => {
    onUpdateShortcut(shortcutId, {
      key: tempKey,
      modifiers: tempModifiers as ('ctrl' | 'alt' | 'shift' | 'meta')[]
    })
    setEditingShortcut(null)
    setTempKey('')
    setTempModifiers([])
  }

  const handleCancelEdit = () => {
    setEditingShortcut(null)
    setTempKey('')
    setTempModifiers([])
  }

  const handleResetShortcut = (shortcutId: string) => {
    const defaultShortcut = shortcuts.find(s => s.id === shortcutId)
    if (defaultShortcut) {
      onUpdateShortcut(shortcutId, {
        key: defaultShortcut.key,
        modifiers: defaultShortcut.modifiers
      })
    }
  }

  const toggleModifier = (modifier: string) => {
    setTempModifiers(prev => 
      prev.includes(modifier) 
        ? prev.filter(m => m !== modifier)
        : [...prev, modifier]
    )
  }

  const getShortcutsByCategory = (category: string): KeyboardShortcut[] => {
    return shortcuts.filter(s => s.category === category as 'file' | 'edit' | 'view' | 'run' | 'navigation')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            View and customize keyboard shortcuts. {isAuthenticated ? 'Click on a shortcut to edit it.' : 'Sign in to customize shortcuts.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {SHORTCUT_CATEGORIES.map((category) => (
              <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {SHORTCUT_CATEGORIES.map((category) => (
            <TabsContent key={category.name} value={category.name.toLowerCase()}>
              <div className="space-y-4">
                {getShortcutsByCategory(category.name.toLowerCase()).map((shortcut) => (
                  <Card key={shortcut.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{shortcut.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {shortcut.description}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {editingShortcut === shortcut.id ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {['ctrl', 'alt', 'shift', 'meta'].map((modifier) => (
                                  <Button
                                    key={modifier}
                                    variant={tempModifiers.includes(modifier) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleModifier(modifier)}
                                  >
                                    {modifier === 'meta' ? 'Cmd' : modifier}
                                  </Button>
                                ))}
                                <Input
                                  value={tempKey}
                                  onChange={(e) => setTempKey(e.target.value)}
                                  placeholder="Key"
                                  className="w-20"
                                />
                              </div>
                              <Button size="sm" onClick={() => handleSaveShortcut(shortcut.id)}>
                                <Save className="size-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {formatShortcut(shortcut)}
                              </Badge>
                              {isAuthenticated && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditShortcut(shortcut.id)}
                                  >
                                    <Edit2 className="size-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleResetShortcut(shortcut.id)}
                                  >
                                    <RotateCcw className="size-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
