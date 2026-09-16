import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useChannelsContext } from '../data/ChannelsContext'
import { usePlayerContext } from '../data/PlayerContext'
import { ChannelGrid } from '../components/ChannelGrid'
import { StatusView } from '../components/StatusView'
import { resolveCountry } from '../utils/slug'

export function CountryPage() {
  const { code } = useParams<{ code: string }>()
  const { channels, countries, loading, error } = useChannelsContext()
  const { play } = usePlayerContext()

  const country = useMemo(() => resolveCountry(countries, code || ''), [countries, code])

  const filtered = useMemo(() => {
    if (!country) return []
    return channels.filter(c => c.countryCode === country.code)
  }, [channels, country])

  if (loading || error) return <StatusView loading={loading} error={error} />

  if (!country) {
    return (
      <div className="page">
        <div className="page__header">
          <h1>Country not found</h1>
          <p>
            We couldn't find that country. <Link to="/countries">Browse all countries</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>{country.flag} {country.name}</h1>
        <p>{filtered.length.toLocaleString()} channels</p>
      </div>
      <ChannelGrid channels={filtered} onSelect={play} emptyMessage="No channels available for this country yet." />
    </div>
  )
}
