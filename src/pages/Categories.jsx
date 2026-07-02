import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import { COLORS } from '../constants/colors'

function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', color: COLORS[0].hex })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const resetForm = () => {
    setForm({ name: '', color: COLORS[0].hex })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const res = await api.put(`/categories/${editingId}`, form)
        setCategories(atual => atual.map(c => c.id === editingId ? res.data : c))
      } else {
        const res = await api.post('/categories', form)
        setCategories(atual => [...atual, res.data])
      }
      resetForm()
    } catch (err) {
      console.error('Erro ao salvar categoria:', err)
    }
  }

  const handleEdit = (category) => {
    setForm({ name: category.name, color: category.color })
    setEditingId(category.id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      setCategories(atual => atual.filter(c => c.id !== id))
    } catch (err) {
      console.error('Erro ao excluir categoria:', err)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Categorias</h1>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          />
          <select
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          >
            {COLORS.map(c => (
              <option key={c.hex} value={c.hex}>{c.name}</option>
            ))}
          </select>
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
          <h2 className="text-xl font-semibold mb-4">Minhas Categorias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Categories
