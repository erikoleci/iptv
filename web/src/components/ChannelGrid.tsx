import { useMemo, useState } from 'react'
import type { Channel } from '../types'
import { ChannelCard } from './ChannelCard'
import { useChannelsContext } from '../data/ChannelsContext'

const PAGE_SIZE = 48

interface ChannelGridProps {
  channels: Channel[]
  onSelect: (channel: Channel) => void
  emptyMessage?: string
}

export function ChannelGrid({ channels, onSelect, emptyMessage }: ChannelGridProps) {
  const { isFavorite, toggleFavorite } = useChannelsContext()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visible = useMemo(() => channels.slice(0, visibleCount), [channels, visibleCount])

  if (channels.length === 0) {
    return <p className="empty-message">{emptyMessage || 'No channels found.'}</p>
  }

  return (
    <div>
      <div className="channel-grid">
        {visible.map(channel => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isFavorite={isFavorite(channel.id)}
            onToggleFavorite={toggleFavorite}
            onSelect={onSelect}
          />
        ))}
      </div>
      {visibleCount < channels.length && (
        <div className="load-more">
          <button onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
            Load more channels ({channels.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
