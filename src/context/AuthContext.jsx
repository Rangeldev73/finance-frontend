import { createContext, useContext, useState } from 'react'
import { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)

  const login = (token) => {
    setToken(token)
    setAuthToken(token)
    }

  const logout = () => {
    setToken(null)
    setAuthToken(null)
    }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}