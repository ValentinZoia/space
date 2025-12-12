# 🧪 GUÍA DEFINITIVA DE TESTING FRONTEND

> **"No testees por testear, testee para dormir tranquilo"** - Un sabio desarrollador

## 📋 ÍNDICE

1. [**Configuración Inicial**](#configuración-inicial)
2. [**Testing de Componentes UI**](#testing-de-componentes-ui)
3. [**Testing de Custom Hooks**](#testing-de-custom-hooks)
4. [**Testing de Contexts**](#testing-de-contexts)
5. [**Mocking Avanzado**](#mocking-avanzado)
6. [**Testing de Eventos**](#testing-de-eventos)
7. [**Testing de Formularios**](#testing-de-formularios)
8. [**Testing de Asincronía**](#testing-de-asincronía)
9. [**Testing de Rutas**](#testing-de-rutas)
10. [**Testing de Accesibilidad**](#testing-de-accesibilidad)
11. [**Errores Comunes y Soluciones**](#errores-comunes-y-soluciones)
12. [**Buenas Prácticas**](#buenas-prácticas)

---

## 🚀 CONFIGURACIÓN INICIAL

### **Dependencias Esenciales**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

### **vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
```

### **tsconfig.json**

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### **__tests__/setup.ts**

```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'

// Mock de APIs del browser que faltan
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

---

## 🎨 TESTING DE COMPONENTES UI

### **Componente Simple (Button)**

```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        outline: "border bg-background",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

```typescript
// components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  // Test básico de renderizado
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary', 'h-9', 'px-4')
  })

  // Test de variantes
  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  // Test de tamaños
  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-6')
  })

  // Test de estado disabled
  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('disabled')
  })

  // Test de eventos
  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test de asChild (Radix Slot)
  it('renders as different element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  // Test de className personalizado
  it('merges custom className with variants', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class', 'bg-primary')
  })
})
```

### **Componente con Iconos y Animaciones**

```typescript
// components/ui/theme-toggle.tsx
"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

```typescript
// components/ui/theme-toggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ThemeToggle } from './theme-toggle'

// Mock de next-themes
const mockSetTheme = vi.fn()
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders correctly', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Toggle theme' })
    expect(button).toBeInTheDocument()
  })

  it('renders both Sun and Moon icons', () => {
    render(<ThemeToggle />)
    const sunIcon = document.querySelector('.lucide-sun')
    const moonIcon = document.querySelector('.lucide-moon')
    
    expect(sunIcon).toBeInTheDocument()
    expect(moonIcon).toBeInTheDocument()
  })

  it('toggles theme when clicked', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Toggle theme' })
    
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('has proper accessibility', () => {
    render(<ThemeToggle />)
    const srOnly = screen.getByText('Toggle theme')
    expect(srOnly).toHaveClass('sr-only')
  })
})
```

---

## 🪝 TESTING DE CUSTOM HOOKS

### **Hook Simple (useState personalizado)**

```typescript
// hooks/useCounter.ts
import { useState, useCallback } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1)
  }, [])
  
  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])
  
  return { count, increment, decrement, reset }
}
```

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('returns initial count', () => {
    const { result } = renderHook(() => useCounter(5))
    expect(result.current.count).toBe(5)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(10))
    
    act(() => {
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(9)
  })

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(7))
    
    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.reset()
    })
    
    expect(result.current.count).toBe(7)
  })
})
```

### **Hook con API (fetch de datos)**

```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { users, loading, error, refetch: fetchUsers }
}
```

```typescript
// hooks/useUsers.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { useUsers } from './useUsers'

// Mock de fetch global
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useUsers', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('loads users successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    })

    const { result } = renderHook(() => useUsers())

    expect(result.current.loading).toBe(true)
    expect(result.current.users).toEqual([])
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.users).toEqual(mockUsers)
    })
  })

  it('handles fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to fetch users')
      expect(result.current.users).toEqual([])
    })
  })

  it('refetches data', async () => {
    const mockUsers = [{ id: 1, name: 'John', email: 'john@example.com' }]
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toEqual(mockUsers)
    })

    // Resetear mock para el refetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 2, name: 'Jane', email: 'jane@example.com' }]
    })

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.users).toEqual([{ id: 2, name: 'Jane', email: 'jane@example.com' }])
    })
  })
})
```

---

## 🌐 TESTING DE CONTEXTS

### **Context Simple (Tema)**

```typescript
// contexts/ThemeContext.tsx
"use client"
import { createContext, ReactNode, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return ctx
}
```

```typescript
// contexts/ThemeContext.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

