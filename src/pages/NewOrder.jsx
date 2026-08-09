import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ClipboardPlus, Ruler, User, Phone, Hash, ChevronDown, ImageIcon, Link2 } from 'lucide-react'
import { createOrder } from '../data.js'
import { isSupabaseConfigured } from '../supabase.js'

const ITEM_TYPES = ['Gate', 'Window', 'Door', 'Railing']
const STEEL_GRADES = ['SS 304', 'SS 201']
const FEET_OPTIONS = Array.from({ length: 31 }, (_, i) => i) // 0..30
const INCH_OPTIONS = Array.from({ length: 12 }, (_, i) => i) // 0..11

function Select({ label, value, onChange, options, icon: Icon, suffix }) {
  return (
    <div className="flex-1">
      <label className="field-label flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-steel-500" />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="field-select pr-10"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
              {suffix ? ` ${suffix}` : ''}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400" />
      </div>
    </div>
  )
}

export default function NewOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const presetItem = location.state?.presetItem

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    item_type: presetItem || ITEM_TYPES[0],
    steel_grade: STEEL_GRADES[0],
    height_ft: 6,
    height_in: 0,
    width_ft: 5,
    width_in: 0,
    special_instructions: '',
    design_image_url: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setNum = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const valid = useMemo(
    () =>
      form.customer_name.trim().length > 0 &&
      form.phone.trim().length >= 6 &&
      form.height_ft + form.height_in > 0 &&
      form.width_ft + form.width_in > 0,
    [form]
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!valid || submitting) return
    setError('')
    setSubmitting(true)
    try {
      await createOrder({
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        item_type: form.item_type,
        steel_grade: form.steel_grade,
        height_ft: form.height_ft,
        height_in: form.height_in,
        width_ft: form.width_ft,
        width_in: form.width_in,
        special_instructions: form.special_instructions.trim() || null,
        design_image_url: form.design_image_url.trim() || null,
      })
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not submit order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-success-100 text-success-600">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-steel-900">Order Placed!</h1>
        <p className="mt-2 max-w-sm text-steel-600">
          Your order has been recorded. The shop owner will see it in the pending list and start work soon.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
          <button onClick={() => navigate('/new-order')} className="btn-primary">
            <ClipboardPlus className="h-5 w-5" /> Place Another Order
          </button>
          <button onClick={() => navigate('/')} className="btn-ghost">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-semibold text-steel-600">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-steel-900">New Order / Measurement</h1>
        <p className="text-steel-500">Fill the details. Use the dropdowns — no typing needed for size.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-600">
          Preview mode: orders are saved in this browser only. They will sync to the shop once keys are connected.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer */}
        <fieldset className="card space-y-4">
          <legend className="font-display text-lg font-bold text-steel-900">Customer Details</legend>
          <div>
            <label className="field-label flex items-center gap-2">
              <User className="h-5 w-5 text-steel-500" /> Customer Name
            </label>
            <input
              className="field-input"
              placeholder="e.g. surendra Kumar"
              value={form.customer_name}
              onChange={set('customer_name')}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="field-label flex items-center gap-2">
              <Phone className="h-5 w-5 text-steel-500" /> Phone Number
            </label>
            <input
              className="field-input"
              type="tel"
              inputMode="tel"
              placeholder="e.g. 88756 42587"
              value={form.phone}
              onChange={set('phone')}
              autoComplete="tel"
            />
          </div>
        </fieldset>

        {/* Item */}
        <fieldset className="card space-y-4">
          <legend className="font-display text-lg font-bold text-steel-900">Item Details</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label flex items-center gap-2">
                <Hash className="h-5 w-5 text-steel-500" /> Item Type
              </label>
              <div className="relative">
                <select
                  value={form.item_type}
                  onChange={set('item_type')}
                  className="field-select pr-10"
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400" />
              </div>
            </div>
            <div>
              <label className="field-label">Steel Grade</label>
              <div className="relative">
                <select
                  value={form.steel_grade}
                  onChange={set('steel_grade')}
                  className="field-select pr-10"
                >
                  {STEEL_GRADES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Measurements */}
        <fieldset className="card space-y-4">
          <legend className="font-display flex items-center gap-2 text-lg font-bold text-steel-900">
            <Ruler className="h-5 w-5 text-accent-500" /> Measurement Section
          </legend>
          <p className="text-sm text-steel-500">Pick from dropdowns to avoid typing mistakes.</p>

          <div>
            <p className="field-label">Height</p>
            <div className="flex gap-3">
              <Select
                label="Feet"
                value={form.height_ft}
                onChange={setNum('height_ft')}
                options={FEET_OPTIONS}
                suffix="ft"
              />
              <Select
                label="Inches"
                value={form.height_in}
                onChange={setNum('height_in')}
                options={INCH_OPTIONS}
                suffix="in"
              />
            </div>
          </div>

          <div>
            <p className="field-label">Width</p>
            <div className="flex gap-3">
              <Select
                label="Feet"
                value={form.width_ft}
                onChange={setNum('width_ft')}
                options={FEET_OPTIONS}
                suffix="ft"
              />
              <Select
                label="Inches"
                value={form.width_in}
                onChange={setNum('width_in')}
                options={INCH_OPTIONS}
                suffix="in"
              />
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded-xl bg-steel-50 px-4 py-3 text-center">
            <p className="text-2xs font-semibold uppercase tracking-wide text-steel-400">Total Size</p>
            <p className="font-display text-2xl font-bold text-success-600">
              {form.height_ft}′ {form.height_in}″ × {form.width_ft}′ {form.width_in}″
            </p>
          </div>
        </fieldset>

        {/* Instructions */}
        <fieldset className="card space-y-2">
          <legend className="font-display text-lg font-bold text-steel-900">Special Instructions</legend>
          <textarea
            className="field-input min-h-[100px] resize-y"
            placeholder="Any design notes, color, handle type, mesh, etc. (optional)"
            value={form.special_instructions}
            onChange={set('special_instructions')}
          />
        </fieldset>

        {/* Design image URL */}
        <fieldset className="card space-y-3">
          <legend className="font-display flex items-center gap-2 text-lg font-bold text-steel-900">
            <ImageIcon className="h-5 w-5 text-accent-500" /> Design Image URL <span className="text-sm font-normal text-steel-400">(optional)</span>
          </legend>
          <p className="text-sm text-steel-500">Paste a link to a design photo (e.g. from the gallery) so the shop owner can see it.</p>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 shrink-0 text-steel-400" />
            <input
              className="field-input"
              type="url"
              placeholder="https://…"
              value={form.design_image_url}
              onChange={set('design_image_url')}
            />
          </div>
          {form.design_image_url.trim() && (
            <div className="overflow-hidden rounded-xl border border-steel-200">
              <img
                src={form.design_image_url.trim()}
                alt="Design preview"
                className="max-h-48 w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          )}
        </fieldset>

        {error && (
          <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600">
            {error}
          </div>
        )}

        <button type="submit" className="btn-accent w-full text-lg" disabled={!valid || submitting}>
          {submitting ? 'Saving…' : 'Submit Order'}
        </button>
      </form>
    </div>
  )
}
