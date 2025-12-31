"use client"

/**
 * Error Boundary for sandboxed component rendering
 * Catches runtime errors without breaking the editor
 */

import { Component, type ErrorInfo, type ReactNode } from "react"
import type { RuntimeError } from "@/features/evaluator/types"

interface Props {
  children: ReactNode
  onError: (error: RuntimeError) => void
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError({
      type: "runtime",
      message: error.message,
      stack: errorInfo.componentStack ?? error.stack,
    })
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm font-medium text-destructive">Runtime Error</p>
            <p className="text-xs text-muted-foreground mt-1">
              {this.state.error?.message ?? "An unknown error occurred"}
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
