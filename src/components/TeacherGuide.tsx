import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Printer,
  Sparkles,
  Users,
} from 'lucide-react';
import { playClickPop } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';

interface TeacherGuideProps {
  onGoToMission: () => void;
  onGoToAssessment: () => void;
}

interface RphLessonStep {
  id: 'set-induksi' | 'langkah-1' | 'langkah-2' | 'langkah-3' | 'penutup';
  label: string;
  duration: string;
  badgeClass: string;
  isiPelajaranTitle: string;
  isiPelajaranBullets: string[];
  isiSubSections?: { heading: string; items: string[] }[];
  aktivitiPdp: { heading?: string; items: string[] }[];
  catatan: { label: string; value: string }[];
}

const RPH_PDF_URL = '/assets/aistudio/RPH_Tahun_2_Jom_Bersihkan_Diri_5d2df953.pdf';

const RPH_METADATA_ROWS: { label: string; value: string }[] = [
  { label: 'Nama Guru Pelatih', value: 'Abu Usamah Bin Abu Bakari' },
  { label: 'Mata Pelajaran', value: 'Bahasa Melayu' },
  { label: 'Tahun / Kelas', value: 'Tahun 2 / 2 Galaksi' },
  { label: 'Bilangan Murid', value: '20 orang' },
  { label: 'Tarikh / Hari', value: '14/9/2026 (Isnin)' },
  { label: 'Masa', value: '10.30 - 11.30 pagi' },
  { label: 'Tema', value: 'Kesihatan dan Kebersihan' },
  { label: 'Tajuk', value: 'Jom Bersihkan Diri' },
  { label: 'Fokus / Kemahiran', value: 'Kemahiran Membaca' },
  { label: 'Standard Kandungan (SK)', value: '2.1 Asas membaca dan memahami' },
  { label: 'Standard Pembelajaran (SP)', value: '2.1.2 Membaca dan memahami (i) perkataan' },
];

const RPH_DIFFERENTIATED_OBJECTIVES = [
  {
    code: 'MB',
    group: 'Kumpulan Baik',
    count: '6 murid',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    behavior: 'membaca dan memahami',
    c1: 'SP 2.1.2 (i)',
    c2: 'perkataan',
    c3: 'Lembaran tugasan, Kahoot',
    c4: "Video 'Jom Bersihkan Diri'",
    degree: '4 daripada 5 perkataan dengan betul dan tepat',
    summary:
      'Membaca dan memahami 4 daripada 5 perkataan dengan betul dan tepat.',
  },
  {
    code: 'MS',
    group: 'Kumpulan Sederhana',
    count: '10 murid',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    behavior: 'membaca dan memahami',
    c1: 'SP 2.1.2 (i)',
    c2: 'perkataan',
    c3: 'Kad perkataan, Quizizz',
    c4: "Video 'Jom Bersihkan Diri'",
    degree: '3 daripada 5 perkataan dengan betul dan tepat',
    summary:
      'Membaca dan memahami 3 daripada 5 perkataan dengan betul dan tepat.',
  },
  {
    code: 'MA',
    group: 'Kumpulan Asas',
    count: '4 murid',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    behavior: 'membaca dan memahami',
    c1: 'SP 2.1.2 (i)',
    c2: 'perkataan',
    c3: 'Kad perkataan bergambar',
    c4: "Video 'Jom Bersihkan Diri'",
    degree: '3 daripada 5 perkataan dengan betul dan tepat dengan bimbingan guru',
    summary:
      'Membaca dan memahami 3 daripada 5 perkataan dengan betul dan tepat dengan bimbingan guru.',
  },
];

