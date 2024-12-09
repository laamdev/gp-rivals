import Image from 'next/image'

import { MainHeader } from '@/components/global/main-header'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'

import { getTeams } from '@/lib/fetchers'

export default async function HomePage() {
  const teams = await getTeams()

  return (
    <MaxWidthWrapper>
      <MainHeader />

      <section className='mt-10 grid grid-cols-4 gap-10'>
        {teams.map(team => (
          <div key={team.id}>
            <div className='relative aspect-square'>
              <Image
                src={team.logo}
                alt={team.name}
                fill
                className='rounded-xl bg-zinc-900 object-cover object-center'
              />
            </div>
            <h2 className='mt-5 text-center font-serif text-white'>
              {team.name}
            </h2>
          </div>
        ))}
      </section>
    </MaxWidthWrapper>
  )
}
