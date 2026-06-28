import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/transactions').then(res => setTransactions(res.data))
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
        <h1 className="text-3xl font-bold mb-6">Transações</h1>
        <table className="w-full text-left">
            <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-3">Descrição</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Data</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map(t => (
                <tr key={t.id} className="border-b border-gray-800">
                    <td className="py-3">{t.description}</td>
                    <td className={t.type === 'INCOME' ? 'text-green-400 py-3' : 'text-red-400 py-3'}>
                    R$ {t.amount.toFixed(2)}
                    </td>
                    <td className="py-3">{t.type}</td>
                    <td className="py-3">{t.date}</td>
                </tr>
                ))}
            </tbody>
        </table>
      </main>

    </div>
  )
}

export default Transactions