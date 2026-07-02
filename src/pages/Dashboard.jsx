import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/transactions/summary'),
      api.get('/transactions/paged?page=0&size=5')
    ]).then(([summaryRes, pagedRes]) => {
      setSummary(summaryRes.data)
      setRecentTransactions(pagedRes.data.content)
    }).catch(err => console.error('Erro ao carregar dashboard:', err))
  }, [])

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

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

        <div>
          <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
          <div className="bg-gray-800 rounded-xl divide-y divide-gray-700">
            {recentTransactions.map(t => (
              <div key={t.id} className="p-4 flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate">{t.description}</p>
                  <p className="text-sm text-gray-400">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </p>
                </div>
                <p className={t.type === 'INCOME' ? 'text-green-400 font-semibold flex-shrink-0' : 'text-red-400 font-semibold flex-shrink-0'}>
                  R$ {t.amount.toFixed(2)}
                </p>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-gray-400 p-4">Nenhuma transação recente.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard