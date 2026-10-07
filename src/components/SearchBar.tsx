import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  initialValue?: string
  size?: 'md' | 'lg'
  // 'onDark' = andheri tasveer (hero) pe: button safed taake saaf dikhe
  tone?: 'default' | 'onDark'
}

// Enter dabane pe /search?q=... pe le jata hai
function SearchBar({ initialValue = '', size = 'md', tone = 'default' }: SearchBarProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState(initialValue)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  const padding = size === 'lg' ? 'py-3.5 text-base' : 'py-2.5 text-sm'

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full gap-2">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('site.search.placeholder')}
        aria-label={t('site.search.label')}
        className={`min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 ${padding}`}
      />
      <button
        type="submit"
        aria-label={t('common.search')}
        className={`rounded-xl px-5 font-medium ${
          tone === 'onDark'
            ? 'bg-white text-gray-900 hover:bg-gray-100'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        } ${padding}`}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="sm:me-2" />
        <span className="hidden sm:inline">{t('common.search')}</span>
      </button>
    </form>
  )
}

export default SearchBar
