"use client"

/**
 * Component Renderer
 * Renders evaluated components with error boundary protection
 */

import type React from "react"
import { useEffect, useRef, useCallback } from "react"
import { createRoot, type Root } from "react-dom/client"
import { ComponentErrorBoundary } from "./error-boundary"
import type { RuntimeError } from "@/features/evaluator/types"

interface RendererProps {
  component: React.ComponentType | null
  onError: (error: RuntimeError) => void
}

/**
 * ComponentRenderer renders the evaluated component into an isolated container
 */
export function ComponentRenderer({ component: Component, onError }: RendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<Root | null>(null)
  const errorBoundaryRef = useRef<ComponentErrorBoundary>(null)

  const handleError = useCallback(
    (error: RuntimeError) => {
      onError(error)
    },
    [onError],
  )

  useEffect(() => {
    if (!containerRef.current) return

    // Create root if not exists
    if (!rootRef.current) {
      rootRef.current = createRoot(containerRef.current)
    }

    // Reset error boundary on component change
    errorBoundaryRef.current?.reset()

    if (Component) {
      rootRef.current.render(
        <ComponentErrorBoundary ref={errorBoundaryRef} onError={handleError}>
          <Component />
        </ComponentErrorBoundary>,
      )
    } else {
      rootRef.current.render(
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          No component to render
        </div>,
      )
    }

    return () => {
      // Cleanup on unmount
      if (rootRef.current) {
        rootRef.current.unmount()
        rootRef.current = null
      }
    }
  }, [Component, handleError])

  return <div ref={containerRef} className="w-full h-full min-h-[100px]" />
}
