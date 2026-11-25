import {
  HygieneObjectItem,
  HygieneWordKey,
  Phase3AssessmentQuestion,
  PhaseDefinition,
  RoutineStepItem,
  SentenceChallengeItem,
  SituationChoiceItem,
  VideoCheckpointQuestion,
} from '../types/learning';

export const ALL_PHASES_META: PhaseDefinition[] = [
  {
    phaseNumber: 1,
    missionTitle: 'Misi 1: Kenali dan Perhati',
    title: 'Fasa 1: Set Induksi dan Pengenalan',
    subtitle: 'Teroka empat gambar amalan kebersihan dan uji pemerhatian awal.',
    enabled: true,
  },
  {
    phaseNumber: 2,
    missionTitle: 'Misi 2: Kenali Perkataan',
    title: 'Fasa 2: Pengenalan & Penerokaan Perkataan',
    subtitle: 'Kenali lima perkataan sasaran, video interaktif dan rakan belajar Pikachu.',
    enabled: true,
  },
  {
    phaseNumber: 3,
    missionTitle: 'Misi 3: Cabaran Pokémon',
    title: 'Fasa 3: Permainan & E-Pentaksiran',
    subtitle: 'Padankan gambar, tangkap perkataan dan ujian 10 soalan.',
    enabled: true,
  },
  {
    phaseNumber: 4,
    missionTitle: 'Misi 4: Aplikasi Kebersihan Diri',
    title: 'Fasa 4: Situasi, Bina Ayat & Latihan Terbeza',
    subtitle: 'Bantu rakan Pokémon, bina ayat mudah dan pilih laluan latihan.',
    enabled: true,
  },
  {
    phaseNumber: 5,
    missionTitle: 'Misi 5: Tamatkan Pengembaraan',
    title: 'Fasa 5: Cabaran Akhir, Refleksi & Sijil',
    subtitle: 'Pentaksiran akhir, refleksi murid, rumusan dan sijil pencapaian.',
    enabled: true,
  },
];

export const HYGIENE_OBJECTS: HygieneObjectItem[] = [
  {
    key: 'sabun',
    word: 'SABUN',
    syllables: 'sa · bun',
    imageUrl: '/src/assets/images/obj_sabun_1795571888446.jpg',
    imageAlt: 'Sabun buku berwarna pastel bersama buih bersih.',
    usageDescription: 'Digunakan untuk mencuci tangan dan badan.',
    exampleSentence: 'Saya mencuci tangan menggunakan sabun.',
    companion: 'pikachu',
    companionGreeting: 'Pika! Saya Pikachu. Sabun menghilangkan kuman dan kotoran pada tangan dan badan.',
  },
  {
    key: 'berus-gigi',
    word: 'BERUS GIGI',
    syllables: 'be · rus gi · gi',
    imageUrl: '/src/assets/images/obj_berus_gigi_v2_1795573738785.jpg',
    imageAlt: 'Berus gigi biru dan kuning bersama ubat gigi segar.',
    usageDescription: 'Digunakan untuk membersihkan gigi.',
    exampleSentence: 'Saya membersihkan gigi dengan berus gigi.',
    companion: 'squirtle',
    companionGreeting: 'Squirtle! Gunakan berus gigi setiap pagi dan malam supaya gigi sentiasa bersih.',
  },
  {
    key: 'tuala',
    word: 'TUALA',
    syllables: 'tu · a · la',
    imageUrl: '/src/assets/images/obj_tuala_1795571889490.jpg',
    imageAlt: 'Tuala mandi berjalur biru dan kuning yang lembut dan kemas.',
    usageDescription: 'Digunakan untuk mengeringkan badan.',
    exampleSentence: 'Saya mengeringkan badan menggunakan tuala.',
    companion: 'bulbasaur',
    companionGreeting: 'Bulba! Selepas mandi, lap badan dan rambut dengan tuala yang bersih.',
  },
  {
    key: 'syampu',
    word: 'SYAMPU',
    syllables: 'syam · pu',
    imageUrl: '/src/assets/images/obj_syampu_v2_1795573739076.jpg',
    imageAlt: 'Botol syampu berwarna ceria bersama buih wangi.',
    usageDescription: 'Digunakan untuk mencuci rambut.',
    exampleSentence: 'Saya mencuci rambut menggunakan syampu.',
    companion: 'charmander',
    companionGreeting: 'Char! Syampu membersihkan rambut dan kulit kepala supaya berbau wangi.',
  },
  {
    key: 'sikat',
    word: 'SIKAT',
    syllables: 'si · kat',
    imageUrl: '/src/assets/images/obj_sikat_1795571890852.jpg',
    imageAlt: 'Sikat rambut berwarna kuning cerah yang kemas.',
    usageDescription: 'Digunakan untuk merapikan rambut.',
    exampleSentence: 'Saya merapikan rambut dengan sikat.',
    companion: 'pikachu',
    companionGreeting: 'Pika Pika! Gunakan sikat supaya rambut sentiasa kemas dan tidak kusut.',
  },
];

