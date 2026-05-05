import { Info } from 'lucide-react';

interface AdPlaceholderProps {
  slot: string;
  size?: 'banner' | 'sidebar' | 'inline';
  className?: string;
}

export default function AdPlaceholder({ slot, size = 'banner', className = '' }: AdPlaceholderProps) {
  // Configuración de tamaños
  const sizeClasses = {
    banner: 'w-full h-[90px] max-w-[728px] mx-auto',
    sidebar: 'w-full aspect-[300/250]',
    inline: 'w-full aspect-[300/250] sm:h-[90px] sm:aspect-auto',
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center bg-bg-elevated border border-border border-dashed rounded-lg opacity-60 hover:opacity-100 transition-opacity p-4 ${sizeClasses[size]} ${className}`}
      data-ad-slot={slot}
    >
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-text-muted font-medium mb-1">
        <Info className="w-3 h-3" />
        Espacio publicitario
      </span>
      <span className="text-[10px] text-text-muted/50">
        Apoya el mantenimiento de la web
      </span>
    </div>
  );
}
