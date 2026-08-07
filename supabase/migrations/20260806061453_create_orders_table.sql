/*
# Create orders table for Modern Steel Fabrication

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `customer_name` (text, not null) — customer who placed the order
  - `phone` (text, not null) — contact phone number
  - `item_type` (text, not null) — one of: Gate, Window, Door, Railing
  - `steel_grade` (text, not null) — one of: SS 304, SS 201
  - `height_ft` (int, not null) — height in feet
  - `height_in` (int, not null, default 0) — additional height in inches
  - `width_ft` (int, not null) — width in feet
  - `width_in` (int, not null, default 0) — additional width in inches
  - `special_instructions` (text, nullable) — free-form notes from customer
  - `status` (text, not null, default 'pending') — one of: pending, in_progress, completed
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- This is a single-tenant shop app with no sign-in screen (admin uses a local PIN only).
  The frontend talks to Supabase with the anon key, so policies allow anon + authenticated CRUD.
- Add indexes on `status` and `created_at` for fast dashboard tab queries.

3. Important Notes
- The admin PIN (1234) is enforced client-side only; it is a UX gate, not a security boundary.
  The shop owner wanted an ultra-simple 4-digit PIN. Real row-level protection comes from the
  anon-key RLS policies below — anyone with the anon key can read/write orders, which is the
  intended behavior for this shared shop tool.
- `updated_at` is maintained by the application on status changes.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('Gate', 'Window', 'Door', 'Railing')),
  steel_grade text NOT NULL CHECK (steel_grade IN ('SS 304', 'SS 201')),
  height_ft integer NOT NULL CHECK (height_ft >= 0 AND height_ft <= 30),
  height_in integer NOT NULL DEFAULT 0 CHECK (height_in >= 0 AND height_in <= 11),
  width_ft integer NOT NULL CHECK (width_ft >= 0 AND width_ft <= 30),
  width_in integer NOT NULL DEFAULT 0 CHECK (width_in >= 0 AND width_in <= 11),
  special_instructions text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders"
ON orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders"
ON orders FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders"
ON orders FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
