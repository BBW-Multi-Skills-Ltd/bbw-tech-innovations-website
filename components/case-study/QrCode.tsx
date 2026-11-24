/** A download QR code for an app (as the project popup showed it), drawn by api.qrserver.com. */
export function QrCode({ url }: { url: string }) {
  const source = `https://api.qrserver.com/v1/create-qr-code/?size=126x126&margin=1&data=${encodeURIComponent(url)}`
  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="inline-block rounded-lg border border-bbw-border bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- generated QR image from an external service */}
        <img src={source} width={126} height={126} alt="QR code for product download" className="block" loading="lazy" />
      </div>
      <p className="font-mono text-[10px] tracking-[0.12em] text-bbw-muted uppercase">Scan to Download</p>
    </div>
  )
}
