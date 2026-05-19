'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Proyectos', href: '/projects', icon: Briefcase },
  { name: 'Tareas', href: '/tasks', icon: CheckSquare },
  { name: 'Usuarios', href: '/users', icon: Users, adminOnly: true },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <Link href="/dashboard" className="flex h-16 items-center px-6 hover:bg-gray-50 transition-colors">
        <span className="text-xl font-bold text-blue-600">Precision Flow</span>
      </Link>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={logout}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
