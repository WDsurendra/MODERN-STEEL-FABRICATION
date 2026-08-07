import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Lock,
  LogOut,
  ArrowLeft,
  ClipboardList,
  Play,
  CheckCircle2,
  History,
  Phone,
  Ruler,
  Hash,
  Search,
  Loader2,
  RefreshCw,
  Inbox,
  HardHat,
  Calendar,
  ImageIcon,
  X,
} from 'lucide-react'
import { fetchOrders, updateOrderStatus } from '../data.js'

const ADMIN_PIN = '1234'
const SESSION_KEY = 'msf_admin_authed'

const TABS = [
  { key: 'pending', label: 'Naye Kaam', sub: 'Pending', icon: ClipboardList, color: 'accent' },
  { key: 'in_progress', label: 'Chalu Kaam', sub: 'In Progress', icon: HardHat, color: 'steel' },
  { key: 'completed', label: 'Purane Kaam', sub: 'History', icon: History, color: 'success' },
]

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function fmtSize(o) {
  return `${o.height_ft}′ ${o.height_in}″ × ${o.width_ft}′ ${o.width_in}″`
}

function PinLogin({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function press(d) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === ADMIN_PIN) {
          sessionStorage.setItem(SESSION_KEY, '1')
          onSuccess()
        } else {
          setError(true)
          setPin('')
        }
      }, 120)
    }
  }
  function backspace() {
    setPin((p) => p.slice(0, -1))
    setError(false)
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <button
        onClick={() => window.history.back()}
        className="absolute left-4 top-4 flex items-center gap-2 text-sm font-semibold text-steel-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-steel-900 text-accent-400">
        <Lock className="h-8 w-8" />
      </div>
      <h1 className="mt-5 font-display text-3xl font-bold text-steel-900">Admin Login</h1>
      <p className="mt-1 text-steel-500">Enter 4-digit PIN</p>

      <div className="mt-6 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-5 w-5 rounded-full border-2 transition ${
              error
                ? 'border-danger-500 bg-danger-500'
                : pin.length > i
                ? 'border-steel-900 bg-steel-900'
                : 'border-steel-300'
            }`}
          />
        ))}
      </div>
      {error && <p className="mt-3 font-semibold text-danger-600">Wrong PIN. Try again.</p>}

      <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="rounded-2xl bg-white py-5 text-2xl font-bold text-steel-900 shadow-sm transition active:scale-95 hover:bg-steel-100"
          >
            {d}
          </button>
        ))}
        <button onClick={backspace} className="rounded-2xl py-5 text-steel-500 transition active:scale-95 hover:bg-steel-100">
          <ArrowLeft className="mx-auto h-6 w-6" />
        </button>
        <button
          onClick={() => press('0')}
          className="rounded-2xl bg-white py-5 text-2xl font-bold text-steel-900 shadow-sm transition active:scale-95 hover:bg-steel-100"
        >
          0
        </button>
        <div />
      </div>
      <p className="mt-6 text-sm text-steel-400">Default PIN: 1234</p>
    </div>
  )
}

function OrderCard({ order, actionLabel, actionIcon: ActionIcon, onAction, actionClass, busyId, setPreviewImg }) {
  const busy = busyId === order.id
  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold text-steel-900">{order.customer_name}</p>
          <a href={`tel:${order.phone}`} className="flex items-center gap-1.5 text-base font-semibold text-steel-600">
            <Phone className="h-4 w-4" /> {order.phone}
          </a>
        </div>
        <span className="rounded-full bg-steel-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-steel-600">
          {order.item_type}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-steel-600">
        <span className="inline-flex items-center gap-1 rounded-lg bg-steel-50 px-2.5 py-1 font-semibold">
          <Hash className="h-3.5 w-3.5" /> {order.steel_grade}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-steel-50 px-2.5 py-1 font-semibold">
          <Calendar className="h-3.5 w-3.5" /> {fmtDate(order.created_at)}
        </span>
      </div>

      <div className="rounded-xl bg-success-50 px-4 py-3">
        <p className="text-2xs font-semibold uppercase tracking-wide text-success-700">Dimensions</p>
        <p className="font-display text-2xl font-bold text-success-600">
          <Ruler className="mr-1 inline h-5 w-5 align-text-bottom" />
          {fmtSize(order)}
        </p>
      </div>

      {order.design_image_url && (
        <div className="flex items-center gap-3 rounded-xl bg-steel-50 p-2">
          <button
            onClick={() => setPreviewImg(order.design_image_url)}
            className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-steel-200"
          >
            <img src={order.design_image_url} alt="Design" className="h-full w-full object-cover" />
          </button>
          <p className="flex items-center gap-1.5 text-sm text-steel-600">
            <ImageIcon className="h-4 w-4" /> Design reference attached — tap to view
          </p>
        </div>
      )}

      {order.special_instructions && (
        <p className="text-sm text-steel-600">
          <span className="font-semibold text-steel-800">Note: </span>
          {order.special_instructions}
        </p>
      )}

      {actionLabel && (
        <button onClick={() => onAction(order)} disabled={busy} className={`${actionClass} w-full text-lg`}>
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ActionIcon className="h-5 w-5" />}
          {busy ? 'Updating…' : actionLabel}
        </button>
      )}
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('pending')
  const [busyId, setBusyId] = useState(null)
  const [query, setQuery] = useState('')
  const [previewImg, setPreviewImg] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (e) {
      setError(e.message || 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function advance(order) {
    setBusyId(order.id)
    try {
      const next = order.status === 'pending' ? 'in_progress' : 'completed'
      const updated = await updateOrderStatus(order.id, next)
      setOrders((list) => list.map((o) => (o.id === order.id ? updated : o)))
    } catch (e) {
      setError(e.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  const filtered = useMemo(() => {
    const byStatus = orders.filter((o) => o.status === tab)
    if (tab !== 'completed') return byStatus
    const q = query.trim().toLowerCase()
    if (!q) return byStatus
    return byStatus.filter(
      (o) =>
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.item_type.toLowerCase().includes(q)
    )
  }, [orders, tab, query])

  const counts = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === 'pending').length,
      in_progress: orders.filter((o) => o.status === 'in_progress').length,
      completed: orders.filter((o) => o.status === 'completed').length,
    }),
    [orders]
  )

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    navigate('/admin')
    setTimeout(() => window.location.reload(), 50)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-steel-900">Dashboard</h1>
          <p className="text-steel-500">Manage shop orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="btn-ghost px-3 py-2" title="Refresh">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button onClick={logout} className="btn-ghost px-3 py-2 text-danger-600">
            <LogOut className="h-5 w-5" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map((t) => {
          const active = tab === t.key
          const count = counts[t.key] || 0
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center transition ${
                active
                  ? 'bg-steel-900 text-white shadow-md'
                  : 'bg-white text-steel-600 hover:bg-steel-100'
              }`}
            >
              <t.icon className="h-6 w-6" />
              <span className="font-display text-base font-bold leading-none">{t.label}</span>
              <span className={`text-2xs font-semibold uppercase ${active ? 'text-steel-300' : 'text-steel-400'}`}>
                {t.sub} · {count}
              </span>
            </button>
          )
        })}
      </div>

      {tab === 'completed' && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400" />
          <input
            className="field-input pl-11"
            placeholder="Search by name, phone, or item…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-steel-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-3 font-semibold">Loading orders…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-steel-200 bg-white py-16 text-center">
          <Inbox className="h-12 w-12 text-steel-300" />
          <p className="mt-3 font-display text-lg font-bold text-steel-700">No orders here</p>
          <p className="text-sm text-steel-400">
            {tab === 'pending'
              ? 'New orders will appear here.'
              : tab === 'in_progress'
              ? 'Work in progress will show here.'
              : 'Completed orders will be archived here.'}
          </p>
        </div>
      ) : tab === 'completed' ? (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-steel-50 text-2xs font-bold uppercase tracking-wide text-steel-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Design</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-steel-50">
                    <td className="px-4 py-3 font-semibold text-steel-900">{o.customer_name}</td>
                    <td className="px-4 py-3 text-steel-600">{o.phone}</td>
                    <td className="px-4 py-3 text-steel-600">{o.item_type}</td>
                    <td className="px-4 py-3 font-bold text-success-600">{fmtSize(o)}</td>
                    <td className="px-4 py-3">
                      {o.design_image_url ? (
                        <button onClick={() => setPreviewImg(o.design_image_url)} className="h-12 w-12 overflow-hidden rounded-lg border border-steel-200">
                          <img src={o.design_image_url} alt="Design" className="h-full w-full object-cover" />
                        </button>
                      ) : (
                        <span className="text-steel-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-steel-500">{fmtDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              busyId={busyId}
              setPreviewImg={setPreviewImg}
              actionLabel={o.status === 'pending' ? 'Kaam Shuru Karein' : 'Kaam Poora Ho Gaya'}
              actionIcon={o.status === 'pending' ? Play : CheckCircle2}
              actionClass={o.status === 'pending' ? 'btn-accent' : 'btn-success'}
              onAction={advance}
            />
          ))}
        </div>
      )}

      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-steel-950/95 p-4" onClick={() => setPreviewImg(null)}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setPreviewImg(null)}>
            <X className="h-6 w-6" />
          </button>
          <img src={previewImg} alt="Design preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')

  if (!authed) return <PinLogin onSuccess={() => setAuthed(true)} />
  return <Dashboard />
}
