// React hooks and utilities
export {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
  useReducer,
  useLayoutEffect,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  useInsertionEffect,
  useActionState,
  useOptimistic,
  use,
  cache,
} from 'react'

// React DOM
export {
  createPortal,
  flushSync,
  unstable_batchedUpdates,
} from 'react-dom'

// Styling utilities
export { clsx, type ClassValue } from 'clsx'
export { twMerge } from 'tailwind-merge'
export { cva } from 'class-variance-authority'
export * from './styling'

// Next.js utilities
export {
  useRouter,
  usePathname,
  useSearchParams,
  redirect,
  notFound,
  permanentRedirect,
} from 'next/navigation'

export {
  useIntersect,
  useOnScroll,
  useInterval,
  useTimeout,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useSessionStorage,
  useMediaQuery,
  useOnClickOutside,
  useKeyPress,
  useEscapeKey,
  useToggle,
  useBoolean,
  useArray,
  useCounter,
  useMap,
  useSet,
  usePrevious,
  useMounted,
  useUnmounted,
  useIsomorphicLayoutEffect,
} from './hooks'

// Form utilities
export { useForm } from 'react-hook-form'
export { z } from 'zod'

// Date utilities
export {
  format,
  parse,
  isValid,
  isDate,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  formatDistanceToNow,
  formatRelative,
} from 'date-fns'

// Animation utilities
export { motion, AnimatePresence } from 'framer-motion'

// Theme utilities
export { useTheme } from 'next-themes'

// Toast utilities
export { toast } from 'sonner'

// Re-export all shadcn/ui components
export * from '@/components/ui'

// Re-export lucide icons
export * from 'lucide-react'
