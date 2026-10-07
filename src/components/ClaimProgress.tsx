import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { verifyClaimCode } from '../api/claims'
import type { Claim } from '../types/claim'
import { getApiError } from '../utils/apiError'

const STEPS = ['claimProgress.step1', 'claimProgress.step2', 'claimProgress.step3', 'claimProgress.step4']

function stepIndex(status: Claim['status']) {
  return { pending: 0, code_sent: 1, code_verified: 2, approved: 3, rejected: 0 }[status]
}

// Talent dashboard pe khule claim ki halat + code daalne ka box
function ClaimProgress({ claim }: { claim: Claim }) {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  // Page khulne ka waqt (render mein baar baar new Date() nahi)
  const [openedAt] = useState(() => Date.now())
  const current = stepIndex(claim.status)
  const expiresAt = claim.verification?.expiresAt ? new Date(claim.verification.expiresAt) : null
  const isExpired = expiresAt ? expiresAt.getTime() < openedAt : false

  const verify = useMutation({
    mutationFn: () => verifyClaimCode(claim._id, code),
    onMutate: () => setError(''),
    onSuccess: () => {
      toast.success(t('claimProgress.verifiedToast'))
      queryClient.invalidateQueries({ queryKey: ['claims'] })
    },
    onError: (err) => {
      const { message, fields } = getApiError(err)
      setError(fields.code ?? message)
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    verify.mutate()
  }

  return (
    <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
        {t('claimProgress.inProgress')}
      </p>
      <p className="mt-2">
        {t('claimProgress.claiming')}{' '}
        <Link to={`/people/${claim.person.slug}`} className="font-semibold underline">
          {claim.person.name}
        </Link>
      </p>

      {/* 4 qadam wali progress line */}
      <ol className="mt-4 grid grid-cols-4 gap-2">
        {STEPS.map((step, index) => (
          <li key={step} className="text-center">
            <div
              className={`h-1.5 rounded-full ${index <= current ? 'bg-gray-900' : 'bg-gray-200'}`}
            />
            <span
              className={`mt-1.5 block text-[11px] leading-tight sm:text-xs ${index <= current ? 'font-medium text-gray-900' : 'text-gray-400'}`}
            >
              {t(step)}
            </span>
          </li>
        ))}
      </ol>

      {claim.status === 'pending' && (
        <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          {t('claimProgress.pendingBody')}
        </p>
      )}

      {claim.status === 'code_sent' && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-gray-800">
            {t('claimProgress.sentBefore')}{' '}
            <a
              href={claim.verification?.channelUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="break-all font-medium underline"
            >
              {claim.verification?.channelUrl}
            </a>
            . {t('claimProgress.sentAfter')}
          </p>
          {isExpired ? (
            <p className="mt-3 text-sm text-red-700">
              {t('claimProgress.expired')}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap gap-2" noValidate>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                aria-label={t('claimProgress.codeLabel')}
                placeholder="______"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={`w-40 rounded-lg border bg-white px-3 py-2 text-center font-mono text-lg tracking-[0.4em] ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="submit"
                disabled={code.length !== 6 || verify.isPending}
                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {verify.isPending ? t('claimProgress.checking') : t('claimProgress.verify')}
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {expiresAt && !isExpired && (
            <p className="mt-2 text-xs text-gray-500">
              {t('claimProgress.expiresOn', { date: expiresAt.toLocaleString(i18n.language) })}
            </p>
          )}
        </div>
      )}

      {claim.status === 'code_verified' && (
        <p className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-800">
          <FontAwesomeIcon icon={faCircleCheck} className="me-1.5" />
          {t('claimProgress.verifiedBody')}
        </p>
      )}
    </section>
  )
}

export default ClaimProgress
