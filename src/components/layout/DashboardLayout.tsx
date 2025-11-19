import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Proyectos', path: '/projects' },
    { label: 'Tareas', path: '/tasks' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">TechFlow</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Hola, {user?.name || 'Usuario'}
          </h2>
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-medium text-sm"
          >
            Cerrar Sesión
          </button>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};