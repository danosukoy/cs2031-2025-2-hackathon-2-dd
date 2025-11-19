import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card } from '../components/common/Card';
import type { Task, Project } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Traemos proyectos y tareas en paralelo para velocidad
        // Nota: hackathon shortcut -> pedimos limit alto para calcular stats locales
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects?limit=100'),
          api.get('/tasks?limit=100') 
        ]);

        const tasks = tasksRes.data.tasks || [];
        const projects = projectsRes.data.projects || [];
        const now = new Date();

        // Cálculos de estadísticas
        const pending = tasks.filter((t: Task) => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
        const completed = tasks.filter((t: Task) => t.status === 'COMPLETED').length;
        const overdue = tasks.filter((t: Task) => {
            return new Date(t.dueDate) < now && t.status !== 'COMPLETED';
        }).length;

        setStats({
          totalProjects: projects.length,
          pendingTasks: pending,
          completedTasks: completed,
          overdueTasks: overdue
        });

        // Tomamos las primeras 5 tareas para "Actividad Reciente"
        setRecentTasks(tasks.slice(0, 5));
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Proyectos Activos" value={stats.totalProjects} color="bg-blue-500" />
        <StatCard title="Tareas Pendientes" value={stats.pendingTasks} color="bg-yellow-500" />
        <StatCard title="Completadas" value={stats.completedTasks} color="bg-green-500" />
        <StatCard title="Vencidas" value={stats.overdueTasks} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Tareas Recientes</h3>
            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <p className="text-gray-500">No hay actividad reciente.</p>
              ) : (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'HIGH' || task.priority === 'URGENT' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                      <span className="text-xs text-blue-600">{task.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Acciones Rápidas</h3>
            <div className="flex flex-col space-y-3">
              <Link to="/projects" className="w-full bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition">
                + Nuevo Proyecto
              </Link>
              <Link to="/tasks" className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-50 transition">
                + Nueva Tarea
              </Link>
              <div className="border-t pt-4 mt-2">
                <p className="text-sm text-gray-500 mb-2">Equipo</p>
                <div className="flex -space-x-2 overflow-hidden">
                  {/* Placeholder avatars */}
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center text-xs">JP</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-400 flex items-center justify-center text-xs">AM</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Subcomponente simple para las tarjetas de stats
const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
  <Card className="flex items-center justify-between border-l-4 border-transparent overflow-hidden relative">
    <div className={`absolute left-0 top-0 bottom-0 w-2 ${color}`}></div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </Card>
);