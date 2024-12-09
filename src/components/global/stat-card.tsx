import { Handshake, Trophy } from '@phosphor-icons/react/dist/ssr'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const StatCard = ({
  title,
  value,
  comparison
}: {
  title: string
  value: string | number
  comparison: boolean | 'tie'
}) => (
  <Card className='relative flex flex-col text-center'>
    {comparison === 'tie' ? (
      <Handshake
        weight='fill'
        className='absolute -right-2 -top-2 h-5 w-5 text-blue-500'
      />
    ) : comparison ? (
      <Trophy
        weight='fill'
        className='absolute -right-2 -top-2 h-5 w-5 text-yellow-500'
      />
    ) : null}
    <CardHeader>
      <CardTitle className='text-sm font-medium text-zinc-400'>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className='font-serif text-3xl font-bold'>{value}</CardContent>
  </Card>
)
