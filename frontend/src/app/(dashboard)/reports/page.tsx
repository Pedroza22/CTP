'use client';

import { FileText, FileSpreadsheet, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function ReportsPage() {
  const downloadReport = async (type: 'pdf' | 'excel', reportName: string) => {
    try {
      const endpoint = type === 'pdf' ? '/reports/pdf/' : '/reports/excel/';
      const response = await api.get(endpoint, {
        responseType: 'blob',
        params: { report: reportName }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-${reportName.toLowerCase().replace(/\s+/g, '-')}.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error descargando el reporte:', error);
      alert('Error al generar el reporte. Asegúrate de que el backend esté disponible.');
    }
  };
  const reports = [
    {
      title: 'Resumen Ejecutivo',
      description: 'Estado general de todos los proyectos activos, hitos alcanzados y riesgos detectados.',
      icon: TrendingUp,
      color: 'from-blue-600 to-indigo-500',
    },
    {
      title: 'Productividad de Tareas',
      description: 'Métricas detalladas sobre la velocidad del equipo y tasas de completitud de tareas.',
      icon: BarChart3,
      color: 'from-emerald-600 to-teal-500',
    },
    {
      title: 'Distribución de Carga',
      description: 'Análisis de tareas asignadas por usuario y balance de responsabilidades.',
      icon: PieChart,
      color: 'from-amber-600 to-orange-500',
    }
  ];

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Reportes</span>
        </h1>
        <p className="mt-2 text-lg text-gray-500">Genera y descarga informes detallados del estado de tus proyectos.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full"
          >
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <report.icon className="h-7 w-7" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">{report.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-1">{report.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <Button 
                variant="outline" 
                onClick={() => downloadReport('pdf', report.title)}
                className="rounded-2xl border-2 flex items-center justify-center gap-2 group/btn hover:border-red-500 hover:text-red-500 transition-all"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => downloadReport('excel', report.title)}
                className="rounded-2xl border-2 flex items-center justify-center gap-2 group/btn hover:border-green-500 hover:text-green-500 transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
      >
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-bold mb-4">¿Necesitas un reporte personalizado?</h3>
          <p className="text-indigo-100 mb-8 leading-relaxed">
            Puedes configurar filtros avanzados por fecha, usuario, proyecto y prioridad para obtener exactamente la información que necesitas.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-bold px-8 shadow-xl">
            Configurar Reporte Avanzado
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-48 w-48 bg-purple-500/20 rounded-full blur-2xl" />
      </motion.div>
    </div>
  );
}
