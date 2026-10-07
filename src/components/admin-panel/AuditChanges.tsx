import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
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
      }[targetType],
      role: 'roles',
      platform: 'platform',
      reason: targetType === 'report' ? 'reportReason' : undefined,
    }
    if (last === 'country') return countryName(value)
    if (last === 'visibility') return t(`audit.values.${value}`, { defaultValue: value })
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

const TONES = {
  old: 'bg-red-50 text-red-700 line-through decoration-red-300',
  new: 'bg-green-50 text-green-800',
  plain: 'bg-gray-100 text-gray-700',
}

// Khali value ko halka sa "—" dikhao, rang wala dabba nahi
function Value({ text, empty, tone }: { text: string; empty: boolean; tone: keyof typeof TONES }) {
  const { t } = useTranslation()
  if (empty) return <span className="text-xs italic text-gray-400">{t('audit.values.empty')}</span>
  return <span className={`break-words rounded-md px-2 py-0.5 ${TONES[tone]}`}>{text}</span>
}

// "Show changes": sirf badle hue fields, pehle -> baad, saaf andaaz mein
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
    return <p className="text-sm text-gray-500">{t('audit.noChanges')}</p>
  }

  const mode = !hasBefore ? 'created' : !hasAfter ? 'deleted' : 'changed'

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <p className="border-b border-gray-100 px-4 py-2 text-xs font-medium text-gray-500">
        {t(`audit.mode.${mode}`, { count: rows.length })}
      </p>
      <dl className="divide-y divide-gray-100">
        {rows.map(({ field, old, now }) => (
          <div
            key={field}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="text-sm font-medium text-gray-700">{fieldName(field)}</dt>
            <dd className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
              {mode !== 'created' && (
                <Value
                  text={old.text}
                  empty={!old.key}
                  tone={mode === 'deleted' ? 'plain' : 'old'}
                />
              )}
              {mode === 'changed' && (
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs text-gray-400 rtl:rotate-180"
                />
              )}
              {mode !== 'deleted' && <Value text={now.text} empty={!now.key} tone="new" />}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default AuditChanges
