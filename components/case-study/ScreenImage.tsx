/**
 * A screenshot filling its (positioned) frame. BBW's images come from
 * Cloudinary or any URL typed in the admin, so they load as they are.
 */
export function ScreenImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded (Cloudinary or any URL), size unknown
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      className="absolute inset-0 size-full object-cover object-top"
    />
  )
}
