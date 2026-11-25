import {
  FormativeMethodItem,
  PhaseDefinition,
  PictureCardItem,
  QuizQuestionItem,
  TargetWordItem,
  VideoStoryboardStep,
} from '../types/learning';

export const PHASE_METADATA: PhaseDefinition = {
  phaseNumber: 1,
  missionTitle: 'Misi 1: Set Induksi',
  title: 'Misi 1: Set Induksi',
  subtitle: 'Teroka gambar amalan kebersihan dan uji pemerhatian awal.',
  enabled: true,
};

export const CURRICULUM_INFO = {
  opdName: 'MISI KEBERSIHAN POKÉMON',
  lessonTitle: 'JOM BERSIHKAN DIRI!',
  subject: 'Bahasa Melayu',
  year: 'Tahun 2',
  theme: 'Kesihatan dan Kebersihan',
  contentStandard: '2.1 Asas membaca dan memahami.',
  learningStandard: '2.1.2 Membaca dan memahami (i) perkataan.',
  learningObjective:
    'Pada akhir pembelajaran, murid dapat membaca dan memahami sekurang-kurangnya 3 daripada 5 perkataan berkaitan video "Jom Bersihkan Diri" dengan betul dan tepat.',
};

export const HERO_MEDIA = {
  heroImage: '/src/assets/images/hero_pokemon_adventure_eevee_1795596764926.jpg',
  heroAlt:
    'Pikachu, Squirtle, Bulbasaur, Charmander dan Eevee bersama-sama di padang rumput yang ceria dengan buih sabun berkilauan.',
  videoPosterImage: '/src/assets/images/video_poster_hygiene_1795567880166.jpg',
  videoPosterAlt:
    'Pikachu, Squirtle, Bulbasaur dan Charmander bersama peralatan kebersihan seperti sabun, berus gigi, tuala, syampu dan sikat.',
};

export const HOME_OBJECTIVES = [
  {
    number: 1,
    title: 'Perhatikan gambar.',
    detail: 'Lihat empat situasi amalan kebersihan diri bersama Squirtle dalam Bahagian A.',
    mission: 'A' as const,
  },
  {
    number: 2,
    title: 'Jawab soalan.',
    detail: 'Uji pemerhatian kamu melalui tiga soalan mudah bersama Bulbasaur dalam Bahagian B.',
    mission: 'C' as const,
  },
];

export const PICTURE_CARDS: PictureCardItem[] = [
  {
    id: 'pic-1',
    title: 'Gambar 1: Menggosok Gigi',
    shortLabel: 'Menggosok Gigi',
    imageUrl: '/src/assets/images/hygiene_brush_teeth_boy_mirror_1795568612899.jpg',
    imageAlt: 'Kanak-kanak lelaki sedang menggosok gigi di hadapan cermin bilik mandi.',
    description: 'Adik sedang menggosok gigi supaya gigi sentiasa bersih.',
    hygieneTip: 'Gosok gigi sekurang-kurangnya dua kali sehari: pagi dan sebelum tidur.',
    companion: 'pikachu',
  },
  {
    id: 'pic-2',
    title: 'Gambar 2: Mencuci Tangan',
    shortLabel: 'Mencuci Tangan',
    imageUrl: '/src/assets/images/hygiene_wash_hands_boy_1795568375722.jpg',
    imageAlt: 'Kanak-kanak lelaki sedang mencuci tangan menggunakan sabun dan air bersih.',
    description: 'Adik mencuci tangan menggunakan sabun untuk menghilangkan kotoran.',
    hygieneTip: 'Cuci tangan sebelum makan dan selepas menggunakan tandas.',
    companion: 'squirtle',
  },
  {
    id: 'pic-3',
    title: 'Gambar 3: Mandi',
    shortLabel: 'Mandi',
    imageUrl: '/src/assets/images/hygiene_taking_bath_1795567879642.jpg',
    imageAlt: 'Kanak-kanak sedang mandi dengan air bersih dan buih sabun.',
    description: 'Adik mandi supaya badan sentiasa bersih dan segar.',
    hygieneTip: 'Mandi setiap pagi dan petang menggunakan sabun dan air bersih.',
    companion: 'squirtle',
  },
  {
    id: 'pic-4',
    title: 'Gambar 4: Menyikat Rambut',
    shortLabel: 'Menyikat Rambut',
    imageUrl: '/src/assets/images/hygiene_comb_hair_fixed_1795568641390.jpg',
    imageAlt: 'Kanak-kanak sedang menyikat rambut dengan kemas di hadapan cermin dengan pantulan yang tepat.',
    description: 'Adik menyikat rambut supaya rambut kelihatan kemas.',
    hygieneTip: 'Sikat rambut selepas mandi supaya kemas dan tidak kusut.',
    companion: 'bulbasaur',
  },
];

export const VIDEO_STORYBOARD: VideoStoryboardStep[] = [
  { step: 1, text: 'Kanak-kanak bangun pada waktu pagi.' },
  { step: 2, text: 'Kanak-kanak menggosok gigi.' },
  { step: 3, text: 'Kanak-kanak mandi menggunakan sabun.' },
  { step: 4, text: 'Kanak-kanak mencuci rambut menggunakan syampu.' },
  { step: 5, text: 'Kanak-kanak mengeringkan badan menggunakan tuala.' },
  { step: 6, text: 'Kanak-kanak menyikat rambut.' },
];

