'use client'

import type { ReactNode } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useToast } from '@front/providers'
import type { ToastType } from '@front/types'

const TOAST_STYLES: Record<ToastType, { wrapper: string; icon: ReactNode }> = {
  success: {
    wrapper: 'bg-[#0A1F1A] border-[#0D9E6E] text-[#10C98A]',
    icon: <CheckCircle2 size={16} />,
  },
  error: {
    wrapper: 'bg-[#1F0A0A] border-[#E53E3E] text-[#FC8181]',
    icon: <AlertCircle size={16} />,
  },
  warning: {
    wrapper: 'bg-[#1F1A0A] border-[#D4A843] text-[#F0C96A]',
    icon: <AlertTriangle size={16} />,
  },
  info: {
    wrapper: 'bg-[#0A0F1F] border-[#6366F1] text-[#A5B4FC]',
    icon: <Info size={16} />,
  },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border animate-fade-in-up shadow-2xl min-w-[280px] max-w-[400px] ${style.wrapper}`}
          >
            {style.icon}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
              aria-label="Fechar notificação"
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
