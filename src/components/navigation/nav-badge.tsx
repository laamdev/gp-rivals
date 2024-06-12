import { ReactNode } from 'react'

interface NavBadgeProps {
  children: ReactNode
}

export const NavBadge = ({ children }: NavBadgeProps) => {
  return (
    <span className='inline-flex items-center rounded-md bg-zinc-400/10 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-400/20'>
      {children}
    </span>
  )
}
