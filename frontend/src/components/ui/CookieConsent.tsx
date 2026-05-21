'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-8 md:w-[450px]"
        >
          <div className="bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-50" />
            
            <div className="flex items-start gap-4 relative">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Aviso de Privacidad</h3>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Utilizamos cookies técnicas y analíticas para mejorar tu experiencia. Al navegar, aceptas nuestra 
                  <span className="text-blue-600 font-bold"> Política de Tratamiento de Datos</span> conforme a la 
                  <span className="font-bold"> Ley 1581 de 2012</span> y estándares <span className="font-bold">ISO 27001</span>.
                </p>
                
                <div className="mt-6 flex items-center gap-3">
                  <Button 
                    onClick={handleAccept}
                    className="flex-1 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100"
                  >
                    Aceptar y Continuar
                  </Button>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest px-2"
                  >
                    Configurar
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
