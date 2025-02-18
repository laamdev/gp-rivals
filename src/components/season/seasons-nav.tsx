import { NavLink } from '@/components/navigation/nav-link'

export const SeasonsNav = async () => {
  const seasons = [{ year: 2024 }]

  if (!seasons) {
    return null
  }

  return (
    <section className='mt-10 flex gap-x-5 overflow-x-auto'>
      {seasons.map(season => (
        <NavLink href={`/${season.year}`} activeFilter={String(season.year)}>
          {season.year}
        </NavLink>
      ))}
    </section>
  )
}
