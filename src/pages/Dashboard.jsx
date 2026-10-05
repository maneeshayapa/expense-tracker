import { Link } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions.jsx'
import { getTotals, getMonthlySummary, getCategoryTotals } from '../utils/calc.js'
import { formatCurrency } from '../utils/format.js'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import TransactionTable from '../components/TransactionTable.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Dashboard() {
  const { transactions, loading, error } = useTransactions()

  if (loading) return <Loader text="Loading your dashboard..." />
  if (error) return <ErrorMessage message={error} />

  const totals = getTotals(transactions)
  const monthly = getMonthlySummary(transactions).slice(-6).reverse() // newest first
  const categories = getCategoryTotals(transactions)
  const recent = [...transactions]
    .sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || ''))
    )
    .slice(0, 5)

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A quick look at your money.">
        <Link className="btn btn-primary" to="/transactions/new">Add transaction</Link>
      </PageHeader>

      <div className="grid-4">
        <StatCard label="Total income" value={formatCurrency(totals.income)} tone="income" />
        <StatCard label="Total expenses" value={formatCurrency(totals.expense)} tone="expense" />
        <StatCard label="Current balance" value={formatCurrency(totals.balance)} />
        <StatCard label="Transactions" value={totals.count} />
      </div>

      <div className="grid-2 section">
        <div className="card">
          <h2>Monthly summary</h2>
          {monthly.length === 0 ? (
            <p className="muted">No data yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Month</th><th className="right">Income</th><th className="right">Expenses</th><th className="right">Net</th></tr>
                </thead>
                <tbody>
                  {monthly.map((m) => (
                    <tr key={m.key}>
                      <td>{m.label}</td>
                      <td className="right income">{formatCurrency(m.income)}</td>
                      <td className="right expense">{formatCurrency(m.expense)}</td>
                      <td className="right">{formatCurrency(m.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Where your money goes</h2>
          {categories.length === 0 ? (
            <p className="muted">No expenses yet.</p>
          ) : (
            categories.map((c) => (
              <div className="bar-row" key={c.name}>
                <div className="row between">
                  <span>{c.name}</span>
                  <span className="muted">{formatCurrency(c.value)} ({c.percent}%)</span>
                </div>
                <div className="bar"><div style={{ width: `${c.percent}%` }} /></div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card section">
        <div className="row between">
          <h2>Recent transactions</h2>
          <Link to="/transactions">View all</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No transactions yet" message="Add your first transaction to see it here." />
        ) : (
          <TransactionTable transactions={recent} />
        )}
      </div>
    </>
  )
}
