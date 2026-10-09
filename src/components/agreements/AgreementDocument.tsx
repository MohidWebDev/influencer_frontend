import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PLATFORM_NAME } from '../../constants/config'
import type { Agreement, AgreementParty } from '../../types/agreement'
import { formatDate, formatDateTime } from '../../utils/adminFormat'
import TermsView from './TermsView'

// Print / "Save as PDF" ke liye rasmi dastaavez. Screen pe chhupi, print pe sirf yahi
function AgreementDocument({ agreement }: { agreement: Agreement }) {
  const { t } = useTranslation()
  // Print ka din (render mein baar baar new Date() nahi)
  const [printedOn] = useState(() => new Date().toISOString())
  const parties: { side: AgreementParty; name?: string; detail?: string }[] = [
    {
      side: 'business',
      name: agreement.businessProfile?.companyName,
      detail: agreement.business ? `${agreement.business.name} · ${agreement.business.email}` : undefined,
    },
    {
      side: 'talent',
      name: agreement.person?.name,
      detail: agreement.talent ? `${agreement.talent.name} · ${agreement.talent.email}` : undefined,
    },
  ]

  return (
    <article className="print-document hidden bg-white text-gray-900 print:block">
      <header className="border-b border-gray-300 pb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">{PLATFORM_NAME}</p>
        <h1 className="mt-1 text-2xl font-bold">{agreement.terms.title}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('agreements.print.reference', { id: agreement._id, version: agreement.version })}
        </p>
      </header>

      <section className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {parties.map((party) => (
          <div key={party.side}>
            <p className="text-xs uppercase text-gray-500">{t(`agreements.party.${party.side}`)}</p>
            <p className="font-semibold">{party.name ?? '—'}</p>
            {party.detail && <p className="text-gray-600">{party.detail}</p>}
          </div>
        ))}
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">{t('agreements.terms')}</h2>
        <TermsView terms={agreement.terms} />
      </section>

      <section className="mt-6 break-inside-avoid">
        <h2 className="mb-2 text-lg font-semibold">{t('agreements.print.signedBy')}</h2>
        <table className="w-full text-sm">
          <tbody>
            {parties.map((party) => {
              const signature = agreement.signatures[party.side]
              const valid = signature?.version === agreement.version
              return (
                <tr key={party.side} className="border-t border-gray-200">
                  <td className="py-2 pe-4 font-medium">{t(`agreements.party.${party.side}`)}</td>
                  <td className="py-2">
                    {valid
                      ? t('agreements.print.signature', {
                          name: signature.name,
                          email: signature.email,
                          date: formatDateTime(signature.signedAt),
                        })
                      : t('agreements.notSigned')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {agreement.signedHash && (
          <p className="mt-3 break-all text-xs text-gray-600">
            {t('agreements.fingerprint')}: <span className="font-mono">{agreement.signedHash}</span>
          </p>
        )}
        <p className="mt-3 text-xs text-gray-500">
          {t('agreements.print.footer', {
            platform: PLATFORM_NAME,
            date: formatDate(printedOn),
          })}
        </p>
      </section>
    </article>
  )
}

export default AgreementDocument
