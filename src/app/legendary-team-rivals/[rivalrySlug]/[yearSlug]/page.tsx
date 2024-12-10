import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

import { cn, getTotalCounts } from '@/lib/utils'
import { legendaryTeamRivals } from '@/data/legendary-team-rivals'

interface TeamRivalrySeasonPageProps {
  params: Promise<{
    rivalrySlug: string
    yearSlug: string
  }>
}

export default async function TeamRivalrySeasonPage({
  params
}: TeamRivalrySeasonPageProps) {
  const { rivalrySlug, yearSlug } = await params

  const team = await legendaryTeamRivals.find(
    ({ slug }) => slug === rivalrySlug
  )

  if (!team) {
    return null
  }

  const rivalrySeason = await team.seasons.find(
    ({ year }) => year === Number(yearSlug)
  )

  if (!rivalrySeason) {
    return null
  }

  return (
    <MaxWidthWrapper>
      <section
        className='flex items-center justify-between rounded-t-2xl px-6 pb-24 pt-6'
        style={{
          background: `linear-gradient(to right, ${team.primaryColor}, ${team.secondaryColor})`
        }}
      >
        <Image
          src={team.drivers[0].pictureUrl}
          alt={`${team.drivers[0].firstName} ${team.drivers[0].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 transform rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />

        <div className='flex flex-col items-center'>
          <h2 className='font-mono text-sm font-medium uppercase tracking-wider text-zinc-100'>{`${team.team} •︎ ${yearSlug}`}</h2>
          <h1 className='mt-2.5 text-center font-serif text-sm md:text-5xl'>{`${team.drivers[0].lastName ?? ''} vs ${team.drivers[1].lastName ?? ''}`}</h1>
        </div>

        <Image
          src={team.drivers[1].pictureUrl}
          alt={`${team.drivers[1].firstName} ${team.drivers[1].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
      </section>

      <SeasonsNav team={team} />
    </MaxWidthWrapper>
  )
}
