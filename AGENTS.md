# AGENTS.md

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

## Code Style
- Next.js 16 with TypeScript, strict mode enabled
- Use `@/*` path aliases for imports
- Tailwind CSS for styling with clsx/tailwind-merge utilities
- React components with proper TypeScript types
- ESLint with Next.js config (core-web-vitals + typescript)
- Geist font family (sans + mono variables)
- Theme support via next-themes with system default
- Component structure: components/_components/ for custom, components/ui/ for reusable UI

## Custom Agents

### Scroll Animation Expert
**Purpose:** Specialized agent for scroll-based animations and interactions
**Use Case:** When working with Lenis, Framer Motion scroll animations, or complex scroll effects
**Instructions:**
- Focus on scrollYProgress and useTransform patterns
- Optimize for performance with proper refs and cleanup
- Ensure smooth transitions between scroll sections
- Test scroll animations at different viewport sizes

### Component Architect
**Purpose:** Design and structure React components following project patterns
**Use Case:** Creating new components or refactoring existing ones
**Instructions:**
- Follow the component structure: components/_components/ for custom, components/ui/ for reusable
- Use proper TypeScript interfaces for props
- Implement proper accessibility (ARIA labels, semantic HTML)
- Ensure components are responsive and theme-aware
- Add proper error boundaries and loading states where needed

### Performance Optimizer
**Purpose:** Analyze and optimize application performance
**Use Case:** When experiencing slow load times, janky animations, or large bundle sizes
**Instructions:**
- Check for unnecessary re-renders with React DevTools
- Optimize images and assets
- Implement code splitting for large components
- Review bundle size and eliminate unused dependencies
- Ensure proper cleanup in useEffect hooks

## File Structure Guidelines

### Routes
- `app/` - Next.js app directory
- `app/[route]/page.tsx` - Route pages
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles

### Components
- `components/_components/` - Custom project components
- `components/ui/` - Reusable UI components
- `components/magicui/` - Third-party UI components

### Providers
- `providers/` - React context providers (Lenis, Cursor, etc.)

### Contexts
- `contexts/` - React contexts for state management

### Utilities
- `lib/` - Utility functions and helpers

## Development Workflow

1. **Feature Development:**
   - Create components in appropriate directories
   - Follow TypeScript strict mode
   - Use Tailwind for styling
   - Test responsiveness

2. **Animation Implementation:**
   - Use Lenis for smooth scrolling
   - Implement Framer Motion for animations
   - Ensure proper cleanup and performance
   - Test scroll behavior across devices

3. **Code Quality:**
   - Run `npm run lint` before commits
   - Ensure TypeScript compilation
   - Test build with `npm run build`
   - Follow established naming conventions

## Project-Specific Patterns

### Scroll Sections
- Use `useRef` for scroll targets
- Implement `useScroll` with proper offsets
- Transform scroll progress to animations
- Clean up event listeners in useEffect

### Component Props
- Use TypeScript interfaces
- Provide default values where appropriate
- Support theme variations
- Handle loading and error states

### Styling Approach
- Tailwind CSS for layout and responsive design
- clsx/tailwind-merge for conditional classes
- CSS-in-JS only when necessary for animations
- Maintain consistency with Geist font family