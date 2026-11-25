import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { PokemonCharacterId } from '../types/learning';

const POKEBALL_ICON_URL = '/src/assets/images/icon_pokeball_1795568614013.jpg';

const CHARACTER_IMAGE_MAP: Record<PokemonCharacterId, { src: string; alt: string; borderClass: string }> = {
  pikachu: {
    src: '/src/assets/images/icon_pikachu_1795568613405.jpg',
    alt: 'Ikon Pikachu',
    borderClass: 'border-yellow-300 bg-yellow-50',
  },
  squirtle: {
    src: '/src/assets/images/icon_squirtle_1795568612778.jpg',
    alt: 'Ikon Squirtle',
    borderClass: 'border-sky-300 bg-sky-50',
  },
  bulbasaur: {
    src: '/src/assets/images/icon_bulbasaur_1795568613483.jpg',
    alt: 'Ikon Bulbasaur',
    borderClass: 'border-emerald-300 bg-emerald-50',
  },
  charmander: {
    src: '/src/assets/images/icon_charmander_1795568613801.jpg',
    alt: 'Ikon Charmander',
    borderClass: 'border-orange-300 bg-orange-50',
  },
  eevee: {
    src: '/src/assets/images/icon_eevee_1795578875518.jpg',
    alt: 'Ikon Eevee',
    borderClass: 'border-amber-300 bg-amber-50',
  },
};

