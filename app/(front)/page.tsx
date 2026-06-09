'use client'

import { Header, ToastContainer, DecorativeGlowBackdrop } from '@front/components'

export default function DashboardPage() {


  return (
    <>
      <ToastContainer />

      <main className="dashboard-shell min-h-screen w-full bg-grid relative overflow-x-hidden overflow-y-visible">
        <DecorativeGlowBackdrop />

        <div className="dashboard-content mx-auto max-w-7xl px-4 py-8 lg:py-6 relative">
          <Header />
       
        </div>
      </main>
    </>
  )
}
