import { useTranslation } from 'react-i18next'
import type { Campaign } from '../../types/campaign'

// Budget aur tareekh chuni hui zaban mein
export function useCampaignFormat() {
  const { i18n } = useTranslation()
  return {
    budget: (campaign: Pick<Campaign, 'budget'>) =>
      campaign.budget
        ? new Intl.NumberFormat(i18n.language, {
            style: 'currency',
            currency: campaign.budget.currency,
            maximumFractionDigits: 0,
          }).format(campaign.budget.amount)
        : null,
    date: (iso?: string) =>
      iso
        ? new Date(iso).toLocaleDateString(i18n.language, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : null,
  }
}
