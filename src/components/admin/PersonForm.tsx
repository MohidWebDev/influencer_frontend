import { useTranslation } from 'react-i18next'
import { useState, type FormEvent } from 'react'
import FormField from '../FormField'
import TaxonomyPicker from './TaxonomyPicker'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  PLATFORM_LABELS,
  STATUS_LABELS,
} from '../../constants/people'
import { useTaxonomy } from '../../hooks/useTaxonomy'
import type { PersonInput } from '../../types/admin'
import type { Person, ProfileStatus, SocialPlatform } from '../../types/person'
import { countryName, languageName } from '../../utils/format'

const SOURCE_TYPES = ['public_web', 'research_sheet', 'self_submitted', 'admin']

// Form ke andar sab kuch string mein rakhte hain (inputs strings dete hain)
interface SocialRow {
  platform: SocialPlatform
  url: string
  handle: string
  followers: string
  engagementRate: string
}

interface FormState {
  name: string
  headline: string
  bio: string
  photoUrl: string
  websiteUrl: string
  country: string
  city: string
  languages: string[]
  professions: string[]
  industries: string[]
  topics: string[]
  socialAccounts: SocialRow[]
  status: ProfileStatus
  verified: boolean
  visibility: 'visible' | 'hidden'
  sourceType: string
  sourceUrl: string
  sourceNote: string
}

function toFormState(person?: Person): FormState {
  return {
    name: person?.name ?? '',
    headline: person?.headline ?? '',
    bio: person?.bio ?? '',
    photoUrl: person?.photoUrl ?? '',
    websiteUrl: person?.websiteUrl ?? '',
    country: person?.country ?? 'PK',
    city: person?.city ?? '',
    languages: person?.languages ?? [],
    professions: person?.professions.map((t) => t.slug) ?? [],
    industries: person?.industries.map((t) => t.slug) ?? [],
    topics: person?.topics.map((t) => t.slug) ?? [],
    socialAccounts:
      person?.socialAccounts.map((a) => ({
        platform: a.platform,
        url: a.url,
        handle: a.handle ?? '',
        followers: a.followers?.toString() ?? '',
        engagementRate: a.engagementRate?.toString() ?? '',
      })) ?? [],
    status: person?.status ?? 'public',
    verified: person?.verified ?? false,
    visibility: person?.visibility ?? 'visible',
    sourceType: 'public_web',
    sourceUrl: '',
    sourceNote: '',
  }
}

// Form ki strings ko backend wali shakal mein badlo
function toInput(form: FormState, isNew: boolean, isOwner: boolean): PersonInput {
  const input: PersonInput = {
    headline: form.headline,
    bio: form.bio,
    photoUrl: form.photoUrl,
    websiteUrl: form.websiteUrl,
    city: form.city,
    languages: form.languages,
    professions: form.professions,
    industries: form.industries,
    topics: form.topics,
    socialAccounts: form.socialAccounts.map((row) => ({
      platform: row.platform,
      url: row.url.trim(),
      handle: row.handle.trim() || undefined,
      followers: row.followers ? Number(row.followers) : undefined,
      engagementRate: row.engagementRate ? Number(row.engagementRate) : undefined,
    })),
  }
  if (form.country) input.country = form.country

  // Owner sirf apne fields bhejta hai. Naam, state, verified admin ka kaam hai
  if (isOwner) return input

  input.name = form.name
  input.status = form.status
  input.verified = form.verified

  if (isNew) {
    input.sourceRecords = [
      {
        sourceType: form.sourceType,
        url: form.sourceUrl.trim() || undefined,
        note: form.sourceNote.trim() || undefined,
      },
    ]
  } else {
    input.visibility = form.visibility
  }
  return input
}

interface PersonFormProps {
  person?: Person
  // 'owner' = talent apni profile edit kar raha hai
  mode?: 'admin' | 'owner'
  isSaving: boolean
  errors: Record<string, string>
  onSubmit: (input: PersonInput) => void
}

const selectClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'
const sectionClass = 'space-y-4 rounded-2xl bg-white p-6 shadow-sm'

