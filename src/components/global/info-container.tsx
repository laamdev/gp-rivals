import { ReactNode } from 'react'

interface InfoContainerProps {
  children: ReactNode
}

export const InfoContainer = ({ children }: InfoContainerProps) => {
  return (
    <div className='grid h-fit grid-cols-2 rounded bg-zinc-900'>{children}</div>
  )
}
