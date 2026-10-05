import { createContext, useContext, useEffect, useRef, useState } from 'react'

import {
  fetchTransactions,
  createTransaction,
  editTransaction,
  removeTransaction,
} from '../services/transactionService.js'

import { useAuth } from './useAuth.jsx'

const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const userIdRef = useRef(user?.uid)
  userIdRef.current = user?.uid

  const [transactionState, setTransactionState] = useState({
    userId: null,
    transactions: [],
  })
  const [loading, setLoading] = useState(true)
  const [loadingUserId, setLoadingUserId] = useState(null)
  const [error, setError] = useState('')

  const transactions =
    user?.uid && transactionState.userId === user.uid
      ? transactionState.transactions
      : []
  const isLoading =
    authLoading ||
    (Boolean(user?.uid) &&
      (loadingUserId !== user.uid || loading))

  useEffect(() => {
    let active = true

    if (authLoading) {
      return () => {
        active = false
      }
    }

    if (!user) {
      setTransactionState({ userId: null, transactions: [] })
      setLoading(false)
      setLoadingUserId(null)
      setError('')
      return () => {
        active = false
      }
    }

    const userId = user.uid
    setLoading(true)
    setLoadingUserId(userId)
    setError('')
    setTransactionState({ userId, transactions: [] })

    fetchTransactions()
      .then((loadedTransactions) => {
        if (active) {
          setTransactionState({ userId, transactions: loadedTransactions })
        }
      })
      .catch((error) => {
        if (!active) return
        console.error('FIRESTORE ERROR:', error)
        setError('Could not load your transactions. Please refresh the page.')
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [user?.uid, authLoading])

  const addTransaction = async (transaction) => {
    const userId = user?.uid
    const created = await createTransaction(transaction)
    if (userId && userIdRef.current === userId) {
      setTransactionState((current) =>
        current.userId === userId
          ? { ...current, transactions: [created, ...current.transactions] }
          : current
      )
    }
  }

  const updateTransaction = async (id, changes) => {
    const userId = user?.uid
    const updated = await editTransaction(id, changes)

    if (userId && userIdRef.current === userId) {
      setTransactionState((current) =>
        current.userId === userId
          ? {
              ...current,
              transactions: current.transactions.map((t) =>
                String(t.id) === String(id) ? { ...t, ...updated } : t
              ),
            }
          : current
      )
    }
  }

  const deleteTransaction = async (id) => {
    const userId = user?.uid
    await removeTransaction(id)

    if (userId && userIdRef.current === userId) {
      setTransactionState((current) =>
        current.userId === userId
          ? {
              ...current,
              transactions: current.transactions.filter(
                (t) => String(t.id) !== String(id)
              ),
            }
          : current
      )
    }
  }

  const value = {
    transactions,
    loading: isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  return useContext(TransactionContext)
}