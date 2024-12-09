import { NavLink } from '@/components/navigation/nav-link'

import { getHistoricalRivalryYears } from '@/lib/fetchers'

export const SeasonsNav = async ({ rivalry }) => {
  // // const data = await getHistoricalRivalryYears({ rivalry })

  // // if (!data) {
  // //   return null
  // // }

  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink
        href={`/legendary-team-rivals/${rivalry.slug}`}
        activeFilter={rivalry.slug}
      >
        Overall
      </NavLink>

      {rivalry.seasons.map(season => (
        <NavLink
          href={`/legendary-team-rivals/${rivalry.slug}/${season.year}`}
          activeFilter={String(season.year)}
        >
          {season.year}
        </NavLink>
      ))}
    </section>
  )
}
