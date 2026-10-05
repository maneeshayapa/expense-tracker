// One summary number, for example "Total Income".
export default function StatCard({ label, value, tone }) {
  return (
    <div className="card stat">
      <span className="muted">{label}</span>
      <strong className={tone}>{value}</strong>
    </div>
  )
}
