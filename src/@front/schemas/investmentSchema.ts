import { z } from 'zod'

function requiredPositiveNumber(fieldLabel: string, maxValue?: number, maxMessage?: string) {
  return z
    .number({ error: `Informe ${fieldLabel.toLowerCase()}` })
    .positive({ message: `${fieldLabel} deve ser maior que zero` })
    .refine((value) => typeof maxValue !== 'number' || value <= maxValue, {
      message: maxMessage ?? `${fieldLabel} ultrapassa o valor máximo`,
    })
}

function optionalPositiveNumber(fieldLabel: string, maxValue?: number, maxMessage?: string) {
  return z
    .number({ error: `Informe ${fieldLabel.toLowerCase()}` })
    .positive({ message: `${fieldLabel} deve ser positivo` })
    .refine((value) => typeof maxValue !== 'number' || value <= maxValue, {
      message: maxMessage ?? `${fieldLabel} ultrapassa o valor máximo`,
    })
    .optional()
}

export const investmentFormSchema = z
  .object({
    investment_type: z.enum(['cdb', 'lci', 'lca']),
    rate_type: z.enum(['pre', 'pos']),
    capital: requiredPositiveNumber('Capital', 100_000_000, 'Valor máximo: R$ 100.000.000'),
    application_date: z
      .string({ error: 'Informe a data de aplicação' })
      .min(1, { message: 'Informe a data de aplicação' })
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Use o formato DD/MM/AAAA' }),
    months: z
      .number({ error: 'Informe o prazo' })
      .int({ message: 'Prazo deve ser número inteiro' })
      .positive({ message: 'Prazo deve ser maior que zero' })
      .refine((value) => value <= 360, { message: 'Prazo máximo: 360 meses' }),
    cdi: optionalPositiveNumber('CDI', 200, 'CDI máximo: 200%'),
    pre_rate: optionalPositiveNumber('Taxa', 100, 'Taxa máxima: 100%'),
    selic_meta: optionalPositiveNumber('Selic Meta'),
  })
  .superRefine((data, ctx) => {
    if (data.rate_type === 'pre' && (data.pre_rate == null || data.pre_rate <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe a taxa pré-fixada',
        path: ['pre_rate'],
      })
    }
    if (data.rate_type === 'pos' && (data.cdi == null || data.cdi <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o percentual do CDI',
        path: ['cdi'],
      })
    }
  })

export type InvestmentFormData = z.infer<typeof investmentFormSchema>
