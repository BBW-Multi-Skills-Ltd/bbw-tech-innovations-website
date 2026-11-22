import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="legal-page grid place-items-center text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mb-6 font-display text-[clamp(32px,4.5vw,54px)] font-bold tracking-[-0.025em]">This page doesn&apos;t exist.</h1>
        <Link href="/" className="btn-primary">← Return to site</Link>
      </div>
    </main>
  )
}
