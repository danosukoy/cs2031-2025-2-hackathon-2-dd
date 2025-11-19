import { useState, useEffect } from 'react';
import api from '../services/api';
import type { TeamMember } from '../types';
import { Card } from '../components/common/Card';

export const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get('/team/members');
        setMembers(response.data.members || []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los miembros del equipo.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <div className="text-center p-10 text-blue-600 font-medium">Cargando equipo...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Nuestro Equipo</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {members.length} Miembros
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="flex items-center space-x-4 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-gray-900 truncate" title={member.name}>
                {member.name}
              </p>
              <p className="text-sm text-gray-500 truncate" title={member.email}>
                {member.email}
              </p>
            </div>
          </Card>
        ))}
        
        {members.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
            No se encontraron miembros en el equipo.
          </div>
        )}
      </div>
    </div>
  );
};