interface QuizzSubmissionProps {
  scorePercentage: number
  score: number
  totalQuestions: number
}

export const QuizzSubmission = ({
  scorePercentage,
  score,
  totalQuestions
}: QuizzSubmissionProps) => {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='fle mt-20 flex-1 flex-col items-center gap-5 py-10'>
        <h2 className='text-3xl font-bold'>Quizz Complete!</h2>
        <p>{`You scored: ${scorePercentage}%`}</p>
        <>
          <div className='flex flex-row gap-10'>
            <p>{score} Correct</p>
            <p>{totalQuestions - score} Incorrect</p>
          </div>
        </>
      </div>
    </div>
  )
}
