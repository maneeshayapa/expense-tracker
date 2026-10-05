import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const displayName = user?.displayName || 'User'
  const email = user?.email || '—'

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Your account details."
      />

      <div className="card profile-card narrow">
        <div className="avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <dl className="details">
          <dt>Name</dt>
          <dd>{displayName}</dd>

          <dt>Email</dt>
          <dd>{email}</dd>

          <dt>User ID</dt>
          <dd>{user?.uid}</dd>
        </dl>

        <button
          className="btn btn-danger"
          onClick={() => setConfirming(true)}
        >
          Log out
        </button>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Log out?"
        message="You will need to log in again to see your transactions."
        confirmLabel="Log out"
        onConfirm={handleLogout}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}
