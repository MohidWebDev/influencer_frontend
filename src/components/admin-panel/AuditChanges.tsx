import { useTranslation } from 'react-i18next'
import type { AuditLogEntry } from '../../types/adminPanel'
import { formatDateTime } from '../../utils/adminFormat'
import { countryName, formatCount, languageName } from '../../utils/format'

type Plain = Record<string, unknown>

// Andaruni fields jo admin ke kaam ke nahi (ya chhupane wale)
const HIDDEN_KEYS = new Set([
  '_id',
  'id',
  '__v',
  'createdAt',
  'updatedAt',
  'codeHash',
  'password',
  'tokenVersion',
  'isDemo',
])

const isPlain = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)
const OBJECT_ID = /^[a-f0-9]{24}$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

// Ek field ki ek value: compare karne ke liye "key", dikhane ke liye "text"
interface Shown {
  key: string
  text: string
}

// Populated objects (taxonomy, user) se id -> naam ki list, taake sirf id wali
// "pehle" ki halat mein bhi naam dikhe
function collectNames(value: unknown, names: Map<string, string>) {
  if (Array.isArray(value)) value.forEach((item) => collectNames(item, names))
  else if (isPlain(value)) {
    if (typeof value._id === 'string' && (value.name || value.email)) {
      names.set(value._id, String(value.name ?? value.email))
    }
    Object.values(value).forEach((item) => collectNames(item, names))
  }
}

// Snapshot ko "field -> value" ki flat list mein badlo (sirf ek level nested)
function flatten(snapshot: unknown, prefix = ''): Map<string, unknown> {
  const out = new Map<string, unknown>()
  if (!isPlain(snapshot)) return out
  for (const [key, value] of Object.entries(snapshot)) {
    if (HIDDEN_KEYS.has(key)) continue
    const path = prefix ? `${prefix}.${key}` : key
    // Nested object (jaise verification, evidence) ke andar ke fields alag dikhao,
    // lekin populated cheezein (naam wali) ek hi value hain
    if (isPlain(value) && !prefix && !('name' in value) && !('email' in value)) {
      for (const [k, v] of flatten(value, path)) out.set(k, v)
    } else out.set(path, value)
  }
  return out
}

function useFormatter(targetType: AuditLogEntry['targetType'], names: Map<string, string>) {
  const { t } = useTranslation()

  // Status / role jaise codes ko unke label mein badlo
  function label(field: string, value: string) {
    const last = field.split('.').pop()
    const groups: Record<string, string | undefined> = {
      status: {
        person: 'profileStatus',
        claim: 'claimStatus',
        report: 'reportStatus',
        user: 'users',
        business: 'businessStatus',
        agreement: 'agreementStatus',
        manager: 'managerStatus',
      }[targetType],
      role: 'roles',
      platform: 'platform',
      reason: targetType === 'report' ? 'reportReason' : undefined,
    }
    if (last === 'country') return countryName(value)
    if (last === 'visibility' || last === 'verificationMethod') {
      return t(`audit.values.${value}`, { defaultValue: value })
    }
    const group = last ? groups[last] : undefined
    if (group) return t(`${group}.${value}`, { defaultValue: value })
    if (names.has(value)) return names.get(value)!
    if (/^report [a-f0-9]{24}$/.test(value)) return t('audit.values.fromReport')
    // Anjaan id: poori lambi id ki jagah chhota sa hawala
    if (OBJECT_ID.test(value)) return `#${value.slice(-6)}`
    if (ISO_DATE.test(value)) return formatDateTime(value)
    return value
  }

  function one(field: string, value: unknown): Shown {
    if (isEmpty(value)) return { key: '', text: '—' }
    if (typeof value === 'boolean') {
      return {
        key: String(value),
        text: value ? t('audit.values.yes') : t('audit.values.no'),
      }
    }
    if (typeof value === 'number') return { key: String(value), text: formatCount(value) }
    if (typeof value === 'string') {
      const text = field === 'languages' ? languageName(value) : label(field, value)
      return { key: value, text }
    }
    if (Array.isArray(value)) {
      const items = value.map((item) => one(field, item))
      return {
        key: items.map((i) => i.key).join('|'),
        text: items.map((i) => i.text).join(', '),
      }
    }
    if (isPlain(value)) {
      // Populated: naam ya email kaafi hai, compare id se
      if (value.name || value.email) {
        const id = typeof value._id === 'string' ? value._id : String(value.name ?? value.email)
        return { key: id, text: String(value.name ?? value.email) }
      }
      // Social account: "Instagram @handle · 12K"
      if (typeof value.platform === 'string') {
        const parts = [
          `${t(`platform.${value.platform}`, { defaultValue: value.platform })} ${value.handle ?? value.url ?? ''}`.trim(),
        ]
        if (typeof value.followers === 'number') parts.push(formatCount(value.followers))
        const key = [
          value.platform,
          value.url,
          value.handle,
          value.followers,
          value.engagementRate,
        ].join('~')
        return { key, text: parts.join(' · ') }
      }
      // Baqi: "field: value" ki chhoti line
      const entries = Object.entries(value).filter(([k, v]) => !HIDDEN_KEYS.has(k) && !isEmpty(v))
      const shown = entries.map(([k, v]) => [k, one(k, v)] as const)
      return {
        key: shown.map(([k, s]) => `${k}=${s.key}`).join(';'),
        text: shown.map(([k, s]) => `${fieldName(k)}: ${s.text}`).join(' · '),
      }
    }
    return { key: String(value), text: String(value) }
  }

  // "verification.channelUrl" -> "Verification › Channel URL"
  function fieldName(path: string) {
    return path
      .split('.')
      .map((part) =>
        t(`audit.fields.${part}`, {
          defaultValue: part.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
        }),
      )
      .join(' › ')
  }

  return { one, fieldName }
}

