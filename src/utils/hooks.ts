import { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react'

// Intersection Observer hook
export function useIntersect(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

// Scroll hook
export function useOnScroll(callback: () => void, deps: React.DependencyList = []) {
  useEffect(() => {
    window.addEventListener('scroll', callback)
    return () => window.removeEventListener('scroll', callback)
  }, deps)
}

// Interval hook
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// Timeout hook
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => clearTimeout(handler)
  }, [value, limit])

  return throttledValue
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Session storage hook
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Media query hook
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Click outside hook
export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Key press hook
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === targetKey) {
      setKeyPressed(true)
    }
  }, [targetKey])

  const upHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === targetKey) {
      setKeyPressed(false)
    }
  }, [targetKey])

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [downHandler, upHandler])

  return keyPressed
}

// Escape key hook
export function useEscapeKey(handler: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handler])
}

// Toggle hook
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle, setValue] as const
}

// Boolean hook
export function useBoolean(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, { setTrue, setFalse, toggle }] as const
}

// Array hook
export function useArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState(initialValue)

  const push = useCallback((element: T) => {
    setArray(prev => [...prev, element])
  }, [])

  const filter = useCallback((callback: (item: T, index: number) => boolean) => {
    setArray(prev => prev.filter(callback))
  }, [])

  const update = useCallback((index: number, newElement: T) => {
    setArray(prev => [
      ...prev.slice(0, index),
      newElement,
      ...prev.slice(index + 1)
    ])
  }, [])

  const remove = useCallback((index: number) => {
    setArray(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }, [])

  const clear = useCallback(() => setArray([]), [])

  return { array, setArray, push, filter, update, remove, clear }
}

// Counter hook
export function useCounter(initialValue: number = 0, step: number = 1) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount(prev => prev + step), [step])
  const decrement = useCallback(() => setCount(prev => prev - step), [step])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  const set = useCallback((value: number) => setCount(value), [])

  return { count, increment, decrement, reset, set }
}

// Map hook
export function useMap<K, V>(initialValue?: Map<K, V>) {
  const [map, setMap] = useState(new Map(initialValue))

  const set = useCallback((key: K, value: V) => {
    setMap(prev => new Map(prev).set(key, value))
  }, [])

  const remove = useCallback((key: K) => {
    setMap(prev => {
      const newMap = new Map(prev)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const clear = useCallback(() => setMap(new Map()), [])

  return { map, set, remove, clear }
}

// Set hook
export function useSet<T>(initialValue?: Set<T>) {
  const [set, setSet] = useState(new Set(initialValue))

  const add = useCallback((item: T) => {
    setSet(prev => new Set(prev).add(item))
  }, [])

  const remove = useCallback((item: T) => {
    setSet(prev => {
      const newSet = new Set(prev)
      newSet.delete(item)
      return newSet
    })
  }, [])

  const clear = useCallback(() => setSet(new Set()), [])

  const has = useCallback((item: T) => set.has(item), [set])

  return { set, add, remove, clear, has }
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// Mounted hook
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

// Unmounted hook
export function useUnmounted() {
  const [unmounted, setUnmounted] = useState(false)
  useEffect(() => () => setUnmounted(true), [])
  return unmounted
}

// Isomorphic layout effect
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
