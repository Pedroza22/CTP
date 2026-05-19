'use client';

import { Briefcase, CheckSquare, Clock, AlertCircle, TrendingUp, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useDashboard } from '@/lib/hooks/useDashboard';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
);

export default function DashboardPage() {
  const { stats, progress, statusCounts, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Proyectos Activos', value: stats?.active_projects || 0, icon: Briefcase, color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-500/10' },
    { name: 'Tareas Pendientes', value: stats?.pending_tasks || 0, icon: Clock, color: 'from-amber-500 to-orange-400', bg: 'bg-amber-500/10' },
    { name: 'Tareas Completadas', value: stats?.completed_tasks || 0, icon: CheckSquare, color: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-500/10' },
    { name: 'Total Proyectos', value: stats?.total_projects || 0, icon: BarChart2, color: 'from-rose-500 to-red-400', bg: 'bg-rose-500/10' },
  ];

  const doughnutData = {
    labels: statusCounts.map(s => s.status.charAt(0).toUpperCase() + s.status.slice(1)),
    datasets: [
      {
        data: statusCounts.map(s => s.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(156, 163, 175, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(244, 63, 94, 0.6)',
        ],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const barData = {
    labels: progress.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
    datasets: [
      {
        label: '% de Avance',
        data: progress.map(p => p.progress),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="space-y-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Analytics</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">Gestión de proyectos y visualización de métricas en tiempo real.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="pr-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rendimiento</p>
            <p className="text-sm font-bold text-gray-900">Actualizado ahora</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 border border-gray-100 group hover:scale-[1.02] transition-transform"
          >
            <div className={`absolute top-0 right-0 h-32 w-32 -mr-16 -mt-16 rounded-full opacity-10 bg-gradient-to-br ${stat.color}`} />
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className="h-6 w-6 text-gray-900" />
              </div>
              <span className="text-2xl font-black text-gray-900">{stat.value}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Distribución de Estados</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={doughnutData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { usePointStyle: true, font: { weight: 'bold' } } }
                }
              }} 
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Progreso de Proyectos</h3>
          </div>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
