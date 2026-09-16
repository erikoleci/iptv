import { useState } from 'react'
import type { Channel } from '../types'

interface ChannelCardProps {
  channel: Channel
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onSelect: (channel: Channel) => void
}

export function ChannelCard({ channel, isFavorite, onToggleFavorite, onSelect }: ChannelCardProps) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div className="channel-card" onClick={() => onSelect(channel)}>
      <div className="channel-card__logo">
        {channel.logo && !logoFailed ? (
          <img
            src={channel.logo}
            alt={channel.name}
            loading="lazy"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="channel-card__logo-fallback">{channel.name.slice(0, 2).toUpperCase()}</span>
        )}
        <span className="channel-card__live">LIVE</span>
        <button
          className={`channel-card__fav${isFavorite ? ' channel-card__fav--active' : ''}`}
          onClick={e => {
            e.stopPropagation()
            onToggleFavorite(channel.id)
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>
      </div>
      <div className="channel-card__meta">
        <p className="channel-card__name" title={channel.name}>{channel.name}</p>
        <p className="channel-card__sub">
          {channel.countryName}
          {channel.categories[0] ? ` · ${channel.categories[0]}` : ''}
        </p>
      </div>
    </div>
  )
}
