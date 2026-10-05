import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../utils/format.js'

// Table of transactions. Edit/Delete buttons only appear when onDelete is passed in.
export default function TransactionTable({ transactions, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th className="right">Amount</th>
            {onDelete && <th className="right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td data-label="Date">{formatDate(t.date)}</td>
              <td data-label="Type"><span className={`badge ${t.type}`}>{t.type === 'income' ? 'Income' : 'Expense'}</span></td>
              <td data-label="Category">{t.category || '—'}</td>
              <td data-label="Description">{t.description || '—'}</td>
              <td data-label="Amount" className={`right amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(Number(t.amount) || 0)}
              </td>
              {onDelete && (
                <td className="right transaction-actions" data-label="Actions">
                  <Link className="btn btn-small" to={`/transactions/${t.id}/edit`}>Edit</Link>{' '}
                  <button
                    className="btn btn-small btn-danger-outline"
                    onClick={() => onDelete(t)}
                    aria-label={`Delete ${t.description || 'transaction'}`}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
