// SVG Store Icons — inline for performance and styling control

interface IconProps {
  className?: string;
}

export function SteamIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Steam">
      <path d="M11.979 0C5.678 0 .511 4.86.022 10.94L6.432 14.6a3.382 3.382 0 0 1 1.891-.577c.063 0 .124.003.186.006l2.83-4.098v-.058c0-2.27 1.85-4.12 4.12-4.12 2.27 0 4.12 1.85 4.12 4.12 0 2.27-1.85 4.12-4.12 4.12h-.097l-4.034 2.878c0 .047.003.095.003.143 0 1.703-1.384 3.087-3.087 3.087a3.093 3.093 0 0 1-3.058-2.656L.583 15.09C1.85 19.97 6.37 23.657 11.78 23.997v.003h.2c6.627 0 12.02-5.393 12.02-12.02C24 5.383 18.607 0 11.98 0zm-3.63 18.6a2.322 2.322 0 0 1-1.313-1.156 2.32 2.32 0 0 1 1.197-3.056l1.443.596a1.73 1.73 0 0 0-.194 2.438 1.74 1.74 0 0 0 2.408.371l1.506.621a2.328 2.328 0 0 1-2.12 1.372 2.333 2.333 0 0 1-2.927-1.186zm7.11-7.85a2.748 2.748 0 0 1-2.747-2.746 2.748 2.748 0 0 1 2.746-2.747 2.748 2.748 0 0 1 2.747 2.747 2.748 2.748 0 0 1-2.747 2.747zm0-4.58a1.833 1.833 0 1 0 0 3.666 1.833 1.833 0 0 0 0-3.666z"/>
    </svg>
  );
}

export function EpicGamesIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Epic Games">
      <path d="M3.537 0C2.165 0 1.66.506 1.66 1.879V18.44c0 .505.024.863.073 1.09.049.227.146.424.295.592.15.168.344.273.585.315.24.042.554.063.938.063h.465c.22 0 .39-.03.507-.094.117-.063.195-.178.233-.345l.06-.345c.478.558 1.236.837 2.275.837.89 0 1.63-.262 2.22-.786.59-.524.887-1.287.887-2.287V14.16c0-1-.297-1.763-.886-2.287-.59-.524-1.33-.786-2.22-.786-1.04 0-1.798.279-2.276.837v-4.92H3.537V0zm13.762 6.934c-1.002 0-1.822.262-2.458.786-.636.524-.955 1.287-.955 2.287v3.32c0 1 .319 1.763.955 2.287.636.524 1.456.786 2.458.786 1.002 0 1.822-.262 2.458-.786.636-.524.955-1.287.955-2.287v-3.32c0-1-.32-1.763-.955-2.287-.636-.524-1.456-.786-2.458-.786zm-5.282.163c-.384 0-.572.182-.572.546v8.72c0 .364.188.546.572.546h.838c.384 0 .572-.182.572-.546v-8.72c0-.364-.188-.546-.572-.546h-.838zM7.6 8.873c.57 0 .856.289.856.866v3.835c0 .577-.286.866-.856.866-.57 0-.856-.289-.856-.866V9.74c0-.577.286-.866.856-.866zm9.7 0c.57 0 .856.289.856.866v3.835c0 .577-.287.866-.856.866-.57 0-.856-.289-.856-.866V9.74c0-.577.286-.866.856-.866zM20.462 0c-.483 0-.724.241-.724.724v22.552c0 .483.241.724.724.724h2.814c.483 0 .724-.241.724-.724V.724C24 .241 23.759 0 23.276 0h-2.814z"/>
    </svg>
  );
}

export function GOGIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GOG">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6-9.6-4.298-9.6-9.6 4.298-9.6 9.6-9.6zm0 3.6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 2.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z"/>
    </svg>
  );
}

export function MicrosoftStoreIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Microsoft Store">
      <path d="M0 0h11.377v11.377H0zm12.623 0H24v11.377H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z"/>
    </svg>
  );
}

export function ItchIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Itch.io">
      <path d="M3.13 1.338C2.08 1.96.5 4.33.5 5.49c0 1.828-.04 1.87 1.243 2.14 1.917.403 3.397-.612 3.674-1.85.103.497.142.744.297 1.072.416.881 1.49 1.172 2.397.743a1.867 1.867 0 0 0 .675-.59c.09-.127.127-.2.162-.2.035 0 .073.073.163.2.351.494.748.723 1.31.793.606.076 1.09-.09 1.462-.463.09-.092.127-.146.162-.146.035 0 .073.054.163.146.372.373.856.539 1.462.463.562-.07.959-.299 1.31-.793.09-.127.128-.2.163-.2s.072.073.162.2c.186.262.38.44.675.59.907.429 1.981.138 2.397-.743.155-.328.194-.575.297-1.072.277 1.238 1.757 2.253 3.674 1.85C23.54 7.36 23.5 7.318 23.5 5.49c0-1.16-1.58-3.53-2.63-4.152C19.478.374 17.86.25 12 .25c-5.86 0-7.478.125-8.87 1.088zM6.985 10.03v3.222H4.563v5.756h3.193v-5.756h2.422V10.03H6.985zm6.093 0v8.978h3.193v-3.222h2.166v3.222h3.193V10.03h-8.552zm3.193 2.534h2.166v3.222h-2.166v-3.222z"/>
    </svg>
  );
}

// Helper to get store icon by RAWG store ID
export function StoreIcon({ storeId, className }: { storeId: number; className?: string }) {
  switch (storeId) {
    case 1: return <SteamIcon className={className} />;
    case 11: return <EpicGamesIcon className={className} />;
    case 5: return <GOGIcon className={className} />;
    case 2: return <MicrosoftStoreIcon className={className} />;
    case 7: return <ItchIcon className={className} />;
    default: return null;
  }
}

// Compact row of store icons from a game's stores array
export function StoreIconsRow({ stores, className = 'w-3.5 h-3.5' }: {
  stores: { id: number; store: { id: number; name: string } }[] | null;
  className?: string;
}) {
  if (!stores || stores.length === 0) return null;

  // Deduplicate and only show known stores
  const knownStores = stores.filter(s => [1, 11, 5, 2, 7].includes(s.store.id));
  const uniqueIds = [...new Set(knownStores.map(s => s.store.id))];

  return (
    <div className="flex items-center gap-1.5 text-text-muted">
      {uniqueIds.map(id => (
        <StoreIcon key={id} storeId={id} className={className} />
      ))}
    </div>
  );
}
