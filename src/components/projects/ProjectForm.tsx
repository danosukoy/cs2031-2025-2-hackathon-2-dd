import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Project } from '../../types';
import { Button } from '../common/Button';

interface ProjectFormProps {
  initialData: Project | null;
  onSuccess: () => void;
}

export const ProjectForm = ({ initialData, onSuccess }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status
      });
    } else {
      setFormData({ name: '', description: '', status: 'ACTIVE' });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await api.put(`/projects/${initialData.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      onSuccess();
    } catch (error) {
      alert('Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
        <input 
          required 
          type="text" 
          className="mt-1 w-full border rounded p-2" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          placeholder="Ej: Rediseño Web"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea 
          className="mt-1 w-full border rounded p-2" 
          rows={3}
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          placeholder="Detalles del alcance..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select 
          className="mt-1 w-full border rounded p-2" 
          value={formData.status} 
          onChange={e => setFormData({...formData, status: e.target.value})}
        >
          <option value="ACTIVE">Activo</option>
          <option value="ON_HOLD">En Espera</option>
          <option value="COMPLETED">Completado</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear Proyecto')}
        </Button>
      </div>
    </form>
  );
};