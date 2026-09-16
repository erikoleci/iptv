import { createContext, useContext } from 'react'
import type { Channel } from '../types'
import { useChannels } from './useChannels'
import { useFavorites } from './useFavorites'

interface ChannelsContextValue {
  channels: Channel[]
  countries: { code: string; name: string; flag: string }[]
  categories: { id: string; name: string }[]
  loading: boolean
  error: string | null
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  favorites: Set<string>
}

const ChannelsContext = createContext<ChannelsContextValue | null>(null)

export function ChannelsProvider({ children }: { children: React.ReactNode }) {
  const { channels, countries, categories, loading, error } = useChannels()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  return (
    <ChannelsContext.Provider
      value={{ channels, countries, categories, loading, error, favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </ChannelsContext.Provider>
  )
}

export function useChannelsContext() {
  const ctx = useContext(ChannelsContext)
  if (!ctx) throw new Error('useChannelsContext must be used within ChannelsProvider')
  return ctx
}
