import { useTranslation } from 'react-i18next'
import type { RepresentationPermissions } from '../../types/manager'

// Talent chunta hai manager kya kar sake (har ijazat ek checkbox, saath mein matlab)
function PermissionPicker({
  value,
  onChange,
}: {
  value: RepresentationPermissions
  onChange: (next: RepresentationPermissions) => void
}) {
  const { t } = useTranslation()
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-sm font-medium">{t('manager.whatCanTheyDo')}</legend>
      {(['handleHires', 'manageProfile'] as const).map((key) => (
        <label
          key={key}
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
            value[key] ? 'border-gray-900' : 'border-gray-200'
          }`}
        >
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-medium">{t(`manager.permissions.${key}`)}</span>
            <span className="block text-xs text-gray-500">{t(`manager.permissionHelp.${key}`)}</span>
          </span>
        </label>
      ))}
      <p className="text-xs text-gray-500">{t('manager.signingNote')}</p>
    </fieldset>
  )
}

export default PermissionPicker
