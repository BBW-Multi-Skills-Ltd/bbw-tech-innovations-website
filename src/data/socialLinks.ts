export interface SocialLink {
  id: string
  platform: string
  url: string
  isEnabled: boolean
}

export const defaultSocialLinks: SocialLink[] = [
  { id: 'instagram', platform: 'instagram', url: 'https://www.instagram.com/bbwtech/', isEnabled: true },
  { id: 'tiktok', platform: 'tiktok', url: 'https://www.tiktok.com/@bbwtech', isEnabled: true },
  { id: 'facebook', platform: 'facebook', url: 'https://www.facebook.com/bbwtech', isEnabled: true },
]

export const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'facebook', 'linkedin', 'x', 'twitter', 'youtube', 'whatsapp', 'other'] as const

export function detectSocialPlatform(url: string) {
  const value = url.toLowerCase()
  if (value.includes('instagram.com')) return 'instagram'
  if (value.includes('tiktok.com')) return 'tiktok'
  if (value.includes('facebook.com') || value.includes('fb.com')) return 'facebook'
  if (value.includes('linkedin.com')) return 'linkedin'
  if (value.includes('twitter.com')) return 'twitter'
  if (value.includes('x.com')) return 'x'
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube'
  if (value.includes('wa.me') || value.includes('whatsapp.com')) return 'whatsapp'
  return 'other'
}
