import { useTranslation } from 'react-i18next'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FormField from '../components/FormField'
import { SIGNUP_ROLE_OPTIONS } from '../constants/roles'
import { COMPANY_SIZES, type CompanySize } from '../types/business'
import { useAuth } from '../hooks/useAuth'
import type { SignupRole } from '../types/user'
import { getApiError } from '../utils/apiError'

function Register() {
  const { t } = useTranslation()
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SignupRole | ''>('')
  // Business: naam ki jagah company ki details
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState<CompanySize | ''>('')
  const [description, setDescription] = useState('')
  const isBusiness = role === 'business'
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    if (!role) {
      setErrors({ role: t('register.chooseType') })
      return
    }

    setIsSubmitting(true)
    try {
      const created = await register(
        isBusiness
          ? { email, password, role, companyName, industry, companySize, description }
          : { name, email, password, role },
      )
      toast.success(t('register.welcome', { name: created.name }))
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const { message, fields } = getApiError(error)
      setErrors(fields)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-bold">{t('register.title')}</h1>
      <p className="mt-1 text-sm text-gray-500">{t('register.subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('register.iAm')}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {SIGNUP_ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  role === option.value
                    ? 'border-gray-900 ring-2 ring-gray-900'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="sr-only"
                />
                <span className="block font-medium">{option.label}</span>
                <span className="mt-1 block text-sm text-gray-500">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
        </fieldset>

        <div className="space-y-4">
          {isBusiness ? (
            <>
              {/* Business: company ki details. Account ka naam company ka naam hoga */}
              <p className="text-sm font-medium">{t('register.aboutCompany')}</p>
              <FormField
                id="companyName"
                label={t('business.fields.companyName')}
                autoComplete="organization"
                maxLength={120}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={errors.companyName}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="industry"
                  label={t('business.fields.industry')}
                  placeholder={t('business.fields.industryPlaceholder')}
                  maxLength={80}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  error={errors.industry}
                />
                <div>
                  <label htmlFor="companySize" className="mb-1 block text-sm font-medium">
                    {t('business.fields.companySize')}
                  </label>
                  <select
                    id="companySize"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value as CompanySize | '')}
                    className={`w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 ${
                      errors.companySize ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('business.fields.chooseSize')}</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {t('business.fields.employees', { size })}
                      </option>
                    ))}
                  </select>
                  {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">
                  {t('business.fields.description')}
                </label>
                <textarea
                  id="description"
                  rows={3}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('business.fields.descriptionPlaceholder')}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              <p className="border-t border-gray-100 pt-4 text-sm font-medium">{t('register.loginDetails')}</p>
            </>
          ) : (
            <FormField
              id="name"
              label={t('register.fullName')}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />
          )}
          <FormField
            id="email"
            label={isBusiness ? t('register.workEmail') : t('login.email')}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />
          <FormField
            id="password"
            label={t('login.password')}
            type="password"
            autoComplete="new-password"
            placeholder={t('register.passwordHint')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {isSubmitting ? t('register.submitting') : t('register.submit')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t('register.haveAccount')}{' '}
        <Link to="/login" className="font-medium text-gray-900 underline">
          {t('register.login')}
        </Link>
      </p>
    </section>
  )
}

export default Register
