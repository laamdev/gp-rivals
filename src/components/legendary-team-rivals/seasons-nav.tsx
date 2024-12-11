import { NavLink } from '@/components/navigation/nav-link'

export const SeasonsNav = async ({ seasons, rivalry }) => {
  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink href={`/legendary/${rivalry.slug}`} activeFilter={rivalry.slug}>
        Overall
      </NavLink>

      {seasons.map(season => (
        <NavLink
          href={`/legendary/${rivalry.slug}/${season.year}`}
          activeFilter={String(season.year)}
        >
          {season.year}
        </NavLink>
      ))}
    </section>
  )
}
