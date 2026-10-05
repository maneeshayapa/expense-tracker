import { createContext, useContext, useEffect, useState } from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../firebase.js'
import {
  loginUser,
  loginWithGoogle as loginWithGoogleUser,
  registerUser,
  logoutUser,
} from '../services/authService.js'

const AuthContext = createContext(null)

function toAppUser(firebaseUser) {
  if (!firebaseUser) {
    return null
  }

  const creationTime = firebaseUser.metadata.creationTime

  return {
    ...firebaseUser,
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split('@')[0] ||
      'User',
    email: firebaseUser.email || '',
    memberSince: creationTime
      ? new Date(creationTime).toISOString().slice(0, 10)
      : '',
    currency: 'USD',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authActionPending, setAuthActionPending] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(toAppUser(currentUser))
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const runAuthAction = async (action) => {
    setAuthActionPending(true)
    try {
      const firebaseUser = await action()
      const appUser = toAppUser(firebaseUser)
      setUser(appUser)
      return appUser
    } catch (error) {
      if (auth.currentUser) {
        try {
          await logoutUser()
        } catch (signOutError) {
          console.error('AUTH CLEANUP ERROR:', signOutError)
          setUser(toAppUser(auth.currentUser))
          throw new Error(
            `${error.message} Your session could not be cleared. Please log out before continuing.`
          )
        }
      }
      setUser(null)
      throw error
    } finally {
      setAuthActionPending(false)
    }
  }

  const login = (email, password) =>
    runAuthAction(() => loginUser(email, password))

  const register = (name, email, password) =>
    runAuthAction(() => registerUser(name, email, password))

  const loginWithGoogle = () =>
    runAuthAction(() => loginWithGoogleUser())

  const logout = async () => {
    await logoutUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authActionPending,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}