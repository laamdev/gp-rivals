import Link from 'next/link'
import { ReactNode } from 'react'

interface NavBadgeProps {
  children: ReactNode
  href: string
}

export const NavBadge = ({ children, href = '/' }: NavBadgeProps) => {
  return (
    <Link
      href={href}
      className='inline-flex items-center whitespace-nowrap rounded-md bg-zinc-400/10 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-400/20'
    >
      {children}
    </Link>
  )
}
