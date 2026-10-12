import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassHalf, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { requestRepresentation } from '../../api/manager'
import { myManagerProfileQuery, myRepresentationsQuery, myTalentsQuery } from '../../api/queries'
import { useAuth } from '../../hooks/useAuth'
import ConfirmDialog from '../admin-panel/ConfirmDialog'
import type { Person } from '../../types/person'
import { getApiError } from '../../utils/apiError'

const outline =
  'inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm hover:bg-gray-100'

// Profile page: verified manager talent ko represent karne ki darkhwast bheje (talent haan karega)
function RepresentAction({ person }: { person: Person }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isManager = user?.role === 'representative'
  const manager = useQuery({ ...myManagerProfileQuery, enabled: isManager })
  const talents = useQuery({ ...myTalentsQuery, enabled: isManager })
  const reps = useQuery({ ...myRepresentationsQuery, enabled: isManager })
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const send = useMutation({
    mutationFn: () => requestRepresentation(person._id, message.trim() || undefined),
    onSuccess: () => {
      toast.success(t('manager.requestSent'))
      setOpen(false)
      setMessage('')
      queryClient.invalidateQueries({ queryKey: ['manager'] })
    },
    onError: (error) => {
      toast.error(getApiError(error).message)
      setOpen(false)
    },
  })

  // Sirf manager accounts, aur sirf woh talent jo platform pe hai (claimed)
  if (!isManager || !person.claimedBy) return null

  if (talents.data?.some((talent) => talent.person._id === person._id)) {
    return (
      <Link to={`/talents/${person._id}`} className={outline}>
        <FontAwesomeIcon icon={faUserTie} />
        {t('manager.youRepresent')}
      </Link>
    )
  }
  if (reps.data?.some((rep) => rep.person?._id === person._id && rep.status === 'requested')) {
    return (
      <span className={`${outline} cursor-default text-gray-500 hover:bg-transparent`}>
        <FontAwesomeIcon icon={faHourglassHalf} />
        {t('manager.requestPending')}
      </span>
    )
  }
  // Kisi aur ka talent: ek waqt mein ek manager
  if (person.representedBy) return null
  if (manager.data?.status !== 'approved') {
    return (
      <Link to="/dashboard/manager" title={t('manager.verifyFirst')} className={`${outline} text-gray-500`}>
        <FontAwesomeIcon icon={faUserTie} />
        {t('manager.verifyToRepresent')}
      </Link>
    )
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={outline}>
        <FontAwesomeIcon icon={faUserTie} />
        {t('manager.requestToRepresent')}
      </button>
      <ConfirmDialog
        open={open}
        title={t('manager.requestTitle', { name: person.name })}
        confirmLabel={t('manager.sendRequest')}
        isBusy={send.isPending}
        onConfirm={() => send.mutate()}
        onCancel={() => setOpen(false)}
      >
        <p>{t('manager.requestBody', { name: person.name })}</p>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium text-gray-900">{t('manager.messageOptional')}</span>
          <textarea
            rows={3}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('manager.requestPlaceholder')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
      </ConfirmDialog>
    </>
  )
}

export default RepresentAction