export const TARGET_WORDS: TargetWordItem[] = [
  {
    id: 'word-sabun',
    word: 'SABUN',
    syllables: 'sa · bun',
    meaning: 'Bahan pencuci untuk membersihkan tangan dan badan daripada kotoran.',
    usageExample: 'Adik mencuci tangan menggunakan sabun.',
    accentColor: 'blue',
  },
  {
    id: 'word-berus-gigi',
    word: 'BERUS GIGI',
    syllables: 'be · rus gi · gi',
    meaning: 'Alat berbulu lembut untuk membersihkan gigi supaya kuat dan sihat.',
    usageExample: 'Adik menggunakan berus gigi pada waktu pagi.',
    accentColor: 'yellow',
  },
  {
    id: 'word-tuala',
    word: 'TUALA',
    syllables: 'tu · a · la',
    meaning: 'Kain lembut untuk mengeringkan badan selepas mandi.',
    usageExample: 'Adik mengelap badan menggunakan tuala bersih.',
    accentColor: 'green',
  },
  {
    id: 'word-syampu',
    word: 'SYAMPU',
    syllables: 'syam · pu',
    meaning: 'Cecair wangi untuk mencuci rambut supaya bersih dan segar.',
    usageExample: 'Adik mencuci rambut menggunakan syampu.',
    accentColor: 'red',
  },
  {
    id: 'word-sikat',
    word: 'SIKAT',
    syllables: 'si · kat',
    meaning: 'Alat bergigi halus untuk merapikan rambut supaya kemas.',
    usageExample: 'Adik menyikat rambut menggunakan sikat.',
    accentColor: 'blue',
  },
];

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 'q1',
    number: 1,
    question: 'Apakah aktiviti yang dilakukan oleh kanak-kanak dalam gambar?',
    options: [
      { key: 'A', text: 'Menjaga kebersihan diri.' },
      { key: 'B', text: 'Bermain di taman.' },
      { key: 'C', text: 'Menonton televisyen.' },
    ],
    correctAnswer: 'A',
    explanation: 'Kanak-kanak melakukan amalan menjaga kebersihan diri seperti mandi, menggosok gigi dan menyikat rambut.',
  },
  {
    id: 'q2',
    number: 2,
    question: 'Apakah objek yang kamu lihat dalam gambar?',
    options: [
      { key: 'A', text: 'Bola dan kasut.' },
      { key: 'B', text: 'Sabun dan berus gigi.' },
      { key: 'C', text: 'Buku dan pensel.' },
    ],
    correctAnswer: 'B',
    explanation: 'Sabun dan berus gigi ialah objek kebersihan diri yang ditunjukkan dalam gambar.',
  },
  {
    id: 'q3',
    number: 3,
    question: 'Mengapakah kita perlu menjaga kebersihan diri?',
    options: [
      { key: 'A', text: 'Supaya badan sentiasa bersih.' },
      { key: 'B', text: 'Supaya pakaian menjadi kotor.' },
      { key: 'C', text: 'Supaya badan berbau.' },
    ],
    correctAnswer: 'A',
    explanation: 'Menjaga kebersihan diri menjadikan badan kita sentiasa bersih, sihat dan segar.',
  },
];

export const FORMATIVE_METHODS: FormativeMethodItem[] = [
  {
    id: 'fm-1',
    title: '1. SOAL JAWAB',
    description: 'Guru bertanya tentang gambar amalan kebersihan diri.',
    character: 'pikachu',
    teacherAction: 'Contoh soalan: "Apakah yang adik gunakan untuk mencuci tangan?"',
  },
  {
    id: 'fm-2',
    title: '2. ANGKAT KAD JAWAPAN',
    description: 'Murid mengangkat kad jawapan yang sesuai.',
    character: 'squirtle',
    teacherAction: 'Minta murid mengangkat kad huruf A, B atau C secara serentak.',
  },
  {
    id: 'fm-3',
    title: '3. RESPONS LISAN',
    description: 'Murid menyebut aktiviti dan objek yang diperhatikan.',
    character: 'bulbasaur',
    teacherAction: 'Bimbing murid menyebut perkataan sasaran: sabun, berus gigi, tuala, syampu, sikat.',
  },
  {
    id: 'fm-4',
    title: '4. PEMERHATIAN AWAL',
    description: 'Guru memerhatikan penglibatan dan pengetahuan sedia ada murid.',
    character: 'charmander',
    teacherAction: 'Catat murid yang memerlukan bimbingan awal membaca perkataan.',
  },
];

export const TEACHER_GUIDE_TIPS = [
  'Mulakan sesi dengan memaparkan halaman utama "Selamat Datang Pelatih!" dan minta murid meneka watak Pokémon kegemaran mereka.',
  'Dalam Bahagian A (Teroka Gambar), klik setiap kad gambar secara bergilir dan minta murid menyebut ayat penerangan secara beramai-ramai.',
  'Bimbing murid mengenal pasti lima perkataan sasaran (SABUN, BERUS GIGI, TUALA, SYAMPU, SIKAT) apabila meneroka Misi 2.',
  'Dalam Bahagian B (Uji Pemerhatian) dan Pentaksiran Formatif Awal, galakkan murid mengangkat kad jawapan A, B atau C sebelum guru menekan butang Hantar Jawapan.',
];
