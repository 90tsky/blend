import { useEffect, useRef, useState } from 'react'
import { DEMO_PHOTO } from '../../services/tryOn'
import { Icon } from '../../ui/Icon'
import { RoundButton } from '../../ui/primitives'
import { useTryOn } from './flow'
import { Step } from './Step'

type Facing = 'user' | 'environment'

// TAKE A PHOTO (Figma Try-On · camera 1734:18914, timer on 1776:10762, countdown 1734:19021): the live camera with
// front/back switching, the 5-second timer and the shutter. Denied → "Camera access is off". Where there's no camera
// at all (or the page isn't secure, e.g. plain http on a phone), the demo person stands in so the flow can be shown.
export function Camera() {
  const { setPhoto, setRoute, go } = useTryOn()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [facing, setFacing] = useState<Facing>('user')
  const [timer, setTimer] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [noCamera, setNoCamera] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false
    setReady(false)
    if (!navigator.mediaDevices?.getUserMedia) {
      setNoCamera(true)
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: facing, width: { ideal: 1080 }, height: { ideal: 1920 } }, audio: false })
      .then(async (s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop())
        stream = s
        const video = videoRef.current
        if (!video) return
        video.srcObject = s
        await video.play().catch(() => {})
        setReady(true)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const name = err instanceof DOMException ? err.name : ''
        if (name === 'NotAllowedError' || name === 'SecurityError') go('camera-off')
        else setNoCamera(true)
      })
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
    // `go` only changes once a photo is taken, and then this screen is leaving anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing])

  const capture = async () => {
    if (noCamera) {
      setPhoto(await (await fetch(DEMO_PHOTO)).blob())
    } else {
      const video = videoRef.current
      if (!video || !video.videoWidth) return
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      // The front camera shows a mirror image; keep the photo the way the shopper saw it.
      if (facing === 'user') ctx.setTransform(-1, 0, 0, 1, canvas.width, 0)
      ctx.drawImage(video, 0, 0)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
      if (!blob) return
      setPhoto(blob)
    }
    setRoute('photo')
    go('preview')
  }

  // 5 → 1, one a second, then the photo.
  useEffect(() => {
    if (count === null) return
    if (count === 0) {
      setCount(null)
      void capture()
      return
    }
    const t = window.setTimeout(() => setCount(count - 1), 1000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const shoot = () => {
    if (count !== null) return
    if (timer) setCount(5)
    else void capture()
  }

  // Turning the timer off also stops a countdown.
  const toggleTimer = () => {
    setTimer(!timer)
    setCount(null)
  }

  return (
    <Step title="Take a photo" fit>
      <div className="camera">
        <div className="camera__feed">
          {noCamera ? (
            <img src={DEMO_PHOTO} alt="" />
          ) : (
            <video ref={videoRef} className={facing === 'user' ? 'is-mirrored' : undefined} playsInline muted autoPlay />
          )}
          <p className="camera__guide">Head to toe in the frame</p>
          {count !== null && count > 0 && (
            <span className="camera__count" aria-hidden="true">
              {count}
            </span>
          )}
        </div>
        <p className="visually-hidden" aria-live="assertive">
          {count || ''}
        </p>
        <p className={`camera__hint${timer ? '' : ' camera__hint--off'}`}>Prop your phone up and step back.</p>
        <div className="camera__controls">
          <button type="button" className="round-btn" aria-label="Timer, 5 seconds" aria-pressed={timer} onClick={toggleTimer}>
            {timer ? <TimerFive /> : <Icon name="timer" />}
          </button>
          <button type="button" className="camera__shutter" aria-label="Take a photo" disabled={!ready && !noCamera} onClick={shoot}>
            <span />
          </button>
          <RoundButton icon="switch-camera" label="Switch camera" disabled={noCamera} onClick={() => setFacing(facing === 'user' ? 'environment' : 'user')} />
        </div>
      </div>
    </Step>
  )
}

// The timer icon while it's on: the stopwatch with a 5 inside.
function TimerFive() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
      <path d="M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM9.5 3h5M18 6l1.2-1.2" />
      <text x="12" y="16.3" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="currentColor" stroke="none">
        5
      </text>
    </svg>
  )
}
