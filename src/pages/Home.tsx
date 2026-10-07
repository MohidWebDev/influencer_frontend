import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { peopleQuery } from '../api/queries'
import PersonCard from '../components/PersonCard'
import SearchBar from '../components/SearchBar'
import { useTaxonomy } from '../hooks/useTaxonomy'

function Home() {
  const { t } = useTranslation()
  const { data: industries } = useTaxonomy('industries')

  // Sab se zyada followers wale 6 log
  const { data: featured, isLoading, isError } = useQuery(
    peopleQuery(new URLSearchParams({ limit: '6', sort: 'followers' })),
  )

  return (
    <div className="space-y-14">
      <section className="py-6 text-center md:py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 md:text-lg">
          {t('home.subtitle')}
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <SearchBar size="lg" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t('home.browseByIndustry')}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {industries?.map((industry) => (
            <Link
              key={industry._id}
              to={`/search?industry=${industry.slug}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:border-gray-900"
            >
              {industry.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{t('home.mostFollowed')}</h2>
          <Link to="/search" className="text-sm underline">
            {t('home.seeAll')}
          </Link>
        </div>
        {isLoading && <p className="mt-4 text-gray-500">{t('common.loading')}</p>}
        {isError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {t('home.loadError')}
          </p>
        )}
        {featured && featured.people.length === 0 && (
          <p className="mt-4 text-gray-500">{t('home.noProfiles')}</p>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {featured?.people.map((person) => (
            <PersonCard key={person._id} person={person} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
