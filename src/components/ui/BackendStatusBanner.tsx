import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { checkHealth } from '@lib/api'
import type { HealthResponse } from '@lib/types'

export const BackendStatusBanner = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [health, setHealth] = useState<HealthResponse | null>(null)

  const check = async () => {
    try {
      const data = await checkHealth()
      setHealth(data)
      setStatus('connected')
    } catch {
      setStatus('disconnected')
    }
  }

  useEffect(() => {
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'checking') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-body-sm font-medium border ${
          status === 'connected'
            ? 'bg-success/10 border-success/30 text-success'
            : 'bg-error/10 border-error/30 text-error'
        }`}
      >
        {status === 'connected' ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <Wifi size={12} />
            <span>
              {health?.services?.mock_mode?.enabled ? 'Mock Mode' : 'Backend Connected'}
            </span>
            {health?.services?.llm_providers?.configured_count !== undefined && (
              <span className="opacity-70">
                · {health.services.llm_providers.configured_count} AI providers
              </span>
            )}
          </>
        ) : (
          <>
            <WifiOff size={12} />
            <span>Backend Offline</span>
            <button onClick={check} className="hover:opacity-70 transition-opacity">
              <RefreshCw size={10} />
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
