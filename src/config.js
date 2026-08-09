// Central shop config — phone, WhatsApp number, and shared helpers.
// Update SHOP_PHONE to the owner's real number (country code, no plus, no spaces)
// to route "Enquire on WhatsApp" and "Call Now" to the right person.

export const SHOP_PHONE_DISPLAY = '+91 85020 84234'
export const SHOP_PHONE_RAW = '918502084234'

export function whatsappLink(message) {
  const text = encodeURIComponent(message || 'Hello, I am interested in your steel fabrication work. Please share more details.')
  return `https://wa.me/${SHOP_PHONE_RAW}?text=${text}`
}

export function telLink() {
  return `tel:+${SHOP_PHONE_RAW}`
}
