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
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Proyectos', path: '/projects', icon: '📁' },
    { label: 'Tareas', path: '/tasks', icon: '✅' },
    { label: 'Equipo', path: '/team', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col z-20">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
            TechFlow
          </h1>
        </div>
        
        <nav className="mt-6 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-xs text-gray-400 text-center">
          Hackathon Edition v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10 px-8">
          <div>
             {/* Breadcrumb simple visual */}
             <span className="text-gray-400 text-sm">TechFlow / </span>
             <span className="text-gray-800 font-medium text-sm capitalize">
               {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
             </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800">{user?.name || 'Usuario'}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
              title="Cerrar Sesión"
            >
              Salir
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};