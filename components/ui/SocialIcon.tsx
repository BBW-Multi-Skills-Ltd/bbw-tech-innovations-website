import type { IconType } from 'react-icons'
import { FaFacebookF, FaInstagram, FaLink, FaLinkedinIn, FaTiktok, FaTwitter, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'

const icons: Record<string, IconType> = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  twitter: FaTwitter,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
}

export default function SocialIcon({ platform, size = 17 }: { platform: string; size?: number }) {
  const Icon = icons[platform.toLowerCase()] ?? FaLink
  return <Icon size={size} aria-hidden="true" />
}
