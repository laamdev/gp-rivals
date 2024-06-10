import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { getSeason, getTeamMemberships } from '../lib/fetchers'
import { PageWrapper } from '@/components/global/page-wrapper'

export default async function HomePage() {
  // const data = await getTeamMemberships()

  // const grouped = data.reduce((acc, membership) => {
  //   const key = `${membership.team.id}-${membership.season.id}`
  //   if (!acc[key]) {
  //     acc[key] = {
  //       team: membership.team,
  //       season: membership.season,
  //       drivers: []
  //     }
  //   }
  //   acc[key].drivers.push(membership.driver)
  //   return acc
  // }, {})

  // const groupedArray = Object.values(grouped)

  return (
    <PageWrapper>
      <h1>Home</h1>
      {/* <MaxWidthWrapper>
        <div className='grid grid-cols-2 gap-x-8'>
          {groupedArray.map(group => (
            <div key={group.team.id}>
              <h2>
                {group.team.name} - {group.season.year}
              </h2>
              <ul>
                {group.drivers.map(driver => (
                  <li key={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MaxWidthWrapper> */}
    </PageWrapper>
  )
}
