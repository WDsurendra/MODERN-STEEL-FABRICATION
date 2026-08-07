import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X, ChevronLeft, ChevronRight, MessageCircle, Maximize2 } from 'lucide-react'
import { GALLERY_ITEMS, GALLERY_FILTERS } from '../gallery.js'
import { whatsappLink } from '../config.js'

function enquiryMessage(title, category) {
  return `Hello, I am interested in this ${category.toLowerCase()} design ("${title}") from your website gallery. Please share more details.`
}

export default function Portfolio() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered = useMemo(
    () => (filter === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === filter)),
    [filter]
  )

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  )
  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, nextImage, prevImage])

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-semibold text-steel-600">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-steel-900">Our Work Gallery</h1>
        <p className="text-steel-500">Tap any photo to view it large. Enquire on WhatsApp for a similar design.</p>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {GALLERY_FILTERS.map((f) => {
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                active ? 'bg-steel-900 text-white shadow-sm' : 'bg-white text-steel-600 hover:bg-steel-100'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.map((item, idx) => (
          <div key={item.id} className="group overflow-hidden rounded-2xl border border-steel-100 bg-white shadow-sm">
            <button
              onClick={() => setLightboxIndex(idx)}
              className="relative block aspect-[4/3] w-full overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-steel-900/70 text-white opacity-0 transition group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
              <span className="absolute bottom-2 left-2 rounded-full bg-steel-900/70 px-2.5 py-1 text-2xs font-bold uppercase tracking-wide text-white">
                {item.category}
              </span>
            </button>
            <div className="space-y-2 p-3">
              <p className="text-sm font-bold leading-tight text-steel-900">{item.title}</p>
              <a
                href={whatsappLink(enquiryMessage(item.title, item.category))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-success-500 px-3 py-2.5 text-sm font-bold text-white transition active:scale-95 hover:bg-success-600"
              >
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-steel-950/95 p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <figure className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.image}
              alt={active.title}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-4 flex flex-col items-center gap-3 text-center">
              <p className="font-display text-lg font-bold text-white">{active.title}</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-2xs font-bold uppercase tracking-wide text-steel-200">
                {active.category}
              </span>
              <a
                href={whatsappLink(enquiryMessage(active.title, active.category))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-success-500 px-5 py-3 text-base font-bold text-white transition active:scale-95 hover:bg-success-600"
              >
                <MessageCircle className="h-5 w-5" /> Enquire on WhatsApp
              </a>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}
