import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import "leaflet/dist/leaflet.css"
import "./shared/utils/fixLeafletIcon.ts"
import './index.css'
import App from './App.tsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID 

const queryClient = new QueryClient({

  defaultOptions:{
    queries:{
      staleTime:60*100,
      retry:1,
      refetchOnWindowFocus: false,
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
