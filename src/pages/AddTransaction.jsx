import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions.jsx'
import PageHeader from '../components/PageHeader.jsx'
import TransactionForm from '../components/TransactionForm.jsx'

export default function AddTransaction() {
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()

  const handleSave = async (values) => {
    await addTransaction(values)
    navigate('/transactions')
  }

  return (
    <>
      <PageHeader title="Add transaction" subtitle="Record a new income or expense." />
      <div className="narrow">
        <TransactionForm submitLabel="Save transaction" onSubmit={handleSave} onCancel={() => navigate('/transactions')} />
      </div>
    </>
  )
}
