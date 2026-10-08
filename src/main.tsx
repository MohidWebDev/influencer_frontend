import { StrictMode } from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/AuthProvider.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'
import './i18n'
import App from './App.tsx'
import LanguageRoot from './components/LanguageRoot'
import AppToaster from './components/AppToaster'

// Koi bhi kaam (claim approve, profile edit, hide, delete...) kaamyab ho to profiles ka
// data har jagah taaza: Explore, Home, profile page, admin cards. Jo screen pe hai foran
// dobara aata hai, baqi agli dafa khulne pe
const mutationCache = new MutationCache({
  onSuccess: () => {
    for (const queryKey of [['people'], ['person'], ['admin'], ['claims']]) {
      queryClient.invalidateQueries({ queryKey })
    }
  },
})

const queryClient = new QueryClient({
  mutationCache,
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
        <ThemeProvider>
          <AuthProvider>
            <LanguageRoot>
              <App />
            </LanguageRoot>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <AppToaster />
      {/* Sirf development mein dikhta hai: cache ke andar kya hai */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
