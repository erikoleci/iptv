import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="page status-view">
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="chip">← Back to home</Link>
    </div>
  )
}
