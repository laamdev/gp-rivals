import Link from 'next/link'

export const Header = () => {
  return (
    <nav className='flex h-16 items-center px-4 md:px-16'>
      <Link href={`/`} className='scale-75 font-serif md:scale-100'>
        <span className='text-xl'>GP</span>
        <span className='ml-0.5 font-mono text-xs'>rivals</span>
      </Link>
    </nav>
  )
}
