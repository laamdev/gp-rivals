import { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return <main className='mb-16'>{children}</main>
}
