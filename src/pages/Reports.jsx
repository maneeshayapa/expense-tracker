import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { useTransactions } from '../hooks/useTransactions.jsx'
import { getMonthlySummary, getCategoryTotals } from '../utils/calc.js'
import { formatCurrency } from '../utils/format.js'
import PageHeader from '../components/PageHeader.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

const COLORS = ['#0f766e', '#c2410c', '#b45309', '#1d4ed8', '#7c3aed', '#be185d', '#4d7c0f']

export default function Reports() {
  const { transactions, loading, error } = useTransactions()

  if (loading) return <Loader text="Building reports..." />
  if (error) return <ErrorMessage message={error} />
  if (transactions.length === 0) {
    return <EmptyState title="No data for reports" message="Add some transactions and your charts will appear here." />
  }

  const monthly = getMonthlySummary(transactions)
  const categories = getCategoryTotals(transactions)
  const money = (value) => formatCurrency(value)

  return (
    <>
      <PageHeader title="Reports" subtitle="See how your money moves month by month." />

      <div className="card">
        <h2>Income vs expenses</h2>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--muted)' }} />
              <YAxis tick={{ fill: 'var(--muted)' }} />
              <Tooltip formatter={money} contentStyle={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)', borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="var(--income)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="var(--expense)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2 section">
        <div className="card">
          <h2>Expenses by category</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                  {categories.map((c, i) => <Cell key={c.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={money} contentStyle={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Running balance</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)' }} />
                <YAxis tick={{ fill: 'var(--muted)' }} />
                <Tooltip formatter={money} contentStyle={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)', borderRadius: 12 }} />
                <Line type="monotone" dataKey="cumulative" name="Balance" stroke="var(--primary)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card section">
        <h2>Monthly balance summary</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Month</th><th className="right">Income</th><th className="right">Expenses</th><th className="right">Saved</th><th className="right">Total balance</th></tr>
            </thead>
            <tbody>
              {monthly.map((m) => (
                <tr key={m.key}>
                  <td>{m.label}</td>
                  <td className="right income">{formatCurrency(m.income)}</td>
                  <td className="right expense">{formatCurrency(m.expense)}</td>
                  <td className={`right ${m.balance >= 0 ? 'income' : 'expense'}`}>{formatCurrency(m.balance)}</td>
                  <td className="right">{formatCurrency(m.cumulative)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
