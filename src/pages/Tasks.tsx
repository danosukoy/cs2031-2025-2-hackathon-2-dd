import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Task, Project, TeamMember } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/tasks/TaskForm';

export const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team/members')
      .then(res => setMembers(res.data.members))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-10">Cargando equipo...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Nuestro Equipo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500 truncate">{member.email}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks?limit=100'), 
        api.get('/projects?limit=100')
      ]);
      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);
    } catch (error) {
      console.error("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  });

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Tareas</h2>
        <Button onClick={handleCreateClick}>+ Nueva Tarea</Button>
      </div>

      {/* Filtros */}
      <Card className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <select 
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los Estados</option>
          <option value="TODO">Por Hacer</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="COMPLETED">Completada</option>
        </select>

        <select 
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={filterPriority} 
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">Todas las Prioridades</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </Card>

      {/* Lista de Tareas */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando tareas...</div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="flex flex-col md:flex-row justify-between gap-4 border-l-4 hover:shadow-md transition-shadow" style={{ borderColor: getPriorityColor(task.priority) }}>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span>📁 {getProjectName(task.projectId)}</span>
                  <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                  <span className="font-medium" style={{ color: getPriorityColor(task.priority) }}>
                    ⚡ {task.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0">
                <button onClick={() => handleEditClick(task)} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2">Editar</button>
                <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-800 text-sm font-medium px-2">Eliminar</button>
              </div>
            </Card>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed">
              No se encontraron tareas con estos filtros.
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
      >
        <TaskForm 
          initialData={editingTask} 
          onSuccess={handleSaveSuccess} 
          projects={projects} 
        />
      </Modal>
    </div>
  );
};

const getPriorityColor = (p: string) => {
  switch(p) {
    case 'URGENT': return '#ef4444'; 
    case 'HIGH': return '#f97316'; 
    case 'MEDIUM': return '#eab308'; 
    default: return '#3b82f6'; 
  }
};

const getStatusColor = (s: string) => {
    if (s === 'COMPLETED') return 'bg-green-100 text-green-800';
    if (s === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
}