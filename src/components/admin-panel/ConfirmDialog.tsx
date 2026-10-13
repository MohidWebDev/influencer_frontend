import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children?: ReactNode
  confirmLabel?: string
  tone?: 'default' | 'danger' | 'success'
  isBusy?: boolean
  confirmDisabled?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const TONES = {
  default: 'bg-gray-900 hover:bg-gray-800',
  danger: 'bg-red-600 hover:bg-red-700',
  success: 'bg-green-600 hover:bg-green-700',
}

// Har khatarnak kaam se pehle "kya aap sure hain?"
function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  tone = 'default',
  isBusy,
  confirmDisabled,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null)
  // ✅ onCancel ko ref mein rakho taake effect uspar depend na kare
  const onCancelRef = useRef(onCancel)

  // ✅ Har render par latest onCancel update karo — bina effect trigger kiye
  useEffect(() => {
    onCancelRef.current = onCancel
  })

  // ✅ Effect sirf `open` par chale — `onCancel` par nahi
  useEffect(() => {
    if (!open) return

    // Focus: agar dialog ke andar textarea/input hai to usay focus do,
    // warna cancel button ko (default behaviour)
    const dialog = cancelRef.current?.closest('[role="dialog"]')
    const firstField = dialog?.querySelector<HTMLElement>('textarea, input')
    ;(firstField ?? cancelRef.current)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])   // ✅ sirf `open` — `onCancel` nahi

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="text-lg font-semibold">
          {title}
        </h2>
        {children && <div className="mt-3 text-sm text-gray-600">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isBusy || confirmDisabled}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${TONES[tone]}`}
          >
            {isBusy ? t('common.saving') : (confirmLabel ?? t('common.confirm'))}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog