import { useState } from 'react'
import ErrorMessage from './ErrorMessage.jsx'
import { expenseCategories, incomeCategories } from '../data/mockData.js'
import { todayString } from '../utils/format.js'

// Used by both Add and Edit pages. The page decides what happens on save.
export default function TransactionForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    const values = {
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: todayString(),
      ...initialValues,
    }

    return {
      ...values,
      amount: values.amount ?? '',
      category: values.category || '',
      description:
        typeof values.description === 'string' ? values.description : '',
      date: values.date || todayString(),
    }
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const categories = form.type === 'income' ? incomeCategories : expenseCategories

  const change = (field, value) => setForm({ ...form, [field]: value })

  // Changing the type also clears the category, because the lists are different.
  const changeType = (type) => setForm({ ...form, type, category: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return setError('Enter an amount greater than 0.')
    if (!form.category) return setError('Choose a category.')
    const description =
      typeof form.description === 'string' ? form.description.trim() : ''
    if (!description) return setError('Add a short description.')
    if (!form.date) return setError('Choose a date.')
    if (form.date > todayString()) {
      return setError('Transaction date cannot be in the future.')
    }

    setError('')
    setSaving(true)
    try {
      await onSubmit({ ...form, amount: Number(form.amount), description })
    } catch {
      setError('Could not save the transaction. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />

      <div className="field">
        <label>Transaction type</label>
        <div className="segmented">
          <button type="button" className={form.type === 'expense' ? 'active expense' : ''} onClick={() => changeType('expense')}>Expense</button>
          <button type="button" className={form.type === 'income' ? 'active income' : ''} onClick={() => changeType('income')}>Income</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => change('amount', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            max={todayString()}
            value={form.date}
            onChange={(e) => change('date', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" value={form.category} onChange={(e) => change('category', e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <input id="description" type="text" maxLength={100} placeholder="What was this for?" value={form.description} onChange={(e) => change('description', e.target.value)} />
      </div>

      <div className="row end">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  )
}
