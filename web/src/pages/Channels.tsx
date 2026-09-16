import { useMemo, useState } from 'react'
import { useChannelsContext } from '../data/ChannelsContext'
import { usePlayerContext } from '../data/PlayerContext'
import { ChannelGrid } from '../components/ChannelGrid'
import { StatusView } from '../components/StatusView'

export function Channels() {
  const { channels, countries, categories, loading, error } = useChannelsContext()
  const { play } = usePlayerContext()
  const [country, setCountry] = useState('all')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return channels.filter(c => {
      if (country !== 'all' && c.countryCode !== country) return false
      if (category !== 'all' && !c.categories.includes(category)) return false
      return true
    })
  }, [channels, country, category])

  if (loading || error) return <StatusView loading={loading} error={error} />

  return (
    <div className="page">
      <div className="page__header">
        <h1>All channels</h1>
        <p>{filtered.length.toLocaleString()} channels available</p>
      </div>

      <div className="filter-bar">
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="all">All countries</option>
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <ChannelGrid channels={filtered} onSelect={play} />
    </div>
  )
}
