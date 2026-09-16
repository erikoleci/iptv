import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="app-header">
      <div className="app-header__row">
        <Link to="/" className="app-header__brand">
          <span className="app-header__brand-mark">▶</span> StreamNest
        </Link>

        <form className="app-header__search" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search channels, countries, categories…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">⌕</button>
        </form>

        <nav className="app-header__nav">
          <Link to="/channels">Channels</Link>
          <Link to="/countries">Countries</Link>
          <Link to="/favorites">Favorites</Link>
        </nav>
      </div>
    </header>
  )
}
