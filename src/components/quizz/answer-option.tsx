import { Button } from '@/components/ui/button'

interface AnswerOptionProps {
  answer: string
  variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'neo'
    | 'neoOutline'
    | 'neoSuccess'
    | 'neoDanger'
  onClick: () => void
}

export const AnswerOption = ({
  answer,
  variant,
  onClick
}: AnswerOptionProps) => {
  return (
    <Button variant={variant} size='xl' onClick={onClick}>
      <p className='whitespace-normal'>{answer}</p>
    </Button>
  )
}
