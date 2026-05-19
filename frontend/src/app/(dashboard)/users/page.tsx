'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, Role } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Intentar fetch real, si no devolver mocks
      try {
        const response = await api.get<User[]>('/auth/users/'); // Ajustar según backend
        return response.data;
      } catch {
        return [
          { id: '1', username: 'Julian', email: 'julian@example.com', role: 'admin' as Role },
          { id: '2', username: 'Catalina', email: 'catalina@example.com', role: 'member' as Role },
          { id: '3', username: 'Dev3', email: 'dev3@example.com', role: 'member' as Role },
        ];
      }
    },
    initialData: [
      { id: '1', username: 'Julian', email: 'julian@example.com', role: 'admin' as Role },
      { id: '2', username: 'Catalina', email: 'catalina@example.com', role: 'member' as Role },
      { id: '3', username: 'Dev3', email: 'dev3@example.com', role: 'member' as Role },
    ]
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Usuarios</span>
          </h1>
          <p className="mt-2 text-gray-500">Administra los accesos y roles de tu equipo.</p>
        </div>
        <Button className="flex items-center gap-2 rounded-2xl shadow-lg shadow-blue-200" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Añadir Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 group hover:y-[-5px] transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${user.role === 'admin' ? 'bg-gradient-to-br from-indigo-600 to-blue-500 shadow-blue-200' : 'bg-gradient-to-br from-gray-600 to-gray-400 shadow-gray-200'}`}>
                {user.username[0].toUpperCase()}
              </div>
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">{user.username}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                  <Shield className="h-3 w-3" />
                  {user.role}
                </span>
                
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir Nuevo Usuario"
      >
        <div className="text-center py-8">
          <p className="text-gray-500 italic">El formulario de creación de usuarios estará disponible próximamente.</p>
        </div>
      </Modal>
    </div>
  );
}
