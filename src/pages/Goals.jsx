import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
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
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/goals'),
      api.get('/categories')
    ]).then(([goalsRes, categoriesRes]) => {
      setGoals(goalsRes.data)
      setCategories(categoriesRes.data)
    }).catch(err => console.error('Erro ao carregar dados:', err))
  }, [])

  const resetForm = () => {
    setForm({
      name: '',
      limitAmount: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      categoryId: ''
    })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const res = await api.put(`/goals/${editingId}`, form)
        setGoals(atual => atual.map(g => g.id === editingId ? res.data : g))
      } else {
        const res = await api.post('/goals', form)
        setGoals(atual => [...atual, res.data])
      }
      resetForm()
    } catch (err) {
      console.error('Erro ao salvar meta:', err)
    }
  }

  const handleEdit = (goal) => {
    setForm({
      name: goal.name,
      limitAmount: goal.limitAmount,
      month: goal.month,
      year: goal.year,
      categoryId: goal.categoryId
    })
    setEditingId(goal.id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`)
      setGoals(atual => atual.filter(g => g.id !== id))
    } catch (err) {
      console.error('Erro ao excluir meta:', err)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Metas</h1>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da meta"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          />
          <input
            type="number"
            placeholder="Limite (R$)"
            value={form.limitAmount}
            onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-3">
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
              className="bg-gray-700 rounded-lg p-3 outline-none w-24"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold flex-1"
            >
              {editingId ? 'Salvar' : 'Adicionar'}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 rounded-lg p-3 font-semibold px-6"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Minhas Metas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => {
              const percentual = Math.min((goal.currentAmount / goal.limitAmount) * 100, 100)
              return (
                <div key={goal.id} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold truncate mr-2">{goal.name}</span>
                    {goal.exceeded && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex-shrink-0">
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
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
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
