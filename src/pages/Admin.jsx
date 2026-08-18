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
  Upload,
} from 'lucide-react'
import { fetchOrders, updateOrderStatus } from '../data.js'
import { supabase } from '../supabase.js'

const ADMIN_PIN = '1234'
const SESSION_KEY = 'msf_admin_authed'

const TABS = [
  { key: 'pending', label: 'Naye Kaam', sub: 'Pending', icon: ClipboardList, color: 'accent' },
  { key: 'in_progress', label: 'Chalu Kaam', sub: 'In Progress', icon: HardHat, color: 'steel' },
  { key: 'completed', label: 'Purane Kaam', sub: 'History', icon: History, color: 'success' },
  { key: 'gallery_upload', label: 'Gallery Photo', sub: 'Upload', icon: ImageIcon, color: 'steel' },
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

function GalleryUploadSection() {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)

  function handleFileChange(e) {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null)
      setPreview(null)
      return
    }
    const file = e.target.files[0]
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleUpload() {
    if (!selectedFile) {
      alert('Kripya pehle ek photo select karein.')
      return
    }

    try {
      setUploading(true)
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ image_url: publicUrl, created_at: new Date() }])

      if (dbError) throw dbError

      alert('Photo kamyabi se gallery mein upload ho gayi h!')
      setSelectedFile(null)
      setPreview(null)
    } catch (error) {
      alert('Upload fail ho gaya: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card max-w-xl mx-auto space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-steel-100">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-steel-900">Nayi Photo Upload Karein</h2>
        <p className="text-sm text-steel-500 mt-1">Yeh photo direct aapki live website ki gallery mein dikhegi.</p>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-steel-300 rounded-2xl p-4 bg-steel-50 hover:bg-steel-100 transition relative min-h-[200px]">
        {preview ? (
          <div className="relative w-full max-h-60 overflow-hidden rounded-xl">
            <img src={preview} alt="Preview" className="w-full h-full object-contain mx-auto" />
            <button
              onClick={() => { setSelectedFile(null); setPreview(null); }}
              className="absolute top-2 right-2 p-1.5 bg-steel-900/80 text-white rounded-full hover:bg-steel-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer w-full py-8">
            <Upload className="h-10 w-10 text-steel-400 mb-2" />
            <span className="text-sm font-semibold text-steel-600">Photo Select Karne Ke Liye Tap Karein</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="btn-accent w-full text-lg py-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
