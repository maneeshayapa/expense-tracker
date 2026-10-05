// Functions that calculate totals from the list of transactions.
function getValidAmount(transaction) {
  const amount = Number(transaction?.amount)
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

function hasValidDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false
  }

  const parsed = new Date(`${date}T00:00:00Z`)
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  )
}

function isValidTransaction(transaction) {
  return (
    (transaction?.type === 'income' || transaction?.type === 'expense') &&
    getValidAmount(transaction) !== null &&
    hasValidDate(transaction.date)
  )
}

function sumByType(transactions, type) {
  return transactions
    .filter(
      (transaction) =>
        transaction?.type === type && isValidTransaction(transaction)
    )
    .reduce(
      (sum, transaction) => sum + (getValidAmount(transaction) || 0),
      0
    )
}

export function getTotals(transactions) {
  const income = sumByType(transactions, 'income')
  const expense = sumByType(transactions, 'expense')
  const count = transactions.filter(isValidTransaction).length
  return { income, expense, balance: income - expense, count }
}

// One row per month, oldest first: { label, income, expense, balance, cumulative }
export function getMonthlySummary(transactions) {
  const months = {}
  transactions.forEach((t) => {
    if (!isValidTransaction(t)) return
    const key = t.date.slice(0, 7) // "2026-05"
    if (!months[key]) months[key] = { key, income: 0, expense: 0 }
    months[key][t.type] += getValidAmount(t)
  })

  let running = 0
  return Object.values(months)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => {
      const balance = m.income - m.expense
      running += balance
      const label = new Date(m.key + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      return { ...m, label, balance, cumulative: running }
    })
}

// Expense categories, biggest first: { name, value, percent }
export function getCategoryTotals(transactions) {
  const totals = {}
  transactions
    .filter((t) => t.type === 'expense' && isValidTransaction(t))
    .forEach((t) => {
      const amount = getValidAmount(t)
      if (amount === null) return
      const category =
        typeof t.category === 'string' && t.category.trim()
          ? t.category
          : 'Uncategorized'
      totals[category] = (totals[category] || 0) + amount
    })
  const all = Object.values(totals).reduce((a, b) => a + b, 0)
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value, percent: all ? Math.round((value / all) * 100) : 0 }))
    .sort((a, b) => b.value - a.value)
}
