"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, Palette } from "lucide-react"
import { cn } from "@/utils"
import * as allThemes from "@uiw/codemirror-themes-all"
import { tokyoNight } from "@/features/evaluator/lib/editor-theme"
import { Extension } from "@codemirror/state"

export const availableThemes = {
    "Tokyo Night (Custom)": tokyoNight,
    ...allThemes
} as unknown as Record<string, Extension>

interface ThemeSwitcherProps {
    currentTheme: string
    onThemeChange: (themeName: string, themeExtension: Extension) => void
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between h-8 bg-[#1a1a1f] border-[#27272a] text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-[#27272a]"
                >
                    <div className="flex items-center gap-2">
                        <Palette className="h-3.5 w-3.5" />
                        <span className="truncate">{currentTheme}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-[#1a1a1f] border-[#27272a]">
                <Command className="bg-[#1a1a1f]">
                    <CommandInput placeholder="Search theme..." className="h-8 text-xs" />
                    <CommandList>
                        <CommandEmpty>No theme found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                            {Object.keys(availableThemes).map((themeName) => (
                                <CommandItem
                                    key={themeName}
                                    value={themeName}
                                    onSelect={(currentValue) => {
                                        onThemeChange(
                                            themeName,
                                            availableThemes[themeName]
                                        )
                                        setOpen(false)
                                    }}
                                    className="text-xs data-[selected=true]:bg-[#27272a] data-[selected=true]:text-[#e4e4e7]"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-3.5 w-3.5",
                                            currentTheme === themeName ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {themeName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
