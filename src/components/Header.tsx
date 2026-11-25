import React, { useEffect, useState } from 'react';
import { Menu, Music, RotateCcw, VolumeX, X } from 'lucide-react';
import { AppSection } from '../types/learning';
import { playClickPop, subscribeThemeMusic, togglePokemonTheme } from '../utils/audio';
import { PokeBallIcon, TownMapIcon } from './PokemonIcons';

interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  completedPhasesCount: number;
  onResetProgress: () => void;
}

const NAV_ITEMS: { id: AppSection; label: string; matchSections?: AppSection[] }[] = [
  { id: 'home', label: 'Utama' },
  { id: 'map', label: 'Peta Misi' },
  { id: 'assessment', label: 'Pentaksiran' },
  { id: 'phase5', label: 'Sijil' },
  { id: 'teacher-guide', label: 'Panduan Guru' },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  completedPhasesCount,
  onResetProgress,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    return subscribeThemeMusic(setMusicPlaying);
  }, []);

  const handleSelect = (section: AppSection) => {
    setConfirmReset(false);
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  const handleToggleMusic = () => {
    togglePokemonTheme();
  };

  const handleConfirmReset = () => {
    setConfirmReset(false);
    setMobileMenuOpen(false);
    playClickPop();
    onResetProgress();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 md:gap-6">
        {/* Zone 1: Brand Title (Single-line) */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
        >
          <PokeBallIcon className="w-7 h-7 shrink-0" />
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Misi Kebersihan Pokémon
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5" aria-label="Menu utama">
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeSection === item.id ||
              Boolean(item.matchSections?.includes(activeSection));
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 ${
                  isActive
                    ? 'border-red-600 text-slate-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Music, Overall Progress & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleMusic}
            aria-pressed={musicPlaying}
            title={musicPlaying ? 'Hentikan Lagu Tema Pokémon' : 'Mainkan Lagu Tema Pokémon'}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              musicPlaying
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {musicPlaying ? (
              <Music className="w-4 h-4 text-amber-700 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span className="hidden lg:inline">{musicPlaying ? 'Lagu Tema: Hidup' : 'Lagu Tema'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('map')}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 tabular-nums ${
              completedPhasesCount === 5
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            <span><TownMapIcon className="w-4 h-4 inline-block mr-1 -mt-0.5" />{completedPhasesCount}/5 Misi</span>
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setConfirmReset(true);
              }}
              title="Reset semula semua kemajuan OPD"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset Semula</span>
            </button>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-2.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold whitespace-nowrap cursor-pointer"
              >
                Sahkan?
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeSection === item.id ||
              Boolean(item.matchSections?.includes(activeSection));
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleToggleMusic}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                musicPlaying
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {musicPlaying ? (
                <Music className="w-4 h-4 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 shrink-0" />
              )}
              <span>{musicPlaying ? 'Lagu Tema Pokémon: Hidup' : 'Mainkan Lagu Tema Pokémon'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('map')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 text-white text-center tabular-nums cursor-pointer"
            >
              <TownMapIcon className="w-4 h-4 shrink-0" />
              <span>Peta Kemajuan: {completedPhasesCount}/5 Misi Selesai</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setConfirmReset(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-red-200 bg-red-50 text-red-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Reset Semula OPD</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold cursor-pointer"
                >
                  Sahkan Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
