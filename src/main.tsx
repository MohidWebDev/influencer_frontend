import { StrictMode } from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthProvider.tsx'
import './index.css'
import './i18n'
import App from './App.tsx'
import LanguageRoot from './components/LanguageRoot'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minute tak data "fresh" hai: dobara API call nahi hogi, cache se foran dikhega
      staleTime: 5 * 60 * 1000,
      // Kisi page pe use na ho to bhi 30 minute tak cache mein rakho
      gcTime: 30 * 60 * 1000,
      // Tab badal kar wapas aane pe har dafa dobara fetch mat karo
      refetchOnWindowFocus: false,
      // 4xx (jaise 404 "nahi mila") pe dobara koshish faltu hai; network/server pe 2 dafa
      retry: (failureCount, error) => {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageRoot>
            <App />
          </LanguageRoot>
        </AuthProvider>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        // Dark mode mein bhi theme ke rang (CSS variables)
        toastOptions={{
          style: { background: 'var(--color-white)', color: 'var(--color-gray-900)' },
        }}
      />
      {/* Sirf development mein dikhta hai: cache ke andar kya hai */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
