import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

function Header() {

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full h-fit px-8 bg-transparent backdrop-blur supports-backdrop-filter:bg-transparent">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                Space
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="#about"
                className="transition-colors hover:text-foreground/80"
              >
                Inicio
              </Link>
              <Link
                href="#projects"
                className="transition-colors hover:text-foreground/80"
              >
                Proyectos
              </Link>
              <Link
                href="#stack"
                className="transition-colors hover:text-foreground/80"
              >
                Tecnologías
              </Link>
              <Link
                href="#contacto"
                className="transition-colors hover:text-foreground/80"
              >
                Contacto
              </Link>
            </nav>
          </div>
          <div className="self-center flex w-full gap-2 justify-end ">
            <ThemeToggle />
            <div>
              <Link href={"/assets/cv.pdf"} target="_blank">
                <Button variant="ghost" size="icon">
                  <Download />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
