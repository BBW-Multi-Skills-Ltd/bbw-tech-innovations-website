import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Signature { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string }

export default function DemoVideoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file: File) => {
    if (!supabase) return
    if (!file.type.startsWith('video/')) { setError('Choose a video file.'); return }
    if (file.size > 524288000) { setError('Videos must be 500 MB or smaller.'); return }
    setIsUploading(true); setError('')
    try {
      const { data, error: signatureError } = await supabase.functions.invoke('cloudinary-upload-signature')
      if (signatureError || !data) throw new Error('Could not prepare secure upload.')
      const credentials = data as Signature
      const form = new FormData()
      form.append('file', file); form.append('api_key', credentials.apiKey); form.append('timestamp', String(credentials.timestamp))
      form.append('folder', credentials.folder); form.append('signature', credentials.signature)
      const response = await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/video/upload`, { method: 'POST', body: form })
      const result = await response.json() as { secure_url?: string; error?: { message?: string } }
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message ?? 'Could not upload video.')
      onChange(result.secure_url)
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Could not upload video.') }
    finally { setIsUploading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  return <div className="admin-demo-video-upload"><input ref={inputRef} type="file" accept="video/*" hidden onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file) }} /><button type="button" className="admin-secondary-button" disabled={isUploading} onClick={() => inputRef.current?.click()}>{isUploading ? 'Uploading…' : 'Upload to Cloudinary'}</button>{value && <a href={value} target="_blank" rel="noreferrer">Preview video</a>}{error && <span role="alert">{error}</span>}</div>
}
