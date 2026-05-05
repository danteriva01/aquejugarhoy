'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, UsersRound, UserPlus,
  CircleDollarSign, Shuffle as ShuffleIcon,
  ArrowLeft, Check, Gamepad2, Heart,
  Swords, Globe, Crown,
  Crosshair, HandshakeIcon, PartyPopper,
} from 'lucide-react';

// ===== Types =====
interface StepOption {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  examples?: string;
}

// ===== Step Data =====

const WITH_WHOM_OPTIONS: StepOption[] = [
  { id: 'solo', label: 'Solo', sublabel: 'Un jugador', icon: <User className="w-6 h-6" /> },
  { id: 'amigos', label: 'Con amigos', sublabel: 'Grupo', icon: <UsersRound className="w-6 h-6" /> },
  { id: 'pareja', label: 'En pareja', sublabel: '2 jugadores · Cooperativo', icon: <Heart className="w-6 h-6" /> },
];

// Solo sub-options
const SOLO_STYLE_OPTIONS: StepOption[] = [
  {
    id: 'singleplayer',
    label: 'Un buen singleplayer',
    sublabel: 'Narrativa, inmersión, campaña',
    icon: <Swords className="w-6 h-6" />,
  },
  {
    id: 'competitive-online',
    label: 'Competitivo Online',
    sublabel: 'PvP, ranking, habilidad',
    icon: <Crosshair className="w-6 h-6" />,
  },
  {
    id: 'mmo',
    label: 'Multijugador Masivo',
    sublabel: 'MMOs, mundos persistentes',
    icon: <Globe className="w-6 h-6" />,
  },
];

// Amigos count
const AMIGOS_COUNT_OPTIONS: StepOption[] = [
  { id: '2', label: '2', sublabel: 'Dúo', icon: <UsersRound className="w-6 h-6" /> },
  { id: '3-4', label: '3–4', sublabel: 'Grupo chico', icon: <UsersRound className="w-6 h-6" /> },
  { id: '5+', label: '+5', sublabel: 'Grupo grande', icon: <UserPlus className="w-6 h-6" /> },
];

// Amigos game style
const AMIGOS_STYLE_OPTIONS: StepOption[] = [
  {
    id: 'matchmaking',
    label: 'Emparejamiento Online',
    sublabel: 'Matchmaking, PvP online',
    icon: <Crosshair className="w-6 h-6" />,
    examples: 'CS2, Dota 2, Rust, DayZ, LoL, CoD',
  },
  {
    id: 'coop-fun',
    label: 'Cooperativo Divertido',
    sublabel: 'Coop, supervivencia, progresión',
    icon: <HandshakeIcon className="w-6 h-6" />,
    examples: 'Minecraft, Deep Rock, Phasmophobia, Terraria',
  },
  {
    id: 'party',
    label: 'Juegos Fiesta / Party',
    sublabel: 'Caóticos, sociales, para reír',
    icon: <PartyPopper className="w-6 h-6" />,
    examples: 'Among Us, Pummel Party, Pico Park, Worms',
  },
];

// Budget
const BUDGET_OPTIONS: StepOption[] = [
  { id: 'free', label: 'Free to Play', sublabel: 'Solo gratis', icon: <CircleDollarSign className="w-6 h-6" /> },
  { id: 'mixed', label: 'Mixto', sublabel: 'Free + pagos', icon: <Crown className="w-6 h-6" /> },
];

