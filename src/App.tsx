import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importación de Páginas
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';


import { DashboardLayout } from './components/layout/DashboardLayout';


const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-blue-600 font-bold">Cargando TechFlow...</div>;
  }

  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Protegidas */}
          {/* Todo lo que esté aquí dentro usará el DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>

          {/* Ruta por defecto: Redirigir cualquier ruta desconocida al Dashboard (o Login si no hay sesión) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
