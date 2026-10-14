import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faChartColumn,
  faCheck,
  faCircleCheck,
  faFileSignature,
  faHandshake,
  faMagnifyingGlass,
  faPaperPlane,
  faShieldHalved,
  faSliders,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../hooks/useAuth'

type FeatureKey = 'discovery' | 'reach' | 'authenticity' | 'outreach' | 'hiring'

// Mock-up ka dabba: app ki chhoti si tasveer (sirf sajawat, screen reader se chhupa)
function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 p-4 ring-1 ring-gray-200 sm:p-6"
    >
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">{children}</div>
    </div>
  )
}

const Bar = ({ className }: { className: string }) => <span className={`block h-2 rounded-full ${className}`} />

// 1. Search filters aur natije
function DiscoveryMock() {
  const { t } = useTranslation()
  return (
    <Frame>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-400">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
        {t('home.mock.searchHint')}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        {[t('home.mock.filterProfession'), t('home.mock.filterCountry'), t('home.mock.filterFollowers')].map(
          (chip) => (
            <span key={chip} className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-white">
              <FontAwesomeIcon icon={faSliders} className="text-[9px]" />
              {chip}
            </span>
          ),
        )}
      </div>
      <ul className="mt-4 space-y-2.5">
        {['SK', 'HM', 'AR'].map((initials, i) => (
          <li key={initials} className="flex items-center gap-3 rounded-xl bg-gray-50 p-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="flex-1 space-y-1.5">
              <Bar className={`bg-gray-300 ${['w-28', 'w-24', 'w-32'][i]}`} />
              <Bar className="w-16 bg-gray-200" />
            </span>
            <span className="text-xs font-semibold text-gray-700">{['2.3M', '1.7M', '980K'][i]}</span>
          </li>
        ))}
      </ul>
    </Frame>
  )
}

// 2. Har platform pe followers aur engagement
function ReachMock() {
  const { t } = useTranslation()
  const rows = [
    { name: 'Instagram', width: 'w-[85%]', followers: '1.2M', rate: '5.8%' },
    { name: 'TikTok', width: 'w-[70%]', followers: '900K', rate: '7.2%' },
    { name: 'YouTube', width: 'w-[45%]', followers: '650K', rate: '4.0%' },
    { name: 'X', width: 'w-[20%]', followers: '84K', rate: '2.1%' },
  ]
  return (
    <Frame>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">{t('home.mock.totalReach')}</p>
          <p className="text-2xl font-bold">2.8M</p>
        </div>
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
          {t('home.mock.avgEngagement')}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.name}>
            <div className="flex justify-between text-xs">
              <span className="font-medium">{row.name}</span>
              <span className="text-gray-500">
                {row.followers} · {row.rate}
              </span>
            </div>
            <span className="mt-1 block h-2 rounded-full bg-gray-100">
              <span className={`block h-2 rounded-full bg-gray-900 ${row.width}`} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-gray-400">{t('home.mock.sources')}</p>
    </Frame>
  )
}

// 3. Verified profile aur us ki janch ki list
function AuthenticityMock() {
  const { t } = useTranslation()
  return (
    <Frame>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 font-semibold text-white">
          HM
        </span>
        <div>
          <p className="font-semibold">Hira Mani</p>
          <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            <FontAwesomeIcon icon={faCircleCheck} />
            {t('site.verified')}
          </span>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {[t('home.mock.checkClaimed'), t('home.mock.checkCode'), t('home.mock.checkSources'), t('home.mock.checkReviews')].map(
          (item) => (
            <li key={item} className="flex items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-700">
                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
              </span>
              {item}
            </li>
          ),
        )}
      </ul>
    </Frame>
  )
}

