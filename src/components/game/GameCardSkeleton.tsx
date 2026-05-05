export default function GameCardSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl overflow-hidden border border-border">
      <div className="aspect-[16/10] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded animate-shimmer" />
          <div className="w-5 h-5 rounded animate-shimmer" />
          <div className="w-5 h-5 rounded animate-shimmer" />
        </div>
        <div className="h-5 w-3/4 rounded animate-shimmer" />
        <div className="flex gap-1">
          <div className="h-5 w-16 rounded-full animate-shimmer" />
          <div className="h-5 w-14 rounded-full animate-shimmer" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-10 rounded animate-shimmer" />
          <div className="h-4 w-12 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
