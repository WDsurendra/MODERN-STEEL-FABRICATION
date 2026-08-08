import { Link, useLocation, Outlet } from 'react-router-dom'
import { HardHat, Home as HomeIcon, ClipboardPlus, Images, Lock } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/portfolio', label: 'Gallery', icon: Images },
  { to: '/new-order', label: 'New Order', icon: ClipboardPlus },
  { to: '/admin', label: 'Admin', icon: Lock },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-steel-50">
      <header className="sticky top-0 z-30 bg-steel-900 text-white shadow-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-500">
              <HardHat className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold">Modern Steel</p>
              <p className="text-2xs uppercase tracking-wider text-steel-300">Fabrication</p>
            </div>
          </Link>
          <nav className="hidden sm:flex sm:items-center sm:gap-1">
            {navItems.map((item) => {
              const active = pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active ? 'bg-steel-700 text-white' : 'text-steel-300 hover:bg-steel-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 pb-24 sm:pb-8">
  <Outlet />
</main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-steel-200 bg-white sm:hidden">
        <div className="mx-auto flex max-w-3xl">
          {navItems.map((item) => {
            const active = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-2xs font-semibold transition ${
                  active ? 'text-accent-600' : 'text-steel-500'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
