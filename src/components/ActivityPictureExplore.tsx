import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { PICTURE_CARDS } from '../data/phase1Data';
import { PictureCardItem } from '../types/learning';
import { playClickPop, playSuccessChime, speakMalay, stopSpeaking } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import { CharacterAvatar, ResilientImage } from './PokemonIcons';

interface ActivityPictureExploreProps {
  exploredPictureIds: string[];
  missionCompleted: boolean;
  onExplorePicture: (pictureId: string) => void;
  onCompleteMission: () => void;
  onNextMission: () => void;
}

export const ActivityPictureExplore: React.FC<ActivityPictureExploreProps> = ({
  exploredPictureIds,
  missionCompleted,
  onExplorePicture,
  onCompleteMission,
  onNextMission,
}) => {
  const [selectedCard, setSelectedCard] = useState<PictureCardItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const exploredCount = exploredPictureIds.length;
  const totalPictures = PICTURE_CARDS.length;
  const allExplored = exploredCount >= totalPictures;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCard) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard]);

  useEffect(() => {
    if (allExplored && !missionCompleted) {
      onCompleteMission();
      playSuccessChime();
    }
  }, [allExplored, missionCompleted, onCompleteMission]);

  const handleOpenCard = (card: PictureCardItem) => {
    playClickPop();
    setSelectedCard(card);
    onExplorePicture(card.id);
    setIsSpeaking(false);
    stopSpeaking();
  };

  const handleCloseModal = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setSelectedCard(null);
  };

  const handlePlayDescription = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    speakMalay(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleCycleCard = (direction: -1 | 1) => {
    if (!selectedCard) return;
    stopSpeaking();
    setIsSpeaking(false);
    const currentIndex = PICTURE_CARDS.findIndex((c) => c.id === selectedCard.id);
    const nextIndex = (currentIndex + direction + totalPictures) % totalPictures;
    const nextCard = PICTURE_CARDS[nextIndex];
    setSelectedCard(nextCard);
    onExplorePicture(nextCard.id);
    playClickPop();
  };

  return (
    <div className="space-y-6">
      {/* Header & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-sky-700 mb-1">Bahagian A · Teroka Gambar</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            AYUH PERHATIKAN GAMBAR!
          </h2>
        </div>
        <div className="text-sm font-semibold text-slate-700 tabular-nums">
          Gambar diteroka: <span className="text-sky-700 font-bold">{exploredCount} / {totalPictures}</span>
        </div>
      </div>

      <CharacterDialogue
        character="pikachu"
        message="Pelatih, cuba perhatikan gambar-gambar ini. Apakah yang sedang dilakukan oleh kanak-kanak?"
      />

      {/* 4 Interactive Picture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {PICTURE_CARDS.map((card) => {
          const isExplored = exploredPictureIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleOpenCard(card)}
              className={`group text-left rounded-2xl border bg-white overflow-hidden transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                isExplored
                  ? 'border-emerald-300 shadow-sm hover:border-emerald-400'
                  : 'border-slate-200 hover:border-sky-400 hover:shadow-md'
              }`}
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <ResilientImage
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fallbackTitle={card.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/95 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Klik untuk besarkan &amp; dengar penerangan
                  </p>
                </div>

                {isExplored ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sudah Lihat</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-sky-700 shrink-0">
                    Buka
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Squirtle Companion Note */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 flex items-center gap-3.5">
        <CharacterAvatar character="squirtle" size="sm" />
        <p className="text-sm text-slate-800">
          <span className="font-bold text-sky-800">Squirtle:</span> Klik keempat-empat kad gambar di atas untuk melihat aktiviti kebersihan diri dengan lebih dekat!
        </p>
      </div>

      {/* Pikachu Feedback upon completing all 4 pictures */}
      {(missionCompleted || allExplored) && (
        <div className="space-y-4 pt-2">
          <CharacterDialogue
            character="pikachu"
            message="Wah, bagus Pelatih! Kamu sangat teliti memerhatikan gambar!"
            actionSlot={
              <button
                type="button"
                onClick={onNextMission}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>Ke Bahagian B: Uji Pemerhatian</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            }
          />
        </div>
      )}

      {/* Enlarged Picture Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-picture-title"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3 min-w-0">
                <CharacterAvatar character={selectedCard.companion} size="sm" />
                <div className="min-w-0">
                  <h3 id="modal-picture-title" className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {selectedCard.title}
                  </h3>
                  <p className="text-xs text-slate-500">Teroka Gambar · Amalan Kebersihan Diri</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer min-h-[40px] shrink-0"
              >
                <X className="w-4 h-4" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Enlarged Image */}
            <div className="relative aspect-[4/3] bg-slate-100 max-h-[52vh] w-full overflow-hidden">
              <ResilientImage
                src={selectedCard.imageUrl}
                alt={selectedCard.imageAlt}
                fallbackTitle={selectedCard.title}
                className="w-full h-full object-contain bg-slate-50"
              />
            </div>

            {/* Description & Audio Control */}
            <div className="p-5 sm:p-6 space-y-4 bg-white">
              <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 space-y-1.5">
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {selectedCard.description}
                </p>
                <p className="text-xs sm:text-sm text-slate-700">
                  Tip Sihat: {selectedCard.hygieneTip}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handlePlayDescription(selectedCard.description)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0 ${
                    isSpeaking
                      ? 'bg-slate-900 text-white'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Henti Audio' : 'Dengar Penerangan'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCycleCard(-1)}
                    className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer min-h-[44px]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelum</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCycleCard(1)}
                    className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer min-h-[44px]"
                  >
                    <span>Seterusnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
