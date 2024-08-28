import { NavLink } from '@/components/navigation/nav-link'
import { getSeasonRaces } from '@/lib/fetchers'
import { currentDate } from '@/lib/utils'

interface SeasonRacesNavProps {
  seasonSlug: string
  teamSlug: string
}

export const SeasonRacesNav = async ({
  seasonSlug,
  teamSlug
}: SeasonRacesNavProps) => {
  const races = await getSeasonRaces({ year: Number(seasonSlug) })

  if (!races) {
    return null
  }

  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink
        href={`/season/${seasonSlug}/team/${teamSlug}`}
        activeFilter={teamSlug}
      >
        Full Season
      </NavLink>

      {races.seasonRaces.map(race => {
        const raceDate = new Date(race.startDate)
        const isFutureRace = raceDate > currentDate

        return (
          <NavLink
            key={`${race.country}-${race.startDate}`}
            href={`/season/${seasonSlug}/team/${teamSlug}/gp/${race.country.toLowerCase().split(' ').join('-')}`}
            activeFilter={race.country.toLowerCase().split(' ').join('-')}
            disabled={isFutureRace}
          >
            {race.country}
          </NavLink>
        )
      })}
    </section>
  )
}
