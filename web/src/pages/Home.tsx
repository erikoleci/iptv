import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChannelsContext } from '../data/ChannelsContext'
import { usePlayerContext } from '../data/PlayerContext'
import { ChannelGrid } from '../components/ChannelGrid'
import { StatusView } from '../components/StatusView'
import { slugify } from '../utils/slug'

function shuffled<T>(arr: T[], count: number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

export function Home() {
  const { channels, countries, categories, loading, error } = useChannelsContext()
  const { play } = usePlayerContext()
  const [category, setCategory] = useState<string>('all')

  const featured = useMemo(() => shuffled(channels, 18), [channels])

  const filtered = useMemo(() => {
    if (category === 'all') return channels
    return channels.filter(c => c.categories.includes(category))
  }, [channels, category])

  if (loading || error) return <StatusView loading={loading} error={error} />

  return (
    <div className="page">
      <section className="hero">
        <h1>Live television from around the world</h1>
        <p>Browse thousands of publicly available channels by country and category, all in one place.</p>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Popular channels</h2>
        </div>
        <ChannelGrid channels={featured} onSelect={play} />
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Browse by country</h2>
          <Link to="/countries" className="section__link">See all countries →</Link>
        </div>
        <div className="chip-row">
          {countries.slice(0, 16).map(c => (
            <Link key={c.code} to={`/country/${slugify(c.name)}`} className="chip">
              <span>{c.flag}</span> {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Browse by category</h2>
        </div>
        <div className="chip-row">
          <button
            className={`chip chip--button${category === 'all' ? ' chip--active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`chip chip--button${category === cat.name ? ' chip--active' : ''}`}
              onClick={() => setCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <ChannelGrid channels={filtered.slice(0, 96)} onSelect={play} />
      </section>
    </div>
  )
}
