'use client';

import { useState } from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'comment';
  created_at: string;
  is_read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Julián completó la tarea "API de Proyectos"',
      type: 'success',
      created_at: new Date().toISOString(),
      is_read: false,
    },
    {
      id: 2,
      message: 'Nuevo comentario de Catalina en "Sidebar"',
      type: 'comment',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_read: false,
    },
    {
      id: 3,
      message: 'La tarea "Reportes" está próxima a vencer',
      type: 'warning',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      is_read: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-2xl p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 z-50 mt-4 w-80 origin-top-right rounded-3xl bg-white p-4 shadow-2xl shadow-gray-200/80 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notificaciones</h3>
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter hover:underline">
                  Marcar todas como leídas
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    className={`flex gap-3 p-3 rounded-2xl transition-all cursor-pointer ${n.is_read ? 'bg-white opacity-60' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                  >
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-900 font-medium leading-relaxed">{n.message}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.is_read && <div className="mt-2 h-2 w-2 rounded-full bg-blue-600 shadow-sm shadow-blue-200" />}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 text-center">
                <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Ver historial completo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
