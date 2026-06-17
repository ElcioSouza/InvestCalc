'use client'
import { useEffect } from 'react'
import { fetchSelicRate } from '@front/utils'
import { UseSelicRateOptions } from './index'

export function useSelicRate({ rateType, setValue }: UseSelicRateOptions): void {
  useEffect(() => {
    if (rateType !== 'pos') return
    
    let cancelled = false

    const fetchData = () => {
      fetchSelicRate()
        .then((rate) => {
          if (!cancelled) {
            setValue('selic_meta', rate, { shouldValidate: false })
          }
        })
        .catch(() => {})
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [rateType, setValue])
}