const RPH_PEDAGOGY_CARDS = [
  {
    title: 'Sistem Bahasa',
    items: [
      'Tatabahasa: Kata nama (alat kebersihan: sabun, tuala, berus) dan kata kerja (mandi)',
      'Ejaan dan sebutan: Suku kata terbuka dan tertutup',
      'Kosa kata: Kebersihan diri (mandi, sabun, tuala, berus, bersih)',
    ],
  },
  {
    title: 'Elemen Merentas Kurikulum (EMK)',
    items: [
      'Nilai murni: Kebersihan, kerajinan, bertanggungjawab',
      'TMK: Penggunaan video, Canva dan Quizizz / Kahoot sebagai bahan multimedia',
      'Bahasa: Membaca perkataan dengan sebutan yang betul',
    ],
  },
  {
    title: 'Kepelbagaian Kaedah dan Teknik (Strategi)',
    items: [
      'Pendekatan: Berpusatkan murid',
      'Kaedah: Perbincangan, penerokaan, bimbingan berperingkat',
      'Teknik: Think-Pair-Share, Kerja kumpulan, E-pentaksiran (Quizizz / Kahoot)',
      'Strategi: Pedagogi Terbeza (Kumpulan Baik, Sederhana, Asas)',
      'PAK-21: Kolaboratif, komunikasi, pemikiran kritis',
      'Model reka bentuk: ASSURE',
    ],
  },
  {
    title: 'Pentaksiran Bilik Darjah (PBD)',
    items: [
      'Instrumen: Lembaran tugasan, senarai semak pemerhatian, skor Quizizz / Kahoot',
      'Pemerhatian Guru: Catatan anekdot',
      'Refleksi murid: “Hari ini saya boleh…” / “Saya masih perlu…”',
    ],
  },
  {
    title: 'Sumber / Bahan Bantu Mengajar (BBM)',
    items: [
      "Video 'Jom Bersihkan Diri'",
      'Gambar situasi kebersihan diri',
      'Grafik / infografik (Canva) dan kad perkataan',
      'Lembaran tugasan mengikut tahap',
      'Quizizz / Kahoot',
    ],
  },
  {
    title: 'Pengetahuan Sedia Ada Murid',
    items: [
      'Murid mempunyai asas kebersihan diri',
      'Murid pernah melihat dan mengamalkan rutin mandi serta menggosok gigi',
      'Murid telah mengenal huruf dan membaca suku kata',
    ],
  },
];

