import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

import { cn, getTotalCounts } from '@/lib/utils'
import { legendaryTeamRivals } from '@/data/legendary-team-rivals'

interface TeamRivalryPageProps {
  params: Promise<{
    rivalrySlug: string
  }>
}

export default async function TeamRivalryPage({
  params
}: TeamRivalryPageProps) {
  const { rivalrySlug } = await params

  const rivalry = await legendaryTeamRivals.find(
    ({ slug }) => slug === rivalrySlug
  )

  if (!rivalry) {
    return null
  }

  const teammates = rivalrySlug.split('-vs-')
  const teammateOne = teammates[0]
  const teammateTwo = teammates[1]

  const teammateOneStatusResponse = await fetch(
    `http://ergast.com/api/f1/1988/drivers/${teammateOne}/status.json`
  )

  if (!teammateOneStatusResponse.ok) return undefined

  const { MRData: teammateOneStatusData } =
    await teammateOneStatusResponse.json()

  const teammateTwoStatusResponse = await fetch(
    `http://ergast.com/api/f1/1988/drivers/${teammateTwo}/status.json`
  )

  if (!teammateTwoStatusResponse.ok) return undefined

  const { MRData: teammateTwoStatusData } =
    await teammateTwoStatusResponse.json()
  getTotalCounts
  const teammateOneStatus = teammateOneStatusData.StatusTable.Status
  const teammateTwoStatus = teammateTwoStatusData.StatusTable.Status

  return (
    <MaxWidthWrapper>
      <section
        className='flex items-center justify-between rounded-t-2xl px-6 pb-24 pt-6'
        style={{
          background: `linear-gradient(to right, ${team.primaryColor}, ${team.secondaryColor})`
        }}
      >
        <Image
          src={rivalry.drivers[0].pictureUrl}
          alt={`${rivalry.drivers[0].firstName} ${rivalry.drivers[0].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 transform rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />

        <div className='flex flex-col items-center'>
          <h2 className='font-mono text-sm font-medium uppercase tracking-wider text-zinc-100'>{`${rivalry.team} •︎ ${rivalry.seasons.length} ${rivalry.seasons.length <= 1 ? 'Season' : 'Seasons'}`}</h2>
          <h1 className='mt-2.5 text-center font-serif text-sm md:text-5xl'>{`${rivalry.drivers[0].lastName ?? ''} vs ${rivalry.drivers[1].lastName ?? ''}`}</h1>
        </div>

        <Image
          src={rivalry.drivers[1].pictureUrl}
          alt={`${rivalry.drivers[1].firstName} ${rivalry.drivers[1].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
      </section>

      <SeasonsNav rivalry={rivalry} />
    </MaxWidthWrapper>
  )
}
