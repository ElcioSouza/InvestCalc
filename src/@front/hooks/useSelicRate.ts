'use client'
import { useEffect } from 'react'
import { UseSelicRateOptions } from './index'

export function useSelicRate({ rateType, setValue }: UseSelicRateOptions): void {
  useEffect(() => {
    if (rateType !== 'pos') return

    let cancelled = false

    const fetchData = async () => {
      try {
        const res = await fetch('/api/selic')
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return

        const val = data?.selic_meta ?? data?.selic ?? data?.rate ?? data?.value
        const num = typeof val === 'number' ? val : typeof val === 'string' ? parseFloat(val) : null
        if (num != null && !isNaN(num) && num > 0) {
          setValue('selic_meta', num, { shouldValidate: false })
          return
        }
      } catch {
        // silently ignore
      }
      setValue('selic_meta', 14.25, { shouldValidate: false })
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [rateType, setValue])
}
