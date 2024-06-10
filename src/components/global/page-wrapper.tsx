import { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return <main className='py-16'>{children}</main>
}
