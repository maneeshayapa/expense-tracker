// Spinner shown while data is loading.
export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="center-box" role="status">
      <div className="spinner" />
      <p className="muted">{text}</p>
    </div>
  )
}
