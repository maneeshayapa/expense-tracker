import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

import { auth, db } from '../firebase.js'

function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please try again later.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/password-does-not-meet-requirements':
      return 'Please choose a stronger password.'
    case 'auth/account-exists-with-different-credential':
      return 'An account with this email already exists. Sign in with your existing method first.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled. Please try again.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in window. Allow pop-ups and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

async function ensureUserProfile(user) {
  const userRef = doc(db, 'users', user.uid)
  const userSnapshot = await getDoc(userRef)

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      name: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      createdAt: serverTimestamp(),
    })
  }
}

export function getSavedUser() {
  return auth.currentUser
}

export async function loginUser(email, password) {
  let userCredential
  try {
    userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }

  try {
    await ensureUserProfile(userCredential.user)
  } catch (error) {
    console.error('PROFILE ERROR:', error)
    throw new Error('Your profile could not be saved. Please try signing in again.')
  }

  return userCredential.user
}

export async function registerUser(name, email, password) {
  let userCredential
  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }

  const user = userCredential.user

  try {
    await updateProfile(user, {
      displayName: name,
    })
    await ensureUserProfile(user)
  } catch (error) {
    console.error('PROFILE SETUP ERROR:', error)
    throw new Error(
      'Your account was created, but its profile could not be saved. Please sign in again to retry.'
    )
  }

  return user
}

export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    await ensureUserProfile(userCredential.user)
    return userCredential.user
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

export async function logoutUser() {
  await signOut(auth)
}