export const HYGIENE_WORD_MAP: Record<HygieneWordKey, HygieneObjectItem> = HYGIENE_OBJECTS.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<HygieneWordKey, HygieneObjectItem>
);

export const PHASE2_VIDEO_CHECKPOINTS: VideoCheckpointQuestion[] = [
  {
    id: 'cp-1',
    number: 1,
    triggerPercent: 18,
    question: 'Dalam babak video tadi, apakah bahan berbuih yang digunakan oleh adik semasa mencuci tangan?',
    options: ['Sabun', 'Sikat', 'Tuala'],
    correctAnswer: 'Sabun',
    feedbackCorrect: 'Betul! Sabun digunakan untuk mencuci tangan supaya bersih daripada kuman.',
    feedbackWrong: 'Cuba lagi! Kita perlukan bahan yang berbuih untuk mencuci tangan.',
  },
  {
    id: 'cp-2',
    number: 2,
    triggerPercent: 36,
    question: 'Di hadapan cermin bilik mandi, Squirtle membantu adik menjaga kebersihan mulut menggunakan apa?',
    options: ['Syampu', 'Berus gigi', 'Sabun'],
    correctAnswer: 'Berus gigi',
    feedbackCorrect: 'Syabas! Berus gigi digunakan untuk membersihkan gigi setiap pagi dan malam.',
    feedbackWrong: 'Belum tepat! Pilih alat khas untuk menggosok gigi.',
  },
  {
    id: 'cp-3',
    number: 3,
    triggerPercent: 54,
    question: 'Selepas selesai mandi, Bulbasaur mengingatkan kita supaya mengelap badan yang basah dengan apa?',
    options: ['Tuala', 'Sikat', 'Syampu'],
    correctAnswer: 'Tuala',
    feedbackCorrect: 'Hebat! Tuala lembut digunakan untuk mengeringkan badan selepas mandi.',
    feedbackWrong: 'Cuba fikir semula! Kita mengelap air pada badan menggunakan kain lembut.',
  },
  {
    id: 'cp-4',
    number: 4,
    triggerPercent: 72,
    question: 'Charmander berkongsi cara menjadikan rambut berbau wangi semasa mandi. Apakah cecair yang digunakan?',
    options: ['Berus gigi', 'Syampu', 'Sabun'],
    correctAnswer: 'Syampu',
    feedbackCorrect: 'Tepat sekali! Syampu digunakan untuk mencuci rambut supaya bersih dan wangi.',
    feedbackWrong: 'Jangan putus asa! Pilih cecair wangi khas untuk mencuci rambut.',
  },
  {
    id: 'cp-5',
    number: 5,
    triggerPercent: 88,
    question: 'Sebelum keluar ke sekolah, Pikachu memastikan rambut sentiasa kemas dan tidak kusut menggunakan apa?',
    options: ['Tuala', 'Sikat', 'Berus gigi'],
    correctAnswer: 'Sikat',
    feedbackCorrect: 'Pika Pika! Sikat digunakan untuk merapikan rambut agar kemas.',
    feedbackWrong: 'Cuba lagi! Alat yang bergigi halus ini merapikan rambut kita.',
  },
];

export const PIKACHU_AI_PRESET_PROMPTS: { id: string; label: string }[] = [
  { id: 'q-sabun', label: 'Apakah itu sabun?' },
  { id: 'q-sikat', label: 'Saya tidak tahu apa itu sikat.' },
  { id: 'q-berus', label: 'Apa kegunaan berus gigi?' },
  { id: 'q-tuala', label: 'Beri contoh ayat untuk tuala.' },
  { id: 'q-syampu', label: 'Mengapa kita guna syampu?' },
  { id: 'q-petunjuk', label: 'Beri saya petunjuk membaca perkataan!' },
];

export function getPikachuSimulationReply(input: string): {
  text: string;
  wordKey?: HygieneWordKey;
} {
  const lower = input.toLowerCase().trim();

  if (lower.includes('sabun')) {
    if (lower.includes('ayat') || lower.includes('contoh')) {
      return {
        text: 'Contoh ayat mudah: "Saya mencuci tangan menggunakan sabun." Cuba baca perlahan-lahan: SA-BUN!',
        wordKey: 'sabun',
      };
    }
    return {
      text: 'Sabun digunakan untuk mencuci tangan dan badan. Cuba sebut perkataan SA-BUN!',
      wordKey: 'sabun',
    };
  }

  if (lower.includes('berus') || lower.includes('gigi')) {
    if (lower.includes('ayat') || lower.includes('contoh')) {
      return {
        text: 'Contoh ayat mudah: "Saya membersihkan gigi dengan berus gigi." Mari sebut: BE-RUS GI-GI!',
        wordKey: 'berus-gigi',
      };
    }
    return {
      text: 'Berus gigi digunakan untuk membersihkan gigi supaya kuat dan sihat. Mari sebut: BE-RUS GI-GI!',
      wordKey: 'berus-gigi',
    };
  }

  if (lower.includes('tuala')) {
    if (lower.includes('ayat') || lower.includes('contoh')) {
      return {
        text: 'Contoh ayat mudah: "Saya mengeringkan badan menggunakan tuala." Cuba sebut: TU-A-LA!',
        wordKey: 'tuala',
      };
    }
    return {
      text: 'Tuala digunakan untuk mengeringkan badan selepas mandi. Mari kita sebut: TU-A-LA!',
      wordKey: 'tuala',
    };
  }

  if (lower.includes('syampu')) {
    if (lower.includes('ayat') || lower.includes('contoh')) {
      return {
        text: 'Contoh ayat mudah: "Saya mencuci rambut menggunakan syampu." Cuba sebut: SYAM-PU!',
        wordKey: 'syampu',
      };
    }
    return {
      text: 'Syampu digunakan untuk mencuci rambut supaya bersih dan wangi. Cuba sebut: SYAM-PU!',
      wordKey: 'syampu',
    };
  }

  if (lower.includes('sikat')) {
    if (lower.includes('ayat') || lower.includes('contoh')) {
      return {
        text: 'Contoh ayat mudah: "Saya merapikan rambut dengan sikat." Mari sebut: SI-KAT!',
        wordKey: 'sikat',
      };
    }
    return {
      text: 'Tidak mengapa! Sikat digunakan untuk merapikan rambut. Mari kita sebut bersama-sama: SI-KAT!',
      wordKey: 'sikat',
    };
  }

  if (lower.includes('petunjuk') || lower.includes('bantu') || lower.includes('tak tahu') || lower.includes('tidak tahu')) {
    return {
      text: 'Petunjuk Pikachu: Sebut perkataan mengikut suku kata ya! SA-BUN, BE-RUS GI-GI, TU-A-LA, SYAM-PU dan SI-KAT. Tekan butang dengar untuk berlatih!',
    };
  }

  if (lower.includes('ayat') || lower.includes('contoh')) {
    return {
      text: 'Kita boleh bina ayat mudah seperti: "Adik mencuci tangan guna sabun" atau "Adik lap badan guna tuala". Pilih satu perkataan untuk contoh lain!',
    };
  }

  return {
    text: 'Pika! Saya hanya membantu tentang lima perkataan kebersihan diri: sabun, berus gigi, tuala, syampu dan sikat. Cuba tanya tentang salah satu perkataan itu ya!',
  };
}

export const PHASE3_CATCH_QUESTIONS: {
  id: string;
  targetWord: HygieneWordKey;
  imageUrl: string;
  imageAlt: string;
  options: string[];
  correctAnswer: string;
}[] = [
  {
    id: 'catch-1',
    targetWord: 'sabun',
    imageUrl: '/src/assets/images/obj_sabun_1795571888446.jpg',
    imageAlt: 'Gambar sabun dengan buih bersih',
    options: ['Sikat', 'Sabun', 'Tuala'],
    correctAnswer: 'Sabun',
  },
  {
    id: 'catch-2',
    targetWord: 'berus-gigi',
    imageUrl: '/src/assets/images/obj_berus_gigi_v2_1795573738785.jpg',
    imageAlt: 'Gambar berus gigi biru dan kuning',
    options: ['Berus gigi', 'Syampu', 'Sabun'],
    correctAnswer: 'Berus gigi',
  },
  {
    id: 'catch-3',
    targetWord: 'tuala',
    imageUrl: '/src/assets/images/obj_tuala_1795571889490.jpg',
    imageAlt: 'Gambar tuala mandi berjalur',
    options: ['Berus gigi', 'Sikat', 'Tuala'],
    correctAnswer: 'Tuala',
  },
  {
    id: 'catch-4',
    targetWord: 'syampu',
    imageUrl: '/src/assets/images/obj_syampu_v2_1795573739076.jpg',
    imageAlt: 'Gambar botol syampu berbuih',
    options: ['Syampu', 'Tuala', 'Sabun'],
    correctAnswer: 'Syampu',
  },
  {
    id: 'catch-5',
    targetWord: 'sikat',
    imageUrl: '/src/assets/images/obj_sikat_1795571890852.jpg',
    imageAlt: 'Gambar sikat rambut berwarna kuning',
    options: ['Sabun', 'Sikat', 'Syampu'],
    correctAnswer: 'Sikat',
  },
];

