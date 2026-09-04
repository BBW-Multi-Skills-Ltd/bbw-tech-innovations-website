import type { RefObject } from 'react'
import { BORDER, MUTED, mono } from '../../styles/theme'
import { MAX_RECORDING_SECONDS } from './useVideoRecorder'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

interface VideoRecorderProps {
  videoRef: RefObject<HTMLVideoElement | null>
  recording: boolean
  elapsed: number
  videoUrl: string | null
  cameraError: string
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

export default function VideoRecorder({ videoRef, recording, elapsed, videoUrl, cameraError, onStart, onStop, onReset }: VideoRecorderProps) {
  if (cameraError) return <div style={{ marginBottom: 28, padding: 20, border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, background: 'rgba(239,68,68,0.06)', color: '#EF4444', fontSize: 13, lineHeight: 1.6 }}>{cameraError}</div>
  if (videoUrl) return (
    <div style={{ marginBottom: 28 }}>
      <video src={videoUrl} controls style={{ width: '100%', borderRadius: 8, background: '#000', maxHeight: 240 }} />
      <button type="button" onClick={onReset} style={{ width: '100%', marginTop: 12, padding: 10, border: `1px solid ${BORDER}`, borderRadius: 6, background: 'transparent', color: MUTED, fontSize: 13, cursor: 'pointer' }}>Record Again</button>
      <p style={{ ...mono, fontSize: 10, color: MUTED, marginTop: 10, lineHeight: 1.6 }}>Duration: {formatTime(elapsed)} — your recording is uploaded privately when sent.</p>
    </div>
  )
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ position: 'relative', background: '#000', borderRadius: 8, overflow: 'hidden', marginBottom: 12, minHeight: 200, display: 'grid', placeItems: 'center' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: 240, display: 'block', borderRadius: 8 }} />
        {recording && <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 100, padding: '4px 10px' }}><div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', animation: 'dot-pulse 1s ease-in-out infinite' }} /><span style={{ ...mono, fontSize: 12, color: '#fff' }}>{formatTime(MAX_RECORDING_SECONDS - elapsed)}</span></div>}
      </div>
      <button type="button" onClick={recording ? onStop : onStart} style={{ width: '100%', padding: 12, background: recording ? 'rgba(239,68,68,0.15)' : '#EF4444', border: recording ? '1px solid rgba(239,68,68,0.4)' : 'none', borderRadius: 6, color: recording ? '#EF4444' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{recording ? '■ Stop & Save' : '● Start Recording'}</button>
      {!recording && <p style={{ ...mono, fontSize: 10, color: MUTED, marginTop: 10 }}>Recording limit: 10 minutes. Be yourself — explain your idea naturally.</p>}
    </div>
  )
}