// Componente de test
const TestComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  )
}

describe('ThemeContext', () => {
  it('provides default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('toggles theme when toggleTheme is called', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('sets theme directly', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    await user.click(screen.getByText('Set Dark'))
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('throws error when used outside provider', () => {
    // Suprimir el error de la consola para este test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within ThemeProvider')
    
    consoleError.mockRestore()
  })
})
```

---

## 🎭 MOCKING AVANZADO

### **Mock de Custom Hooks**

```typescript
// Mock básico
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'John' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn()
  })
}))

// Mock controlable
const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// En el test:
mockUseAuth.mockReturnValue({
  user: null,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn()
})
```

### **Mock de Contexts**

```typescript
// Mock completo del context
vi.mock('@/contexts/ColorContext', () => ({
  ColorProvider: ({ children }: { children: React.ReactNode }) => children,
  useColor: () => ({
    color: '#13FFAA',
    setColor: vi.fn(),
    colors: ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C']
  })
}))

// Mock con espías
const mockSetColor = vi.fn()
vi.mock('@/contexts/ColorContext', () => ({
  useColor: () => ({
    color: '#13FFAA',
    setColor: mockSetColor
  })
}))
```

### **Mock de Librerías Externas**

```typescript
// Mock de Framer Motion
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, style, ...props }: any) => (
      <button style={style} {...props}>
        {children}
      </button>
    ),
    div: ({ children, style, ...props }: any) => (
      <div style={style} {...props}>
        {children}
      </div>
    )
  },
  useMotionTemplate: (template: any, ...values: any[]) => {
    if (typeof template === 'string' && template.includes('solid')) {
      return `1px solid ${values[0]}`
    }
    return values[0] || '#000000'
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 1 }),
  animate: vi.fn()
}))

// Mock de Three.js
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="canvas">{children}</div>
}))

vi.mock('@react-three/drei', () => ({
  Stars: () => <div data-testid="stars"></div>
}))

// Mock de next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
    themes: ['light', 'dark'],
    systemTheme: 'light'
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children
}))
```

### **Mock de APIs del Browser**

```typescript
// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

---

## 🖱️ TESTING DE EVENTOS

### **Eventos del Mouse**

```typescript
// events/MouseEvents.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Mouse Events', () => {
  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles double click', async () => {
    const user = userEvent.setup()
    const handleDoubleClick = vi.fn()
    
    render(<Button onDoubleClick={handleDoubleClick}>Double click</Button>)
    
    await user.dblClick(screen.getByRole('button'))
    expect(handleDoubleClick).toHaveBeenCalledTimes(1)
  })

  it('handles hover events', async () => {
    const user = userEvent.setup()
    const handleMouseEnter = vi.fn()
    const handleMouseLeave = vi.fn()
    
    render(
      <Button 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover me
      </Button>
    )
    
    const button = screen.getByRole('button')
    
    await user.hover(button)
    expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    
    await user.unhover(button)
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('handles right click', async () => {
    const user = userEvent.setup()
    const handleContextMenu = vi.fn()
    
    render(<Button onContextMenu={handleContextMenu}>Right click</Button>)
    
    await user.pointer([
      { keys: '[MouseRight]', target: screen.getByRole('button') }
    ])
    
    expect(handleContextMenu).toHaveBeenCalledTimes(1)
  })
})
```

### **Eventos de Teclado**

```typescript
// events/KeyboardEvents.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Keyboard Events', () => {
  it('handles key press', async () => {
    const user = userEvent.setup()
    const handleKeyDown = vi.fn()
    
    render(
      <input 
        type="text" 
        onKeyDown={handleKeyDown}
        data-testid="input"
      />
    )
    
    const input = screen.getByTestId('input')
    await user.type(input, 'hello')
    
    expect(handleKeyDown).toHaveBeenCalledTimes(5) // h-e-l-l-o
  })

  it('handles specific keys', async () => {
    const user = userEvent.setup()
    const handleEnter = vi.fn()
    const handleEscape = vi.fn()
    
    render(
      <div>
        <input data-testid="input1" onKeyDown={(e) => e.key === 'Enter' && handleEnter()} />
        <input data-testid="input2" onKeyDown={(e) => e.key === 'Escape' && handleEscape()} />
      </div>
    )
    
    await user.type(screen.getByTestId('input1'), 'test{Enter}')
    await user.type(screen.getByTestId('input2'), 'test{Escape}')
    
    expect(handleEnter).toHaveBeenCalledTimes(1)
    expect(handleEscape).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup()
    const handleShortcut = vi.fn()
    
    render(
      <div onKeyDown={(e) => {
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault()
          handleShortcut()
        }
      }}>
        <span>Press Ctrl+S</span>
      </div>
    )
    
    await user.keyboard('{Control>}s{/Control}')
    expect(handleShortcut).toHaveBeenCalledTimes(1)
  })
})
```

