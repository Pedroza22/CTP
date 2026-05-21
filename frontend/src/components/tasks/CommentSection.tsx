'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User as UserIcon, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  task: string;
  user: string;
  user_detail: {
    username: string;
    avatar_url?: string;
  };
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  taskId: string;
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      // Endpoint mock por ahora si no existe
      try {
        const response = await api.get<Comment[]>(`/comments/?task_id=${taskId}`);
        return response.data;
      } catch {
        return [
          {
            id: '1',
            task: taskId,
            user: '1',
            user_detail: { username: 'Julian' },
            content: 'He revisado la base de datos y todo parece estar en orden.',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            task: taskId,
            user: '2',
            user_detail: { username: 'Catalina' },
            content: 'Ya subí los mockups iniciales a Figma.',
            created_at: new Date(Date.now() - 1800000).toISOString(),
          }
        ];
      }
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post('/comments/', { task: taskId, content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      setNewComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommentMutation.mutate(newComment);
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        Comentarios
        <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h4>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          className="w-full rounded-2xl border-gray-200 border-2 p-4 pr-12 text-sm focus:border-blue-500 focus:ring-0 transition-all min-h-[100px] resize-none text-gray-900 bg-white placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || createCommentMutation.isPending}
          className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-900">{comment.user_detail.username}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && !isLoading && (
          <p className="text-center text-gray-400 text-sm italic py-4">No hay comentarios aún.</p>
        )}
      </div>
    </div>
  );
}