function PersonForm({ person, mode = 'admin', isSaving, errors, onSubmit }: PersonFormProps) {
  const { t } = useTranslation()
  const isNew = !person
  const isOwner = mode === 'owner'
  const [form, setForm] = useState<FormState>(() => toFormState(person))
  const { data: professions = [] } = useTaxonomy('professions')
  const { data: industries = [] } = useTaxonomy('industries')
  const { data: topics = [] } = useTaxonomy('topics')

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateSocial(index: number, patch: Partial<SocialRow>) {
    update(
      'socialAccounts',
      form.socialAccounts.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    )
  }

  function toggleLanguage(code: string) {
    update(
      'languages',
      form.languages.includes(code)
        ? form.languages.filter((c) => c !== code)
        : [...form.languages, code],
    )
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit(toInput(form, isNew, isOwner))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className={sectionClass}>
        <h2 className="text-lg font-semibold">{t('personForm.identity')}</h2>
        {isOwner ? (
          <div>
            <span className="mb-1 block text-sm font-medium">{t('personForm.fullName')}</span>
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-700">{form.name}</p>
            <p className="mt-1 text-xs text-gray-500">{t('personForm.nameSupport')}</p>
          </div>
        ) : (
          <FormField
            id="name"
            label={t('personForm.fullNameRequired')}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
          />
        )}
        <FormField
          id="headline"
          label={t('personForm.headline')}
          placeholder={t('personForm.headlinePlaceholder')}
          value={form.headline}
          onChange={(e) => update('headline', e.target.value)}
          error={errors.headline}
        />
        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium">
            {t('personForm.bio')}
          </label>
          <textarea
            id="bio"
            rows={5}
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
        </div>
        <FormField
          id="photoUrl"
          label={t('personForm.photoUrl')}
          placeholder="https://..."
          value={form.photoUrl}
          onChange={(e) => update('photoUrl', e.target.value)}
          error={errors.photoUrl}
        />
        <FormField
          id="websiteUrl"
          label={t('personForm.website')}
          placeholder="https://..."
          value={form.websiteUrl}
          onChange={(e) => update('websiteUrl', e.target.value)}
          error={errors.websiteUrl}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('personForm.country')}</span>
            <select
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              className={selectClass}
            >
              {COUNTRY_OPTIONS.map((code) => (
                <option key={code} value={code}>
                  {countryName(code)}
                </option>
              ))}
            </select>
          </label>
          <FormField
            id="city"
            label={t('personForm.city')}
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            error={errors.city}
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('personForm.languages')}</legend>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((code) => (
              <label
                key={code}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${form.languages.includes(code) ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.languages.includes(code)}
                  onChange={() => toggleLanguage(code)}
                />
                {languageName(code)}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold">{t('personForm.categories')}</h2>
        <TaxonomyPicker
          label={t('personForm.professions')}
          items={professions}
          selected={form.professions}
          onChange={(v) => update('professions', v)}
          error={errors.professions}
        />
        <TaxonomyPicker
          label={t('personForm.industries')}
          items={industries}
          selected={form.industries}
          onChange={(v) => update('industries', v)}
          error={errors.industries}
        />
        <TaxonomyPicker
          label={t('personForm.topics')}
          items={topics}
          selected={form.topics}
          onChange={(v) => update('topics', v)}
          error={errors.topics}
        />
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('personForm.social')}</h2>
          <button
            type="button"
            onClick={() =>
              update('socialAccounts', [
                ...form.socialAccounts,
                { platform: 'instagram', url: '', handle: '', followers: '', engagementRate: '' },
              ])
            }
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            {t('personForm.addAccount')}
          </button>
        </div>
        {form.socialAccounts.length === 0 && (
          <p className="text-sm text-gray-500">{t('personForm.noSocial')}</p>
        )}
        {form.socialAccounts.map((row, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2"
          >
            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('personForm.platform')}</span>
              <select
                value={row.platform}
                onChange={(e) =>
                  updateSocial(index, { platform: e.target.value as SocialPlatform })
                }
                className={selectClass}
              >
                {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <FormField
              id={`social-url-${index}`}
              label={t('personForm.profileUrl')}
              placeholder="https://..."
              value={row.url}
              onChange={(e) => updateSocial(index, { url: e.target.value })}
              error={errors[`socialAccounts.${index}.url`]}
            />
            <FormField
              id={`social-handle-${index}`}
              label={t('personForm.handle')}
              placeholder="@name"
              value={row.handle}
              onChange={(e) => updateSocial(index, { handle: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id={`social-followers-${index}`}
                label={t('personForm.followers')}
                type="number"
                min={0}
                value={row.followers}
                onChange={(e) => updateSocial(index, { followers: e.target.value })}
                error={errors[`socialAccounts.${index}.followers`]}
              />
              <FormField
                id={`social-eng-${index}`}
                label={t('personForm.engagement')}
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={row.engagementRate}
                onChange={(e) => updateSocial(index, { engagementRate: e.target.value })}
                error={errors[`socialAccounts.${index}.engagementRate`]}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                update(
                  'socialAccounts',
                  form.socialAccounts.filter((_, i) => i !== index),
                )
              }
              className="justify-self-start text-sm text-red-600 hover:underline"
            >
              {t('personForm.removeAccount')}
            </button>
          </div>
        ))}
      </section>

      {!isOwner && (
        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">{t('personForm.adminSettings')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('personForm.profileState')}</span>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as ProfileStatus)}
                className={selectClass}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {!isNew && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('personForm.visibility')}</span>
                <select
                  value={form.visibility}
                  onChange={(e) => update('visibility', e.target.value as 'visible' | 'hidden')}
                  className={selectClass}
                >
                  <option value="visible">{t('personForm.visible')}</option>
                  <option value="hidden">{t('personForm.hiddenOpt')}</option>
                </select>
              </label>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => update('verified', e.target.checked)}
              className="h-4 w-4"
            />
            {t('personForm.verified')}
          </label>
        </section>
      )}

      {/* Document ka rule: har profile ke saath likha ho ke maloomat kahan se aayi */}
      {isNew && (
        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">{t('personForm.source')}</h2>
          <p className="text-sm text-gray-500">
            {t('personForm.sourceHelp')}
          </p>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('personForm.sourceType')}</span>
            <select
              value={form.sourceType}
              onChange={(e) => update('sourceType', e.target.value)}
              className={selectClass}
            >
              {SOURCE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {t(`personForm.src.${s}`)}
                </option>
              ))}
            </select>
          </label>
          <FormField
            id="sourceUrl"
            label={t('personForm.sourceUrl')}
            placeholder="https://..."
            value={form.sourceUrl}
            onChange={(e) => update('sourceUrl', e.target.value)}
            error={errors['sourceRecords.0.url']}
          />
          <FormField
            id="sourceNote"
            label={t('personForm.note')}
            placeholder={t('personForm.notePlaceholder')}
            value={form.sourceNote}
            onChange={(e) => update('sourceNote', e.target.value)}
          />
        </section>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSaving ? t('common.saving') : isNew ? t('personForm.create') : t('personForm.saveChanges')}
      </button>
    </form>
  )
}

export default PersonForm
