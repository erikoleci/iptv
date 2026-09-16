import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useChannelsContext } from '../data/ChannelsContext'
import { usePlayerContext } from '../data/PlayerContext'
import { ChannelGrid } from '../components/ChannelGrid'
import { StatusView } from '../components/StatusView'

export function Search() {
  const [params] = useSearchParams()
  const query = (params.get('q') || '').trim().toLowerCase()
  const { channels, loading, error } = useChannelsContext()
  const { play } = usePlayerContext()

  const results = useMemo(() => {
    if (!query) return []
    return channels.filter(c => {
      const haystack = [c.name, c.countryName, ...c.categories].join(' ').toLowerCase()
      return haystack.includes(query)
    })
  }, [channels, query])

  if (loading || error) return <StatusView loading={loading} error={error} />

  return (
    <div className="page">
      <div className="page__header">
        <h1>Search results for "{params.get('q')}"</h1>
        <p>{results.length.toLocaleString()} matches</p>
      </div>
      <ChannelGrid channels={results} onSelect={play} emptyMessage="No channels matched your search." />
    </div>
  )
}
