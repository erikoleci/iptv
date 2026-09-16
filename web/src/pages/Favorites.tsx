import { useMemo } from 'react'
import { useChannelsContext } from '../data/ChannelsContext'
import { usePlayerContext } from '../data/PlayerContext'
import { ChannelGrid } from '../components/ChannelGrid'
import { StatusView } from '../components/StatusView'

export function Favorites() {
  const { channels, favorites, loading, error } = useChannelsContext()
  const { play } = usePlayerContext()

  const favoriteChannels = useMemo(
    () => channels.filter(c => favorites.has(c.id)),
    [channels, favorites]
  )

  if (loading || error) return <StatusView loading={loading} error={error} />

  return (
    <div className="page">
      <div className="page__header">
        <h1>Your favorites</h1>
        <p>{favoriteChannels.length} saved channels</p>
      </div>
      <ChannelGrid
        channels={favoriteChannels}
        onSelect={play}
        emptyMessage="You haven't added any favorites yet. Tap the star on a channel to save it here."
      />
    </div>
  )
}
