import { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    try {
      await api.post('/auth/login', { email, password })
      login()
      navigate('/dashboard')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setError('E-mail ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-blue-400 text-center">Rajo Finance</h2>
        <h1 className="text-2xl font-bold text-gray-800">Entrar</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="border border-gray-300 rounded-lg p-3 w-full outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="border border-gray-300 rounded-lg p-3 w-full outline-none"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Login