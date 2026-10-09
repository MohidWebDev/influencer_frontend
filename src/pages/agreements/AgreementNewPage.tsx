import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { createAgreement } from '../../api/agreements'
import { myHiresQuery } from '../../api/queries'
import TermsForm from '../../components/agreements/TermsForm'
import type { AgreementTerms } from '../../types/agreement'
import type { HireRequest } from '../../types/business'
import { getApiError } from '../../utils/apiError'

// Hire request se pehle se bhari shartein (business baad mein badal sakta hai)
function startingTerms(hire: HireRequest): AgreementTerms {
  return {
    title: hire.title,
    scope: hire.message,
    currency: hire.budget?.currency ?? 'PKR',
    milestones: [
      {
        title: hire.serviceTitle ?? hire.title,
        amount: hire.budget?.amount ?? 0,
        dueDate: hire.startDate,
      },
    ],
    revisions: 2,
  }
}

// /agreements/new?hire=ID -> business accept hui hire request se muahida banata hai
function AgreementNewPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const hireId = params.get('hire') ?? ''
  const { data: hires, isLoading } = useQuery(myHiresQuery)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const hire = hires?.find((h) => h._id === hireId)

  const create = useMutation({
    mutationFn: (terms: AgreementTerms) => createAgreement(hireId, terms),
    onMutate: () => setErrors({}),
    onSuccess: (agreement) => {
      toast.success(t('agreements.created'))
      queryClient.invalidateQueries({ queryKey: ['agreements'] })
      queryClient.invalidateQueries({ queryKey: myHiresQuery.queryKey })
      navigate(`/agreements/${agreement._id}`)
    },
    onError: (error) => {
      const { message, fields } = getApiError(error)
      // Backend "terms.title" bhejta hai, form "title" samajhta hai
      setErrors(Object.fromEntries(Object.entries(fields).map(([k, v]) => [k.replace(/^terms\./, ''), v])))
      toast.error(message)
    },
  })

  if (isLoading) return <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-white shadow-sm" />
  // Muahida pehle se hai to wahin le jao
  if (hire?.agreement) return <Navigate to={`/agreements/${hire.agreement}`} replace />

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm underline">
        <FontAwesomeIcon icon={faArrowLeft} className="rtl:rotate-180" />
        {t('site.backToDashboard')}
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{t('agreements.newTitle')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {hire?.person
            ? t('agreements.newSubtitle', { name: hire.person.name })
            : t('agreements.newSubtitleGeneric')}
        </p>
      </div>
      {!hire || hire.status !== 'accepted' ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t('agreements.hireNotReady')}
        </p>
      ) : (
        <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
          <TermsForm
            initial={startingTerms(hire)}
            errors={errors}
            isSaving={create.isPending}
            submitLabel={t('agreements.sendToTalent')}
            onSubmit={(terms) => create.mutate(terms)}
            onCancel={() => navigate('/dashboard')}
          />
        </div>
      )}
    </div>
  )
}

export default AgreementNewPage
