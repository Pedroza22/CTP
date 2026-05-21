'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { User, Camera, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
      }

      await updateProfile(formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Perfil</span>
        </h1>
        <p className="mt-2 text-gray-500">Gestiona tu información personal y apariencia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-1 shadow-2xl shadow-blue-200">
                <div className="h-full w-full rounded-[22px] bg-white flex items-center justify-center overflow-hidden relative">
                  {avatarPreview || user?.avatar_url ? (
                    <Image 
                      src={avatarPreview || (user?.avatar_url?.startsWith('http') ? user.avatar_url : `http://localhost:8000${user?.avatar_url}`)} 
                      alt="Avatar" 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <User className="h-12 w-12 text-blue-600" />
                  )}
                </div>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 text-blue-600 hover:scale-110 transition-transform"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange}
              />
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-black text-gray-900">{user?.username}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 mt-2">
                <Shield className="h-3.5 w-3.5" />
                {user?.role}
              </span>
            </div>

            <div className="w-full mt-8 pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="h-4 w-4 text-gray-400" />
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Nombre de usuario"
                  placeholder="Tu nombre de usuario"
                  error={errors.username?.message}
                  {...register('username')}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email (No editable)</label>
                  <div className="block w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-3 text-gray-400 sm:text-sm cursor-not-allowed">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button 
                  type="submit" 
                  isLoading={isLoading} 
                  className="flex-1 rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
                >
                  Guardar Cambios
                </Button>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    ¡Actualizado!
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
