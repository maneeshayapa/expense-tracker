// Small helpers that turn raw values into readable text.
export function formatCurrency(amount) {
  const numericAmount = Number(amount)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Number.isFinite(numericAmount) ? numericAmount : 0
  )
}

export function formatDate(dateString) {
  if (
    typeof dateString !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return '—'
  }

  const utcDate = new Date(`${dateString}T00:00:00Z`)
  if (
    Number.isNaN(utcDate.getTime()) ||
    utcDate.toISOString().slice(0, 10) !== dateString
  ) {
    return '—'
  }

  // Adding T00:00:00 stops the date from shifting because of time zones.
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function todayString() {
  return new Date().toISOString().slice(0, 10)
}
