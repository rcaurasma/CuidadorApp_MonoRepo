import Sidebar from '../common/Sidebar'

export default function CaregiverLayout({ children, title }) {
  const menuItems = [
    { icon: 'dashboard', label: 'Overview', path: '/caregiver/dashboard' },
    { icon: 'description', label: 'Patient Logs', path: '/caregiver/patient-logs' },
    { icon: 'warning', label: 'Incidents', path: '/caregiver/incidents' },
    { icon: 'schedule', label: 'Shift Reports', path: '/caregiver/shift-reports' },
    { icon: 'payments', label: 'Payroll', path: '/caregiver/payroll' },
    { icon: 'verified', label: 'Onboarding', path: '/caregiver/onboarding' }
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar title="Portal" subtitle="Cuidadores" menuItems={menuItems} />
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#f6f7f8]">
        {title && (
          <header className="h-16 border-b border-[#e7edf3] bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          </header>
        )}
        {children}
      </main>
    </div>
  )
}
