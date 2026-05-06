import { useEffect, useRef } from 'react'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4'

const FADE_S = 0.5
const END_GAP_MS = 100

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId = 0

    const tick = () => {
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) {
        video.style.opacity = '0'
        rafId = requestAnimationFrame(tick)
        return
      }

      const t = video.currentTime
      const opacity =
        t < FADE_S
          ? t / FADE_S
          : t < duration - FADE_S
            ? 1
            : t < duration
              ? (duration - t) / FADE_S
              : 0

      video.style.opacity = String(opacity)
      rafId = requestAnimationFrame(tick)
    }

    const onEnded = () => {
      video.pause()
      video.currentTime = 0
      window.setTimeout(() => {
        void video.play()
      }, END_GAP_MS)
    }

    video.addEventListener('ended', onEnded)
    rafId = requestAnimationFrame(tick)
    void video.play().catch(() => {})

    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0 }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
  )
}
