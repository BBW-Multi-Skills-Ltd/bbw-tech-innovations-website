/** A wa.me link for a WhatsApp number in any common format, or null when unset or invalid. */
export function whatsappLink(number?: string) {
  const digits = number?.replace(/\D/g, '') ?? ''
  return digits.length >= 8 ? `https://wa.me/${digits}` : null
}
