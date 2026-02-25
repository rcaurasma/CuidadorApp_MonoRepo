import Sidebar from '../common/Sidebar'

export default function FamilyLayout({ children, title }) {
  const menuItems = [
    { icon: 'dashboard', label: 'Schedule & Booking', path: '/family/dashboard' },
    { icon: 'person_add', label: 'Register', path: '/family/register' },
    { icon: 'medical_information', label: 'Medical Records', path: '/family/medical-records' },
    { icon: 'history', label: 'History', path: '/family/history' },
    { icon: 'support_agent', label: 'Support', path: '/family/support' }
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar title="Portal" subtitle="Familias" menuItems={menuItems} />
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
