import Link from 'next/link'

import { NavLink } from './nav-link'

import { getSeasonsYear } from '@/lib/fetchers'

export const Header = async () => {
  const seasons = await getSeasonsYear()

  return (
    <nav className='flex h-16 items-center justify-between px-4 md:px-16'>
      <Link href={`/`} className='scale-75 font-serif md:scale-100'>
        <span className='text-xl'>{`GP`}</span>
        <span className='ml-0.5 font-mono text-xs'>{`rivals`}</span>
      </Link>

      <div className='flex items-center gap-x-4'>
        {seasons.map(season => {
          return (
            <NavLink
              key={season.year}
              href={`/season/${season.year}`}
              activeFilter={String(season.year)}
            >
              {season.year}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
