import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import slugify from 'slugify'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { MainHeader } from '@/components/global/main-header'

import { getTeamMemberships } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { SeasonsNav } from '@/components/season/seasons-nav'

interface SeasonPageProps {
  params: {
    seasonSlug: string
  }
}
interface SeasonTeam {
  slug: string
  team: {
    id: string
    name: string
    color: string
  }
  season: {
    year: number
  }
  drivers: {
    id: string
    firstName: string
    lastName: string
    pictureUrl: string
  }[]
}

interface Props {
  params: { seasonSlug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { seasonSlug } = params

  return {
    title: `${String(seasonSlug)} F1 Season`
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { seasonSlug } = params
  const data = await getTeamMemberships(Number(params.seasonSlug))

  if (!data) {
    return null
  }

  const grouped = data.reduce((acc, membership) => {
    const teamName = membership.team.name
    const seasonYear = membership.season.year
    const slug = slugify(`${teamName} ${seasonYear}`, {
      lower: true,
      strict: true
    })

    if (!acc[slug]) {
      acc[slug] = {
        slug,
        team: membership.team,
        season: membership.season,
        drivers: []
      }
    }
    acc[slug].drivers.push(membership.driver)
    return acc
  }, {})

  const seasonTeams = Object.values(grouped).sort(
    (a: SeasonTeam, b: SeasonTeam) => a.team.name.localeCompare(b.team.name)
  )

  return (
    <MaxWidthWrapper>
      <MainHeader />

      <SeasonsNav />

      <div className='mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3'>
        {seasonTeams &&
          seasonTeams.map((seasonTeam: SeasonTeam) => (
            <Link
              href={`/season/${seasonSlug}/team/${seasonTeam.team.name.toLocaleLowerCase().split(' ').join('-')}`}
              key={seasonTeam.team.id}
              className='group'
            >
              <ul className={cn('mt-4 grid grid-cols-2')}>
                {seasonTeam.drivers.slice(0, 2).map((driver, idx) => (
                  <li key={driver.id} className='relative'>
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        idx % 2 === 0 ? 'rounded-tl-2xl' : 'rounded-tr-2xl'
                      )}
                      style={{
                        background: `linear-gradient(to bottom, ${seasonTeam.team.color}, transparent)`
                      }}
                    >
                      <Image
                        alt={`${driver.firstName} ${driver.lastName}`}
                        src={driver.pictureUrl ?? ''}
                        width={320}
                        height={320}
                        className={cn(
                          'transform duration-300',
                          idx % 2 === 0
                            ? 'rotate-180 -scale-y-100 group-hover:-scale-y-105 group-hover:scale-x-105'
                            : 'group-hover:scale-105'
                        )}
                      />
                    </div>
                    <div className='absolute inset-0 transform bg-black opacity-10 duration-300 group-hover:opacity-0' />
                  </li>
                ))}
              </ul>
              <h2 className='mt-4 text-center text-xl font-bold'>
                {seasonTeam.team.name}
              </h2>
            </Link>
          ))}
      </div>
    </MaxWidthWrapper>
  )
}
