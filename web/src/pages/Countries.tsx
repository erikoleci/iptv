import { Link } from 'react-router-dom'
import { useChannelsContext } from '../data/ChannelsContext'
import { StatusView } from '../components/StatusView'
import { slugify } from '../utils/slug'

export function Countries() {
  const { countries, channels, loading, error } = useChannelsContext()

  if (loading || error) return <StatusView loading={loading} error={error} />

  return (
    <div className="page">
      <div className="page__header">
        <h1>Countries</h1>
        <p>{countries.length} countries with available channels</p>
      </div>
      <div className="country-grid">
        {countries.map(c => {
          const count = channels.filter(ch => ch.countryCode === c.code).length
          return (
            <Link key={c.code} to={`/country/${slugify(c.name)}`} className="country-card">
              <span className="country-card__flag">{c.flag}</span>
              <span className="country-card__name">{c.name}</span>
              <span className="country-card__count">{count} channels</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
