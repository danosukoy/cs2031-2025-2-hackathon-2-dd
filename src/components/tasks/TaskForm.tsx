import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Task, Project } from '../../types';
import { Button } from '../common/Button';

interface TaskFormProps {
  initialData: Task | null;
  onSuccess: () => void;
  projects: Project[];
}

export const TaskForm = ({ initialData, onSuccess, projects }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        projectId: initialData.projectId,
        priority: initialData.priority,
        status: initialData.status,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({ 
        title: '', 
        description: '', 
        projectId: projects[0]?.id || '', 
        priority: 'MEDIUM', 
        status: 'TODO', 
        dueDate: new Date().toISOString().split('T')[0] 
      });
    }
  }, [initialData, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await api.put(`/tasks/${initialData.id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      onSuccess();
    } catch (error) {
      alert('Error al guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input 
          required 
          type="text" 
          className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea 
          className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          rows={3}
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Proyecto</label>
          <select 
            required
            className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={formData.projectId} 
            onChange={e => setFormData({...formData, projectId: e.target.value})}
          >
             <option value="" disabled>Seleccionar...</option>
             {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Límite</label>
          <input 
            required
            type="date" 
            className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={formData.dueDate} 
            onChange={e => setFormData({...formData, dueDate: e.target.value})} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Prioridad</label>
            <select className="mt-1 w-full border rounded p-2" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select className="mt-1 w-full border rounded p-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="TODO">Por Hacer</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completada</option>
            </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
};