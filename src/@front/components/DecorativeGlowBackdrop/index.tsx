export function DecorativeGlowBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden>
      <div
        className="absolute -top-50 left-0 h-150 w-150 -translate-x-1/2 rounded-full opacity-[0.035] bg-[radial-gradient(circle,#D4A843_0%,transparent_70%)]"
      />
      <div
        className="absolute -bottom-50 right-0 h-125 w-125 translate-x-1/2 rounded-full opacity-[0.035] bg-[radial-gradient(circle,#0D9E6E_0%,transparent_70%)]"
      />
    </div>
  )
}