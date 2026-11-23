'use client'

import { Video } from 'lucide-react'
import { useSiteActions } from '@/components/home/SiteActions'

/** The highlighted video enquiry tile: opens the contact form on the video recorder. */
export function VideoEnquiryButton() {
  const { openContact } = useSiteActions()
  return (
    <button
      type="button"
      onClick={() => openContact('video')}
      className="group flex min-h-56 cursor-pointer flex-col items-start rounded-[10px] border-none bg-bbw-accent p-8 text-left text-white transition-opacity duration-200 hover:opacity-90 stick:min-h-0 stick:p-5 min-[960px]:min-h-[min(240px,32svh)] min-[960px]:p-10"
    >
      <span className="flex size-12 items-center justify-center rounded-[12px] bg-black/15 stick:hidden">
        <Video size={22} aria-hidden="true" />
      </span>
      <span className="mt-6 font-mono text-[10px] tracking-[0.15em] uppercase opacity-80 stick:mt-0">Video enquiry · Max 30 min</span>
      <span className="mt-1 font-display text-[34px] leading-tight font-bold tracking-[-0.02em] stick:text-[24px] min-[960px]:text-[40px]">Record a Video</span>
      <span className="mt-auto pt-4 text-[16px] stick:pt-1 stick:text-[14px]">Record a short video about your project</span>
    </button>
  )
}