// "Show changes": sirf badle hue fields, table mein: Field | Pehle | Baad
function AuditChanges({ log }: { log: AuditLogEntry }) {
  const { t } = useTranslation()
  const names = new Map<string, string>()
  collectNames(log.before, names)
  collectNames(log.after, names)
  // reviewedBy / handledBy jaisi ids aksar isi admin ki hoti hain
  if (log.actor) names.set(log.actor._id, log.actor.name)
  const { one, fieldName } = useFormatter(log.targetType, names)

  const before = flatten(log.before)
  const after = flatten(log.after)
  const hasBefore = isPlain(log.before)
  const hasAfter = isPlain(log.after)

  // Update: sirf woh fields jo after mein aaye aur badle.
  // Create (before nahi) / delete (after nahi): jo kuch hai sab dikhao
  const fields = hasBefore && hasAfter ? [...after.keys()] : [...(hasAfter ? after : before).keys()]
  const rows = fields
    .map((field) => ({
      field,
      old: one(field, before.get(field)),
      now: one(field, after.get(field)),
    }))
    .filter((row) =>
      hasBefore && hasAfter
        ? row.old.key !== row.now.key
        : (hasAfter ? row.now : row.old).key !== '',
    )

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
        {t('audit.noChanges')}
      </p>
    )
  }

  const mode = !hasBefore ? 'created' : !hasAfter ? 'deleted' : 'changed'
  const empty = <span className="text-gray-400">—</span>
  const before_ = (value: Shown) =>
    value.key ? (
      <span
        className={`inline rounded-md px-1.5 py-0.5 break-words ${
          mode === 'deleted'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-red-50 text-red-700 line-through decoration-red-300'
        }`}
      >
        {value.text}
      </span>
    ) : (
      empty
    )
  const after_ = (value: Shown) =>
    value.key ? (
      <span className="inline rounded-md bg-green-50 px-1.5 py-0.5 break-words text-green-800">
        {value.text}
      </span>
    ) : (
      empty
    )
  const columns =
    mode === 'changed'
      ? 'sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)]'
      : 'sm:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)]'

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {t(`audit.mode.${mode}`, { count: rows.length })}
        </h3>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Sar-e-fehrist (sirf bari screen pe; mobile pe har khana apna label dikhata hai) */}
        <div
          className={`hidden gap-4 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium tracking-wide text-gray-500 uppercase sm:grid ${columns}`}
        >
          <span>{t('audit.field')}</span>
          {mode !== 'created' && (
            <span>{mode === 'deleted' ? t('audit.value') : t('audit.before')}</span>
          )}
          {mode !== 'deleted' && (
            <span>{mode === 'created' ? t('audit.value') : t('audit.after')}</span>
          )}
        </div>
        <ul className="divide-y divide-gray-100">
          {rows.map(({ field, old, now }) => (
            <li key={field} className={`grid gap-1.5 px-4 py-3 text-sm sm:gap-4 ${columns}`}>
              <span className="font-medium text-gray-900">{fieldName(field)}</span>
              {mode !== 'created' && (
                <span className="min-w-0 text-gray-700">
                  <span className="me-1.5 text-xs text-gray-400 sm:hidden">
                    {mode === 'deleted' ? t('audit.value') : t('audit.before')}:
                  </span>
                  {before_(old)}
                </span>
              )}
              {mode !== 'deleted' && (
                <span className="min-w-0 text-gray-700">
                  <span className="me-1.5 text-xs text-gray-400 sm:hidden">
                    {mode === 'created' ? t('audit.value') : t('audit.after')}:
                  </span>
                  {after_(now)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default AuditChanges