// 4. Shortlist se seedhi hire request
function OutreachMock() {
  const { t } = useTranslation()
  return (
    <Frame>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <FontAwesomeIcon icon={faStar} className="text-amber-500" />
        {t('home.mock.shortlist')}
      </p>
      <div className="mt-3 flex -space-x-2 rtl:space-x-reverse">
        {['SK', 'AR', 'HM', 'OA'].map((initials) => (
          <span
            key={initials}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white ring-2 ring-white"
          >
            {initials}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-gray-200 p-3">
        <p className="text-sm font-semibold">{t('home.mock.requestTitle')}</p>
        <div className="mt-2 space-y-1.5">
          <Bar className="w-full bg-gray-200" />
          <Bar className="w-4/5 bg-gray-200" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{t('home.mock.budget')}</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">
            <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />
            {t('home.mock.send')}
          </span>
        </div>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
        <FontAwesomeIcon icon={faHandshake} />
        {t('home.mock.accepted')}
      </p>
    </Frame>
  )
}

// 5. Muahida: milestones aur dono taraf ke dastakhat
function HiringMock() {
  const { t } = useTranslation()
  const milestones = [
    { label: t('home.mock.milestone1'), done: true },
    { label: t('home.mock.milestone2'), done: true },
    { label: t('home.mock.milestone3'), done: false },
  ]
  return (
    <Frame>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{t('home.mock.agreement')}</p>
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
          {t('home.mock.active')}
        </span>
      </div>
      <ol className="mt-4 space-y-2.5">
        {milestones.map((milestone) => (
          <li key={milestone.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                milestone.done ? 'bg-gray-900 text-white' : 'border-2 border-gray-300'
              }`}
            >
              {milestone.done && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
            </span>
            <span className={milestone.done ? 'text-gray-500 line-through' : ''}>{milestone.label}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 text-xs">
        {[t('home.mock.brand'), t('home.mock.talent')].map((side) => (
          <span key={side} className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-2">
            <FontAwesomeIcon icon={faFileSignature} className="text-green-700" />
            {t('home.mock.signedBy', { side })}
          </span>
        ))}
      </div>
    </Frame>
  )
}

const FEATURES: { key: FeatureKey; icon: IconDefinition; mock: () => ReactNode }[] = [
  { key: 'discovery', icon: faSliders, mock: () => <DiscoveryMock /> },
  { key: 'reach', icon: faChartColumn, mock: () => <ReachMock /> },
  { key: 'authenticity', icon: faShieldHalved, mock: () => <AuthenticityMock /> },
  { key: 'outreach', icon: faPaperPlane, mock: () => <OutreachMock /> },
  { key: 'hiring', icon: faFileSignature, mock: () => <HiringMock /> },
]

// Home page: platform kya karta hai, paanch hisson mein. Likhai aur tasveer baari baari daayen / baayen
function FeatureBlocks() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const links: Record<FeatureKey, string> = {
    discovery: '/search',
    reach: '/search?sort=followers',
    authenticity: '/search',
    outreach: user ? '/dashboard' : '/register',
    hiring: user ? '/dashboard' : '/register',
  }

  return (
    <section>
      <div className="text-center">
        <h2 className="text-xl font-semibold md:text-2xl">{t('home.featuresTitle')}</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-gray-500">{t('home.featuresSubtitle')}</p>
      </div>
      <div className="mt-10 space-y-16 md:space-y-24">
        {FEATURES.map((feature, i) => (
          <article
            key={feature.key}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
          >
            <div className={i % 2 === 1 ? 'md:order-2' : ''}>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white">
                  <FontAwesomeIcon icon={feature.icon} className="text-[11px]" />
                </span>
                {t(`home.features.${feature.key}.eyebrow`)}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                {t(`home.features.${feature.key}.title`)}
              </h3>
              <p className="mt-3 text-gray-600">{t(`home.features.${feature.key}.body`)}</p>
              <ul className="mt-5 space-y-2.5">
                {(['p1', 'p2', 'p3'] as const).map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 text-green-600" />
                    {t(`home.features.${feature.key}.${point}`)}
                  </li>
                ))}
              </ul>
              <Link
                to={links[feature.key]}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                {t(`home.features.${feature.key}.cta`)}
                <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
              </Link>
            </div>
            <div className={i % 2 === 1 ? 'md:order-1' : ''}>{feature.mock()}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureBlocks
