'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavLinkProps {
  children: ReactNode
  href: string
  className?: string
  activeFilter?: string | boolean | null
  disabled?: boolean
}

export const NavLink = ({
  children,
  href,
  className,
  activeFilter,
  disabled
}: NavLinkProps) => {
  const pathname = usePathname()

  const isActive = pathname.endsWith(activeFilter as string)

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        'transform rounded bg-zinc-900 px-2 py-1 text-xs font-semibold whitespace-nowrap text-zinc-400 shadow-sm duration-300 ease-linear hover:bg-zinc-800',
        isActive && 'border border-zinc-400',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      {children}
    </Link>
  )
}
