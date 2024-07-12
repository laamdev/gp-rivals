import type { Metadata } from 'next'
import '@/app/globals.css'
import { Header } from '@/components/navigation/header'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import localFont from 'next/font/local'
import { NavBadge } from '@/components/navigation/nav-badge'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { getSeasonRaces, getTeamMembership } from '@/lib/fetchers'
import Image from 'next/image'
import type { ResolvingMetadata } from 'next'

interface TeamSeasonPageProps {
  params: {
    seasonSlug: string
    teamSlug: string
  }
}

export async function generateMetadata(
  { params }: TeamSeasonPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { seasonSlug, teamSlug } = params

  const teamSlugCapitalized =
    teamSlug.charAt(0).toUpperCase() + teamSlug.slice(1)

  return {
    title: `${teamSlugCapitalized}'s ${seasonSlug} Season`
  }
}

export default async function TeamSeasonLayout({
  params,
  children
}: Readonly<{
  children: ReactNode
  params: {
    seasonSlug: string
    teamSlug: string
  }
}>) {
  const { seasonSlug, teamSlug } = params

  const races = await getSeasonRaces({ year: Number(seasonSlug) })
  const teamMembership = await getTeamMembership({
    teamName: teamSlug,
    year: seasonSlug
  })

  if (!teamMembership || !races) {
    return null
  }

  const drivers = teamMembership.drivers.map(driver => {
    return {
      name: driver.driver.lastName,
      image: driver.driver.pictureUrl,
      driverId: driver.id
    }
  })

  return (
    <MaxWidthWrapper>
      <section
        className='flex items-center justify-between rounded-t-2xl'
        style={{
          background: `linear-gradient(to bottom, ${teamMembership.color}, transparent)`
        }}
      >
        <Image
          src={drivers[0].image ?? ''}
          alt={drivers[0].name ?? ''}
          width={560}
          height={560}
          className={cn(
            'w-24 transform duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
        <div>
          <h1 className='text-center font-serif text-sm md:text-5xl'>{`${drivers[0].name ?? ''} vs ${drivers[1].name ?? ''}`}</h1>
        </div>
        <Image
          src={drivers[1].image ?? ''}
          alt={drivers[1].name ?? ''}
          width={560}
          height={560}
          className={cn(
            'w-24 rotate-180 -scale-y-100 transform duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
      </section>

      <section className='flex gap-x-4 overflow-x-auto py-8'>
        <NavBadge href={`/season/${seasonSlug}/team/${teamSlug}`}>
          Full Season
        </NavBadge>

        {races.seasonRaces.map(race => (
          <NavBadge
            href={`/season/${seasonSlug}/team/${teamSlug}/gp/${race.country.toLowerCase().split(' ').join('-')}`}
          >
            {race.country}
          </NavBadge>
        ))}
      </section>

      <section>{children}</section>
    </MaxWidthWrapper>
  )
}
