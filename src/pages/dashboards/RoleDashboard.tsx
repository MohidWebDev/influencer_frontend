import { useTranslation } from 'react-i18next'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCalendarCheck,
  faEnvelopeOpenText,
  faFileContract,
  faFileInvoiceDollar,
  faMagnifyingGlass,
  faMicrophone,
  faStar,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import DashboardHeader from '../../components/DashboardHeader'
import MyProfileSection from '../../components/MyProfileSection'
import BusinessVerificationSection from '../../components/business/BusinessVerificationSection'
import IncomingHireRequests from '../../components/business/IncomingHireRequests'
import SentHireRequests from '../../components/business/SentHireRequests'
import type { SignupRole } from '../../types/user'

interface DashboardCard {
  icon: IconDefinition
  title: string
  description: string
  // Link ho to button chalega, warna "Coming soon"
  action?: { label: string; to: string }
}

interface RoleConfig {
  title: string
  subtitle: string
  cards: DashboardCard[]
}

const EXPLORE: DashboardCard = {
  icon: faMagnifyingGlass,
  title: 'dash.discover.title',
  description:
    'dash.discover.description',
  action: { label: 'dash.discover.action', to: '/search' },
}

// Har account type ka apna dashboard. Features aage ke phases mein judenge
const ROLE_DASHBOARDS: Record<SignupRole, RoleConfig> = {
  talent: {
    title: 'dash.talent.title',
    subtitle: 'dash.talent.subtitle',
    cards: [
      {
        icon: faFileInvoiceDollar,
        title: 'dash.services.title',
        description: 'dash.services.description',
        action: { label: 'dash.services.action', to: '/dashboard/services' },
      },
      {
        icon: faCalendarCheck,
        title: 'dash.availability.title',
        description: 'dash.availability.description',
        // Availability bhi services wale page pe hi set hoti hai
        action: { label: 'dash.availability.action', to: '/dashboard/services' },
      },
      {
        icon: faFileContract,
        title: 'dash.agreements.title',
        description: 'dash.agreements.talentDescription',
        action: { label: 'dash.agreements.action', to: '/agreements' },
      },
    ],
  },
  representative: {
    title: 'dash.representative.title',
    subtitle: 'dash.representative.subtitle',
    cards: [
      {
        icon: faUsers,
        title: 'dash.yourTalents.title',
        description: 'dash.yourTalents.description',
      },
      {
        icon: faEnvelopeOpenText,
        title: 'dash.inquiries.title',
        description: 'dash.repInquiries.description',
      },
      EXPLORE,
    ],
  },
  business: {
    title: 'dash.business.title',
    subtitle: 'dash.business.subtitle',
    cards: [
      EXPLORE,
      {
        icon: faStar,
        title: 'dash.shortlists.title',
        description: 'dash.shortlists.businessDescription',
        action: { label: 'dash.shortlists.action', to: '/shortlists' },
      },
      {
        icon: faFileContract,
        title: 'dash.agreements.title',
        description: 'dash.agreements.businessDescription',
        action: { label: 'dash.agreements.action', to: '/agreements' },
      },
    ],
  },
  agency: {
    title: 'dash.agency.title',
    subtitle: 'dash.agency.subtitle',
    cards: [
      EXPLORE,
      {
        icon: faStar,
        title: 'dash.shortlists.title',
        description: 'dash.shortlists.agencyDescription',
        action: { label: 'dash.shortlists.action', to: '/shortlists' },
      },
      {
        icon: faEnvelopeOpenText,
        title: 'dash.sentInquiries.title',
        description: 'dash.sentInquiries.agencyDescription',
      },
    ],
  },
  organization: {
    title: 'dash.organization.title',
    subtitle: 'dash.organization.subtitle',
    cards: [
      EXPLORE,
      {
        icon: faMicrophone,
        title: 'dash.eventRequests.title',
        description: 'dash.eventRequests.description',
      },
      {
        icon: faStar,
        title: 'dash.shortlists.title',
        description: 'dash.shortlists.orgDescription',
        action: { label: 'dash.shortlists.action', to: '/shortlists' },
      },
    ],
  },
}

function RoleDashboard({ role }: { role: SignupRole }) {
  const { t } = useTranslation()
  const config = ROLE_DASHBOARDS[role]

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {role === 'talent' && <MyProfileSection />}
      {/* Hire requests jaldi dikhen: talent ko jawab dena hota hai */}
      {role === 'talent' && <IncomingHireRequests />}
      {role === 'business' && <BusinessVerificationSection />}

      <div>
        <h2 className="text-lg font-semibold">{t(config.title)}</h2>
        <p className="text-sm text-gray-500">{t(config.subtitle)}</p>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 ${config.cards.length === 3 ? 'lg:grid-cols-3' : ''}`}>
        {config.cards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FontAwesomeIcon icon={card.icon} />
              </span>
              {!card.action && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                  {t('dash.comingSoon')}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-semibold">{t(card.title)}</h3>
            <p className="mt-1 flex-1 text-sm text-gray-600">{t(card.description)}</p>
            {card.action && (
              <Link
                to={card.action.to}
                className="mt-4 self-start rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                {t(card.action.label)}{' '}
                <FontAwesomeIcon icon={faArrowRight} className="ms-1 rtl:rotate-180" />
              </Link>
            )}
          </article>
        ))}
      </div>

      {/* Business ki bheji hui hire requests */}
      {role === 'business' && <SentHireRequests />}
    </div>
  )
}

export default RoleDashboard
