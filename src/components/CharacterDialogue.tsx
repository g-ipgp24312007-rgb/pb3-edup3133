import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { PokemonCharacterId } from '../types/learning';
import { CHARACTER_META, CharacterAvatar } from './PokemonIcons';
import { speakMalay, stopSpeaking } from '../utils/audio';

interface CharacterDialogueProps {
  character: PokemonCharacterId;
  message: string;
  enableAudio?: boolean;
  actionSlot?: React.ReactNode;
}

export const CharacterDialogue: React.FC<CharacterDialogueProps> = ({
  character,
  message,
  enableAudio = true,
  actionSlot,
}) => {
  const meta = CHARACTER_META[character];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [message]);

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    speakMalay(message, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${meta.surfaceClass} transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <CharacterAvatar character={character} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
              <span className="font-bold text-slate-900">{meta.name}</span>
              <span aria-hidden="true">·</span>
              <span>{meta.role}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
              &ldquo;{message}&rdquo;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {enableAudio && (
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                isSpeaking
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
              aria-label={isSpeaking ? 'Hentikan suara' : 'Dengar dialog'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
              <span>{isSpeaking ? 'Berhenti' : 'Dengar'}</span>
            </button>
          )}
          {actionSlot}
        </div>
      </div>
    </div>
  );
};
