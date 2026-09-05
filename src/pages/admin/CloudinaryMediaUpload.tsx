import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

type AssetType = 'image' | 'video' | 'audio'
interface Signature { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string; assetType: AssetType; resourceType: 'image' | 'video' }

export default function CloudinaryMediaUpload({ assetType, value, onChange }: { assetType: AssetType; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const label = assetType === 'image' ? 'Upload image to Cloudinary' : assetType === 'audio' ? 'Upload audio to Cloudinary' : 'Upload video to Cloudinary'

  const upload = async (file: File) => {
    if (!supabase) return
    if (!file.type.startsWith(`${assetType}/`)) { setError(`Choose a ${assetType} file.`); return }
    const maxSize = assetType === 'image' ? 10485760 : assetType === 'audio' ? 52428800 : 524288000
    if (file.size > maxSize) { setError(`${assetType === 'image' ? 'Images' : assetType === 'audio' ? 'Audio files' : 'Videos'} must be ${assetType === 'image' ? '10 MB' : assetType === 'audio' ? '50 MB' : '500 MB'} or smaller.`); return }
    setIsUploading(true); setError('')
    try {
      const { data, error: signatureError } = await supabase.functions.invoke('cloudinary-upload-signature', { body: { assetType } })
      if (signatureError) {
        const response = signatureError.context
        const detail = response instanceof Response ? await response.json().catch(() => null) : null
        if (detail && typeof detail === 'object' && 'error' in detail && typeof detail.error === 'string') throw new Error(detail.error)
        throw new Error('Could not prepare secure upload.')
      }
      if (!data) throw new Error('Could not prepare secure upload.')
      const credentials = data as Signature
      const form = new FormData()
      form.append('file', file); form.append('api_key', credentials.apiKey); form.append('timestamp', String(credentials.timestamp)); form.append('folder', credentials.folder); form.append('signature', credentials.signature)
      const response = await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/${credentials.resourceType}/upload`, { method: 'POST', body: form })
      const result = await response.json() as { secure_url?: string; error?: { message?: string } }
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message ?? `Could not upload ${assetType}.`)
      onChange(result.secure_url)
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : `Could not upload ${assetType}.`) }
    finally { setIsUploading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  return <div className="admin-demo-video-upload"><input ref={inputRef} type="file" accept={`${assetType}/*`} hidden onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file) }} /><button type="button" className="admin-secondary-button" disabled={isUploading} onClick={() => inputRef.current?.click()}>{isUploading ? 'Uploading…' : label}</button>{value && <a href={value} target="_blank" rel="noreferrer">Preview {assetType}</a>}{error && <span role="alert">{error}</span>}</div>
}
