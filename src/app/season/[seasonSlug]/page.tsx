import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { MainHeader } from '@/components/global/main-header'
import { SeasonsNav } from '@/components/season/seasons-nav'

import { cn } from '@/lib/utils'
import { seasons } from '@/data/seasons'

interface SeasonPageProps {
  params: Promise<{
    seasonSlug: string
  }>
}

export async function generateMetadata({
  params
}: SeasonPageProps): Promise<Metadata> {
  const { seasonSlug } = await params

  return {
    title: `${String(seasonSlug)} F1 Season`
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { seasonSlug } = await params

  const season = seasons.find(season => season.year === Number(seasonSlug))

  console.log(season)

  if (!season) {
    return null
  }

  return (
    <MaxWidthWrapper>
      <MainHeader />

      <SeasonsNav />

      <div className='mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2'>
        {season &&
          season.teams.map(team => (
            <Link
              href={`/season/${seasonSlug}/team/${team.name.toLocaleLowerCase().split(' ').join('-')}`}
              key={team.id}
              className='group'
            >
              <ul className={cn('mt-4 grid grid-cols-2')}>
                {team.drivers.slice(0, 2).map((driver, idx) => (
                  <li key={driver.id} className='relative'>
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        idx % 2 === 0 ? 'rounded-tl-2xl' : 'rounded-tr-2xl'
                      )}
                      style={{
                        background: `linear-gradient(to bottom, ${team.primaryColor}, transparent)`
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
              <h2 className='mt-4 text-center font-serif text-sm font-medium sm:text-base'>
                {team.name}
              </h2>
            </Link>
          ))}
      </div>
    </MaxWidthWrapper>
  )
}