export const PHASE3_ASSESSMENT_QUESTIONS: Phase3AssessmentQuestion[] = [
  {
    id: 'p3-q1',
    number: 1,
    targetWord: 'sabun',
    type: 'word-from-image',
    question: 'Perhatikan gambar buih bersih ini. Pilih ejaan perkataan yang betul.',
    promptImageUrl: '/src/assets/images/obj_sabun_1795571888446.jpg',
    promptImageAlt: 'Gambar sabun',
    options: [
      { key: 'A', label: 'Sabun' },
      { key: 'B', label: 'Tuala' },
      { key: 'C', label: 'Sikat' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 'p3-q2',
    number: 2,
    targetWord: 'berus-gigi',
    type: 'object-usage',
    question: 'Antara alatan berikut, manakah diletakkan bersama ubat gigi di atas singki?',
    options: [
      { key: 'A', label: 'Syampu' },
      { key: 'B', label: 'Berus gigi' },
      { key: 'C', label: 'Sikat' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 'p3-q3',
    number: 3,
    targetWord: 'tuala',
    type: 'image-from-word',
    question: 'Pilih gambar kain lembut yang sepadan dengan perkataan TUALA.',
    options: [
      {
        key: 'A',
        label: 'Gambar A',
        imageUrl: '/src/assets/images/obj_syampu_v2_1795573739076.jpg',
        imageAlt: 'Botol syampu',
      },
      {
        key: 'B',
        label: 'Gambar B',
        imageUrl: '/src/assets/images/obj_sikat_1795571890852.jpg',
        imageAlt: 'Sikat rambut',
      },
      {
        key: 'C',
        label: 'Gambar C',
        imageUrl: '/src/assets/images/obj_tuala_1795571889490.jpg',
        imageAlt: 'Tuala mandi',
      },
    ],
    correctAnswer: 'C',
  },
  {
    id: 'p3-q4',
    number: 4,
    targetWord: 'syampu',
    type: 'object-usage',
    question: 'Bilakah waktu yang paling sesuai untuk menggunakan syampu?',
    options: [
      { key: 'A', label: 'Semasa mencuci rambut di bilik mandi' },
      { key: 'B', label: 'Semasa menyapu lantai bilik darjah' },
      { key: 'C', label: 'Semasa mengelap meja makan' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 'p3-q5',
    number: 5,
    targetWord: 'sikat',
    type: 'object-usage',
    question: 'Alat ini bergigi halus dan berwarna kuning. Apakah namanya?',
    options: [
      { key: 'A', label: 'Sabun' },
      { key: 'B', label: 'Sikat' },
      { key: 'C', label: 'Berus gigi' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 'p3-q6',
    number: 6,
    targetWord: 'berus-gigi',
    type: 'image-from-word',
    question: 'Pilih gambar yang sepadan dengan suku kata be · rus gi · gi.',
    options: [
      {
        key: 'A',
        label: 'Gambar A',
        imageUrl: '/src/assets/images/obj_berus_gigi_v2_1795573738785.jpg',
        imageAlt: 'Berus gigi',
      },
      {
        key: 'B',
        label: 'Gambar B',
        imageUrl: '/src/assets/images/obj_sabun_1795571888446.jpg',
        imageAlt: 'Sabun',
      },
      {
        key: 'C',
        label: 'Gambar C',
        imageUrl: '/src/assets/images/obj_tuala_1795571889490.jpg',
        imageAlt: 'Tuala',
      },
    ],
    correctAnswer: 'A',
  },
  {
    id: 'p3-q7',
    number: 7,
    targetWord: 'sabun',
    type: 'context-sentence',
    question: 'Sebelum makan nasi lemak di kantin, Faris membasuh tangan dengan ______.',
    options: [
      { key: 'A', label: 'sikat' },
      { key: 'B', label: 'sabun' },
      { key: 'C', label: 'berus gigi' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 'p3-q8',
    number: 8,
    targetWord: 'tuala',
    type: 'context-sentence',
    question: 'Siti baru keluar dari kolam renang. Dia mengeringkan badannya dengan ______.',
    options: [
      { key: 'A', label: 'syampu' },
      { key: 'B', label: 'sikat' },
      { key: 'C', label: 'tuala' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 'p3-q9',
    number: 9,
    targetWord: 'syampu',
    type: 'word-from-image',
    question: 'Namakan cecair wangi di dalam botol berwarna ceria ini.',
    promptImageUrl: '/src/assets/images/obj_syampu_v2_1795573739076.jpg',
    promptImageAlt: 'Gambar botol syampu',
    options: [
      { key: 'A', label: 'Syampu' },
      { key: 'B', label: 'Sabun' },
      { key: 'C', label: 'Tuala' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 'p3-q10',
    number: 10,
    targetWord: 'sikat',
    type: 'context-sentence',
    question: 'Amir bercermin sebelum ke sekolah sambil memegang ______ untuk merapikan rambut.',
    options: [
      { key: 'A', label: 'berus gigi' },
      { key: 'B', label: 'tuala' },
      { key: 'C', label: 'sikat' },
    ],
    correctAnswer: 'C',
  },
];

export const PHASE4_ROUTINE_STEPS: RoutineStepItem[] = [
  {
    id: 'routine-1',
    correctOrder: 1,
    wordKey: 'berus-gigi',
    title: 'Menggosok gigi menggunakan berus gigi.',
    imageUrl: '/src/assets/images/hygiene_brush_teeth_boy_mirror_1795568612899.jpg',
    imageAlt: 'Murid lelaki menggosok gigi di hadapan cermin.',
    explanation: 'Berus gigi digunakan pada awal pagi untuk membersihkan gigi.',
  },
  {
    id: 'routine-2',
    correctOrder: 2,
    wordKey: 'sabun',
    title: 'Mencuci badan menggunakan sabun.',
    imageUrl: '/src/assets/images/hygiene_taking_bath_1795567879642.jpg',
    imageAlt: 'Kanak-kanak mandi menggunakan sabun berbuih.',
    explanation: 'Sabun membersihkan kotoran dan peluh pada seluruh badan.',
  },
  {
    id: 'routine-3',
    correctOrder: 3,
    wordKey: 'syampu',
    title: 'Mencuci rambut menggunakan syampu.',
    imageUrl: '/src/assets/images/routine_shampoo_hair_1795571890456.jpg',
    imageAlt: 'Murid mencuci rambut menggunakan syampu berbuih.',
    explanation: 'Syampu menjadikan rambut dan kulit kepala bersih serta wangi.',
  },
  {
    id: 'routine-4',
    correctOrder: 4,
    wordKey: 'tuala',
    title: 'Mengeringkan badan menggunakan tuala.',
    imageUrl: '/src/assets/images/routine_dry_towel_1795571891747.jpg',
    imageAlt: 'Murid mengeringkan badan dan rambut menggunakan tuala.',
    explanation: 'Tuala menyerap air supaya badan kering dan selesa.',
  },
  {
    id: 'routine-5',
    correctOrder: 5,
    wordKey: 'sikat',
    title: 'Merapikan rambut menggunakan sikat.',
    imageUrl: '/src/assets/images/hygiene_comb_hair_fixed_1795568641390.jpg',
    imageAlt: 'Murid merapikan rambut dengan sikat di hadapan cermin.',
    explanation: 'Sikat memastikan rambut kemas dan rapi sebelum berpakaian.',
  },
];

export const PHASE4_SITUATIONS: SituationChoiceItem[] = [
  {
    id: 'sit-1',
    character: 'pikachu',
    situation: 'Pikachu baru selesai menanam pokok bunga dan tangannya berlumpur. Apakah yang Pikachu perlu gunakan?',
    correctWord: 'sabun',
    feedback: 'Betul! Pikachu mencuci tangannya dengan sabun sehingga bersih daripada tanah.',
  },
  {
    id: 'sit-2',
    character: 'squirtle',
    situation: 'Squirtle baru makan kek strawberi sebelum tidur malam. Apakah alat untuk menjaga giginya?',
    correctWord: 'berus-gigi',
    feedback: 'Syabas! Squirtle menggunakan berus gigi supaya giginya putih dan sihat.',
  },
  {
    id: 'sit-3',
    character: 'bulbasaur',
    situation: 'Bulbasaur terkena hujan renyai dan badannya basah kuyup. Apakah barang yang diperlukan?',
    correctWord: 'tuala',
    feedback: 'Hebat! Bulbasaur mengelap badannya yang basah dengan tuala lembut.',
  },
  {
    id: 'sit-4',
    character: 'charmander',
    situation: 'Selepas berlatih berlari, kepala Charmander berpeluh. Apakah cecair wangi yang sesuai semasa mandi?',
    correctWord: 'syampu',
    feedback: 'Tepat sekali! Charmander mencuci rambut dan kepalanya menggunakan syampu.',
  },
  {
    id: 'sit-5',
    character: 'pikachu',
    situation: 'Pikachu bersiap untuk bergambar bersama Pelatih tetapi rambutnya kusut. Apakah alat yang diperlukan?',
    correctWord: 'sikat',
    feedback: 'Pika Pika! Pikachu merapikan rambutnya dengan sikat supaya segak bergambar!',
  },
];

export const PHASE4_SENTENCES: SentenceChallengeItem[] = [
  {
    id: 'sent-1',
    number: 1,
    beforeBlank: 'Ibu membasuh tangan adik dengan',
    afterBlank: 'sebelum makan tengah hari.',
    correctWord: 'sabun',
    imageUrl: '/src/assets/images/obj_sabun_1795571888446.jpg',
    imageAlt: 'Gambar sabun',
  },
  {
    id: 'sent-2',
    number: 2,
    beforeBlank: 'Abang meletakkan ubat gigi di atas',
    afterBlank: 'berwarna biru itu.',
    correctWord: 'berus-gigi',
    imageUrl: '/src/assets/images/obj_berus_gigi_v2_1795573738785.jpg',
    imageAlt: 'Gambar berus gigi',
  },
  {
    id: 'sent-3',
    number: 3,
    beforeBlank: 'Kakak menjemur',
    afterBlank: 'yang lembap di ampaian luar rumah.',
    correctWord: 'tuala',
    imageUrl: '/src/assets/images/obj_tuala_1795571889490.jpg',
    imageAlt: 'Gambar tuala',
  },
  {
    id: 'sent-4',
    number: 4,
    beforeBlank: 'Adik gemar bau wangi',
    afterBlank: 'semasa mencuci rambutnya.',
    correctWord: 'syampu',
    imageUrl: '/src/assets/images/obj_syampu_v2_1795573739076.jpg',
    imageAlt: 'Gambar botol syampu',
  },
  {
    id: 'sent-5',
    number: 5,
    beforeBlank: 'Datuk meletakkan',
    afterBlank: 'kecil itu di atas meja cermin.',
    correctWord: 'sikat',
    imageUrl: '/src/assets/images/obj_sikat_1795571890852.jpg',
    imageAlt: 'Gambar sikat',
  },
];

export const PHASE5_FINAL_QUESTIONS: Phase3AssessmentQuestion[] = [
  {
    id: 'p5-q1',
    number: 1,
    targetWord: 'tuala',
    type: 'object-usage',
    question: 'Kain lembut ini menyerap air selepas kita mandi atau berenang. Apakah objek ini?',
    options: [
      { key: 'A', label: 'Tuala' },
      { key: 'B', label: 'Syampu' },
      { key: 'C', label: 'Sikat' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 'p5-q2',
    number: 2,
    targetWord: 'syampu',
    type: 'image-from-word',
    question: 'Cari gambar botol yang sepadan dengan suku kata syam · pu.',
    options: [
      {
        key: 'A',
        label: 'Gambar A',
        imageUrl: '/src/assets/images/obj_sabun_1795571888446.jpg',
        imageAlt: 'Sabun',
      },
      {
        key: 'B',
        label: 'Gambar B',
        imageUrl: '/src/assets/images/obj_syampu_v2_1795573739076.jpg',
        imageAlt: 'Botol syampu',
      },
      {
        key: 'C',
        label: 'Gambar C',
        imageUrl: '/src/assets/images/obj_berus_gigi_v2_1795573738785.jpg',
        imageAlt: 'Berus gigi',
      },
    ],
    correctAnswer: 'B',
  },
  {
    id: 'p5-q3',
    number: 3,
    targetWord: 'berus-gigi',
    type: 'context-sentence',
    question: 'Doktor gigi menasihati kita agar menggosok gigi dua kali sehari dengan ______.',
    options: [
      { key: 'A', label: 'tuala' },
      { key: 'B', label: 'sikat' },
      { key: 'C', label: 'berus gigi' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 'p5-q4',
    number: 4,
    targetWord: 'sikat',
    type: 'word-from-image',
    question: 'Lihat gambar ini. Perkataan manakah bermula dengan suku kata "si" untuk merapikan rambut?',
    promptImageUrl: '/src/assets/images/obj_sikat_1795571890852.jpg',
    promptImageAlt: 'Gambar sikat rambut',
    options: [
      { key: 'A', label: 'Sikat' },
      { key: 'B', label: 'Sabun' },
      { key: 'C', label: 'Syampu' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 'p5-q5',
    number: 5,
    targetWord: 'sabun',
    type: 'object-usage',
    question: 'Mengapakah kita digalakkan mencuci tangan menggunakan sabun sebelum menjamah makanan?',
    options: [
      { key: 'A', label: 'Supaya tangan menjadi lebih basah' },
      { key: 'B', label: 'Untuk menyingkirkan kotoran dan kuman' },
      { key: 'C', label: 'Supaya rambut kelihatan lebih kemas' },
    ],
    correctAnswer: 'B',
  },
];

export const PHASE5_REFLECTION_FEELINGS = [
  'Saya sudah boleh membaca perkataan.',
  'Saya boleh mengenal pasti gambar dan perkataan.',
  'Saya masih memerlukan bantuan.',
  'Saya mahu berlatih lagi.',
];
