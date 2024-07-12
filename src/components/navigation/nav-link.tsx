'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavLinkProps {
  children: ReactNode
  href: string
  className?: string
  isActiveFilter?: string
}

export const NavLink = ({
  children,
  href,
  className,
  isActiveFilter
}: NavLinkProps) => {
  const pathname = usePathname()

  const isActive = pathname.includes(isActiveFilter ?? '')

  return (
    <Link
      href={href}
      className={cn(
        isActive && 'border border-zinc-400',
        'transform rounded bg-zinc-900 px-2 py-1 text-xs font-semibold text-zinc-400 shadow-sm duration-300 ease-linear hover:bg-zinc-800',
        className
      )}
    >
      {children}
    </Link>
  )
}
