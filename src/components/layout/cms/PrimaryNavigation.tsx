'use client'

import { SetStateAction } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Create Content', href: '/create-content' },
  { label: 'Content Library', href: '/content-library' },
  { label: 'Content Calendar', href: '/content-calendar' },
  { label: 'Approvals', href: '/approvals' },
]

const PrimaryNavigation = ({ openMenu, setOpenMenu }: { openMenu: boolean; setOpenMenu: (value: SetStateAction<boolean>) => void }) => {
  const pathname = usePathname();

  return (
    <div className={cn(
      "max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:bg-white/95 max-lg:backdrop-blur-md lg:block transition-all duration-300",
      openMenu ? "translate-x-0 opacity-100" : "max-lg:-translate-x-full max-lg:opacity-0 hidden lg:block"
    )}>
      <Button 
        className="max-lg:flex hidden p-0 !bg-transparent text-primary absolute top-6 right-6 z-50 w-10 h-10 items-center justify-center hover:bg-slate-100 rounded-full" 
        onClick={() => setOpenMenu(false)}
      >
        <X className="size-6" />
      </Button>
      
      <nav className='lg:flex items-center h-full'>
        <ul className='flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2 p-8 lg:p-0'>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/create-content' && pathname.startsWith('/create-content'));
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md block group",
                    isActive 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-primary hover:bg-slate-50"
                  )}
                  onClick={() => setOpenMenu(false)}
                >
                  {item.label}
                  {/* Subtle active indicator for desktop */}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full hidden lg:block" />
                  )}
                  {/* Hover indicator for desktop */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 hidden lg:block" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )
}

export default PrimaryNavigation

