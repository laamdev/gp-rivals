import { NavLink } from '@/components/navigation/nav-link'

import { getHistoricalRivalryYears } from '@/lib/fetchers'

interface SeasonsNavProps {
  rivalry: string
}

export const SeasonsNav = async ({ rivalry }: SeasonsNavProps) => {
  const data = await getHistoricalRivalryYears({ rivalry })

  if (!data) {
    return null
  }

  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink
        href={`/legendary-team-rivals/${rivalry}`}
        activeFilter={rivalry}
      >
        Overall
      </NavLink>

      {data.teamSeasons.map(teamSeason => (
        <NavLink
          href={`/legendary-team-rivals/${rivalry}/${teamSeason.season.year}`}
          activeFilter={String(teamSeason.season.year)}
        >
          {teamSeason.season.year}
        </NavLink>
      ))}
    </section>
  )
}
