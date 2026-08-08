import { Link } from 'react-router-dom'
import {
  DoorOpen,
  Fence,
  Frame,
  Grid3x3,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Hammer,
  ClipboardPlus,
  Images,
  Droplets,
  Home as HomeIcon,
  MessageCircle,
  Sun,
  Check,
} from 'lucide-react'
import { telLink, whatsappLink } from '../config.js'

const categories = [
  { name: 'Gates', icon: Fence, desc: 'Main & sliding gates' },
  { name: 'Windows', icon: Frame, desc: 'Steel-framed windows' },
  { name: 'Doors', icon: DoorOpen, desc: 'Single & double doors' },
  { name: 'Railings', icon: Grid3x3, desc: 'Balcony & stairs' },
  { name: 'Other', icon: Hammer, desc: 'Custom steel work' }, // <-- Yeh nayi line add karni hai
]

const features = [
  { icon: ShieldCheck, title: 'SS 304 & SS 201', desc: 'Genuine grade steel, rust-resistant' },
  { icon: Hammer, title: 'Custom Designs', desc: 'Made to your exact measurements' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Honest timelines, no false promises' },
]

const steelGrades = [
  {
    grade: 'SS 304',
    badge: 'Outdoor',
    color: 'success',
    points: ['Rust-proof', 'Withstands rain & sun', 'Best for gates & railings'],
  },
  {
    grade: 'SS 201',
    badge: 'Indoor',
    color: 'steel',
    points: ['Budget-friendly', 'Good for indoor use', 'Best for windows & doors'],
  },
]

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-steel-900 px-5 py-8 text-white shadow-lg sm:px-8 sm:py-12">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-steel-700/40 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-steel-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-300">
            <Hammer className="h-3.5 w-3.5" /> Local Fabrication Shop
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Modern Steel Fabrication
          </h1>
          <p className="mt-2 max-w-md text-base text-steel-200">
            Gates, Windows, Doors & Railings — made to your exact size in genuine SS 304 / SS 201 steel.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/new-order" className="btn-accent">
              <ClipboardPlus className="h-5 w-5" /> Place New Order
            </Link>
            <Link to="/portfolio" className="btn-ghost bg-white/10 text-white hover:bg-white/20">
              <Images className="h-5 w-5" /> View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold text-steel-900">Quick Categories</h2>
          <Link to="/new-order" className="text-sm font-semibold text-accent-600">
            Start order →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/new-order"
              state={{ presetItem: c.name }}
              className="group card flex flex-col gap-3 transition active:scale-[0.98] hover:border-steel-300 hover:shadow-md"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-steel-100 text-steel-700 transition group-hover:bg-accent-100 group-hover:text-accent-700">
                <c.icon className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-steel-900">{c.name}</p>
                <p className="text-sm text-steel-500">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Steel Quality banner */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-steel-900">Our Steel Quality</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {steelGrades.map((g) => (
            <div
              key={g.grade}
              className={`card space-y-3 border-2 ${
                g.color === 'success' ? 'border-success-100 bg-success-50' : 'border-steel-200 bg-steel-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      g.color === 'success' ? 'bg-success-500 text-white' : 'bg-steel-700 text-white'
                    }`}
                  >
                    {g.color === 'success' ? <Droplets className="h-5 w-5" /> : <HomeIcon className="h-5 w-5" />}
                  </span>
                  <p className="font-display text-xl font-bold text-steel-900">{g.grade}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-2xs font-bold uppercase tracking-wide ${
                    g.color === 'success'
                      ? 'bg-success-100 text-success-700'
                      : 'bg-steel-200 text-steel-700'
                  }`}
                >
                  {g.badge}
                </span>
              </div>
              <ul className="space-y-1.5">
                {g.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-steel-700">
                    <Check
                      className={`h-4 w-4 ${g.color === 'success' ? 'text-success-600' : 'text-steel-600'}`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="card flex items-start gap-3 bg-accent-50 border-accent-100">
          <Sun className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
          <p className="text-sm text-steel-700">
            <span className="font-bold text-steel-900">Not sure which grade?</span> For outdoor items
            (gates, railings) choose <span className="font-bold text-success-700">SS 304</span>. For indoor
            items (windows, doors) <span className="font-bold text-steel-700">SS 201</span> works well and
            saves cost.
          </p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-steel-900">Why Choose Us</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-success-100 text-success-700">
                <f.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-steel-900">{f.title}</p>
                <p className="text-sm text-steel-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="card space-y-3 border-steel-200 bg-steel-900 text-white">
        <h2 className="font-display text-lg font-bold">Visit / Contact the Shop</h2>
        <div className="space-y-2 text-steel-100">
          <p className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-accent-400" /> +91 98765 43210
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-accent-400" /> Main Road, Industrial Area
          </p>
          <p className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-accent-400" /> Mon–Sat, 9 AM – 7 PM
          </p>
        </div>
        <Link to="/new-order" className="btn-accent w-full">
          <ClipboardPlus className="h-5 w-5" /> Place New Order
        </Link>
      </section>

      {/* Mobile quick action bar spacer (fixed bar sits in Layout) */}
      <div className="h-2 sm:hidden" />

      {/* Mobile Quick Action Bar */}
      <div className="fixed inset-x-0 bottom-[3.25rem] z-20 flex gap-2 px-4 sm:hidden">
        <a href={telLink()} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-steel-900 py-3 text-base font-bold text-white shadow-lg active:scale-95">
          <Phone className="h-5 w-5" /> Call Now
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-success-500 py-3 text-base font-bold text-white shadow-lg active:scale-95"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </div>
  )
}
