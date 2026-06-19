'use client'
import { useEffect } from 'react'
import { UseSelicRateOptions } from './index'

export function useSelicRate({ rateType, setValue }: UseSelicRateOptions): void {
  useEffect(() => {
    if (rateType !== 'pos') return

    let cancelled = false

    const fetchData = async () => {
      try {
        const res = await fetch('/api/calculate')
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return

        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        if (list.length > 0) {
          const first = list[0]
          const raw = first?.input ?? first
          const val = raw?.selic_meta_default
          const num = typeof val === 'number' ? val : typeof val === 'string' ? parseFloat(val) : null
          if (num != null && !isNaN(num) && num > 0) {
            setValue('selic_meta_default', num, { shouldValidate: false })
          }
        }
      } catch {
        // silently ignore
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [rateType, setValue])
}
