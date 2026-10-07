import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import type { AuditLogEntry } from '../../types/adminPanel'
import { formatDateTime } from '../../utils/adminFormat'
import AuditChanges from './AuditChanges'

// Audit log ki ek entry: kisne, kab, kis cheez pe aur kya badla
function ChangesDialog({ log, onClose }: { log: AuditLogEntry; onClose: () => void }) {
  const { t } = useTranslation()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="changes-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-gray-50 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 rounded-t-2xl border-b border-gray-200 bg-white p-5">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">{t(`auditTarget.${log.targetType}`)}</p>
            <h2 id="changes-title" className="truncate text-lg font-semibold">
              {log.targetLabel ?? log.targetId}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t(`auditAction.${log.action}`, { defaultValue: log.action })} ·{' '}
              {t('common.by', { name: log.actor?.name ?? log.actorEmail })}
            </p>
            <p className="text-xs text-gray-400">{formatDateTime(log.createdAt)}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t('audit.close')}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <AuditChanges log={log} />
        </div>
      </div>
    </div>
  )
}

export default ChangesDialog