const RPH_LESSON_STEPS: RphLessonStep[] = [
  {
    id: 'set-induksi',
    label: 'Set Induksi',
    duration: '5 minit',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    isiPelajaranTitle: 'Gambar situasi kebersihan diri · Sumber: guru (Canva)',
    isiPelajaranBullets: [],
    isiSubSections: [
      {
        heading: 'Soalan rangsangan',
        items: [
          '1. Apakah yang kamu lakukan sebelum ke sekolah?',
          '2. Mengapakah kita perlu mandi setiap hari?',
          '3. Apa yang kita akan belajar hari ini?',
        ],
      },
    ],
    aktivitiPdp: [
      {
        items: [
          '1. Murid dipaparkan gambar situasi murid mandi, menggosok gigi dan mencuci tangan.',
          '2. Murid diminta memerhati gambar tersebut.',
          '3. Murid menjawab soalan rangsangan secara lisan.',
          '4. Think-Pair-Share: murid berkongsi pengalaman kebersihan diri dengan rakan sebelah.',
          '5. Murid mengaitkan perbincangan dengan tajuk “Jom Bersihkan Diri”.',
          '6. Guru menyatakan objektif pembelajaran.',
        ],
      },
    ],
    catatan: [
      { label: 'BBM', value: 'Gambar situasi, skrin / proyektor' },
      { label: 'KB', value: 'Menghubungkait pengalaman sedia ada murid' },
      { label: 'KP', value: 'Visual-ruang, verbal-linguistik' },
      { label: 'PAK-21', value: 'Think-Pair-Share' },
      { label: 'EMK', value: 'Nilai murni (kebersihan), TMK' },
      { label: 'Nilai', value: 'Keyakinan, kebersihan diri' },
      { label: 'PBD', value: 'Formatif awal: soal jawab, angkat kad jawapan, pemerhatian awal' },
    ],
  },
  {
    id: 'langkah-1',
    label: 'Langkah 1',
    duration: '15 minit',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    isiPelajaranTitle: 'Video / grafik ringkas “Jom Bersihkan Diri”',
    isiPelajaranBullets: ['Sumber: video pilihan guru, slaid Canva'],
    isiSubSections: [
      {
        heading: 'Perkataan sasaran',
        items: ['mandi, sabun, tuala, berus, bersih'],
      },
      {
        heading: 'Soalan',
        items: ['Apa yang kamu perhatikan?'],
      },
    ],
    aktivitiPdp: [
      {
        items: [
          '1. Murid menonton video “Jom Bersihkan Diri” melalui skrin digital.',
          '2. Guru menghentikan video pada adegan tertentu; murid menjawab “Apa yang kamu perhatikan?”.',
          '3. Guru menunjukkan 5 perkataan sasaran pada slaid Canva.',
          '4. Guru memodelkan bacaan perkataan dengan suku kata dan sebutan yang betul.',
          '5. Murid membaca perkataan secara beramai-ramai, kemudian berpasangan.',
          '6. Guru menerangkan makna setiap perkataan dengan merujuk adegan video.',
          '7. Murid memadankan perkataan dengan gambar secara lisan.',
        ],
      },
    ],
    catatan: [
      { label: 'BBM', value: 'Video, grafik dan kad perkataan (Canva), skrin digital' },
      { label: 'KB', value: 'Mengingat, memahami, menghubungkait perkataan dengan gambar' },
      { label: 'KP', value: 'Visual-ruang, verbal-linguistik' },
      { label: 'PAK-21', value: 'Komunikasi' },
      { label: 'EMK', value: 'Bahasa, TMK' },
      { label: 'Nilai', value: 'Keberanian bertutur, kebersihan' },
      { label: 'PBD', value: 'Pemerhatian guru: murid membaca dan menyebut perkataan dengan betul' },
    ],
  },
  {
    id: 'langkah-2',
    label: 'Langkah 2',
    duration: '15 minit',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    isiPelajaranTitle: 'Aktiviti kumpulan berperingkat',
    isiPelajaranBullets: [
      'Aliran: Terima tugasan → teroka bahan → bincang dalam kumpulan → hasilkan jawapan → kongsi dapatan',
    ],
    isiSubSections: [
      {
        heading: 'Kumpulan Baik (6 murid) · Kad Soalan',
        items: [
          '1. Apakah perkataan yang menunjukkan alat mandi?',
          '2. Apakah maksud perkataan “bersih” dalam teks ini?',
        ],
      },
      {
        heading: 'Kumpulan Sederhana (10 murid) · Kad Soalan',
        items: [
          '1. Apakah perkataan pada kad ini?',
          '2. Padankan perkataan dengan gambar yang betul.',
        ],
      },
      {
        heading: 'Kumpulan Asas (4 murid) · Kad Soalan',
        items: [
          '1. Baca perkataan pada kad bergambar ini.',
          '2. Apakah yang ada dalam gambar?',
        ],
      },
    ],
    aktivitiPdp: [
      {
        items: [
          '1. Murid dibahagi kepada tiga kumpulan mengikut tahap.',
          '2. Setiap kumpulan menerima tugasan dan bahan, kemudian meneroka bahan.',
        ],
      },
      {
        heading: 'Kumpulan Baik',
        items: [
          '3. Murid membaca teks ringkas yang mengandungi 5 perkataan sasaran, menggariskan perkataan dan menerangkan maksudnya.',
        ],
      },
      {
        heading: 'Kumpulan Sederhana',
        items: [
          '4. Murid membaca kad perkataan, memadankan dengan gambar dan membaca setiap padanan.',
        ],
      },
      {
        heading: 'Kumpulan Asas',
        items: [
          '5. Murid membaca kad perkataan bergambar bersama guru, kemudian menyebut semula tanpa bimbingan.',
        ],
      },
      {
        heading: 'Semua kumpulan',
        items: [
          '6. Murid berbincang dan menghasilkan jawapan.',
          '7. Wakil setiap kumpulan membaca dan berkongsi dapatan.',
          '8. Guru membetulkan sebutan dan makna, serta menguatkan nilai kebersihan.',
        ],
      },
    ],
    catatan: [
      {
        label: 'BBM',
        value: 'Kad perkataan dan gambar, lembaran tugasan mengikut tahap, infografik, teks ringkas',
      },
      { label: 'KB', value: 'Menganalisis, mengaplikasi, menjelaskan makna' },
      { label: 'KP', value: 'Interpersonal, verbal-linguistik, visual-ruang' },
      { label: 'Strategi', value: 'Pembelajaran terbeza, pembelajaran koperatif' },
      { label: 'PAK-21', value: 'Kolaboratif, komunikasi' },
      { label: 'EMK', value: 'Kesihatan dan kebersihan diri' },
      { label: 'Nilai', value: 'Kerjasama, keyakinan' },
      {
        label: 'PBD (proses)',
        value:
          'Senarai semak pemerhatian: mengenal pasti perkataan, membaca dengan betul, memberi respons, bekerjasama, menyelesaikan tugasan',
      },
    ],
  },
  {
    id: 'langkah-3',
    label: 'Langkah 3',
    duration: '20 minit',
    badgeClass: 'bg-red-100 text-red-900 border-red-300',
    isiPelajaranTitle: 'Aplikasi, pengukuhan dan e-pentaksiran (Quizizz / Kahoot)',
    isiPelajaranBullets: [],
    isiSubSections: [
      {
        heading: '5 item interaktif',
        items: [
          '1. Padanan perkataan dengan gambar',
          '2. Pilihan jawapan (perkataan yang betul)',
          '3. Gambar + perkataan',
          '4. Makna perkataan',
          '5. Aplikasi dalam situasi',
        ],
      },
    ],
    aktivitiPdp: [
      {
        items: [
          '1. Murid diberikan lembaran tugasan / akses kuiz mengikut tahap.',
          '2. Murid menjawab 5 item kuiz secara individu atau berpasangan.',
          '3. Murid membaca perkataan sasaran dalam situasi kebersihan diri (aplikasi).',
          '4. Murid berkongsi hasil dan jawapan dengan rakan.',
          '5. Guru menyemak skor dan membincangkan jawapan yang salah.',
          '6. Guru membimbing murid yang belum mencapai 3 daripada 5 perkataan.',
        ],
      },
    ],
    catatan: [
      { label: 'BBM', value: 'Peranti, Quizizz / Kahoot, lembaran tugasan mengikut tahap' },
      { label: 'KB', value: 'Mengaplikasi, menilai' },
      { label: 'KP', value: 'Verbal-linguistik, interpersonal, visual-ruang' },
      { label: 'Strategi', value: 'Pembelajaran terbeza mengikut tahap' },
      { label: 'PAK-21', value: 'Kolaboratif, literasi digital' },
      { label: 'EMK', value: 'TMK, bahasa' },
      { label: 'Nilai', value: 'Kerajinan, kebersihan, keyakinan diri' },
      { label: 'PBD', value: 'E-pentaksiran (skor kuiz), AFL' },
    ],
  },
  {
    id: 'penutup',
    label: 'Penutup',
    duration: '5 minit',
    badgeClass: 'bg-violet-100 text-violet-900 border-violet-300',
    isiPelajaranTitle: 'Refleksi murid dan rumusan',
    isiPelajaranBullets: [],
    isiSubSections: [
      {
        heading: 'Soalan',
        items: [
          '1. Apakah perkataan yang kamu baca hari ini?',
          '2. Apakah maksud perkataan “bersih”?',
          '3. Apakah amalan kebersihan yang kamu akan lakukan?',
        ],
      },
      {
        heading: 'Cadangan jawapan',
        items: [
          '1. Mandi, sabun, tuala, berus dan bersih.',
          '2. Bersih bermaksud tidak kotor.',
          '3. Saya akan mandi dan mencuci tangan setiap hari.',
        ],
      },
    ],
    aktivitiPdp: [
      {
        items: [
          '1. Guru menanyakan beberapa soalan kepada murid.',
          '2. Murid menjawab secara lisan.',
          '3. Murid membuat refleksi: “Hari ini saya boleh…” dan “Saya masih perlu…”.',
          '4. Murid menilai media pembelajaran (menarik, mudah difahami, membantu pembelajaran, meningkatkan penglibatan) pada skala 1 (Tidak setuju) hingga 4 (Sangat setuju).',
          '5. Guru merumuskan isi pelajaran dan menegaskan kepentingan kebersihan diri.',
        ],
      },
    ],
    catatan: [
      { label: 'KB', value: 'Membuat rumusan, membuat perkaitan dengan kehidupan harian' },
      { label: 'KP', value: 'Verbal-linguistik, intrapersonal' },
      { label: 'EMK', value: 'Nilai murni (kebersihan), bahasa' },
      { label: 'Nilai', value: 'Bertanggungjawab, keyakinan diri' },
      { label: 'PBD', value: 'Refleksi murid, instrumen penilaian kebolehgunaan media' },
    ],
  },
];

