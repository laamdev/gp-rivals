import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

interface NavBadgeProps {
  children: ReactNode
  gpSlug?: string
  isActive?: boolean
  href: string
  className?: string
}

export const NavBadge = ({
  children,
  href = '/',
  className,
  gpSlug
}: NavBadgeProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md bg-zinc-400/10 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-400/20',
        {
          isActive: 'bg-zinc-400 text-zinc-900'
        },
        className,
        href.includes(gpSlug!) && 'text-red-500'
      )}
    >
      {children}
    </Link>
  )
}
