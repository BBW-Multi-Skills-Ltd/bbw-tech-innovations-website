import { supabase } from '@/lib/supabase/browser'
import type { ContactDetails } from '@/components/contact/types'

// Video enquiries were removed from the site (Nov 2026); past ones stay viewable in the admin.
interface EnquiryInput extends ContactDetails {
  message: string
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
  await invoke('submit-enquiry', { ...contactBody(input), kind: 'message', message: input.message.trim() })
}

