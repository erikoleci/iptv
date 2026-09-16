import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import type { Channel } from '../types'

interface PlayerProps {
  channel: Channel
}

type Status = 'loading' | 'ready' | 'error'

export function Player({ channel }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setStatus('loading')
    let hls: Hls | null = null
    let cancelled = false

    function handlePlayable() {
      if (!cancelled) setStatus('ready')
    }

    const isM3u8 = /\.m3u8($|\?)/i.test(channel.streamUrl)

    if (isM3u8 && Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true,
      })
      hls.loadSource(channel.streamUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, handlePlayable)
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal && !cancelled) {
          setStatus('error')
          hls?.destroy()
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || !isM3u8) {
      // Native HLS support (Safari) or a regular browser-compatible stream
      video.src = channel.streamUrl
      video.addEventListener('loadedmetadata', handlePlayable)
      video.addEventListener('error', () => {
        if (!cancelled) setStatus('error')
      })
    } else {
      setStatus('error')
    }

    return () => {
      cancelled = true
      if (hls) hls.destroy()
      if (video) {
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [channel.streamUrl])

  return (
    <div className="player">
      <video
        ref={videoRef}
        className="player__video"
        controls
        autoPlay
        playsInline
        style={{ display: status === 'error' ? 'none' : 'block' }}
      />
      {status === 'loading' && (
        <div className="player__overlay">
          <div className="spinner" />
          <p>Loading stream…</p>
        </div>
      )}
      {status === 'error' && (
        <div className="player__overlay player__overlay--error">
          <p>Stream unavailable</p>
          <span>This channel could not be played right now. Try another channel.</span>
        </div>
      )}
    </div>
  )
}
