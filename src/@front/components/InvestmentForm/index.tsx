'use client'

import { RefreshCw, Zap, PlusCircle, DollarSign, Calendar, Clock, Percent, BarChart3, Shield } from 'lucide-react'
import { InvestmentTypeSelector } from '../InvestmentTypeSelector'
import { RateTypeSelector } from '../RateTypeSelector'
import { FieldWrap } from '../FieldWrap'
import { INVESTMENT_TYPE_CONFIG } from '@front/constants'
import type { InvestmentFormProps } from './type'

function getInputBorderClass(hasError: boolean) {
  return hasError ? 'border-[#E53E3E]' : 'border-[rgba(255,255,255,0.07)]'
}

export function InvestmentForm({
  mode,
  investmentType,
  rateType,
  errors,
  isLoading,
  register,
  onSubmit,
}: InvestmentFormProps) {
  const typeInfo = INVESTMENT_TYPE_CONFIG[investmentType] ?? INVESTMENT_TYPE_CONFIG.cdb

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div
        className="dashboard-card-tight rounded-2xl p-6 shadow-[0_0_40px_rgba(212,168,67,0.06)] bg-(--bg-card) border-(--border)"
      >
        <div className="flex items-center gap-2 mb-6">
          <Zap size={15} className="text-(--gold)" />
          <span className="text-xs font-bold text-[#D4A843] uppercase tracking-widest">
            {mode === 'simular' ? 'Simulador' : 'Novo Investimento'}
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <InvestmentTypeSelector selected={investmentType} register={register} />
          <RateTypeSelector selected={rateType} register={register} />

          <FieldWrap label="Capital Inicial (R$)" icon={<DollarSign size={13} />} error={errors.capital?.message}>
            <input
              type="number"
              step="0.01"
              placeholder="10000.00"
              {...register('capital', { valueAsNumber: true })}
                className={`input-gold w-full rounded-xl border bg-[rgba(255,255,255,0.025)] px-3 py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#333] ${getInputBorderClass(Boolean(errors.capital))}`}
            />
          </FieldWrap>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrap label="Data de Aplicação" icon={<Calendar size={13} />} error={errors.application_date?.message}>
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                maxLength={10}
                {...register('application_date')}
                className={`input-gold w-full rounded-xl border bg-[rgba(255,255,255,0.025)] px-3 py-2.5 pl-9 pr-3 text-sm text-white ${getInputBorderClass(Boolean(errors.application_date))}`}
              />
            </FieldWrap>
            <FieldWrap label="Prazo (meses)" icon={<Clock size={13} />} error={errors.months?.message}>
              <input
                type="number"
                placeholder="6"
                {...register('months', { valueAsNumber: true })}
                className={`input-gold w-full rounded-xl border bg-[rgba(255,255,255,0.025)] px-3 py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#333] ${getInputBorderClass(Boolean(errors.months))}`}
              />
            </FieldWrap>
          </div>

          {rateType === 'pos' ? (
            <div className="grid grid-cols-2 gap-3">
              <FieldWrap label="% do CDI" icon={<Percent size={13} />} error={errors.cdi?.message}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="110"
                  {...register('cdi', { valueAsNumber: true })}
                  className={`input-gold w-full rounded-xl border bg-[rgba(255,255,255,0.025)] px-3 py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#333] ${getInputBorderClass(Boolean(errors.cdi))}`}
                />
              </FieldWrap>
              <FieldWrap label="Selic Meta (%)" icon={<BarChart3 size={13} />} error={errors.selic_meta?.message}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="14.25"
                  {...register('selic_meta', { valueAsNumber: true })}
                  className={`input-gold w-full rounded-xl border bg-[rgba(255,255,255,0.025)] px-3 py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#333] ${getInputBorderClass(Boolean(errors.selic_meta))}`}
                />
              </FieldWrap>
            </div>
          ) : (
            <FieldWrap label="Taxa Pr\u00E9-fixada (% a.a.)" icon={<Percent size={13} />} error={errors.pre_rate?.message}>
              <input
                type="number"
                step="0.01"
                placeholder="11.50"
                {...register('pre_rate', { valueAsNumber: true })}
                className={`input-gold w-full rounded-xl border bg-[rgba(255,255,255,0.025)] px-3 py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#333] ${getInputBorderClass(Boolean(errors.pre_rate))}`}
              />
            </FieldWrap>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-semibold normal-case tracking-normal transition-all duration-200 ${isLoading ? 'bg-[rgba(212,168,67,0.15)] text-[#555] shadow-none' : 'bg-[linear-gradient(135deg,#D4A843_0%,#F0C96A_50%,#A07820_100%)] text-[#060810] shadow-[0_4px_28px_rgba(212,168,67,0.35)]'}`}
          >
            {isLoading ? (
              <><RefreshCw size={15} className="animate-spin" /> Calculando...</>
            ) : mode === 'simular' ? (
              <><Zap size={15} /> Calcular Simulação</>
            ) : (
              <><PlusCircle size={15} /> Salvar Investimento</>
            )}
          </button>
        </form>
      </div>

      <div
        className="dashboard-card-tight rounded-xl p-3 flex items-center gap-3 bg-[rgba(255,255,255,0.015)] border-[1px_solid_rgba(212,168,67,0.08)]"
      >
        <span className="text-2xl">{typeInfo.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-[#D4A843]">{typeInfo.label}</div>
          <div className="text-[11px] text-[#555] truncate">{typeInfo.desc}</div>
        </div>
        {!typeInfo.taxed && (
          <div className="flex items-center gap-1 text-[#0D9E6E] text-[11px] font-bold shrink-0">
            <Shield size={11} /> Isento IR/IOF
          </div>
        )}
      </div>
    </div>
  )
}
