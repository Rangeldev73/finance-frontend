import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { MONTHS } from '../constants/months'

function Goals() {
  const [goals, setGoals] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '',
    limitAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categoryId: ''
  })
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/goals'),
      api.get('/categories')
    ]).then(([goalsRes, categoriesRes]) => {
      setGoals(goalsRes.data)
      setCategories(categoriesRes.data)
    }).catch(err => console.error('Erro ao carregar dados:', err))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSubmit = async () => {
    try {
      const res = await api.post('/goals', form)
      setGoals(atual => [...atual, res.data])
      setForm({
        name: '',
        limitAmount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        categoryId: ''
      })
    } catch (err) {
      console.error('Erro ao criar meta:', err)
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

      <main className="flex-1 p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Metas</h1>

        <div className="bg-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da meta"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          />
          <input
            type="number"
            placeholder="Limite (R$)"
            value={form.limitAmount}
            onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-4">
            <select
              value={form.month}
              onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              className="bg-gray-700 rounded-lg p-3 outline-none flex-1"
            >
              {MONTHS.map((name, index) => (
                <option key={index + 1} value={index + 1}>{name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Ano"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className="bg-gray-700 rounded-lg p-3 outline-none flex-1"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold"
          >
            Adicionar
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Minhas Metas</h2>
          <div className="grid grid-cols-2 gap-4">
            {goals.map(goal => {
              const percentual = Math.min((goal.currentAmount / goal.limitAmount) * 100, 100)
              return (
                <div key={goal.id} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{goal.name}</span>
                    {goal.exceeded && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        Estourado
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {MONTHS[goal.month - 1]}/{goal.year}
                  </span>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${goal.exceeded ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    R$ {goal.currentAmount?.toFixed(2)} / R$ {goal.limitAmount?.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}

export default Goals