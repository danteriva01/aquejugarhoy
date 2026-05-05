import Image from 'next/image';
import { getDealRedirectUrl } from '@/lib/api/cheapshark';
import type { CheapSharkDeal } from '@/lib/api/types';
import PriceBadge from '@/components/ui/PriceBadge';
import { StoreIcon } from '@/components/ui/StoreIcons';
import { STORES } from '@/lib/constants';

interface DealCardProps {
  deal: CheapSharkDeal;
  index?: number;
}

export default function DealCard({ deal, index = 0 }: DealCardProps) {
  const storeId = parseInt(deal.storeID);
  const storeInfo = STORES[storeId];
  const dealUrl = getDealRedirectUrl(deal.dealID);
  
  // CheapShark savings comes as a string like "95.055915"
  const discountPercent = parseFloat(deal.savings);

  return (
    <a
      href={dealUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block animate-fade-in-up h-full"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
      title={`Ver oferta de ${deal.title}`}
    >
      <div className="relative h-full bg-bg-card rounded-lg overflow-hidden border border-border hover:border-border-hover hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 flex flex-col">
        
        {/* Thumbnail Image */}
        <div className="relative w-full aspect-[460/215] bg-bg-elevated overflow-hidden shrink-0">
          <Image
            src={deal.thumb}
            alt={deal.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading={index < 4 ? "eager" : "lazy"}
          />
          
          {/* Store Icon Overlay */}
          <div className="absolute bottom-2 left-2 p-1.5 bg-bg-primary/80 backdrop-blur-sm rounded border border-border/50">
            <StoreIcon storeId={storeId} className="w-3.5 h-3.5 text-text-primary" />
          </div>

          {/* Rating overlay if available */}
          {deal.steamRatingPercent && deal.steamRatingPercent !== "0" && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-sm rounded text-[10px] font-medium border border-border/50 flex items-center gap-1">
              <span className={parseInt(deal.steamRatingPercent) >= 70 ? "text-success" : "text-warning"}>
                {deal.steamRatingPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-grow justify-between gap-3">
          
          {/* Title */}
          <h3 className="font-heading font-medium text-sm text-text-primary group-hover:text-accent-light transition-colors duration-200 line-clamp-2 leading-snug">
            {deal.title}
          </h3>

          {/* Bottom Row: Reviews & Price */}
          <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/50">
            <div className="text-[10px] text-text-muted truncate max-w-[40%]">
              {deal.steamRatingText || (storeInfo ? storeInfo.name : 'Oferta')}
            </div>
            
            <PriceBadge 
              normalPrice={parseFloat(deal.normalPrice)}
              salePrice={parseFloat(deal.salePrice)}
              discountPercent={discountPercent}
              size="sm"
            />
          </div>
        </div>
        
      </div>
    </a>
  );
}
