'use client';

import { Briefcase, CheckSquare, Clock, AlertCircle, TrendingUp, Users } from 'lucide-react';
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

const stats = [
  { name: 'Proyectos Activos', value: '12', icon: Briefcase, color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-500/10' },
  { name: 'Tareas Pendientes', value: '45', icon: Clock, color: 'from-amber-500 to-orange-400', bg: 'bg-amber-500/10' },
  { name: 'Tareas Completadas', value: '128', icon: CheckSquare, color: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-500/10' },
  { name: 'Tareas Bloqueadas', value: '3', icon: AlertCircle, color: 'from-rose-500 to-red-400', bg: 'bg-rose-500/10' },
];

const doughnutData = {
  labels: ['Pendientes', 'En Progreso', 'Completadas', 'Bloqueadas'],
  datasets: [
    {
      data: [45, 30, 128, 3],
      backgroundColor: [
        'rgba(156, 163, 175, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(244, 63, 94, 0.6)',
      ],
      hoverBackgroundColor: [
        'rgba(156, 163, 175, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(244, 63, 94, 0.8)',
      ],
      borderWidth: 0,
      cutout: '75%',
    },
  ],
};

const barData = {
  labels: ['Proyecto A', 'Proyecto B', 'Proyecto C', 'Proyecto D', 'Proyecto E'],
  datasets: [
    {
      label: '% de Avance',
      data: [65, 40, 85, 30, 95],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      borderRadius: 8,
      barThickness: 20,
    },
  ],
};

export default function DashboardPage() {
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
            <p className="text-sm font-bold text-gray-900">+12.5% este mes</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 border border-gray-100 group"
          >
            <div className={`absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className="relative flex items-center">
              <div className={`${stat.bg} rounded-2xl p-4 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`h-7 w-7 text-transparent bg-clip-text bg-gradient-to-br ${stat.color}`} style={{ color: 'unset', fill: 'none' }} />
                {/* Fallback color if gradient text fails for icons */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <stat.icon className={`h-7 w-7 ${stat.name.includes('Activos') ? 'text-blue-500' : stat.name.includes('Pendientes') ? 'text-amber-500' : stat.name.includes('Completadas') ? 'text-emerald-500' : 'text-rose-500'}`} />
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Progreso de Proyectos</h3>
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div className="h-3 w-3 rounded-full bg-blue-200" />
            </div>
          </div>
          <div className="h-[300px]">
            <Bar 
              data={barData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { 
                    beginAtZero: true, 
                    max: 100,
                    grid: { display: false },
                    border: { display: false }
                  },
                  x: {
                    grid: { display: false },
                    border: { display: false }
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-8">Distribución de Tareas</h3>
          <div className="h-[300px] relative">
            <Doughnut 
              data={doughnutData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: { weight: 'bold' }
                    }
                  }
                }
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <p className="text-4xl font-black text-gray-900">176</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Actividad Reciente</h3>
          </div>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Ver todo</button>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {[
              { user: 'Julián', action: 'completó la tarea', target: 'Implementar API de Proyectos', time: '15 min', color: 'bg-emerald-500' },
              { user: 'Catalina', action: 'creó el componente', target: 'Kanban Board v2', time: '45 min', color: 'bg-blue-500' },
              { user: 'Dev3', action: 'subió un archivo en', target: 'Reportes Mensuales', time: '2 horas', color: 'bg-amber-500' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                className="flex items-center group cursor-pointer"
              >
                <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center text-white font-bold shadow-lg shadow-${item.color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
                  {item.user[0]}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{item.user}</span> {item.action} <span className="font-bold text-blue-600">{item.target}</span>
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Hace {item.time}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-gray-200 group-hover:bg-blue-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
