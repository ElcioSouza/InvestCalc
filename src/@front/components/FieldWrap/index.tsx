import { AlertCircle } from 'lucide-react'
import type { FieldWrapProps } from './type'

export function FieldWrap({ label, icon, error, children }: FieldWrapProps) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#555] mb-1.5 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none">
            {icon}
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-[#FC8181] text-[11px] mt-1 flex items-center gap-1">
          <AlertCircle size={10} />
          {error}
        </p>
      )}
    </div>
  )
}
