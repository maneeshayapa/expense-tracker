import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'

import { db, auth } from '../firebase.js'

function getTransactionsRef() {
  const user = auth.currentUser

  if (!user) {
    throw new Error('You must be logged in.')
  }

  return collection(db, 'users', user.uid, 'transactions')
}

export async function fetchTransactions() {
  const transactionsRef = getTransactionsRef()

  const transactionsQuery = query(transactionsRef, orderBy('date', 'desc'))
  const snapshot = await getDocs(transactionsQuery)

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }))
}

export async function createTransaction(transaction) {
  const transactionsRef = getTransactionsRef()

  const documentRef = await addDoc(transactionsRef, transaction)

  return {
    id: documentRef.id,
    ...transaction,
  }
}

export async function editTransaction(id, changes) {
  const user = auth.currentUser

  if (!user) {
    throw new Error('You must be logged in.')
  }

  const transactionRef = doc(
    db,
    'users',
    user.uid,
    'transactions',
    id
  )

  await updateDoc(transactionRef, changes)

  return {
    id,
    ...changes,
  }
}

export async function removeTransaction(id) {
  const user = auth.currentUser

  if (!user) {
    throw new Error('You must be logged in.')
  }

  const transactionRef = doc(
    db,
    'users',
    user.uid,
    'transactions',
    id
  )

  await deleteDoc(transactionRef)
}