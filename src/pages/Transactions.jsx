import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions.jsx'
import { expenseCategories, incomeCategories } from '../data/mockData.js'
import PageHeader from '../components/PageHeader.jsx'
import TransactionTable from '../components/TransactionTable.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

const allCategories = [...new Set([...incomeCategories, ...expenseCategories])]

export default function Transactions() {
  const { transactions, loading, error, deleteTransaction } = useTransactions()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [toDelete, setToDelete] = useState(null) // the transaction waiting for confirmation
  const [deleteError, setDeleteError] = useState('')

  if (loading) return <Loader text="Loading transactions..." />
  if (error) return <ErrorMessage message={error} />

  // Apply search and filters, then sort by date.
  const visible = [...transactions]
    .filter((t) =>
      (t.description || '')
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter(
      (t) => typeFilter === 'all' || t.type === typeFilter
    )
    .filter(
      (t) =>
        categoryFilter === 'all' ||
        t.category === categoryFilter
    )
    .sort((a, b) =>
      sortOrder === 'newest'
        ? String(b.date || '').localeCompare(String(a.date || ''))
        : String(a.date || '').localeCompare(String(b.date || ''))
    )

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('all')
    setCategoryFilter('all')
  }

  const confirmDelete = async () => {
    try {
      await deleteTransaction(toDelete.id)
      setDeleteError('')
    } catch {
      setDeleteError('Could not delete the transaction. Please try again.')
    }
    setToDelete(null)
  }

  return (
    <>
      <PageHeader title="Transactions" subtitle={`${visible.length} of ${transactions.length} shown`}>
        <Link className="btn btn-primary" to="/transactions/new">Add transaction</Link>
      </PageHeader>

      <ErrorMessage message={deleteError} />

      <div className="card filters">
        <input type="search" placeholder="Search descriptions" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="card section">
        {visible.length === 0 ? (
          <EmptyState title="No transactions found" message="Try a different search or clear the filters.">
            <button className="btn" onClick={clearFilters}>Clear filters</button>
          </EmptyState>
        ) : (
          <TransactionTable transactions={visible} onDelete={setToDelete} />
        )}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete transaction?"
        message={toDelete ? `"${toDelete.description}" will be removed permanently.` : ''}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
