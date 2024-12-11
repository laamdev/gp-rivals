'use client'

import { useState } from 'react'
import { CaretLeft, X } from '@phosphor-icons/react'

import { MainHeader } from '@/components/global/main-header'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AnswerOption } from '@/components/quizz/answer-option'
import { ResultCard } from '@/components/quizz/result-card'
import { QuizzSubmission } from '@/components/quizz/quizz-submission'

import { quizz } from '@/data/quizz'

export default function QuizzPage() {
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleNext = () => {
    if (!isStarted) {
      setIsStarted(true)
      return
    }

    if (currentQuestion === quizz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setSubmitted(true)
      return
    }

    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const handleAnswer = answer => {
    setSelectedAnswer(answer.id)

    const isCurrentCorrect = answer.isCorrect

    if (isCurrentCorrect) {
      setScore(score + 1)
    }

    setIsCorrect(isCurrentCorrect)
  }

  const scorePercentage: number = Math.round((score / quizz.length) * 100)

  if (submitted) {
    return (
      <QuizzSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={quizz.length}
      />
    )
  }

  return (
    <MaxWidthWrapper className='flex flex-col items-center justify-center'>
      {!isStarted ? (
        <MainHeader
          heading='F1 Quiz'
          summary={`Test your Formula 1 knowledge with our exciting quiz, covering everything from legendary drivers to iconic races. Whether you're a seasoned fan or a newcomer, see how well you know the world of F1!`}
        />
      ) : (
        <div className='sticky top-0 z-10 w-full py-4 shadow-md'>
          <header className='grid grid-flow-col grid-cols-[auto,1fr,auto] items-center justify-between gap-2 py-2'>
            <Button variant='outline' size='icon'>
              <CaretLeft />
            </Button>
            <Progress value={(currentQuestion / quizz.length) * 100} />
            <Button variant='outline' size='icon'>
              <X />
            </Button>
          </header>

          <h1 className='mt-10 text-center text-3xl font-bold'>
            {quizz[currentQuestion].questionText}
          </h1>

          <div className='mt-5 grid gap-5 md:grid-cols-2'>
            {quizz[currentQuestion].answers.map(answer => {
              const variant =
                selectedAnswer === answer.id
                  ? answer.isCorrect
                    ? 'neoSuccess'
                    : 'neoDanger'
                  : 'neoOutline'
              return (
                <AnswerOption
                  variant={variant}
                  key={answer.id}
                  answer={answer.answerText}
                  onClick={() => handleAnswer(answer)}
                />
              )
            })}
          </div>
        </div>
      )}

      <Button size='lg' onClick={handleNext}>
        {!isStarted
          ? 'Start'
          : currentQuestion === quizz.length - 1
            ? 'Submit'
            : 'Next'}
      </Button>

      <footer className='mt-5'>
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            quizz[currentQuestion].answers.find(
              answer => answer.isCorrect === true
            )?.answerText || ''
          }
        />
      </footer>
    </MaxWidthWrapper>
  )
}