### **Eventos de Formulario**

```typescript
// events/FormEvents.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Form Events', () => {
  it('handles form submission', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn((e) => e.preventDefault())
    
    render(
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" required />
        <button type="submit">Submit</button>
      </form>
    )
    
    await user.type(screen.getByRole('textbox'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('handles input changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(
      <input 
        type="text" 
        onChange={handleChange}
        data-testid="input"
      />
    )
    
    const input = screen.getByTestId('input')
    await user.type(input, 'hello world')
    
    expect(handleChange).toHaveBeenCalledTimes(11) // cada letra + espacio
  })

  it('handles select changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(
      <select onChange={handleChange} data-testid="select">
        <option value="">Choose...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    )
    
    await user.selectOptions(screen.getByTestId('select'), 'option1')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
```

---

## 📝 TESTING DE FORMULARIOS

### **Formulario Simple de Login**

```typescript
// components/LoginForm.tsx
"use client"
import { useState } from 'react'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Login successful:', formData)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

```typescript
// components/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('renders form fields correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Login' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('shows error for invalid email', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: 'Login' })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument()
    })
  })

  it('shows error for short password', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password/i)
    const submitButton = screen.getByRole('button', { name: 'Login' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: 'Login' })
    
    // Trigger error
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
    
    // Start typing
    await user.type(emailInput, 'test@example.com')
    
    // Error should be cleared
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password/i)
    const submitButton = screen.getByRole('button', { name: 'Login' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Button should show loading state
    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    // Wait for submission
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login successful:', {
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    // Button should return to normal state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()
    })
    
    consoleSpy.mockRestore()
  })

  it('handles form submission with Enter key', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123{Enter}')
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login successful:', {
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    consoleSpy.mockRestore()
  })
})
```

---

## ⏱️ TESTING DE ASINCRONÍA

### **Componente con Datos Asíncronos**

```typescript
// components/UserList.tsx
"use client"
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading users...</div>
  if (error) return <div>Error: {error}</div>
  if (users.length === 0) return <div>No users found</div>

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>Refresh</button>
    </div>
  )
}
```

```typescript
// components/UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserList } from './UserList'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

// Mock de fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('UserList', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('shows loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<UserList />)
    expect(screen.getByText('Loading users...')).toBeInTheDocument()
  })

  it('displays users after successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('John Doe - john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith - jane@example.com')).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument()
    })
  })

  it('shows no users message when array is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument()
    })
  })

  it('refetches data when refresh button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 3, name: 'New User', email: 'new@example.com' }]
      })

    const user = userEvent.setup()
    render(<UserList />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Click refresh
    await user.click(screen.getByRole('button', { name: 'Refresh' }))

    // Should show loading again
    expect(screen.getByText('Loading users...')).toBeInTheDocument()

    // Should show new data
    await waitFor(() => {
      expect(screen.getByText('New User - new@example.com')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
  })

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })
  })
})
```

### **Testing con Timers**

```typescript
// components/Timer.tsx
"use client"
import { useState, useEffect } from 'react'

export function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  return (
    <div>
      <div data-testid="seconds">{seconds}</div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}
