import React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '../theme-toggle'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

function Header(
  // { children }: { children: React.ReactNode }
) {

  return (


    <>

      <header className="sticky flex justify-center top-0 z-50 w-full h-fit  px-8 bg-transparent backdrop-blur supports-backdrop-filter:bg-transparent">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                Valenzo.dev
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
                Projectos
              </Link>
              <Link
                href="#stack"
                className="transition-colors hover:text-foreground/80"
              >
                Tecnologias
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
              <Link href={"/assets/GabrielLimaSantana.pdf"} target="_blank">
                <Button variant="ghost" size="icon">
                  <Download />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* <section className='container px-4 md:px-6 z-50 max-w-[1380px] mx-auto'>
        <section id="about" className="py-12 md:py-12 lg:py-24">
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                {children}
              </div>
            </div>
          </div>
        </section>
      </section> */}
    </>




  )
}

export default Header
