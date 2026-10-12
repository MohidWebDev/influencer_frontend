import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import type { RepresentationPermissions } from '../../types/manager'

// Manager ko kya karne ki ijazat hai (har ijazat ek chip)
function PermissionChips({ permissions }: { permissions: RepresentationPermissions }) {
  const { t } = useTranslation()
  return (
    <span className="flex flex-wrap gap-1.5">
      {(['manageProfile', 'handleHires'] as const).map((key) => (
        <span
          key={key}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
            permissions[key] ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500 line-through'
          }`}
        >
          <FontAwesomeIcon icon={permissions[key] ? faCheck : faXmark} className="text-[10px]" />
          {t(`manager.permissions.${key}`)}
        </span>
      ))}
    </span>
  )
}

export default PermissionChips
