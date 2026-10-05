import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions.jsx'
import PageHeader from '../components/PageHeader.jsx'
import TransactionForm from '../components/TransactionForm.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function EditTransaction() {
  const { id } = useParams()
  const { transactions, loading, updateTransaction } = useTransactions()
  const navigate = useNavigate()

  if (loading) return <Loader />

  const transaction = transactions.find((t) => String(t.id) === id)
  if (!transaction) {
    return (
      <EmptyState title="Transaction not found" message="It may have been deleted.">
        <Link className="btn" to="/transactions">Back to transactions</Link>
      </EmptyState>
    )
  }

  const handleSave = async (values) => {
    await updateTransaction(transaction.id, values)
    navigate('/transactions')
  }

  return (
    <>
      <PageHeader title="Edit transaction" subtitle="Update the details below." />
      <div className="narrow">
        <TransactionForm
          initialValues={{
            type: transaction.type,
            amount: String(transaction.amount ?? ''),
            category: transaction.category || '',
            description: transaction.description || '',
            date: transaction.date || '',
          }}
          submitLabel="Save changes"
          onSubmit={handleSave}
          onCancel={() => navigate('/transactions')}
        />
      </div>
    </>
  )
}
