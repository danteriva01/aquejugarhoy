'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Library, LogOut } from 'lucide-react';

export default function SteamLoginButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    window.location.href = '/auth/steam';
  };

  const handleLogout = async () => {
    await fetch('/api/user', { method: 'DELETE' });
    setUser(null);
    window.location.reload();
  };

  if (loading) return <div className="w-8 h-8 rounded-full bg-bg-elevated animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/perfil"
          className="flex items-center gap-3 bg-bg-card border border-border hover:border-accent/50 px-3 py-1.5 rounded-full transition-all group"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-accent/30 group-hover:border-accent transition-colors">
            <Image 
              src={user.avatar} 
              alt={user.name} 
              fill 
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-text-primary hidden sm:inline group-hover:text-accent transition-colors">
            {user.name}
          </span>
          <Library className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors hidden sm:block" />
        </Link>
        <button 
          onClick={handleLogout}
          className="p-2 text-text-muted hover:text-error transition-colors rounded-full hover:bg-error/10"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2.5 px-4 py-2 bg-[#171a21] hover:bg-[#2a475e] text-white rounded-md transition-colors font-medium text-sm border border-white/5 shadow-lg group"
    >
      <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.834 16.591l-.146.046c-.538.169-1.077.218-1.57.143-.492-.075-.929-.264-1.282-.553-.352-.289-.603-.667-.738-1.116-.134-.449-.138-.962-.01-1.517l2.846-12.012 1.442.342-2.846 12.012c-.085.358-.081.693-.01.999.071.306.216.56.44.757.225.196.505.32.83.37.324.049.664.015 1.044-.105l.146-.046 1.442.342-1.442-.342-.164.693-1.442-.342.164-.693.125-.529zm7.091-6.195l-3.328 14.053-1.442-.341 3.328-14.053 1.442.341z" />
      </svg>
      <span>Conectar Steam</span>
    </button>
  );
}
