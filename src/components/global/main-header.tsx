interface MainHeaderProps {
  heading?: string
  summary?: string
}

export const MainHeader = ({
  heading = 'GP Rivals',
  summary = 'Compare and visualize the performance of F1 teammates at individual races or throughout a full season.'
}: MainHeaderProps) => {
  return (
    <section className='mt-10'>
      <div className='mx-auto flex max-w-5xl flex-col items-center'>
        <h1 className='text-center font-serif text-5xl md:text-7xl'>
          {heading}
        </h1>
        <p className='mt-2.5 text-balance text-center text-base text-zinc-400 md:text-lg'>
          {summary}
        </p>
      </div>
    </section>
  )
}