export default function OnboardingFlow() {
  const router = useRouter();

  // State
  const [withWhom, setWithWhom] = useState<string | null>(null);
  const [gameStyle, setGameStyle] = useState<string | null>(null);
  const [amigosCount, setAmigosCount] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const [history, setHistory] = useState<string[]>(['withWhom']);
  const currentStepKey = history[history.length - 1];

  // Calculate total steps for progress bar
  const getTotalSteps = () => {
    if (withWhom === 'pareja') return 2;   // withWhom → budget
    if (withWhom === 'solo') return 3;      // withWhom → soloStyle → budget
    if (withWhom === 'amigos') return 4;    // withWhom → count → style → budget
    return 3; // default
  };

  const buildQueryAndNavigate = (finalBudget: string) => {
    const params = new URLSearchParams();
    params.set('platforms', '4');
    params.set('ordering', '-added');

    const tags: string[] = [];

    // === Build RAWG tags (broad — scoring does the filtering) ===
    if (withWhom === 'solo') {
      if (gameStyle === 'singleplayer') {
        tags.push('singleplayer');
      } else if (gameStyle === 'competitive-online') {
        tags.push('multiplayer', 'competitive');
      } else if (gameStyle === 'mmo') {
        tags.push('massively-multiplayer');
      }
    } else if (withWhom === 'pareja') {
      tags.push('co-op');
    } else if (withWhom === 'amigos') {
      if (gameStyle === 'matchmaking') {
        tags.push('multiplayer');
      } else if (gameStyle === 'coop-fun') {
        tags.push('co-op');
      } else if (gameStyle === 'party') {
        tags.push('funny');
      }
    }

    if (finalBudget === 'free') {
      tags.push('free-to-play');
    }

    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    }

    // Context params for the scoring engine
    if (withWhom) params.set('withWhom', withWhom);
    if (gameStyle) params.set('gameStyle', gameStyle);
    if (amigosCount) params.set('playerCount', amigosCount);
    params.set('budget', finalBudget);

    router.push(`/explorar?${params.toString()}`);
  };

  const advanceTo = (nextStepKey: string) => {
    setTimeout(() => {
      setHistory(prev => [...prev, nextStepKey]);
    }, 120);
  };

  const handleBack = () => {
    setHistory(prev => prev.slice(0, -1));
  };

  // ===== Handlers =====
  const handleWithWhomSelect = (id: string) => {
    setWithWhom(id);
    setGameStyle(null);
    setAmigosCount(null);

    if (id === 'solo') advanceTo('soloStyle');
    else if (id === 'amigos') advanceTo('amigosCount');
    else if (id === 'pareja') advanceTo('budget'); // Direct to budget
  };

  const handleSoloStyleSelect = (id: string) => {
    setGameStyle(id);
    advanceTo('budget');
  };

  const handleAmigosCountSelect = (id: string) => {
    setAmigosCount(id);
    advanceTo('amigosStyle');
  };

  const handleAmigosStyleSelect = (id: string) => {
    setGameStyle(id);
    advanceTo('budget');
  };

  const handleBudgetSelect = (id: string) => {
    setBudget(id);
    buildQueryAndNavigate(id);
  };

  // ===== Step Content =====
  const getStepContent = () => {
    switch (currentStepKey) {
      case 'withWhom':
        return {
          title: '¿Con quién vas a jugar?',
          subtitle: 'Elegí la compañía',
          options: WITH_WHOM_OPTIONS,
          selected: withWhom,
          onSelect: handleWithWhomSelect,
        };
      case 'soloStyle':
        return {
          title: '¿Qué tipo de juego querés jugar?',
          subtitle: 'Elegí tu experiencia',
          options: SOLO_STYLE_OPTIONS,
          selected: gameStyle,
          onSelect: handleSoloStyleSelect,
        };
      case 'amigosCount':
        return {
          title: '¿Cuántos son?',
          subtitle: 'Incluidos vos',
          options: AMIGOS_COUNT_OPTIONS,
          selected: amigosCount,
          onSelect: handleAmigosCountSelect,
        };
      case 'amigosStyle':
        return {
          title: '¿Qué tipo de juego quieren jugar?',
          subtitle: 'Elegí el estilo del grupo',
          options: AMIGOS_STYLE_OPTIONS,
          selected: gameStyle,
          onSelect: handleAmigosStyleSelect,
        };
      case 'budget':
        return {
          title: '¿Presupuesto?',
          subtitle: 'Gratis o también pagos',
          options: BUDGET_OPTIONS,
          selected: budget,
          onSelect: handleBudgetSelect,
        };
      default:
        return null;
    }
  };

  const currentStep = getStepContent();
  if (!currentStep) return null;

  const progressPercent = Math.min((history.length / getTotalSteps()) * 100, 100);

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 pb-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Gamepad2 className="w-8 h-8 text-accent" />
          <span className="font-heading text-2xl font-bold text-text-primary">¿A qué jugar hoy?</span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-bg-tertiary rounded-full mx-auto mb-8 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="w-full max-w-3xl animate-fade-in-up" key={currentStepKey}>
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary text-center mb-2">
          {currentStep.title}
        </h2>
        <p className="text-text-muted text-sm text-center mb-8">
          {currentStep.subtitle}
        </p>

        {/* Option cards */}
        <div className={`grid gap-3 ${
          currentStep.options.length <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-md mx-auto' :
          currentStep.options.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto' :
          'grid-cols-2 sm:grid-cols-4'
        }`}>
          {currentStep.options.map((option) => (
            <button
              key={option.id}
              onClick={() => currentStep.onSelect(option.id)}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-200 cursor-pointer group ${
                currentStep.selected === option.id
                  ? 'bg-accent/8 border-accent text-text-primary'
                  : 'bg-bg-card border-border hover:border-border-hover text-text-secondary hover:text-text-primary'
              }`}
            >
              {/* Check indicator */}
              {currentStep.selected === option.id && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <div className={`transition-colors ${
                currentStep.selected === option.id ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
              }`}>
                {option.icon}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{option.label}</div>
                {option.sublabel && (
                  <div className="text-xs text-text-muted mt-0.5">{option.sublabel}</div>
                )}
                {option.examples && (
                  <div className="text-[10px] text-text-muted/60 mt-1.5 leading-relaxed">
                    {option.examples}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-10">
        {history.length > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2 text-text-muted text-sm hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
        )}
      </div>

      {/* Skip links & Modo Grupo */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
        {currentStepKey === 'withWhom' && (
          <div className="w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-3 justify-center">
              <div className="h-px bg-border flex-1" />
              <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold">¿No se deciden?</span>
              <div className="h-px bg-border flex-1" />
            </div>
            <button
              onClick={() => router.push('/grupo')}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-accent/10 hover:bg-accent/15 border border-accent/20 rounded-xl text-accent-light text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UsersRound className="w-4 h-4" />
              Probar Modo Grupo Colaborativo
            </button>
          </div>
        )}

        <button
          onClick={() => {
            const params = new URLSearchParams({ platforms: '4', ordering: '-rating' });
            const randomPage = Math.floor(Math.random() * 10) + 1;
            params.set('page', String(randomPage));
            params.set('page_size', '1');
            router.push(`/explorar?${params.toString()}`);
          }}
          className="flex items-center gap-1.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
        >
          <ShuffleIcon className="w-3.5 h-3.5" />
          Sorpréndeme con algo aleatorio
        </button>
      </div>
    </div>
  );
}
