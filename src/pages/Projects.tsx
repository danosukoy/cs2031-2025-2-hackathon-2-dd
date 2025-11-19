import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Project } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ProjectForm } from '../components/projects/ProjectForm';

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Pedimos un límite alto para simplificar la paginación en esta hackathon
      const response = await api.get('/projects?limit=50');
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error cargando proyectos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtrado en cliente
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar proyecto? Esto no borrará las tareas asociadas automáticamente, pero ten cuidado.')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      alert('No se pudo eliminar el proyecto');
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Proyectos</h2>
        <Button onClick={handleCreate}>+ Nuevo Proyecto</Button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="max-w-md">
        <input 
          type="text" 
          placeholder="Buscar proyecto..." 
          className="w-full border rounded p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Proyectos */}
      {loading ? (
        <div className="text-center py-10">Cargando proyectos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow border-t-4 border-blue-500">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 truncate">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3 h-12">
                  {project.description || 'Sin descripción'}
                </p>
              </div>
              
              <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <button 
                  onClick={() => handleEdit(project)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Eliminar
                </button>
              </div>
            </Card>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded shadow-sm">
              No se encontraron proyectos. ¡Crea el primero!
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      >
        <ProjectForm 
          initialData={editingProject} 
          onSuccess={handleSuccess} 
        />
      </Modal>
    </div>
  );
};