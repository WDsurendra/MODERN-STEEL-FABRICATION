import { isSupabaseConfigured, supabase } from './supabase.js'

// Mock in-memory store so the app works in preview before real keys are plugged in.
// Once VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are valid, all calls hit Supabase instead.

const STORAGE_KEY = 'msf_mock_orders_v1'

function uid() {
  return 'mock-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function seedMock() {
  const now = Date.now()
  const day = 86400000
  return [
    {
      id: uid(),
      customer_name: 'Ramesh Kumar',
      phone: '98765 43210',
      item_type: 'Gate',
      steel_grade: 'SS 304',
      height_ft: 7,
      height_in: 0,
      width_ft: 12,
      width_in: 0,
      special_instructions: 'Sliding gate with peacock design on top',
      design_image_url: 'https://images.pexels.com/photos/13165402/pexels-photo-13165402.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      status: 'pending',
      created_at: new Date(now - day * 0).toISOString(),
      updated_at: new Date(now - day * 0).toISOString(),
    },
    {
      id: uid(),
      customer_name: 'Sunita Devi',
      phone: '99887 76655',
      item_type: 'Window',
      steel_grade: 'SS 201',
      height_ft: 4,
      height_in: 6,
      width_ft: 5,
      width_in: 0,
      special_instructions: 'Two windows, mesh on inside',
      status: 'pending',
      created_at: new Date(now - day * 0.5).toISOString(),
      updated_at: new Date(now - day * 0.5).toISOString(),
    },
    {
      id: uid(),
      customer_name: 'Mohan Lal',
      phone: '91234 56789',
      item_type: 'Door',
      steel_grade: 'SS 304',
      height_ft: 7,
      height_in: 3,
      width_ft: 3,
      width_in: 6,
      special_instructions: 'Double door, brass handle',
      status: 'in_progress',
      created_at: new Date(now - day * 2).toISOString(),
      updated_at: new Date(now - day * 1).toISOString(),
    },
    {
      id: uid(),
      customer_name: 'Anita Sharma',
      phone: '90011 22334',
      item_type: 'Railing',
      steel_grade: 'SS 201',
      height_ft: 3,
      height_in: 0,
      width_ft: 20,
      width_in: 0,
      special_instructions: 'Balcony railing, vertical bars',
      design_image_url: 'https://images.pexels.com/photos/13272374/pexels-photo-13272374.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      status: 'completed',
      created_at: new Date(now - day * 10).toISOString(),
      updated_at: new Date(now - day * 5).toISOString(),
    },
    {
      id: uid(),
      customer_name: 'Vikram Singh',
      phone: '93344 55667',
      item_type: 'Gate',
      steel_grade: 'SS 304',
      height_ft: 6,
      height_in: 6,
      width_ft: 10,
      width_in: 0,
      special_instructions: 'Main gate with name plate space',
      status: 'completed',
      created_at: new Date(now - day * 20).toISOString(),
      updated_at: new Date(now - day * 15).toISOString(),
    },
  ]
}

function loadMock() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  const seed = seedMock()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

function saveMock(rows) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  } catch {
    // ignore
  }
}

export async function fetchOrders() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  // small artificial delay so loading states show
  await new Promise((r) => setTimeout(r, 250))
  return loadMock()
}

export async function createOrder(payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }
  await new Promise((r) => setTimeout(r, 250))
  const rows = loadMock()
  const row = {
    id: uid(),
    ...payload,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  rows.unshift(row)
  saveMock(rows)
  return row
}

export async function updateOrderStatus(id, status) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  await new Promise((r) => setTimeout(r, 200))
  const rows = loadMock()
  const idx = rows.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error('Order not found')
  rows[idx] = { ...rows[idx], status, updated_at: new Date().toISOString() }
  saveMock(rows)
  return rows[idx]
}