```

```typescript
// components/Timer.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Timer } from './Timer'
import { vi, beforeEach, afterEach } from 'vitest'

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at 0 seconds', () => {
    render(<Timer />)
    expect(screen.getByTestId('seconds')).toHaveTextContent('0')
  })

  it('increments seconds when running', async () => {
    const user = userEvent.setup()
    render(<Timer />)
    
    await user.click(screen.getByText('Start'))
    
    // Fast-forward time
    vi.advanceTimersByTime(1000)
    expect(screen.getByTestId('seconds')).toHaveTextContent('1')
    
    vi.advanceTimersByTime(2000)
    expect(screen.getByTestId('seconds')).toHaveTextContent('3')
  })

  it('stops incrementing when stopped', async () => {
    const user = userEvent.setup()
    render(<Timer />)
    
    await user.click(screen.getByText('Start'))
    vi.advanceTimersByTime(2000)
    
    await user.click(screen.getByText('Stop'))
    vi.advanceTimersByTime(2000)
    
    // Should still be at 2
    expect(screen.getByTestId('seconds')).toHaveTextContent('2')
  })

  it('resets to 0 when reset', async () => {
    const user = userEvent.setup()
    render(<Timer />)
    
    await user.click(screen.getByText('Start'))
    vi.advanceTimersByTime(3000)
    
    await user.click(screen.getByText('Reset'))
    expect(screen.getByTestId('seconds')).toHaveTextContent('0')
  })

  it('cleans up interval on unmount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Timer />)
    
    await user.click(screen.getByText('Start'))
    vi.advanceTimersByTime(1000)
    
    unmount()
    
    // Advance time after unmount - should not cause errors
    vi.advanceTimersByTime(1000)
  })
})
```

---

## 🛣️ TESTING DE RUTAS

### **Testing con Next.js App Router**

```typescript
// app/page.test.tsx
import { render, screen } from '@testing-library/react'
import Page from './page'

// Mock de componentes que usan Three.js o Motion
vi.mock('@/components/features/aurora-hero', () => ({
  AuroraHero: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="aurora-hero">{children}</div>
  )
}))

vi.mock('@/components/sections/hero-section', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>
}))

vi.mock('@/components/sections/projects-section', () => ({
  ProjectsSection: () => <div data-testid="projects-section">Projects Section</div>
}))

