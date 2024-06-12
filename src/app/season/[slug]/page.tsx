import { InfoCard } from '@/components/global/info-card'
import { InfoContainer } from '@/components/global/info-container'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { NavBadge } from '@/components/navigation/nav-badge'
import { getTeamMembership } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface SeasonPageProps {
  params: {
    slug: string
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { slug } = params

  let slugParts = slug.split('-')
  const year = Number(slugParts.pop())
  const teamName = slugParts.join(' ')

  const data = await getTeamMembership({ teamName, year })

  if (!data) {
    return null
  }

  const drivers = data.drivers.map(driver => {
    let totalPosition = 0
    let totalPolePosition = 0
    let totalSprintShootout = 0
    let totalSprint = 0
    let totalTimeInRace = 0
    let totalFastestLap = 0
    let totalResults = driver.raceResults.length

    driver.raceResults.forEach(result => {
      totalPosition += result.position
      totalPolePosition += result.polePosition
      totalSprintShootout += result.sprintShootout ?? 0
      totalSprint += result.sprint ?? 0
      totalTimeInRace += result.timeInRace
      totalFastestLap += result.fastestLap
    })

    let averagePosition = totalPosition / totalResults
    let averagePolePosition = totalPolePosition / totalResults
    let averageSprintShootout = totalSprintShootout / totalResults
    let averageSprint = totalSprint / totalResults
    let averageTimeInRace = totalTimeInRace / totalResults
    let averageFastestLap = totalFastestLap / totalResults

    return {
      name: driver.driver.lastName,
      image: driver.driver.pictureUrl,
      driverId: driver.id,
      averagePosition,
      averagePolePosition,
      averageSprintShootout,
      averageSprint,
      averageTimeInRace,
      averageFastestLap
    }
  })

  return (
    <MaxWidthWrapper>
      <section
        className='flex items-center gap-x-4 rounded-t-2xl'
        style={{
          background: `linear-gradient(to bottom, ${data.color}, transparent)`
        }}
      >
        <Image
          src={drivers[0].image ?? ''}
          alt={drivers[0].name ?? ''}
          width={560}
          height={560}
          className={cn(
            'w-72 transform duration-300 group-hover:-scale-y-105 group-hover:scale-x-105'
          )}
        />
        <div>
          <h1 className='text-center font-serif text-4xl'>{`${drivers[0].name ?? ''} vs ${drivers[1].name ?? ''}`}</h1>
        </div>
        <Image
          src={drivers[1].image ?? ''}
          alt={drivers[1].name ?? ''}
          width={560}
          height={560}
          className={cn(
            'w-72 rotate-180 -scale-y-100 transform duration-300 group-hover:-scale-y-105 group-hover:scale-x-105'
          )}
        />
      </section>

      <div className='mt-4 flex gap-x-4'>
        <NavBadge>Season</NavBadge>
        <NavBadge>Bahrain</NavBadge>
      </div>

      <section className='mt-8'>
        <h2 className='text-center text-lg font-medium'>Position</h2>
        <div className='mt-4 grid grid-cols-2 gap-x-8'>
          <InfoContainer>
            <InfoCard
              label={`Race`}
              value={drivers[0].averagePosition}
              className='border-b border-r border-stone-700'
            />
            <InfoCard
              label={`Qualifying`}
              value={drivers[0].averagePolePosition}
              className='border-b border-stone-700'
            />

            <InfoCard
              label={`Sprint`}
              value={drivers[0].averageSprint}
              className='border-r border-stone-700'
            />
            <InfoCard
              label={`Shootout`}
              value={drivers[0].averageSprintShootout}
              className='border-stone-700'
            />
          </InfoContainer>
          <InfoContainer>
            <InfoCard
              label={`Race`}
              value={drivers[1].averagePosition}
              className='border-b border-r border-stone-700'
            />
            <InfoCard
              label={`Qualifying`}
              value={drivers[1].averagePolePosition}
              className='border-b border-stone-700'
            />

            <InfoCard
              label={`Sprint`}
              value={drivers[1].averageSprint}
              className='border-r border-stone-700'
            />
            <InfoCard
              label={`Shootout`}
              value={drivers[1].averageSprintShootout}
              className='border-stone-700'
            />
          </InfoContainer>
        </div>
      </section>

      <section className='mt-8'>
        <h2 className='text-center text-lg font-medium'>Times</h2>
        <div className='mt-4 grid grid-cols-2 gap-x-8'>
          <InfoContainer>
            <InfoCard
              label={`Race`}
              value={drivers[0].averageTimeInRace}
              className='border-b border-r border-stone-700'
            />
            <InfoCard
              label={`Race`}
              value={drivers[0].averageTimeInRace}
              className='border-b border-stone-700'
            />
            <InfoCard
              label={`Race`}
              value={drivers[0].averageTimeInRace}
              className='border-r border-stone-700'
            />
            <InfoCard
              label={`Race`}
              value={drivers[0].averageTimeInRace}
              className='border-stone-700'
            />
          </InfoContainer>
          <InfoContainer>
            <InfoCard
              label={`Race`}
              value={drivers[1].averageTimeInRace}
              className='border-b border-r border-stone-700'
            />
            <InfoCard
              label={`Race`}
              value={drivers[1].averageTimeInRace}
              className='border-b border-stone-700'
            />
            <InfoCard
              label={`Race`}
              value={drivers[1].averageTimeInRace}
              className='border-r border-stone-700'
            />
            <InfoCard
              label={`Race`}
              value={drivers[1].averageTimeInRace}
              className='border-stone-700'
            />
          </InfoContainer>
        </div>
      </section>
    </MaxWidthWrapper>
  )
}
