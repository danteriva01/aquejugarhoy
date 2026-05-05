import { DONATION_URL } from '@/lib/constants';
import { Coffee } from 'lucide-react';

interface DonationButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function DonationButton({ variant = 'compact', className = '' }: DonationButtonProps) {
  if (variant === 'compact') {
    return (
      <a
        href={DONATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-bg-card border border-border text-text-secondary text-sm hover:text-accent-light hover:border-accent/30 hover:bg-accent/5 transition-all ${className}`}
        title="Invitame un cafecito"
      >
        <Coffee className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Apoyar</span>
      </a>
    );
  }

  return (
    <a
      href={DONATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm font-medium hover:border-accent/50 hover:bg-bg-card transition-all group ${className}`}
    >
      <Coffee className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
      <span>Invitar un cafecito</span>
    </a>
  );
}
