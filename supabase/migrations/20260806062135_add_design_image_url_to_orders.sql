/*
# Add design_image_url column to orders

1. Modified Tables
- `orders`
  - Add `design_image_url` (text, nullable) — optional URL to a design reference image
    (e.g. a photo from the gallery the customer wants to replicate, or an uploaded design photo).
    Shown as a thumbnail in the admin dashboard next to measurement data.

2. Security
- No policy changes. The existing anon + authenticated CRUD policies already cover the new column
  because they are table-level (USING (true) / WITH CHECK (true)).

3. Important Notes
- This is a non-destructive ADD COLUMN. Existing rows get NULL for design_image_url.
- The column is optional; the form and admin UI treat a null/empty value as "no image".
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS design_image_url text;