describe('Home Page', () => {
  it('renders main sections', () => {
    render(<Page />)
    
    expect(screen.getByTestId('aurora-hero')).toBeInTheDocument()
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('projects-section')).toBeInTheDocument()
  })

  it('has proper page structure', () => {
    render(<Page />)
    
    // Verificar que tenga los elementos principales
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

### **Testing de Navigation**

```typescript
// components/Navigation.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navigation from './Navigation'

describe('Navigation', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    )
  }

  it('renders navigation links', () => {
    renderWithRouter(<Navigation />)
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('navigates to different pages', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Navigation />)
    
    await user.click(screen.getByRole('link', { name: 'About' }))
    
    // Verificar que la URL cambió (depende de tu router)
    expect(window.location.pathname).toBe('/about')
  })
})
```

---

## ♿ TESTING DE ACCESIBILIDAD

### **Testing de ARIA Labels**

```typescript
// accessibility/ARIA.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Accessibility Tests', () => {
  it('button has proper aria-label when provided', () => {
    render(<Button aria-label="Close dialog">×</Button>)
    
    const button = screen.getByRole('button', { name: 'Close dialog' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Close dialog')
  })

  it('screen reader only text is properly hidden', () => {
    render(
      <button>
        <span className="sr-only">Only for screen readers</span>
        Visible text
      </button>
    )
    
    const srOnlyElement = screen.getByText('Only for screen readers')
    expect(srOnlyElement).toHaveClass('sr-only')
  })

  it('form inputs have proper labels', () => {
    render(
      <form>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" required />
      </form>
    )
    
    const input = screen.getByRole('textbox', { name: 'Email Address' })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'email')
    expect(input).toBeRequired()
  })

  it('links have descriptive text', () => {
    render(
      <nav>
        <a href="/home">Home</a>
        <a href="/about">About Us</a>
        <a href="/contact">Get in Touch</a>
      </nav>
    )
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get in Touch' })).toBeInTheDocument()
  })

  it('images have alt text', () => {
    render(<img src="/logo.png" alt="Company Logo" />)
    
    const image = screen.getByRole('img', { name: 'Company Logo' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'Company Logo')
  })

  it('modal has proper focus management', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <button>Open Modal</button>
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h2 id="modal-title">Modal Title</h2>
          <button>Close</button>
        </div>
      </div>
    )
    
    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('aria-modal', 'true')
  })
})
```

### **Testing de Keyboard Navigation**

```typescript
// accessibility/KeyboardNavigation.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Keyboard Navigation', () => {
  it('can navigate with tab key', async () => {
    const user = userEvent.setup()
    render(
      <form>
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Last name" />
        <button type="submit">Submit</button>
      </form>
    )
    
    // Start at first input
    await user.tab()
    expect(screen.getByPlaceholderText('First name')).toHaveFocus()
    
    // Tab to second input
    await user.tab()
    expect(screen.getByPlaceholderText('Last name')).toHaveFocus()
    
    // Tab to button
    await user.tab()
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus()
  })

  it('can navigate backwards with shift+tab', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
    )
    
    // Focus on middle button
    await user.click(screen.getByText('Button 2'))
    
    // Navigate backwards
    await user.tab({ shift: true })
    expect(screen.getByText('Button 1')).toHaveFocus()
  })

  it('skip links work correctly', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <header>Header content</header>
        <main id="main-content">
          <h1>Main content</h1>
        </main>
      </div>
    )
    
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skipLink).toBeInTheDocument()
    
    await user.click(skipLink)
    
    const mainContent = screen.getByRole('main')
    expect(mainContent).toHaveFocus()
  })
})
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### **Error: `window.matchMedia is not a function`**

```typescript
// Solución: Agregar al setup.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### **Error: `act(...) is not wrapped`**

```typescript
// ❌ Mal
render(<Component />)
fireEvent.click(screen.getByRole('button'))

// ✅ Bien
import { act } from '@testing-library/react'
render(<Component />)
act(() => {
  fireEvent.click(screen.getByRole('button'))
})

// ✅ Mejor (con userEvent)
import userEvent from '@testing-library/user-event'
const user = userEvent.setup()
render(<Component />)
await user.click(screen.getByRole('button'))
```

### **Error: Componente no se renderiza con hooks**

```typescript
// ❌ Mal - Mock incompleto
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null })
}))

// ✅ Bien - Mock completo
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false
  })
}))
```

### **Error: `template.replace is not a function`**

```typescript
// ❌ Mal - Asumir que useMotionTemplate recibe string
vi.mock('motion/react', () => ({
  useMotionTemplate: (template: string) => template.replace('${color}', '#000')
}))

// ✅ Bien - Manejar diferentes tipos de inputs
vi.mock('motion/react', () => ({
  useMotionTemplate: (template: any, ...values: any[]) => {
    if (typeof template === 'string') {
      return template.replace(/\$\{([^}]+)\}/g, (_, key) => values[0] || '#000')
    }
    return values[0] || '#000'
  }
}))
```

### **Error: Tests asíncronos fallan**

```typescript
// ❌ Mal - No esperar
render(<AsyncComponent />)
expect(screen.getByText('Loaded')).toBeInTheDocument()

// ✅ Bien - Usar waitFor
import { waitFor } from '@testing-library/react'
render(<AsyncComponent />)
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Mejor - Usar findBy
render(<AsyncComponent />)
expect(await screen.findByText('Loaded')).toBeInTheDocument()
```

### **Error: Mock no se actualiza entre tests**

```typescript
// ❌ Mal - Mock persistente
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: 'John' })
}))

describe('Component', () => {
  it('shows user name', () => {
    render(<Component />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('shows guest when not logged in', () => {
    // ❌ El mock sigue retornando 'John'
    render(<Component />)
    expect(screen.getByText('Guest')).toBeInTheDocument() // Falla
  })
})

// ✅ Bien - Mock controlable
const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

describe('Component', () => {
  beforeEach(() => {
    mockUseAuth.mockClear()
  })

  it('shows user name', () => {
    mockUseAuth.mockReturnValue({ user: 'John' })
    render(<Component />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('shows guest when not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null })
    render(<Component />)
    expect(screen.getByText('Guest')).toBeInTheDocument() // ✅ Funciona
  })
})
```

---

## ✨ BUENAS PRÁCTICAS

### **1. Estructura de Tests**

```typescript
describe('ComponentName', () => {
  // Setup común
  let user: ReturnType<typeof userEvent.setup>
  
  beforeEach(() => {
    user = userEvent.setup()
    // Mocks comunes
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // Tests agrupados por funcionalidad
  describe('Rendering', () => {
    it('renders correctly with default props', () => {})
    it('renders with custom props', () => {})
  })

  describe('Interactions', () => {
    it('handles click events', () => {})
    it('handles keyboard events', () => {})
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {})
    it('supports keyboard navigation', () => {})
  })
})
```

### **2. Nombres de Tests Descriptivos**

```typescript
// ❌ Mal
it('works', () => {})
it('button test', () => {})

// ✅ Bien
it('renders button with correct text', () => {})
it('calls onClick handler when clicked', () => {})
it('shows loading state during submission', () => {})
it('disables button when disabled prop is true', () => {})
```

### **3. Tests Independientes**

```typescript
// ❌ Mal - Tests dependientes
let component: RenderResult

it('renders initial state', () => {
  component = render(<Counter />)
  expect(screen.getByText('0')).toBeInTheDocument()
})

it('increments after click', () => {
  // Depende del test anterior
  fireEvent.click(screen.getByText('+'))
  expect(screen.getByText('1')).toBeInTheDocument()
})

// ✅ Bien - Tests independientes
it('renders initial state', () => {
  render(<Counter />)
  expect(screen.getByText('0')).toBeInTheDocument()
})

it('increments after click', () => {
  render(<Counter />)
  fireEvent.click(screen.getByText('+'))
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### **4. Selectores Apropiados**

```typescript
// ❌ Mal - Frágil
expect(container.querySelector('.btn-primary')).toBeInTheDocument()
expect(screen.getByText('Click')).toBeInTheDocument() // Si hay múltiples "Click"

// ✅ Bien - Robusto
expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument()
expect(screen.getByLabelText('Email address')).toBeInTheDocument()
expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
```

### **5. Tests de Integración vs Unitarios**

```typescript
// Unit Test - Testea una sola cosa
it('Button component renders correctly', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Integration Test - Testea múltiples componentes trabajando juntos
it('Form submission calls API with correct data', async () => {
  const mockSubmit = vi.fn()
  render(<ContactForm onSubmit={mockSubmit} />)
  
  await userEvent.type(screen.getByLabelText('Name'), 'John Doe')
  await userEvent.type(screen.getByLabelText('Email'), 'john@example.com')
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
```

### **6. Manejo de Estados de Carga**

```typescript
it('shows loading state during async operation', async () => {
  render(<AsyncComponent />)
  
  // Estado inicial de carga
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  
  // Esperar a que termine la carga
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
  
  // Verificar que el loading desapareció
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
})
```

### **7. Tests de Error Handling**

```typescript
it('handles API errors gracefully', async () => {
  // Mock de error
  mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
  })
  
  // Verificar que hay un botón de retry
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
})
```

---

## 📦 SCRIPTS ÚTILES

### **package.json scripts**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:related": "vitest --related",
    "test:changed": "vitest --changed"
  }
}
```

### **Comandos de Vitest**

```bash
# Correr todos los tests
npm run test

# Modo watch (se re-ejecuta con cambios)
npm run test:watch

# Interfaz visual
npm run test:ui

# Coverage de código
npm run test:coverage

# Correr solo tests relacionados con archivos cambiados
npm run test:related

# Correr tests de archivos específicos
npx vitest Button.test.tsx

# Correr tests que coincidan con un patrón
npx vitest --grep "button"

# Correr tests en modo debug
npx vitest --inspect-brk
```

---

## 🎯 CONCLUSIONES

### **✅ Qué Testear:**
- **Renderizado básico** - ¿El componente aparece?
- **Props** - ¿Responde a diferentes props?
- **Eventos** - ¿Maneja interacciones del usuario?
- **Estados** - ¿Muestra estados correctos (loading, error, success)?
- **Accesibilidad** - ¿Es usable por todos?
- **Integración** - ¿Funciona con otros componentes?

### **❌ Qué NO Testear:**
- **Implementación interna** - No testees funciones privadas
- **Librerías de terceros** - Confía en React, Next.js, etc.
- **CSS exacto** - Testea comportamiento, no estilos
- **Props de routing** - No testees URLs específicas

### **🎯 Principios Clave:**
1. **Tests simples y legibles**
2. **Un test = una assertion principal**
3. **Tests independientes entre sí**
4. **Mocks predecibles y controlados**
5. **Cobertura significativa, no 100%**

---

## 🚀 RECURSOS ADICIONALES

- **[Testing Library Docs](https://testing-library.com/docs/)**
- **[Vitest Docs](https://vitest.dev/)**
- **[React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)**
- **[Common Testing Mistakes](https://kentcdodds.com/blog/common-testing-mistakes)**

> **Recuerda:** "Los tests no son sobre encontrar bugs, son sobre prevenirlos" - Kent C. Dodds

---

**¡Ahora tenés una guía completa para dominar el testing frontend!** 🎉

*Creado con ❤️ por un desarrollador que odia los bugs pero ama la tranquilidad de tener buenos tests.*