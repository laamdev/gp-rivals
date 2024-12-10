import { NavLink } from '@/components/navigation/nav-link'

export const SeasonsNav = async ({ team }) => {
  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink
        href={`/legendary-team-rivals/${team.slug}`}
        activeFilter={team.slug}
      >
        Overall
      </NavLink>

      {team.seasons.map(season => (
        <NavLink
          href={`/legendary-team-rivals/${team.slug}/${season.year}`}
          activeFilter={String(season.year)}
        >
          {season.year}
        </NavLink>
      ))}
    </section>
  )
}
