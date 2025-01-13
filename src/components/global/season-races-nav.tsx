import { NavLink } from '@/components/navigation/nav-link'

import { currentDate } from '@/lib/utils'
import { getSeasonRaces } from '@/api/queries'

interface SeasonRacesNavProps {
  teamSlug: string
  seasonSlug: string
}

export const SeasonRacesNav = async ({
  teamSlug,
  seasonSlug
}: SeasonRacesNavProps) => {
  const races = await getSeasonRaces(seasonSlug)

  if (!races) return null

  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink href={`/${seasonSlug}/${teamSlug}`} activeFilter={teamSlug}>
        Full Season
      </NavLink>

      {races.seasonRaces.map((race, idx) => {
        const raceDate = new Date(race.date)
        const isFutureRace = raceDate > currentDate

        return (
          <NavLink
            key={idx}
            href={`/${seasonSlug}/${teamSlug}/${race.round}`}
            activeFilter={race.round}
            disabled={isFutureRace}
          >
            {race.raceName}
          </NavLink>
        )
      })}
    </section>
  )
}
