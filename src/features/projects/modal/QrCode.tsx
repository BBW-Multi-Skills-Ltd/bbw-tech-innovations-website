import { BORDER, MUTED, mono } from '../../../styles/theme'

export default function QrCode({ url }: { url: string }) {
  const source = `https://api.qrserver.com/v1/create-qr-code/?size=126x126&margin=1&data=${encodeURIComponent(url)}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`, display: 'inline-block' }}>
        <img src={source} width={126} height={126} alt="QR code for product download" style={{ display: 'block' }} />
      </div>
      <p style={{ ...mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>Scan to Download</p>
    </div>
  )
}
