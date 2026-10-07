import axios from 'axios'
import i18n from '../i18n'
import type { ApiError } from '../types/api'

// Backend ke error response se message aur field errors nikalta hai.
// Jaane-pehchaane error codes ka message chuni hui zaban mein
export function getApiError(error: unknown) {
  if (axios.isAxiosError<ApiError>(error) && error.response?.data?.error) {
    const { code, message, fields } = error.response.data.error
    const translated = i18n.exists(`apiErrors.${code}`) ? i18n.t(`apiErrors.${code}`) : message
    return {
      message: code === 'VALIDATION_ERROR' ? i18n.t('site.fixFields') : translated,
      fields: fields ?? {},
    }
  }
  return { message: i18n.t('site.somethingWrong'), fields: {} }
}
