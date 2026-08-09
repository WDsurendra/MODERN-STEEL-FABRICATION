import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X, ChevronLeft, ChevronRight, MessageCircle, Maximize2 } from 'lucide-react'
import { GALLERY_FILTERS } from '../gallery.js'
import { whatsappLink } from '../config.js'
import { supabase } from '../supabase.js'

function enquiryMessage(title, category) {
  return `Hello, I am interested in this ${category.toLowerCase()} design ("${title}") from your website gallery. Please share more details.`
}

export default function Portfolio() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Supabase 'gallery' table se photos fetch karein
  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error('Error fetching gallery:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((i) => i.category === filter)),
    [filter, items]
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

  const activeItem = lightboxIndex !== null ? filtered[lightboxIndex] : null

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-steel-600 font-medium">
        Gallery load ho rahi hai...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-steel-700 hover:text-steel-900 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
        <span className="text-xs text-steel-500 font-semibold uppercase tracking-wider">
          Work Gallery
        </span>
      </div>

      <div className="border-b border-steel-200 pb-4">
        <h1 className="text-2xl font-bold text-steel-900 sm:text-3xl">Design Gallery</h1>
        <p className="mt-1 text-sm text-steel-600">
          Browse our recent gate, railing, shutter, and custom fabrication work.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? 'bg-steel-900 text-white shadow'
                : 'bg-steel-100 text-steel-700 hover:bg-steel-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-steel-500">
          Is category me filhal koi photo nahi hai.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <div
              key={item.id || idx}
              className="group relative overflow-hidden rounded-xl border border-steel-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-steel-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <span className="inline-block rounded-md bg-steel-100 px-2 py-0.5 text-[11px] font-semibold text-steel-700">
                  {item.category}
                </span>
                <h3 className="mt-1 font-semibold text-steel-900">{item.title}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setLightboxIndex(idx)}
                    className="inline-flex items-center gap-1 rounded-lg border border-steel-300 bg-white px-2.5 py-1.5 text-xs font-medium text-steel-700 hover:bg-steel-50 transition"
                  >
                    <Maximize2 className="h-3.5 w-3.5" /> View
                  </button>
                  <a
                    href={whatsappLink(enquiryMessage(item.title, item.category))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-accent-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-accent-700 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Enquiry
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 p-2"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 p-2"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="max-h-[90vh] max-w-3xl overflow-hidden rounded-xl bg-white p-2 shadow-2xl">
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="max-h-[70vh] w-full object-contain rounded-lg"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-steel-900">{activeItem.title}</h3>
              <p className="text-xs text-steel-500">{activeItem.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}