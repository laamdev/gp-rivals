import { Smiley, SmileySad } from '@phosphor-icons/react/dist/ssr'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface ResultCardProps {
  isCorrect: boolean | null
  correctAnswer: string
}

export const ResultCard = ({ isCorrect, correctAnswer }: ResultCardProps) => {
  if (isCorrect === null) {
    return null
  }

  const title = isCorrect ? 'Correct!' : `Incorrect! `

  const description = isCorrect
    ? 'Well done! You got it right.'
    : `The correct answer is: ${correctAnswer}`

  return (
    <Alert variant={isCorrect ? 'default' : 'destructive'}>
      {isCorrect ? (
        <Smiley className='h-4 w-4' />
      ) : (
        <SmileySad className='h-4 w-4' />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
