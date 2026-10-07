import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { faArrowUp, faEnvelope, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { CONTACT_EMAIL, PLATFORM_NAME, SOCIAL_LINKS } from '../constants/config'
import { useAuth } from '../hooks/useAuth'

const currentYear = new Date().getFullYear()

const SOCIALS: { key: keyof typeof SOCIAL_LINKS; label: string; icon: IconDefinition }[] = [
  { key: 'instagram', label: 'Instagram', icon: faInstagram },
  { key: 'x', label: 'X', icon: faXTwitter },
  { key: 'linkedin', label: 'LinkedIn', icon: faLinkedinIn },
  { key: 'youtube', label: 'YouTube', icon: faYoutube },
  { key: 'facebook', label: 'Facebook', icon: faFacebookF },
  { key: 'tiktok', label: 'TikTok', icon: faTiktok },
]

interface FooterLink {
  label: string
  to?: string
  href?: string
}

// Site ke neeche: brand, kaam ke links, social accounts aur copyright
function Footer() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t('footer.discover'),
      links: [
        { label: t('footer.explorePeople'), to: '/search' },
        { label: t('footer.browseIndustries'), to: '/browse' },
        { label: t('footer.mostFollowed'), to: '/search?sort=followers' },
      ],
    },
    {
      title: t('footer.forTalent'),
      links: user
        ? [
            { label: t('footer.dashboard'), to: user.role === 'admin' ? '/admin' : '/dashboard' },
            { label: t('footer.findYourProfile'), to: '/search' },
          ]
        : [
            { label: t('footer.claimProfile'), to: '/search' },
            { label: t('footer.createAccount'), to: '/register' },
            { label: t('footer.login'), to: '/login' },
          ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.about'), to: '/about' },
        { label: t('footer.contact'), href: `mailto:${CONTACT_EMAIL}` },
        { label: t('footer.reportProblem'), href: `mailto:${CONTACT_EMAIL}?subject=Report` },
      ],
    },
  ]

  const linkClass = 'text-sm text-gray-400 transition hover:text-white'

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand + paigham + social */}
          <div className="md:col-span-5">
            <Link to="/" className="text-xl font-bold text-white">
              {PLATFORM_NAME}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
              {t('footer.tagline')}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-300 ring-1 ring-white/10">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400" />
              {t('footer.trust')}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('footer.followUs')}>
              {SOCIALS.map((social) => (
                <li key={social.key}>
                  <a
                    href={SOCIAL_LINKS[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white hover:text-gray-950"
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <nav
            aria-label={t('footer.siteLinks')}
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link to={link.to} className={linkClass}>
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Email wali patti */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">{t('footer.contactTitle')}</p>
            <p className="mt-1 text-sm text-gray-400">{t('footer.contactBody')}</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span dir="ltr">{CONTACT_EMAIL}</span>
          </a>
        </div>

        {/* Copyright + upar jao */}
        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-500">
            © {currentYear} {PLATFORM_NAME}. {t('footer.rights')}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-xs text-gray-400 transition hover:text-white"
          >
            {t('footer.backToTop')}
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
