import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { saveMyManagerProfile } from '../../api/manager'
import { myManagerProfileQuery } from '../../api/queries'
import FormField from '../../components/FormField'
import { COUNTRY_OPTIONS } from '../../constants/people'
import type { ManagerInput, ManagerProfile } from '../../types/manager'
import { getApiError } from '../../utils/apiError'
import { countryName } from '../../utils/format'

const MAX_LINKS = 5
const selectClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900'

function toForm(manager: ManagerProfile | null): ManagerInput {
  return {
    agencyName: manager?.agencyName ?? '',
    websiteUrl: manager?.websiteUrl ?? '',
    country: manager?.country ?? 'PK',
    city: manager?.city ?? '',
    contactPhone: manager?.contactPhone ?? '',
    bio: manager?.bio ?? '',
    talentsCount: manager?.talentsCount !== undefined ? String(manager.talentsCount) : '',
    proofLinks: manager?.proofLinks.length ? manager.proofLinks : [''],
  }
}

// Form alag taake saved details aate hi un se shuru ho
function ManagerForm({ manager }: { manager: ManagerProfile | null }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ManagerInput>(() => toForm(manager))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = <K extends keyof ManagerInput>(key: K, value: ManagerInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const save = useMutation({
    mutationFn: () =>
      saveMyManagerProfile({
        agencyName: form.agencyName.trim() || undefined,
        websiteUrl: form.websiteUrl.trim(),
        country: form.country,
        city: form.city.trim() || undefined,
        contactPhone: form.contactPhone.trim(),
        bio: form.bio.trim() || undefined,
        talentsCount: form.talentsCount.trim() ? Number(form.talentsCount) : undefined,
        proofLinks: form.proofLinks.map((l) => l.trim()).filter(Boolean),
      }),
    onSuccess: (saved) => {
      queryClient.setQueryData(myManagerProfileQuery.queryKey, saved)
      const restarted = saved.status === 'pending' && manager?.status !== 'pending'
      toast.success(restarted ? t('manager.submitted') : t('manager.saved'))
      navigate('/dashboard')
    },
    onError: (error) => {
      const { message, fields } = getApiError(error)
      setErrors(fields)
      toast.error(message)
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate()
  }

  const setLink = (index: number, value: string) =>
    update(
      'proofLinks',
      form.proofLinks.map((link, i) => (i === index ? value : link)),
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      {manager?.status === 'approved' && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{t('manager.identityWarning')}</p>
      )}
      {manager?.status === 'rejected' && manager.rejectionReason && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t('manager.rejected', { reason: manager.rejectionReason })}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="agencyName"
          label={t('manager.fields.agencyName')}
          placeholder={t('manager.fields.agencyPlaceholder')}
          maxLength={120}
          value={form.agencyName}
          onChange={(e) => update('agencyName', e.target.value)}
          error={errors.agencyName}
        />
        <FormField
          id="websiteUrl"
          type="url"
          label={t('manager.fields.websiteUrl')}
          placeholder="https://linkedin.com/in/..."
          value={form.websiteUrl}
          onChange={(e) => update('websiteUrl', e.target.value)}
          error={errors.websiteUrl}
          required
        />
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{t('manager.fields.bio')}</span>
        <textarea
          rows={4}
          maxLength={1000}
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
          placeholder={t('manager.fields.bioPlaceholder')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="talentsCount"
          type="number"
          min={0}
          max={10000}
          label={t('manager.fields.talentsCount')}
          value={form.talentsCount}
          onChange={(e) => update('talentsCount', e.target.value)}
          error={errors.talentsCount}
        />
        <FormField
          id="contactPhone"
          type="tel"
          label={t('business.fields.contactPhone')}
          placeholder="+92 300 1234567"
          value={form.contactPhone}
          onChange={(e) => update('contactPhone', e.target.value)}
          error={errors.contactPhone}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('business.fields.country')}</span>
          <select value={form.country} onChange={(e) => update('country', e.target.value)} className={selectClass}>
            {COUNTRY_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {countryName(code)}
              </option>
            ))}
          </select>
        </label>
        <FormField
          id="city"
          label={t('business.fields.city')}
          value={form.city}
          onChange={(e) => update('city', e.target.value)}
          error={errors.city}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium">{t('business.fields.proofLinks')}</legend>
        <p className="mt-0.5 text-xs text-gray-500">{t('manager.fields.proofLinksHint')}</p>
        <div className="mt-2 space-y-2">
          {form.proofLinks.map((link, index) => (
            <div key={index}>
              <div className="flex gap-2">
                <input
                  type="url"
                  aria-label={t('business.fields.proofLinks')}
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(index, e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors[`proofLinks.${index}`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {form.proofLinks.length > 1 && (
                  <button
                    type="button"
                    aria-label={t('business.fields.removeLink')}
                    onClick={() =>
                      update(
                        'proofLinks',
                        form.proofLinks.filter((_, i) => i !== index),
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 text-gray-500 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              {errors[`proofLinks.${index}`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`proofLinks.${index}`]}</p>
              )}
            </div>
          ))}
        </div>
        {form.proofLinks.length < MAX_LINKS && (
          <button
            type="button"
            onClick={() => update('proofLinks', [...form.proofLinks, ''])}
            className="mt-2 inline-flex items-center gap-1.5 text-sm underline"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            {t('business.fields.addLink')}
          </button>
        )}
      </fieldset>

      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-5">
        <Link to="/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
          {t('common.cancel')}
        </Link>
        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {save.isPending
            ? t('common.saving')
            : manager && manager.status !== 'rejected'
              ? t('common.save')
              : t('manager.submit')}
        </button>
      </div>
    </form>
  )
}

// /dashboard/manager -> manager apni professional details tasdeeq ke liye bhejta hai
function ManagerProfileForm() {
  const { t } = useTranslation()
  const { data: manager, isLoading, isError } = useQuery(myManagerProfileQuery)

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm underline">
        <FontAwesomeIcon icon={faArrowLeft} className="rtl:rotate-180" />
        {t('site.backToDashboard')}
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{manager ? t('manager.editTitle') : t('manager.formTitle')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('manager.formSubtitle')}</p>
      </div>
      {isLoading && <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" />}
      {isError && manager === undefined && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t('common.error')}</p>
      )}
      {!isLoading && manager !== undefined && <ManagerForm manager={manager ?? null} />}
    </div>
  )
}

export default ManagerProfileForm