export const TeacherGuide: React.FC<TeacherGuideProps> = ({
  onGoToMission,
  onGoToAssessment,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<RphLessonStep['id']>('set-induksi');
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  const activeStep =
    RPH_LESSON_STEPS.find((s) => s.id === selectedStepId) || RPH_LESSON_STEPS[0];

  const handlePrint = () => {
    playClickPop();
    window.print();
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Top RPH Header Banner */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl">
              <GraduationCap className="w-4 h-4" />
              <span>Sekolah Kebangsaan Aman Jaya · RPH Bahasa Melayu Tahun 2</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              PANDUAN GURU (RPH: JOM BERSIHKAN DIRI)
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Rancangan Pengajaran Harian lengkap mengikut model ASSURE, objektif ABCD terbeza (MB, MS, MA), serta perincian aktiviti dari Set Induksi hingga Penutup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setShowPdfPreview((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4" />
              <span>{showPdfPreview ? 'Tutup Paparan PDF' : 'Papar Dokumen PDF'}</span>
            </button>

            <a
              href={RPH_PDF_URL}
              download="RPH_Tahun_2_Jom_Bersihkan_Diri.pdf"
              onClick={() => playClickPop()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold min-h-[44px]"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Muat Turun PDF</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak RPH</span>
            </button>
          </div>
        </div>

        <CharacterDialogue
          character="pikachu"
          message="Selamat datang Cikgu! Rujukan RPH Tahun 2 (SK 2.1 · SP 2.1.2) ini disusun khas bagi memandu sesi PdP bersama murid kelas 2 Galaksi."
        />

        {/* Embedded Original RPH PDF Preview */}
        {showPdfPreview && (
          <div className="rounded-2xl border border-slate-300 bg-slate-100 overflow-hidden space-y-2 p-3 no-print">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700">
                Lampiran Asal: RPH Bahasa Melayu Tahun 2 — Jom Bersihkan Diri (4 Halaman)
              </span>
              <a
                href={RPH_PDF_URL}
                download="RPH_Tahun_2_Jom_Bersihkan_Diri.pdf"
                className="text-xs font-bold text-sky-700 hover:underline"
              >
                Simpan fail PDF
              </a>
            </div>
            <object
              data={RPH_PDF_URL}
              type="application/pdf"
              className="w-full h-[540px] rounded-xl bg-white border border-slate-200"
              aria-label="Dokumen PDF RPH Tahun 2 Jom Bersihkan Diri"
            >
              <div className="p-6 text-center space-y-3 bg-white rounded-xl">
                <p className="text-sm font-semibold text-slate-700">
                  Pelayar anda tidak menyokong pratonton PDF secara langsung.
                </p>
                <a
                  href={RPH_PDF_URL}
                  download="RPH_Tahun_2_Jom_Bersihkan_Diri.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>Muat Turun RPH (PDF)</span>
                </a>
              </div>
            </object>
          </div>
        )}

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 flex items-center gap-3">
            <Users className="w-5 h-5 text-sky-700 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-sky-800">Kelas &amp; Murid</p>
              <p className="text-sm font-extrabold text-slate-900">2 Galaksi · 20 orang</p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-amber-800">Tarikh / Hari</p>
              <p className="text-sm font-extrabold text-slate-900">14/9/2026 (Isnin)</p>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-emerald-800">Masa Pengajaran</p>
              <p className="text-sm font-extrabold text-slate-900">10.30 – 11.30 pagi</p>
            </div>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-3.5 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-violet-700 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-violet-800">Kemahiran Fokus</p>
              <p className="text-sm font-extrabold text-slate-900">Membaca (SP 2.1.2)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Maklumat Am RPH & Merungkai SP / ABCD */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Maklumat Umum */}
        <div className="lg:col-span-5 rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <ClipboardCheck className="w-5 h-5 text-sky-700" />
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
              Maklumat RPH &amp; Standard Kurikulum
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {RPH_METADATA_ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-12 text-xs sm:text-sm"
              >
                <div className="col-span-5 bg-amber-50/80 px-3 py-2.5 font-bold text-slate-800 border-r border-slate-100">
                  {row.label}
                </div>
                <div className="col-span-7 bg-white px-3 py-2.5 font-medium text-slate-900">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Merungkai SP & Objektif Pembelajaran Model ABCD */}
        <div className="lg:col-span-7 rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
              Merungkai SP &amp; Objektif Pembelajaran (Model ABCD)
            </h2>
          </div>

          {/* Merungkai SP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-1.5">
              <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                Kata Nama (Pengetahuan Bahasa)
              </p>
              <p className="text-sm font-bold text-slate-900">1. Perkataan</p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 space-y-1.5">
              <p className="text-xs font-extrabold text-sky-800 uppercase tracking-wide">
                Kata Kerja (Kemahiran Bahasa)
              </p>
              <p className="text-sm font-bold text-slate-900">2. Membaca · 3. Memahami</p>
            </div>
          </div>

          {/* Model ABCD Umum */}
          <div className="rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                  <th className="p-2.5 font-extrabold">Audien</th>
                  <th className="p-2.5 font-extrabold">Behavior</th>
                  <th className="p-2.5 font-extrabold">C1 (HP)</th>
                  <th className="p-2.5 font-extrabold">C2 (PB)</th>
                  <th className="p-2.5 font-extrabold">C3 (Alat)</th>
                  <th className="p-2.5 font-extrabold">C4 (Stimulus)</th>
                  <th className="p-2.5 font-extrabold">Degree</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-slate-900">
                  <td className="p-2.5 font-semibold">Murid Tahun 2</td>
                  <td className="p-2.5">membaca dan memahami</td>
                  <td className="p-2.5">SP 2.1.2 (i)</td>
                  <td className="p-2.5">perkataan</td>
                  <td className="p-2.5">Kad perkataan, Quizizz / Kahoot</td>
                  <td className="p-2.5">Video ‘Jom Bersihkan Diri’</td>
                  <td className="p-2.5 font-semibold">3 daripada 5 perkataan dengan betul dan tepat</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Objektif Pembelajaran (OP) */}
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50/80 p-4 space-y-1.5">
            <p className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
              Objektif Pembelajaran (OP)
            </p>
            <p className="text-sm text-slate-900 font-medium leading-relaxed">
              Pada akhir sesi pengajaran dan pembelajaran, murid Tahun 2 dapat:
              <br />
              <span className="font-bold">
                (i) membaca dan memahami 3 daripada 5 perkataan berkaitan video ‘Jom Bersihkan Diri’ dengan betul dan tepat.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Merungkai Objektif Khusus Terbeza (MB, MS, MA) */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              Objektif Khusus &amp; Pembelajaran Terbeza (Model ABCD)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Petunjuk: MB = Murid Baik · MS = Murid Sederhana · MA = Murid Asas · HP = Had Pencapaian · PB = Pengetahuan Bahasa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RPH_DIFFERENTIATED_OBJECTIVES.map((item) => (
            <div
              key={item.code}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold ${item.badgeClass}`}
                >
                  {item.code} · {item.group}
                </span>
                <span className="text-xs font-bold text-slate-600">{item.count}</span>
              </div>

              <p className="text-sm font-bold text-slate-900 leading-snug">{item.summary}</p>

              <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <p>
                  <span className="font-bold text-slate-900">Behavior:</span> {item.behavior} ({item.c1}, {item.c2})
                </p>
                <p>
                  <span className="font-bold text-slate-900">Alat (C3):</span> {item.c3}
                </p>
                <p>
                  <span className="font-bold text-slate-900">Stimulus (C4):</span> {item.c4}
                </p>
                <p>
                  <span className="font-bold text-slate-900">Degree:</span> {item.degree}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sistem Bahasa, EMK, Strategi, PBD, BBM & Pengetahuan Sedia Ada */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {RPH_PEDAGOGY_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 shadow-sm space-y-3"
          >
            <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{card.title}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {card.items.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Strategi Pengajaran & Pembelajaran / Perincian Aktiviti */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-sky-700 uppercase tracking-wide">
            Strategi Pengajaran dan Pembelajaran / Perincian Aktiviti
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
            Aliran Pelaksanaan PdP (Set Induksi hingga Penutup · 60 Minit)
          </h2>
        </div>

        {/* Step Tabs */}
        <div className="flex flex-wrap gap-2 no-print" role="tablist" aria-label="Langkah Pengajaran RPH">
          {RPH_LESSON_STEPS.map((step) => {
            const isSelected = step.id === selectedStepId;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  playClickPop();
                  setSelectedStepId(step.id);
                }}
                className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[42px] ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-sky-300'
                }`}
              >
                {step.label} ({step.duration})
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`px-3 py-1 rounded-lg border text-xs font-extrabold ${activeStep.badgeClass}`}>
              {activeStep.label} · {activeStep.duration}
            </span>
            <span className="text-xs font-bold text-slate-600">{activeStep.isiPelajaranTitle}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Column 1: Isi Pelajaran */}
            <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
              <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Isi Pelajaran
              </h3>
              <p className="text-sm font-bold text-slate-900">{activeStep.isiPelajaranTitle}</p>
              {activeStep.isiPelajaranBullets.map((b, i) => (
                <p key={i} className="text-xs sm:text-sm text-slate-700">
                  {b}
                </p>
              ))}
              {activeStep.isiSubSections?.map((sec) => (
                <div key={sec.heading} className="space-y-1 pt-1">
                  <p className="text-xs font-extrabold text-sky-800">{sec.heading}</p>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                    {sec.items.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Column 2: Aktiviti PdP */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
              <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Aktiviti Pengajaran dan Pembelajaran
              </h3>
              <div className="space-y-3">
                {activeStep.aktivitiPdp.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1.5">
                    {group.heading && (
                      <p className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                        {group.heading}
                      </p>
                    )}
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
                      {group.items.map((line, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Catatan */}
            <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
              <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Catatan
              </h3>
              <dl className="space-y-2 text-xs">
                {activeStep.catatan.map((c) => (
                  <div key={c.label} className="rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                    <dt className="font-extrabold text-slate-900">{c.label}</dt>
                    <dd className="text-slate-700 mt-0.5 leading-relaxed">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Navigation Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
          <button
            type="button"
            onClick={onGoToAssessment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-700" />
            <span>Buka Halaman Pentaksiran Bilik Darjah</span>
          </button>

          <button
            type="button"
            onClick={onGoToMission}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
          >
            <span>Mulakan Pengajaran (Misi 1)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
