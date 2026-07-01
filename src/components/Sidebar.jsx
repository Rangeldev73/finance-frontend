import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
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
  )
}

export default Sidebar