import axios from 'axios'
import { MutationCache, QueryClient } from '@tanstack/react-query'

// Jo data kisi kaam (mutation) ke baad badal sakta hai: claim approve, profile edit,
// business code, hire jawab, muahida... Kaam kaamyab ho to ye sab taaza
const AFTER_MUTATION_KEYS = [
  ['people'],
  ['person'],
  ['admin'],
  ['claims'],
  ['business'],
  ['me'],
  ['agreements'],
]

const mutationCache = new MutationCache({
  onSuccess: () => {
    for (const queryKey of AFTER_MUTATION_KEYS) {
      queryClient.invalidateQueries({ queryKey })
    }
  },
})

// Poori app ka ek hi React Query client (main.tsx isi ko QueryClientProvider mein deta hai)
export const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      // Data khud "purana" nahi hota: component dobara aane pe ya har jagah use hone pe
      // API call nahi. Taaza tab hota hai jab koi kehe: LiveUpdates (har kuch second,
      // sirf screen wala data) ya kisi kaam ke baad (upar mutationCache)
      staleTime: Infinity,
      // Kisi page pe use na ho to bhi 30 minute tak cache mein rakho
      gcTime: 30 * 60 * 1000,
      // Tab pe wapas aane ka refresh LiveUpdates khud (thoda ruk kar) karta hai
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
