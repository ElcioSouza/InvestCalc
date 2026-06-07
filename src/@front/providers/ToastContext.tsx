'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { generateId } from '@front/utils'
import { TOAST_DURATION_MS } from '@front/constants'
import type { Toast, ToastType } from '@front/types'

interface ToastContextValue {
  toasts: Toast[]
  showToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const t = timeoutsRef.current.get(id)
    if (t) { clearTimeout(t); timeoutsRef.current.delete(id) }
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = generateId()
      setToasts((prev) => [...prev, { id, type, message }])
      timeoutsRef.current.set(
        id,
        setTimeout(() => removeToast(id), TOAST_DURATION_MS)
      )
    },
    [removeToast]
  )

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}
