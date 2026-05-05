import React from 'react';

export default function ExplorerLoading() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-8 w-48 bg-bg-card border border-border rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-bg-card border border-border rounded-lg animate-pulse" />
        </div>

        {/* Search & Filter Skeleton */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <div className="flex-1 h-10 bg-bg-card border border-border rounded-lg animate-pulse" />
          <div className="w-full sm:w-32 h-10 bg-bg-card border border-border rounded-lg animate-pulse" />
          <div className="w-full sm:w-40 h-10 bg-bg-card border border-border rounded-lg animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-bg-card border border-border rounded-xl overflow-hidden h-[380px] animate-pulse">
                  <div className="aspect-[16/9] bg-bg-elevated" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-bg-elevated rounded" />
                    <div className="h-3 w-1/4 bg-bg-elevated rounded" />
                    <div className="space-y-2 pt-4">
                      <div className="h-3 w-full bg-bg-elevated rounded" />
                      <div className="h-3 w-5/6 bg-bg-elevated rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-[300px] h-[600px] bg-bg-card border border-border rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
