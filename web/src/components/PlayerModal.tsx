import { usePlayerContext } from '../data/PlayerContext'
import { useChannelsContext } from '../data/ChannelsContext'
import { Player } from './Player'

export function PlayerModal() {
  const { nowPlaying, close } = usePlayerContext()
  const { isFavorite, toggleFavorite } = useChannelsContext()

  if (!nowPlaying) return null

  return (
    <div className="player-modal" role="dialog" aria-modal="true" onClick={close}>
      <div className="player-modal__panel" onClick={e => e.stopPropagation()}>
        <div className="player-modal__header">
          <div>
            <h2>{nowPlaying.name}</h2>
            <p>
              {nowPlaying.countryName}
              {nowPlaying.categories[0] ? ` · ${nowPlaying.categories[0]}` : ''}
            </p>
          </div>
          <div className="player-modal__actions">
            <button
              className={`player-modal__fav${isFavorite(nowPlaying.id) ? ' player-modal__fav--active' : ''}`}
              onClick={() => toggleFavorite(nowPlaying.id)}
            >
              ★ {isFavorite(nowPlaying.id) ? 'Favorited' : 'Favorite'}
            </button>
            <button className="player-modal__close" onClick={close} aria-label="Close player">✕</button>
          </div>
        </div>
        <Player channel={nowPlaying} key={nowPlaying.id} />
      </div>
    </div>
  )
}
