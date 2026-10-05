// Shown when there is nothing to display yet. Always suggest what to do next.
export default function EmptyState({ title, message, children }) {
  return (
    <div className="center-box">
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      {children}
    </div>
  )
}
