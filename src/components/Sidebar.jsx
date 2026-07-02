import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Tag, Target, LogOut } from 'lucide-react'

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <aside className="hidden md:flex w-56 bg-gray-800 flex-col p-6 gap-4">
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

      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 justify-around items-center py-2 z-50">
        <Link to="/dashboard" className="flex flex-col items-center text-gray-300 hover:text-white gap-1 px-1">
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Dashboard</span>
        </Link>
        <Link to="/transactions" className="flex flex-col items-center text-gray-300 hover:text-white gap-1 px-1">
          <ArrowLeftRight size={20} />
          <span className="text-[10px]">Transações</span>
        </Link>
        <Link to="/categories" className="flex flex-col items-center text-gray-300 hover:text-white gap-1 px-1">
          <Tag size={20} />
          <span className="text-[10px]">Categorias</span>
        </Link>
        <Link to="/goals" className="flex flex-col items-center text-gray-300 hover:text-white gap-1 px-1">
          <Target size={20} />
          <span className="text-[10px]">Metas</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-red-400 hover:text-red-300 gap-1 px-1"
        >
          <LogOut size={20} />
          <span className="text-[10px]">Sair</span>
        </button>
      </nav>
    </>
  )
}

export default Sidebar