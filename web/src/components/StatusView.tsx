interface StatusViewProps {
  loading: boolean
  error: string | null
}

export function StatusView({ loading, error }: StatusViewProps) {
  if (loading) {
    return (
      <div className="status-view">
        <div className="spinner" />
        <p>Loading channel directory…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="status-view status-view--error">
        <p>We couldn't load the channel directory.</p>
        <span>Please check your connection and try again in a moment.</span>
      </div>
    )
  }
  return null
}
