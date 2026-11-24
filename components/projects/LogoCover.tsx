import { logoCoverBackground } from '@/lib/logo-cover'

/**
 * A project's logo centred on a soft gradient of its accent colour. Fills its
 * (positioned) parent; the logo sits in an inset box and is contained, so it
 * never touches the edges or gets cut off at any card size.
 */
export function LogoCover({ logoUrl, accentColor, name }: { logoUrl: string; accentColor?: string; name: string }) {
  return (
    <div className="absolute inset-0" style={{ background: logoCoverBackground(accentColor) }}>
      <div className="absolute inset-x-[18%] inset-y-[16%]">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded logo (Cloudinary or any URL) */}
        <img src={logoUrl} alt={`${name} logo`} loading="lazy" className="size-full object-contain drop-shadow-[0_6px_18px_rgb(0_0_0/0.18)]" />
      </div>
    </div>
  )
}
