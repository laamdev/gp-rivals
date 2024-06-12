import Link from 'next/link'

export const Header = () => {
  return (
    <header className='flex h-32 items-center px-16'>
      <Link href={`/`} className='font-serif'>
        <span className='text-xl'>GP</span>
        <span className='ml-0.5 font-mono text-xs'>rivals</span>
      </Link>
    </header>
  )
}
