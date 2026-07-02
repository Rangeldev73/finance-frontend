import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import { MONTHS } from '../constants/months'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'INCOME',
    categoryId: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1)
  const [filterYear, setFilterYear] = useState(new Date().getFullYear())

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    const lastDay = new Date(filterYear, filterMonth, 0).getDate()
    const startDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-01`
    const endDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    api.get(`/transactions/filter?startDate=${startDate}&endDate=${endDate}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Erro ao filtrar transações:', err))
  }, [filterMonth, filterYear])

  const resetForm = () => {
    setForm({ description: '', amount: '', type: 'INCOME', categoryId: '' })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      categoryId: parseInt(form.categoryId)
    }
    try {
      if (editingId) {
        const res = await api.put(`/transactions/${editingId}`, payload)
        setTransactions(atual => atual.map(t => t.id === editingId ? res.data : t))
      } else {
        const res = await api.post('/transactions', payload)
        setTransactions(atual => [...atual, res.data])
      }
      resetForm()
    } catch (err) {
      console.error('Erro ao salvar transação:', err)
    }
  }

  const handleEdit = (transaction) => {
    setForm({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.categoryId
    })
    setEditingId(transaction.id)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`)
      setTransactions(atual => atual.filter(t => t.id !== id))
    } catch (err) {
      console.error('Erro ao excluir transação:', err)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 md:p-8 pb-20 md:pb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Transações</h1>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          />
          <input
            type="number"
            placeholder="Valor"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          >
            <option value="INCOME">Receita</option>
            <option value="EXPENSES">Despesa</option>
          </select>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="bg-gray-700 rounded-lg p-3 outline-none w-full"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
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

        <div className="flex gap-3">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="bg-gray-700 rounded-lg p-3 outline-none flex-1"
          >
            {MONTHS.map((name, index) => (
              <option key={index + 1} value={index + 1}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="bg-gray-700 rounded-lg p-3 outline-none w-24"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-3 pr-4 whitespace-nowrap">Descrição</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Valor</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Tipo</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Categoria</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Data</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-gray-800">
                  <td className="py-3 pr-4 whitespace-nowrap">{t.description}</td>
                  <td className={`py-3 pr-4 whitespace-nowrap ${t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{t.type}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">{t.categoryName ?? '—'}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="text-gray-400 mt-4">Nenhuma transação encontrada para esse período.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Transactions