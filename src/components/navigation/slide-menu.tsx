'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export const Menu = () => {
  const pathname = usePathname()

  return (
    <header className='flex w-full items-center justify-center py-6 sm:py-8'>
      <nav className='flex gap-x-4'>
        <Link
          href='/'
          className={cn(
            buttonVariants({
              variant: pathname === '/' ? 'default' : 'outline',
              size: 'sm'
            })
          )}
        >
          2024
        </Link>
        <Link
          href='/legendary'
          className={cn(
            buttonVariants({
              variant: pathname === '/legendary' ? 'default' : 'outline',
              size: 'sm'
            })
          )}
        >
          Legendary
        </Link>
      </nav>
    </header>
  )
}
