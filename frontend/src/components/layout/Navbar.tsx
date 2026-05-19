'use client';

import { Search, User } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-10 sticky top-0 z-30">
      <div className="flex w-96 items-center">
        <div className="relative w-full group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full rounded-2xl border-0 bg-gray-50 py-2.5 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all"
            placeholder="Buscar proyectos, tareas..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <NotificationBell />
        <Link href="/users" className="flex items-center space-x-4 pl-6 border-l border-gray-100 hover:bg-gray-50/50 p-2 rounded-2xl transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{user?.username || 'Usuario'}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user?.role || 'Miembro'}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">
            <div className="h-full w-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden relative">
              {user?.avatar_url ? (
                <Image src={user.avatar_url} alt="Profile" fill className="object-cover" />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
