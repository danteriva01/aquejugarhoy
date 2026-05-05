import { Tag } from 'lucide-react';

interface PriceBadgeProps {
  normalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  isFree?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceBadge({
  normalPrice,
  salePrice,
  discountPercent,
  isFree,
  className = '',
  size = 'md',
}: PriceBadgeProps) {
  // Free game
  if (isFree || salePrice === 0) {
    const sizeClasses = {
      sm: 'text-[10px] px-1.5 py-0.5',
      md: 'text-xs px-2 py-1',
      lg: 'text-sm px-3 py-1.5',
    };

    return (
      <div className={`inline-flex items-center font-bold bg-success/20 text-success rounded ${sizeClasses[size]} ${className}`}>
        Free to Play
      </div>
    );
  }

  // Discounted game
  if (discountPercent && discountPercent > 0 && salePrice !== undefined && normalPrice !== undefined) {
    const textSizes = {
      sm: { badge: 'text-[10px]', price: 'text-xs', original: 'text-[10px]' },
      md: { badge: 'text-xs', price: 'text-sm', original: 'text-[10px]' },
      lg: { badge: 'text-sm', price: 'text-base', original: 'text-xs' },
    };

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`inline-flex items-center font-bold bg-accent/20 text-accent-light px-1.5 py-0.5 rounded ${textSizes[size].badge}`}>
          -{Math.round(discountPercent)}%
        </div>
        <div className="flex flex-col items-end leading-none">
          <span className={`text-text-muted line-through ${textSizes[size].original}`}>
            US${normalPrice.toFixed(2)}
          </span>
          <span className={`font-bold text-text-primary ${textSizes[size].price}`}>
            US${salePrice.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  // Normal price game
  if (normalPrice !== undefined) {
    const textSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    return (
      <div className={`font-medium text-text-primary ${textSizes[size]} ${className}`}>
        US${normalPrice.toFixed(2)}
      </div>
    );
  }

  // No price info
  return null;
}
