// Example usage of all the new imports and utilities
import {
  // React hooks
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  
  // Styling utilities
  clsx,
  cn,
  cva,
  
  // Custom hooks
  useToggle,
  useDebounce,
  useLocalStorage,
  useKeyPress,
  useOnClickOutside,
  useInterval,
  useTimeout,
  
  // Form utilities
  useForm,
  
  // Date utilities
  format,
  addDays,
  
  // Animation utilities
  motion,
  AnimatePresence,
  
  // Theme utilities
  useTheme,
  
  // Toast utilities
  toast,
  
  // UI components
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  
  // Icons
  Heart,
  Star,
  Moon,
  Sun,
} from '@/utils'

// Example component using various utilities
export function ExampleComponent() {
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useLocalStorage('dark-mode', false)
  const [isOpen, toggleOpen] = useToggle(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { theme, setTheme } = useTheme()
  const modalRef = useRef<HTMLDivElement>(null)
  
  const isEnterPressed = useKeyPress('Enter')
  const isEscapePressed = useKeyPress('Escape')
  
  useOnClickOutside(modalRef, () => isOpen && toggleOpen())
  
  useInterval(() => {
    setCount(c => c + 1)
  }, 1000)
  
  useTimeout(() => {
    toast.success('Timeout triggered!')
  }, 5000)
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
    toast.success('Count increased!')
  }, [])
  
  const expensiveValue = useMemo(() => {
    return Array.from({ length: 1000 }, (_, i) => i * count).reduce((a, b) => a + b, 0)
  }, [count])
  
  const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'underline-offset-4 hover:underline text-primary',
        },
        size: {
          default: 'h-10 py-2 px-4',
          sm: 'h-9 px-3 rounded-md',
          lg: 'h-11 px-8 rounded-md',
          icon: 'h-10 w-10',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    }
  )
  
  return (
    <Card className={cn('w-full max-w-md mx-auto p-6', isDark && 'bg-gray-800')}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Enhanced Component
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{count}</div>
          <div className="text-sm text-muted-foreground">Expensive: {expensiveValue}</div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleClick} className={buttonVariants()}>
            Increment
          </Button>
          <Button variant="outline" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full px-3 py-2 border rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          />
          <div className="text-sm text-muted-foreground">
            Debounced: {debouncedSearch}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Dark mode:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? 'On' : 'Off'}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Enter pressed: {isEnterPressed ? 'Yes' : 'No'} | 
          Escape pressed: {isEscapePressed ? 'Yes' : 'No'}
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-background border rounded-lg"
            >
              <p>Modal content - Press Escape or click outside to close</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button onClick={toggleOpen}>
          {isOpen ? 'Close' : 'Open'} Modal
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Current date: {format(new Date(), 'PPP')}
          <br />
          Next week: {format(addDays(new Date(), 7), 'PPP')}
        </div>
      </CardContent>
    </Card>
  )
}
