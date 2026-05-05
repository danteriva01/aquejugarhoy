import Link from 'next/link';
import { GENRES, SPECIAL_CATEGORIES } from '@/lib/constants';
import {
  Swords, Lightbulb, Compass, Shield, BrainCircuit, Crosshair,
  Smile, Cpu, Gamepad2, Footprints, Gauge, Globe, Trophy, Flame,
  Heart, LayoutGrid, CircleDollarSign, Users, UsersRound, User,
  Skull, Grid3X3,
} from 'lucide-react';
import type { ElementType } from 'react';

// Map icon string names to Lucide components
const ICON_MAP: Record<string, ElementType> = {
  Swords, Lightbulb, Compass, Shield, BrainCircuit, Crosshair,
  Smile, Cpu, PuzzleIcon: Gamepad2, Joystick: Gamepad2, Footprints, Gauge,
  Globe, Trophy, Flame, Heart, LayoutGrid, CircleDollarSign,
  Users, UsersRound, User, Skull, Grid3X3,
};

export default function CategoryGrid() {
  const allCategories = [
    ...SPECIAL_CATEGORIES.map((c) => ({
      name: c.name,
      icon: c.icon,
      href: `/explorar?tags=${c.tag}&ordering=-added`,
    })),
    ...GENRES.slice(0, 8).map((g) => ({
      name: g.name,
      icon: g.icon,
      href: `/explorar?genres=${g.slug}&ordering=-added`,
    })),
  ];

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid className="w-5 h-5 text-text-muted" />
        <h2 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">
          Categorías
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
        {allCategories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Gamepad2;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-center gap-2.5 px-3 py-3 bg-bg-card rounded-lg border border-border hover:border-border-hover transition-colors group"
            >
              <IconComp className="w-4 h-4 text-text-muted group-hover:text-accent-light transition-colors flex-shrink-0" />
              <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors truncate">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
