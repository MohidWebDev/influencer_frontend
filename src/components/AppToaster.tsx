import { Toaster, ToastBar, toast, type ToastType } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

// Har qism ke toast ka rang (icon ke peeche halka gol) aur kinare ki patti
const TONES: Partial<Record<ToastType, { badge: string; bar: string }>> = {
  success: { badge: 'bg-green-50 text-green-600', bar: 'bg-green-500' },
  error: { badge: 'bg-red-50 text-red-600', bar: 'bg-red-500' },
  loading: { badge: 'bg-gray-100 text-gray-600', bar: 'bg-gray-400' },
  blank: { badge: 'bg-blue-50 text-blue-600', bar: 'bg-blue-500' },
}

// Poori site ke toasts: hamare cards jaisa (safed, rounded, halka saya), Font Awesome icons,
// dark mode mein khud badalte hain (CSS variables)
function AppToaster() {
  const { t } = useTranslation()
  return (
    <Toaster
      position="bottom-right"
      gutter={10}
      containerStyle={{ inset: 16 }}
      toastOptions={{
        duration: 4000,
        success: { icon: <FontAwesomeIcon icon={faCircleCheck} /> },
        error: { icon: <FontAwesomeIcon icon={faCircleExclamation} />, duration: 5000 },
        loading: { icon: <FontAwesomeIcon icon={faSpinner} spinPulse /> },
        blank: { icon: <FontAwesomeIcon icon={faCircleInfo} /> },
        style: {
          background: 'var(--color-white)',
          color: 'var(--color-gray-900)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: '14px',
          boxShadow: '0 12px 32px -12px rgb(15 23 42 / 0.28), 0 2px 6px -2px rgb(15 23 42 / 0.08)',
          padding: '0',
          maxWidth: '420px',
          overflow: 'hidden',
          fontSize: '14px',
        },
      }}
    >
      {(item) => (
        <ToastBar toast={item}>
          {({ icon, message }) => {
            const tone = TONES[item.type] ?? TONES.blank!
            return (
              <div className="relative flex w-full items-start gap-3 py-3 ps-4 pe-2">
                <span className={`absolute inset-y-0 start-0 w-1 ${tone.bar}`} aria-hidden="true" />
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${tone.badge}`}
                >
                  {icon}
                </span>
                {/* react-hot-toast ka message apna div deta hai: margin hata do */}
                <div className="min-w-0 flex-1 self-center leading-snug [&>div]:m-0! [&>div]:justify-start! [&>div]:text-start!">
                  {message}
                </div>
                {item.type !== 'loading' && (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(item.id)}
                    aria-label={t('settings.close')}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-sm" />
                  </button>
                )}
              </div>
            )
          }}
        </ToastBar>
      )}
    </Toaster>
  )
}

export default AppToaster
