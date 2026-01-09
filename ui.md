# UI Design Specification: Evaluator Sandbox

> A comprehensive style guide for aligning the external UI design with our target application.

---

## 📸 Design Comparison

### Current Design (Target)
![Our current evaluator design](localhost_50505_revealed_1767542638532.png)

### External Agent's Design (To Be Improved)
![External agent's current design](uploaded_image_1767542577165.png)

---

## 🎯 Key Differences Summary

| Aspect | **Target Design** | **Current External Design** | **Action Required** |
|--------|-------------------|----------------------------|---------------------|
| Layout | 3-column: sidebar + editor + preview | 3-column structure | ✅ Good foundation |
| Header | "Evaluator" + status badge + CTAs | "DEVTOOL" header | ⚠️ Needs refinement |
| Accent | Electric blue neon glow | Green toggles | 🔄 Change to blue |
| Code Editor | Full syntax highlighting | Basic monospace | ❌ Missing |
| Left Sidebar | FILES + TEST SNIPPETS sections | Minimal | ❌ Missing |
| Visual Polish | Neon border, hover states | Very flat | ❌ Missing |
| Typography | Dense, Inter-like, 10-12px | Basic | ⚠️ Needs work |

---

## 🎨 Color Palette

### Backgrounds
```css
--bg-base: #0a0a0a;           /* Main background */
--bg-elevated: #111111;        /* Cards, panels */
--bg-surface: #1a1a1f;         /* Sidebar items, buttons */
--bg-hover: #252530;           /* Hover states */
```

### Accent Colors
```css
--accent-primary: #3b82f6;     /* Electric blue - main accent */
--accent-glow: rgba(59, 130, 246, 0.3);  /* Neon glow effect */
--accent-success: #22c55e;     /* Green for success states */
--accent-warning: #f59e0b;     /* Orange for warnings */
--accent-error: #ef4444;       /* Red for errors */
```

### Text Colors
```css
--text-primary: #e4e4e7;       /* High contrast, headers */
--text-secondary: #a1a1aa;     /* Body text */
--text-muted: #71717a;         /* Labels, hints */
--text-disabled: #52525b;      /* Disabled states */
```

### Borders
```css
--border-subtle: #27272a;      /* Subtle dividers */
--border-default: #3f3f46;     /* Default borders */
--border-accent: #3b82f6;      /* Focused/active borders */
```

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ HEADER: Logo | Status Badge | Actions (Shortcuts, Execute) │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌──────────┬────────────────────────────┬─────────────────────┐   │
│  │          │                            │                     │   │
│  │ SIDEBAR  │      CODE EDITOR           │   RIGHT PANEL       │   │
│  │          │                            │                     │   │
│  │ • FILES  │  [Tabs: Evaluator|Imports] │   CONFIGURATION     │   │
│  │          │                            │   • Auto-run toggle │   │
│  │ • TEST   │  1 │ function transform... │   • Strict mode     │   │
│  │ SNIPPETS │  2 │   return data.map...  │   • Timeout         │   │
│  │          │  3 │     ...item,          │                     │   │
│  │          │  4 │     processed: true   │                     │   │
│  │          │  5 │   });                 │   ─────────────     │   │
│  │          │  6 │ }                     │                     │   │
│  │          │                            │   OUTPUT            │   │
│  │          │                            │   [Results here]    │   │
│  │          │                            │                     │   │
│  └──────────┴────────────────────────────┴─────────────────────┘   │
│  ░░░░░░░░░░░░░░░░░ NEON GLOW BORDER ░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────────────────────────────────┘
```

### Column Widths
- **Left Sidebar**: `200px` (collapsible)
- **Center Editor**: `flex: 1` (takes remaining space)
- **Right Panel**: `280px` (fixed)

---

## 🔤 Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Section headers | `10px` | `600` | `--text-muted` |
| Sidebar items | `13px` | `400` | `--text-secondary` |
| Tab labels | `13px` | `500` | `--text-primary` |
| Code | `13px` | `400` | Syntax colors |
| Buttons (small) | `12px` | `500` | `--text-primary` |
| Status badge | `11px` | `500` | `--text-primary` |

### Code Font
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
font-size: 13px;
line-height: 1.6;
```

---

## 🖥️ Component Specifications

### 1. Header Bar

```
Height: 48px
Background: var(--bg-base)
Border-bottom: 1px solid var(--border-subtle)
Padding: 0 16px

Structure:
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Evaluator    ● Ready         [Shortcuts] [▶ Execute] │
└──────────────────────────────────────────────────────────────┘
```

**Status Badge:**
- Small colored dot (6px) + "Ready" text
- Colors: Green = ready, Yellow = running, Red = error

**Execute Button:**
- Filled style with accent color
- Icon + text: "▶ Execute"
- Hover: slightly brighter
- Active: pressed state

### 2. Left Sidebar (File Tree)

> **Reference Component**: Use [beautiful-file-tree-v2](https://beautiful-file-tree-v2.vercel.app/) as the foundation. Convert to dark theme.

```
Width: 200px (resizable via drag handle)
Background: var(--bg-base)
Border-right: 1px solid var(--border-subtle)

Sections:
├── FILES (collapsible, interactive tree)
│   ├── 📁 components/
│   │   ├── 📄 Button.tsx
│   │   └── 📄 Button.module.css  ← paired file
│   ├── 📁 hooks/
│   └── 📄 index.ts
│
└── TEST SNIPPETS (collapsible)
    ├── Simple Heading
    ├── Counter
    ├── Data Transform
    └── API Call
```

**File Pairing Feature:**
- Right-click on `.tsx` → "Create scoped CSS" → generates `ComponentName.module.css`
- Right-click on `.ts` → "Create test file" → generates `ComponentName.test.ts`
- Paired files show linked icon indicator
- Clicking parent auto-expands to show paired files

**Section Headers:**
- Uppercase, 10px, letter-spacing: 0.05em
- Chevron icon for collapse/expand

**List Items:**
- Padding: 8px 12px
- Hover: bg var(--bg-surface)
- Active: bg var(--bg-hover) + left accent border

### 3. Code Editor Panel

> ⚠️ **Note**: Editor will be implemented in-house using Monaco. Keep UI spec minimal.

- Basic container with dark background
- Tab bar at top (if needed for multiple files)
- We handle syntax highlighting, line numbers, etc.

### 4. Right Panel (Configuration + Output)

```
Width: 280px
Background: var(--bg-base)
Border-left: 1px solid var(--border-subtle)

┌─────────────────────────────┐
│ CONFIGURATION          ▼    │
├─────────────────────────────┤
│ Auto-run on change    [○──] │
│ Strict mode           [──●] │
│ Timeout (ms)   [____5000__] │
├─────────────────────────────┤
│ OUTPUT                 Edit │
├─────────────────────────────┤
│                             │
│   No execution yet.         │
│   Click Execute to run.     │
│                             │
└─────────────────────────────┘
```

### 5. Keyboard Shortcuts Legend

Accessible via header "Shortcuts" button or `⌘ + /` / `Ctrl + /`.

```
┌─────────────────────────────────────┐
│ ⌨️ KEYBOARD SHORTCUTS         [×]  │
├─────────────────────────────────────┤
│ General                             │
│   ⌘/Ctrl + Enter    Execute code    │
│   ⌘/Ctrl + S        Save file       │
│   ⌘/Ctrl + /        Toggle legend   │
│   ⌘/Ctrl + B        Toggle sidebar  │
│                                     │
│ Editor                              │
│   ⌘/Ctrl + D        Duplicate line  │
│   ⌘/Ctrl + Shift+K  Delete line     │
│   ⌘/Ctrl + P        Quick file open │
│                                     │
│ Recording                           │
│   ⌘/Ctrl + Shift+R  Start recording │
│   Escape            Stop recording  │
└─────────────────────────────────────┘
```

**Display:**
- Modal overlay with blur backdrop
- Grouped by category
- Platform-aware (⌘ on Mac, Ctrl on Windows/Linux)
- Searchable with filter input

### 6. Session Recorder

Record user interactions for demos, bug reports, or tutorials.

```
┌─────────────────────────────────────┐
│ 🔴 Recording... 00:32        [Stop] │
└─────────────────────────────────────┘
```

**Features:**
- Records: keystrokes, mouse clicks, code changes, outputs
- Floating indicator bar when active (top-right corner)
- Exports as:
  - `.webm` video (screen capture)
  - `.json` session replay (for playback in-app)
- Playback mode with timeline scrubber
- Start/stop via keyboard shortcut or header button

**Toggle Switches:**
- Width: 36px, Height: 20px
- Track: var(--bg-surface)
- Active track: var(--accent-primary)
- Knob: white, 16px circle
- Transition: 150ms ease

**Input Fields:**
- Height: 32px
- Background: var(--bg-surface)
- Border: 1px solid var(--border-subtle)
- Focus: border-color var(--accent-primary)

---

## ✨ Signature Element: Neon Glow Border

This is the **distinctive visual element** that sets our design apart.

```css
.workspace-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.workspace-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.6),
    rgba(59, 130, 246, 0.1),
    rgba(59, 130, 246, 0.4)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

/* Outer glow */
.workspace-container {
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.15),
    0 0 40px rgba(59, 130, 246, 0.1),
    0 0 60px rgba(59, 130, 246, 0.05);
}
```

---

## 🎬 Micro-Interactions

### Hover States
- **All clickable elements**: 150ms transition
- **Buttons**: Background lightens by 10%
- **Sidebar items**: Background shifts to var(--bg-surface)
- **Tabs**: Underline appears or text brightens

### Active/Pressed States
- Scale down slightly: `transform: scale(0.98)`
- Background darkens

### Focus States
- Blue outline/ring: `box-shadow: 0 0 0 2px var(--accent-primary)`
- Never remove focus indicators for accessibility

### Loading States
- Subtle pulse animation on status indicator
- Execute button shows spinner when running

---

## 📋 Implementation Checklist

Use this checklist to ensure all design elements are implemented:

- [ ] **Color System**
  - [ ] Dark backgrounds (#0a0a0a, #111, #1a1a1f)
  - [ ] Monochrome accent colors
  - [ ] Proper text hierarchy (primary/secondary/muted)

- [ ] **Layout**
  - [ ] 3-column layout with proper widths
  - [ ] Collapsible left sidebar
  - [ ] Fixed right panel

- [ ] **Header**
  - [ ] Application title with logo
  - [ ] Status indicator with colored dot
  - [ ] Shortcuts button (ghost style)
  - [ ] Execute button (filled, prominent)

- [ ] **Left Sidebar**
  - [ ] FILES section with collapsible header
  - [ ] TEST SNIPPETS section with clickable items
  - [ ] Proper hover/active states

- [ ] **Code Editor**
  Keep very basic, we will do monaco in house

- [ ] **Right Panel**
  - [ ] CONFIGURATION section header
  - [ ] Toggle switches (styled, not default)
  - [ ] Input fields with proper styling
  - [ ] OUTPUT section with placeholder text

- [ ] **File Tree (Left Sidebar)**
  - [ ] Use [beautiful-file-tree-v2](https://beautiful-file-tree-v2.vercel.app/) as base
  - [ ] Convert to dark theme
  - [ ] Smooth expand/collapse animations
  - [ ] File type icons (folder, .ts, .tsx, .css, etc.)
  - [ ] Resizable panel with drag handle
  - [ ] File pairing context menu (create scoped CSS, test file)
  - [ ] Linked file indicator for paired files

- [ ] **Keyboard Shortcuts Legend**
  - [ ] Modal overlay with blur backdrop
  - [ ] Grouped shortcuts by category
  - [ ] Platform-aware key labels (⌘ vs Ctrl)
  - [ ] Searchable/filterable
  - [ ] Trigger via ⌘/Ctrl + /

- [ ] **Session Recorder**
  - [ ] Floating recording indicator
  - [ ] Start/stop via ⌘/Ctrl + Shift + R
  - [ ] Export as .webm video
  - [ ] Export as .json for in-app replay
  - [ ] Playback mode with timeline

- [ ] **Visual Polish**
  - [ ] Neon glow border around viewport
  - [ ] Consistent border-radius (8px for elements, 12px for container)
  - [ ] Smooth transitions (150ms)
  - [ ] Hover states on all interactive elements

- [ ] **Typography**
  - [ ] Inter font for UI
  - [ ] JetBrains Mono for code
  - [ ] Proper sizing (10-13px range)
  - [ ] Correct font weights

---

## 🔗 Resources

- **Inter Font**: [Google Fonts](https://fonts.google.com/specimen/Inter)
- **JetBrains Mono**: [JetBrains](https://www.jetbrains.com/lp/mono/)
- **Color Inspiration**: [haptic](https://app.haptic.md/notes)

---

> **Note**: The neon glow border is the signature element that creates the "sandbox" aesthetic. Don't skip this — it's what makes the design feel premium and unique!