import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('INCOME')
  const [categoryId, setCategoryId] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/transactions').then(res => setTransactions(res.data))
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCreate = async () => {
    try {
      await api.post('/transactions', {
        description,
        amount: parseFloat(amount),
        type,
        categoryId: parseInt(categoryId)
      })
      api.get('/transactions').then(res => setTransactions(res.data))
      setDescription('')
      setAmount('')
      setType('INCOME')
      setCategoryId('')
    } catch (err) {
      console.error('Erro ao criar transação:', err)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      <aside className="w-56 bg-gray-800 flex flex-col p-6 gap-4">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Rajo Finance</h2>
        <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
        <Link to="/transactions" className="text-gray-300 hover:text-white">Transações</Link>
        <Link to="/categories" className="text-gray-300 hover:text-white">Categorias</Link>
        <Link to="/goals" className="text-gray-300 hover:text-white">Metas</Link>
        <button
          onClick={handleLogout}
          className="mt-auto text-left text-red-400 hover:text-red-300"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Transações</h1>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          />
          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          >
            <option value="INCOME">Receita</option>
            <option value="EXPENSES">Despesa</option>
          </select>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold"
          >
            Adicionar
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="pb-3">Descrição</th>
              <th className="pb-3">Valor</th>
              <th className="pb-3">Tipo</th>
              <th className="pb-3">Categoria</th>
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
                <td className="py-3">{t.categoryName ?? '—'}</td>
                <td className="py-3">{t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </main>
    </div>
  )
}

export default Transactions