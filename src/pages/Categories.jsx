import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { COLORS } from '../constants/colors'

function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', color: COLORS[0].hex })
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSubmit = async () => {
    try {
      const res = await api.post('/categories', form)
      setCategories(atual => [...atual, res.data])
      setForm({ name: '', color: COLORS[0].hex })
    } catch (err) {
      console.error('Erro ao criar categoria:', err)
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
        <h1 className="text-3xl font-bold">Categorias</h1>

        <div className="bg-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          />
          <select
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none"
          >
            {COLORS.map(c => (
              <option key={c.hex} value={c.hex}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold"
          >
            Adicionar
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Minhas Categorias</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-3"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

export default Categories