export const CharacterMiniIcon: React.FC<{
  character: PokemonCharacterId;
  className?: string;
}> = ({ character, className = 'w-6 h-6' }) => {
  const [failed, setFailed] = useState(false);
  const info = CHARACTER_IMAGE_MAP[character];

  if (failed) {
    return (
      <span
        className={`${className} inline-flex items-center justify-center rounded-full border ${info.borderClass} text-[10px] font-extrabold text-slate-900 uppercase shrink-0`}
        aria-label={info.alt}
      >
        {character.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={info.src}
      alt={info.alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${className} rounded-full object-cover border ${info.borderClass} shrink-0 shadow-xs`}
    />
  );
};

export const EeveeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <CharacterMiniIcon character="eevee" className={className} />
);

const MISSION_LIST_POKEMON_MAP: Record<1 | 2 | 3 | 4 | 5, { src: string; alt: string; borderClass: string }> = {
  1: {
    src: '/src/assets/images/icon_togepi_1795597621311.jpg',
    alt: 'Ikon Togepi',
    borderClass: 'border-amber-300 bg-amber-50',
  },
  2: {
    src: '/src/assets/images/icon_piplup_1795597621787.jpg',
    alt: 'Ikon Piplup',
    borderClass: 'border-sky-300 bg-sky-50',
  },
  3: {
    src: '/src/assets/images/icon_torchic_1795597621908.jpg',
    alt: 'Ikon Torchic',
    borderClass: 'border-orange-300 bg-orange-50',
  },
  4: {
    src: '/src/assets/images/icon_chikorita_1795597622325.jpg',
    alt: 'Ikon Chikorita',
    borderClass: 'border-emerald-300 bg-emerald-50',
  },
  5: {
    src: '/src/assets/images/icon_jigglypuff_1795597626346.jpg',
    alt: 'Ikon Jigglypuff',
    borderClass: 'border-pink-300 bg-pink-50',
  },
};

export const MissionListPokemonIcon: React.FC<{
  phaseNumber: 1 | 2 | 3 | 4 | 5;
  className?: string;
}> = ({ phaseNumber, className = 'w-8 h-8' }) => {
  const [failed, setFailed] = useState(false);
  const info = MISSION_LIST_POKEMON_MAP[phaseNumber];

  if (failed) {
    return (
      <span
        className={`${className} inline-flex items-center justify-center rounded-full border ${info.borderClass} text-xs font-extrabold text-slate-900 shrink-0`}
        aria-label={info.alt}
      >
        M{phaseNumber}
      </span>
    );
  }

  return (
    <img
      src={info.src}
      alt={info.alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${className} rounded-full object-cover border ${info.borderClass} shrink-0 shadow-xs`}
    />
  );
};

export const PokeBallIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
        <path d="M3.5 32C3.5 16.26 16.26 3.5 32 3.5C47.74 3.5 60.5 16.26 60.5 32H3.5Z" fill="#DC2626" />
        <line x1="3" y1="32" x2="61" y2="32" stroke="#0F172A" strokeWidth="4.5" />
        <circle cx="32" cy="32" r="9.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4.5" />
      </svg>
    );
  }

  return (
    <img
      src={POKEBALL_ICON_URL}
      alt="Poké Ball"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${className} rounded-full object-cover border border-slate-900/15 bg-white`}
    />
  );
};

export const OpenPokeBallCelebration: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    {/* Radiant burst */}
    <circle cx="60" cy="54" r="40" fill="#FEF08A" fillOpacity="0.45" />
    <circle cx="60" cy="54" r="26" fill="#FDE047" fillOpacity="0.6" />
    {/* Sparkle stars */}
    <path d="M22 24L25 31L32 34L25 37L22 44L19 37L12 34L19 31L22 24Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M96 20L98.5 26L104.5 28.5L98.5 31L96 37L93.5 31L87.5 28.5L93.5 26L96 20Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
    <path d="M60 8L62.5 15L69.5 17.5L62.5 20L60 27L57.5 20L50.5 17.5L57.5 15L60 8Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    {/* Top lid tilted open */}
    <g transform="rotate(-24 30 56)">
      <path d="M24 54C24 34.1 40.1 18 60 18C79.9 18 96 34.1 96 54H24Z" fill="#DC2626" stroke="#0F172A" strokeWidth="4" />
      <path d="M24 54H96" stroke="#0F172A" strokeWidth="4" />
    </g>
    {/* Bottom bowl */}
    <path d="M24 64C24 83.9 40.1 100 60 100C79.9 100 96 83.9 96 64H24Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <path d="M24 64H96" stroke="#0F172A" strokeWidth="4" />
    <circle cx="60" cy="64" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <circle cx="60" cy="64" r="4.5" fill="#FACC15" />
  </svg>
);

export const GreatBallIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <path d="M4 32C4 16.5 16.5 4 32 4C47.5 4 60 16.5 60 32H4Z" fill="#0284C7" />
    <path d="M12 16L22 24" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M52 16L42 24" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" />
    <line x1="4" y1="32" x2="60" y2="32" stroke="#0F172A" strokeWidth="4.5" />
    <circle cx="32" cy="32" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <circle cx="32" cy="32" r="3.5" fill="#38BDF8" />
  </svg>
);

export const UltraBallIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <path d="M4 32C4 16.5 16.5 4 32 4C47.5 4 60 16.5 60 32H4Z" fill="#1E293B" />
    <path d="M14 14V26M50 14V26M14 14H24M40 14H50" stroke="#FACC15" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="4" y1="32" x2="60" y2="32" stroke="#0F172A" strokeWidth="4.5" />
    <circle cx="32" cy="32" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <circle cx="32" cy="32" r="3.5" fill="#FACC15" />
  </svg>
);

export const HealBallIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <path d="M4 32C4 16.5 16.5 4 32 4C47.5 4 60 16.5 60 32H4Z" fill="#F472B6" />
    <path d="M23 11H41" stroke="#BAE6FD" strokeWidth="5" strokeLinecap="round" />
    <line x1="4" y1="32" x2="60" y2="32" stroke="#0F172A" strokeWidth="4.5" />
    <circle cx="32" cy="32" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <circle cx="32" cy="32" r="3.5" fill="#FDE047" />
  </svg>
);

export const MasterBallIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <path d="M4 32C4 16.5 16.5 4 32 4C47.5 4 60 16.5 60 32H4Z" fill="#7E22CE" />
    <circle cx="15" cy="18" r="5" fill="#F472B6" />
    <circle cx="49" cy="18" r="5" fill="#F472B6" />
    <path d="M25 22L28 13L32 19L36 13L39 22" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" y1="32" x2="60" y2="32" stroke="#0F172A" strokeWidth="4.5" />
    <circle cx="32" cy="32" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
    <circle cx="32" cy="32" r="3.5" fill="#C084FC" />
  </svg>
);

export type MapPokeballVariant = 'poke' | 'great' | 'heal' | 'ultra' | 'master';

export const MapPokeballGraphic: React.FC<{ variant: MapPokeballVariant; className?: string }> = ({
  variant,
  className = 'w-6 h-6',
}) => {
  if (variant === 'great') return <GreatBallIcon className={className} />;
  if (variant === 'heal') return <HealBallIcon className={className} />;
  if (variant === 'ultra') return <UltraBallIcon className={className} />;
  if (variant === 'master') return <MasterBallIcon className={className} />;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
      <path d="M4 32C4 16.5 16.5 4 32 4C47.5 4 60 16.5 60 32H4Z" fill="#DC2626" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="#0F172A" strokeWidth="4.5" />
      <circle cx="32" cy="32" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
      <circle cx="32" cy="32" r="3.5" fill="#FACC15" />
    </svg>
  );
};

export const PokedexIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <rect x="11" y="6" width="42" height="52" rx="8" fill="#DC2626" stroke="#0F172A" strokeWidth="3.5" />
    <circle cx="24" cy="18" r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2.5" />
    <circle cx="36" cy="15" r="2.5" fill="#FACC15" />
    <circle cx="43" cy="15" r="2.5" fill="#4ADE80" />
    <rect x="18" y="29" width="28" height="19" rx="4" fill="#BAE6FD" stroke="#0F172A" strokeWidth="2.5" />
    <path d="M23 39H35M23 43H31" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const TownMapIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path d="M8 15L24 9L40 15L56 9V49L40 55L24 49L8 55V15Z" fill="#FEF08A" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M24 9V49M40 15V55" stroke="#CA8A04" strokeWidth="2.5" />
    <path d="M15 39C21 30 29 36 35 28C40 21 46 27 49 23" stroke="#DC2626" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
    <circle cx="49" cy="23" r="4" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
  </svg>
);

export const GymBadgeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path
      d="M32 6L40 18L54 16L48 30L56 42L42 46L36 58L28 48L14 52L18 38L8 28L20 22L22 8L32 6Z"
      fill="#FACC15"
      stroke="#0F172A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="32" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
    <path d="M21 32C21 25.9 25.9 21 32 21C38.1 21 43 25.9 43 32H21Z" fill="#DC2626" />
    <line x1="21" y1="32" x2="43" y2="32" stroke="#0F172A" strokeWidth="2.8" />
    <circle cx="32" cy="32" r="3.5" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
  </svg>
);

export const PotionIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path d="M24 10H40L37 18H27L24 10Z" fill="#0284C7" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
    <rect x="27" y="18" width="10" height="6" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />
    <path d="M16 32C16 26.5 20.5 23 26 23H38C43.5 23 48 26.5 48 32V48C48 52.4 44.4 56 40 56H24C19.6 56 16 52.4 16 48V32Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="3.5" />
    <rect x="22" y="34" width="20" height="14" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
    <path d="M32 37V45M28 41H36" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const OranBerryIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path d="M32 16C34 10 42 7 47 11C43 16 37 18 32 16Z" fill="#22C55E" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
    <path d="M32 16C28 10 21 9 17 13C21 17 27 18 32 16Z" fill="#4ADE80" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="32" cy="36" r="19" fill="#0EA5E9" stroke="#0F172A" strokeWidth="3.5" />
    <path d="M24 27C26 24 30 23 33 24" stroke="#BAE6FD" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const LightningEnergyIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="26" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3.5" />
    <path
      d="M35 12L19 35H31L28 52L45 29H33L35 12Z"
      fill="#FACC15"
      stroke="#0F172A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrainerCapIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path d="M12 36C12 22.7 21 13 32 13C43 13 52 22.7 52 36H12Z" fill="#DC2626" stroke="#0F172A" strokeWidth="3.5" />
    <path d="M22 36C22 28 26.5 22 32 22C37.5 22 42 28 42 36H22Z" fill="#FFFFFF" />
    <path d="M27 32C27 29.2 29.2 27 32 27C34.8 27 37 29.2 37 32" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
    <path d="M8 36H56C56 41.5 46 45 32 45C18 45 8 41.5 8 36Z" fill="#B91C1C" stroke="#0F172A" strokeWidth="3.5" />
  </svg>
);

export const CharacterAvatar: React.FC<{
  character: PokemonCharacterId;
  size?: 'sm' | 'md' | 'lg';
}> = ({ character, size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  const dims = size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-16 h-16' : 'w-14 h-14';
  const info = CHARACTER_IMAGE_MAP[character];

  return (
    <div
      className={`${dims} rounded-2xl border ${info.borderClass} flex items-center justify-center shrink-0 overflow-hidden shadow-xs`}
    >
      {failed ? (
        <span className="font-display text-sm font-extrabold text-slate-800 uppercase">
          {character.slice(0, 2)}
        </span>
      ) : (
        <img
          src={info.src}
          alt={info.alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export const CHARACTER_META: Record<PokemonCharacterId, { name: string; role: string; surfaceClass: string }> = {
  pikachu: {
    name: 'Pikachu',
    role: 'Pemandu Utama',
    surfaceClass: 'bg-yellow-50 border-yellow-200',
  },
  squirtle: {
    name: 'Squirtle',
    role: 'Teman Kebersihan',
    surfaceClass: 'bg-sky-50 border-sky-200',
  },
  bulbasaur: {
    name: 'Bulbasaur',
    role: 'Pembantu Pemerhatian',
    surfaceClass: 'bg-emerald-50 border-emerald-200',
  },
  charmander: {
    name: 'Charmander',
    role: 'Pemberi Galakan',
    surfaceClass: 'bg-orange-50 border-orange-200',
  },
  eevee: {
    name: 'Eevee',
    role: 'Penjaga Menara Juara',
    surfaceClass: 'bg-amber-50 border-amber-200',
  },
};

export const TrainerBadgeGraphic: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => (
  <svg viewBox="0 0 180 180" fill="none" className={className} aria-hidden="true">
    {/* Outer Starburst Ring */}
    <circle cx="90" cy="90" r="80" fill="#FEF9C3" stroke="#EAB308" strokeWidth="5" />
    <circle cx="90" cy="90" r="68" fill="#FFFFFF" stroke="#0284C7" strokeWidth="4" strokeDasharray="8 6" />
    {/* Inner Shield / Medallion */}
    <circle cx="90" cy="86" r="46" fill="#0284C7" stroke="#0F172A" strokeWidth="4" />
    {/* Poké Ball crest inside medallion */}
    <circle cx="90" cy="82" r="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
    <path d="M66 82C66 68.7 76.7 58 90 58C103.3 58 114 68.7 114 82H66Z" fill="#DC2626" />
    <line x1="66" y1="82" x2="114" y2="82" stroke="#0F172A" strokeWidth="3.5" />
    <circle cx="90" cy="82" r="7" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
    {/* 3 Achievement Stars */}
    <path d="M48 44L51 51L58 54L51 57L48 64L45 57L38 54L45 51L48 44Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M132 44L135 51L142 54L135 57L132 64L129 57L122 54L129 51L132 44Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M90 22L93.5 30L101.5 33.5L93.5 37L90 45L86.5 37L78.5 33.5L86.5 30L90 22Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    {/* Ribbon Banner */}
    <rect x="22" y="130" width="136" height="32" rx="10" fill="#DC2626" stroke="#0F172A" strokeWidth="3.5" />
    <text
      x="90"
      y="150"
      textAnchor="middle"
      fill="#FFFFFF"
      fontSize="12"
      fontWeight="800"
      fontFamily="Bricolage Grotesque, sans-serif"
      letterSpacing="0.8"
    >
      LEVEL 1 · HYGIENE
    </text>
  </svg>
);

export const ResilientImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}> = ({ src, alt, className = 'w-full h-full object-cover', fallbackTitle }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-sky-50 via-emerald-50 to-yellow-50 flex flex-col items-center justify-center p-6 text-center border border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-3">
          <ImageOff className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-700">{fallbackTitle || alt}</p>
        <p className="text-xs text-slate-500 mt-1">Ilustrasi Misi Kebersihan Pokémon</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
