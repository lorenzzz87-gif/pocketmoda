export function buildWhatsAppLink(phone: string, prefillText?: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const text = prefillText ? encodeURIComponent(prefillText) : ''
  return `https://wa.me/${cleaned}${text ? `?text=${text}` : ''}`
}

export function buildOrderWhatsApp(phone: string, orderId: string, productTitle: string): string {
  const text = `Hi, I just placed an order on PocketModa (Order #${orderId.slice(0, 8).toUpperCase()}) for "${productTitle}". Looking forward to confirming the details with you.`
  return buildWhatsAppLink(phone, text)
}
