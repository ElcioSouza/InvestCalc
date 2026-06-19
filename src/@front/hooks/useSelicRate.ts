'use client'
import { useEffect } from 'react'
import { UseSelicRateOptions } from './index'

export function useSelicRate({ rateType, setValue }: UseSelicRateOptions): void {
  useEffect(() => {
    if (rateType !== 'pos') return
    setValue('selic_meta_default', 14.25, { shouldValidate: false })
  }, [rateType, setValue])
}
