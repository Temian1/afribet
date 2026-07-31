import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { NotificationsProvider } from './contexts/NotificationsContext.jsx'
import { SoundProvider } from './contexts/SoundContext.jsx'
import { BetSlipProvider } from './contexts/BetSlipContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationsProvider>
              <AppProvider>
                <BetSlipProvider>
                  <App />
                </BetSlipProvider>
              </AppProvider>
            </NotificationsProvider>
          </AuthProvider>
        </ToastProvider>
      </SoundProvider>
    </ThemeProvider>
  </StrictMode>,
)
