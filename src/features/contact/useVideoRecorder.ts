import { useCallback, useEffect, useRef, useState } from 'react'

export const MAX_RECORDING_SECONDS = 30 * 60

export default function useVideoRecorder() {
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (timerRef.current) window.clearInterval(timerRef.current)
  }, [])

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    setRecording(false)
    stopStream()
  }, [stopStream])

  const startCamera = useCallback(async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.muted = true }
    } catch {
      setCameraError('Camera access denied. Please allow camera permissions in your browser settings.')
    }
  }, [])

  const prepareCamera = useCallback(async () => {
    setVideoUrl(current => { if (current) URL.revokeObjectURL(current); return null })
    setElapsed(0)
    setRecording(false)
    await startCamera()
  }, [startCamera])

  const startRecording = () => {
    const stream = streamRef.current
    if (!stream) return
    chunksRef.current = []
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
    const recorder = new MediaRecorder(stream, { mimeType })
    recorder.ondataavailable = event => { if (event.data.size > 0) chunksRef.current.push(event.data) }
    recorder.onstop = () => setVideoUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'video/webm' })))
    recorder.start(1000)
    recorderRef.current = recorder
    setRecording(true)
    setElapsed(0)
    let seconds = 0
    timerRef.current = window.setInterval(() => {
      seconds += 1
      setElapsed(seconds)
      if (seconds >= MAX_RECORDING_SECONDS) stopRecording()
    }, 1000)
  }

  const reset = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.onstop = null
      recorderRef.current.stop()
    }
    setRecording(false)
    stopStream()
    setElapsed(0)
    setVideoUrl(current => { if (current) URL.revokeObjectURL(current); return null })
    setCameraError('')
  }, [stopStream])

  useEffect(() => () => {
    stopStream()
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }, [stopStream])

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
  }, [videoUrl])

  return { videoRef, recording, elapsed, videoUrl, cameraError, prepareCamera, startRecording, stopRecording, reset }
}
