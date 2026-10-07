import { Fragment, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

// Zaban badalne pe poori app dobara banti hai, taake har text (constants samet)
// nayi zaban mein aa jaye. Data (React Query cache) wahin rehta hai
function LanguageRoot({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  return <Fragment key={i18n.language}>{children}</Fragment>
}

export default LanguageRoot
