import { supabase } from '../../lib/supabase'
import type { ContactDetails } from './types'

interface EnquiryInput extends ContactDetails {
  message?: string
  videoBlob?: Blob | null
}

function client() {
  if (!supabase) throw new Error('The enquiry service is not configured yet.')
  return supabase
}

async function invoke(functionName: string, body: Record<string, unknown>) {
  const { data, error } = await client().functions.invoke(functionName, { body })
  if (error) {
    const response = error.context
    const detail = response instanceof Response ? await response.json().catch(() => null) : null
    if (detail && typeof detail === 'object' && 'error' in detail && typeof detail.error === 'string') throw new Error(detail.error)
    throw new Error('We could not send your enquiry. Please try again.')
  }
  if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') throw new Error(data.error)
  return data as Record<string, unknown>
}

const contactBody = ({ name, email, phone }: ContactDetails) => ({ name: name.trim(), email: email.trim(), phone: phone.trim(), website: '' })

export async function submitMessageEnquiry(input: EnquiryInput) {
  await invoke('submit-enquiry', { ...contactBody(input), kind: 'message', message: input.message?.trim() ?? '' })
}

export async function submitVideoEnquiry(input: EnquiryInput) {
  if (!input.videoBlob) throw new Error('Please record a video before sending.')
  const prepared = await invoke('submit-enquiry', { ...contactBody(input), kind: 'video', videoSize: input.videoBlob.size })
  const id = typeof prepared.id === 'string' ? prepared.id : ''
  const path = typeof prepared.path === 'string' ? prepared.path : ''
  const token = typeof prepared.token === 'string' ? prepared.token : ''
  if (!id || !path || !token) throw new Error('We could not prepare your private video upload.')
  const { error } = await client().storage.from('enquiry-videos').uploadToSignedUrl(path, token, input.videoBlob, { contentType: input.videoBlob.type || 'video/webm' })
  if (error) throw new Error('Your video could not be uploaded. Please try again.')
  await invoke('finalize-video-enquiry', { id })
}
