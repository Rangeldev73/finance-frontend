import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    api.get('/transactions/summary').then(res => setSummary(res.data))
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      <Sidebar />

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