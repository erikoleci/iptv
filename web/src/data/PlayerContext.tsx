import { createContext, useContext, useState } from 'react'
import type { Channel } from '../types'

interface PlayerContextValue {
  nowPlaying: Channel | null
  play: (channel: Channel) => void
  close: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [nowPlaying, setNowPlaying] = useState<Channel | null>(null)

  return (
    <PlayerContext.Provider
      value={{
        nowPlaying,
        play: channel => setNowPlaying(channel),
        close: () => setNowPlaying(null),
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayerContext() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayerContext must be used within PlayerProvider')
  return ctx
}
