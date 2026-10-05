import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim()

    if (!name || !email || !form.password || !form.confirm) {
      return setError('Fill in all fields.')
    }

    if (name.length < 2) {
      return setError('Name must be at least 2 characters.')
    }

    if (form.password.length < 6) {
      return setError('Password should be at least 6 characters.')
    }

    if (form.password !== form.confirm) {
      return setError('The passwords do not match.')
    }

    setError('')
    setLoading(true)

    try {
      await register(name, email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Create your account</h1>

      <p className="muted">
        Start tracking your income and expenses.
      </p>

      <ErrorMessage message={error} />

      <div className="field">
        <label htmlFor="name">Full name</label>

        <input
          id="name"
          type="text"
          maxLength={50}
          value={form.name}
          onChange={(e) => change('name', e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => change('email', e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={(e) => change('password', e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
      </div>

      <div className="field">
        <label htmlFor="confirm">Confirm password</label>

        <input
          id="confirm"
          type="password"
          minLength={6}
          value={form.confirm}
          onChange={(e) => change('confirm', e.target.value)}
          placeholder="Enter your password again"
          autoComplete="new-password"
        />
      </div>

      <button
        className="btn btn-primary full"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <p className="muted center">
        Already registered?{' '}
        <Link to="/login">Log in</Link>
      </p>
    </form>
  )
}