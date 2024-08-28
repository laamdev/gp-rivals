import { ReactNode } from 'react'
import { CardTitle } from '../ui/card'

interface RaceStatContainerProps {
  label: string
  children: ReactNode
}

export const RaceStatContainer = ({
  label,
  children
}: RaceStatContainerProps) => {
  return (
    <div>
      <CardTitle className='text-center'>{label}</CardTitle>

      <div className='mt-5 grid grid-cols-2 gap-x-10 gap-y-5'>{children}</div>
    </div>
  )
}
