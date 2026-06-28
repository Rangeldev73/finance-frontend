import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/transactions/summary').then(res => setSummary(res.data))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <aside className="w-56 bg-gray-800 flex flex-col p-6 gap-4">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Rajo Finance</h2>
        <a href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</a>
        <a href="/transactions" className="text-gray-300 hover:text-white">Transações</a>
        <a href="/categories" className="text-gray-300 hover:text-white">Categorias</a>
        <a href="/goals" className="text-gray-300 hover:text-white">Metas</a>
        <button
          onClick={handleLogout}
          className="mt-auto text-left text-red-400 hover:text-red-300"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-1">Saldo</p>
            <p className="text-2xl font-bold">
              R$ {summary?.balance?.toFixed(2) ?? '...'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-1">Receitas</p>
            <p className="text-2xl font-bold text-green-400">
              R$ {summary?.totalIncome?.toFixed(2) ?? '...'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-1">Despesas</p>
            <p className="text-2xl font-bold text-red-400">
              R$ {summary?.totalExpenses?.toFixed(2) ?? '...'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard