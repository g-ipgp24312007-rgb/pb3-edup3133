import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, type Content } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';
const TTS_MODEL_NAME = 'gemini-3.8-flash-lite-tts';
const TTS_VOICE_NAME = 'Kore';
const TTS_MAX_CACHE_ENTRIES = 160;
const ttsAudioCache = new Map<string, Buffer>();

const MALAY_TTS_STYLE =
  'Speak like a warm, friendly, natural Malaysian human teacher talking conversationally to an 8-year-old primary school student in standard Bahasa Melayu (loghat baku Malaysia yang lembut, jelas dan bersahaja, bukan nada robot). Pronounce "syampu" with the exact "sy" (/ʃ/) consonant sound as in the Malay word "syurga". Pronounce "berus" with the Malay schwa e-pepet "be" (/bə/) vowel sound as in the Malay word "beguk" (never "bérus"). Pronounce "Pokémon" naturally as "Pokemon".';

function normalizeTtsInput(rawText: string): string {
  return rawText
    .replace(/\b[A-Z]{2,}\b/g, (word) => word.toLowerCase())
    .replace(/\s*·\s*/g, ' ')
    .replace(/\bsy[\s-]*am[\s-]*pu\b/gi, 'syampu')
    .replace(/\bsyam[\s-]*pu\b/gi, 'syampu')
    .replace(/\bbe[\s-]*rus\b/gi, 'berus')
    .replace(/\bsa[\s-]*bun\b/gi, 'sabun')
    .replace(/\bgi[\s-]*gi\b/gi, 'gigi')
    .replace(/\btu[\s-]*a[\s-]*la\b/gi, 'tuala')
    .replace(/\bsi[\s-]*kat\b/gi, 'sikat')
    .replace(/pokémon/gi, 'Pokemon')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCachedTtsAudio(key: string): Buffer | undefined {
  const existing = ttsAudioCache.get(key);
  if (!existing) return undefined;
  // Refresh LRU order
  ttsAudioCache.delete(key);
  ttsAudioCache.set(key, existing);
  return existing;
}

function setCachedTtsAudio(key: string, wavBuffer: Buffer): void {
  if (ttsAudioCache.has(key)) {
    ttsAudioCache.delete(key);
  } else if (ttsAudioCache.size >= TTS_MAX_CACHE_ENTRIES) {
    const oldestKey = ttsAudioCache.keys().next().value;
    if (oldestKey !== undefined) {
      ttsAudioCache.delete(oldestKey);
    }
  }
  ttsAudioCache.set(key, wavBuffer);
}

const PIKACHU_SYSTEM_INSTRUCTION = `Kamu ialah Pikachu, maskot dan rakan belajar mesra untuk murid Tahun 2 sekolah rendah (umur 8 tahun) dalam aplikasi pembelajaran Bahasa Melayu bertajuk "Misi Kebersihan Pokémon" (Topik: Jom Bersihkan Diri!).

Peranan dan garis panduan jawapan:
1. Sentiasa mulakan atau selitkan gaya mesra Pikachu sekali-sekala seperti "Pika!", "Pika Pika!", atau "Wah, soalan bagus Pelatih!".
2. Gunakan Bahasa Melayu yang ringkas, jelas, sopan, dan mudah difahami oleh murid Tahun 2.
3. Fokus membantu murid membaca, mengeja mengikut suku kata, dan memahami lima perkataan sasaran kebersihan diri:
   - SABUN (sa-bun): untuk mencuci tangan dan badan.
   - BERUS GIGI (be-rus gi-gi): untuk membersihkan gigi.
   - TUALA (tu-a-la): untuk mengeringkan badan selepas mandi.
   - SYAMPU (syam-pu): untuk mencuci rambut supaya bersih dan wangi.
   - SIKAT (si-kat): untuk merapikan rambut.
4. Berikan jawapan pendek dan padat (maksimum 2 hingga 3 ayat pendek).
5. Jangan gunakan format markdown seperti **tebal**, # tajuk, atau senarai berpeluru kerana teks akan dibaca terus oleh murid dan sistem suara (text-to-speech).
6. Jika murid bertanya tentang kebersihan diri secara umum (seperti mandi, cuci tangan, gosok gigi), jawab dengan positif dan kaitkan dengan perkataan sasaran.
7. Jika murid bertanya perkara di luar topik pembelajaran, jawab dengan lembut dan ajak mereka kembali belajar tentang kebersihan diri bersama rakan Pokémon (Squirtle, Bulbasaur, Charmander).`;

interface IncomingHistoryItem {
  sender?: string;
  text?: string;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildChatHistory(rawHistory: unknown): Content[] {
  if (!Array.isArray(rawHistory)) return [];
  return rawHistory
    .slice(-10)
    .filter((item): item is IncomingHistoryItem => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const text = typeof item.text === 'string' ? item.text.trim().slice(0, 600) : '';
      const role = item.sender === 'student' ? 'user' : 'model';
      return { role, text };
    })
    .filter((entry) => entry.text.length > 0)
    .map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.text }],
    }));
}

interface WordKnowledge {
  key: string;
  word: string;
  syllables: string;
  usage: string;
  why: string;
  example: string;
  when: string;
}

const WORD_KNOWLEDGE: WordKnowledge[] = [
  {
    key: 'sabun',
    word: 'sabun',
    syllables: 'sa-bun',
    usage: 'Sabun digunakan untuk mencuci tangan dan badan daripada kotoran serta kuman.',
    why: 'Kita perlu guna sabun supaya kuman hilang dan badan berbau wangi.',
    example: 'Contoh ayat mudah: Saya mencuci tangan menggunakan sabun sebelum makan.',
    when: 'Kita guna sabun semasa mandi, selepas bermain dan sebelum makan.',
  },
  {
    key: 'berus',
    word: 'berus gigi',
    syllables: 'be-rus gi-gi',
    usage: 'Berus gigi digunakan untuk membersihkan gigi dan membuang sisa makanan.',
    why: 'Kita guna berus gigi supaya gigi kekal kuat, bersih dan tidak rosak.',
    example: 'Contoh ayat mudah: Saya menggosok gigi menggunakan berus gigi setiap pagi.',
    when: 'Kita guna berus gigi pada waktu pagi dan sebelum tidur malam.',
  },
  {
    key: 'tuala',
    word: 'tuala',
    syllables: 'tu-a-la',
    usage: 'Tuala ialah kain lembut yang digunakan untuk mengeringkan badan dan rambut.',
    why: 'Kita guna tuala supaya badan tidak basah dan selesa selepas mandi.',
    example: 'Contoh ayat mudah: Saya mengelap badan yang basah menggunakan tuala bersih.',
    when: 'Kita guna tuala sebaik sahaja selesai mandi atau mencuci muka.',
  },
  {
    key: 'syampu',
    word: 'syampu',
    syllables: 'syam-pu',
    usage: 'Syampu digunakan untuk mencuci rambut dan kulit kepala supaya bersih.',
    why: 'Kita guna syampu agar rambut tidak gatal, bebas kotoran dan berbau wangi.',
    example: 'Contoh ayat mudah: Adik mencuci rambut menggunakan syampu semasa mandi.',
    when: 'Kita guna syampu semasa mandi apabila rambut berpeluh atau kotor.',
  },
  {
    key: 'sikat',
    word: 'sikat',
    syllables: 'si-kat',
    usage: 'Sikat digunakan untuk merapikan rambut supaya kelihatan kemas dan tidak kusut.',
    why: 'Kita guna sikat agar rambut tersusun kemas apabila ke sekolah.',
    example: 'Contoh ayat mudah: Saya merapikan rambut dengan sikat di hadapan cermin.',
    when: 'Kita guna sikat selepas mengeringkan rambut atau sebelum keluar rumah.',
  },
];

function generateSmartPikachuReply(rawMessage: string, rawHistory: unknown): string {
  const lower = rawMessage.toLowerCase().trim();
  const asksExample = /\b(ayat|contoh|bina)\b/.test(lower);
  const asksSpelling = /\b(eja|suku kata|sebut|baca|bunyi)\b/.test(lower);
  const asksWhy = /\b(kenapa|mengapa|sebab|faedah|kebaikan)\b/.test(lower);
  const asksWhen = /\b(bila|waktu|masa)\b/.test(lower);

  const matchedWord =
    WORD_KNOWLEDGE.find((w) => lower.includes(w.key)) ||
    (lower.includes('gigi') ? WORD_KNOWLEDGE[1] : undefined) ||
    (lower.includes('shampu') ? WORD_KNOWLEDGE[3] : undefined);

  if (matchedWord) {
    if (asksExample) {
      return `Pika Pika! ${matchedWord.example} Cuba baca perkataan ini mengikut suku kata: ${matchedWord.syllables.toUpperCase()}!`;
    }
    if (asksSpelling) {
      return `Wah, soalan bagus Pelatih! Mari kita eja dan sebut bersama-sama: ${matchedWord.syllables.toUpperCase()}, dibaca ${matchedWord.word}. Hebat!`;
    }
    if (asksWhy) {
      return `Pika! ${matchedWord.why} Cuba sebut perkataan ${matchedWord.syllables.toUpperCase()} dengan jelas ya!`;
    }
    if (asksWhen) {
      return `Pika Pika! ${matchedWord.when} Jangan lupa eja bersama saya: ${matchedWord.syllables.toUpperCase()}!`;
    }
    return `Pika! ${matchedWord.usage} ${matchedWord.example} Mari sebut bersama Pikachu: ${matchedWord.syllables.toUpperCase()}!`;
  }

  // Semak konteks perbualan terdahulu jika murid balas ringkas seperti "contoh ayat" atau "kenapa"
  if ((asksExample || asksSpelling || asksWhy || asksWhen) && Array.isArray(rawHistory)) {
    const lastText = [...rawHistory]
      .reverse()
      .map((item) => (item && typeof item === 'object' && typeof (item as IncomingHistoryItem).text === 'string'
        ? (item as IncomingHistoryItem).text!.toLowerCase()
        : ''))
      .find((t) => WORD_KNOWLEDGE.some((w) => t.includes(w.key)));

    if (lastText) {
      const prevWord = WORD_KNOWLEDGE.find((w) => lastText.includes(w.key));
      if (prevWord) {
        if (asksExample) return `Pika Pika! ${prevWord.example}`;
        if (asksSpelling) return `Mari eja bersama Pikachu: ${prevWord.syllables.toUpperCase()} (${prevWord.word})!`;
        if (asksWhy) return `Pika! ${prevWord.why}`;
        if (asksWhen) return `Pika! ${prevWord.when}`;
      }
    }
  }

  if (/\b(hai|hello|helo|hi|assalamualaikum|salam|selamat)\b/.test(lower)) {
    return 'Pika Pika! Hai Pelatih! Saya Pikachu, rakan belajar kamu. Tanya saya tentang sabun, berus gigi, tuala, syampu atau sikat ya!';
  }

  if (/\b(siapa|nama)\b/.test(lower)) {
    return 'Pika! Saya ialah Pikachu AI, pemandu pengembaraan kebersihan diri kamu bersama Squirtle, Bulbasaur dan Charmander!';
  }

  if (/\b(terima kasih|thanks|tq|bagus|hebat|pandai|ok|okay|baik)\b/.test(lower)) {
    return 'Pika Pika! Sama-sama Pelatih! Kamu memang murid Tahun 2 yang rajin dan hebat. Teruskan berlatih membaca lima perkataan kebersihan diri ya!';
  }

  if (/\b(mandi|tangan|rambut|badan|bersih|kuman|kotor)\b/.test(lower)) {
    return 'Wah, soalan bagus Pelatih! Untuk menjaga kebersihan diri, kita guna sabun untuk mencuci tangan dan badan, syampu untuk rambut, tuala untuk mengelap badan dan sikat untuk merapikan rambut.';
  }

  if (/\b(petunjuk|bantu|tolong|tidak tahu|tak tahu|susah|senarai|lima|5)\b/.test(lower)) {
    return 'Jangan risau Pelatih! Petunjuk Pikachu: baca setiap perkataan mengikut suku kata iaitu SA-BUN, BE-RUS GI-GI, TU-A-LA, SYAM-PU dan SI-KAT. Pilih mana-mana satu untuk saya terangkan!';
  }

  return `Pika Pika! Saya terima soalan kamu tentang "${rawMessage.slice(0, 60)}". Dalam misi hari ini, jom kita teroka lima perkataan kebersihan diri: sabun, berus gigi, tuala, syampu dan sikat. Cuba tanya makna, ejaan suku kata atau contoh ayat bagi mana-mana perkataan itu!`;
}

async function sendWithRetry(
  ai: GoogleGenAI,
  message: string,
  history: Content[],
  attempts = 2
): Promise<string> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const chat = ai.chats.create({
        model: MODEL_NAME,
        history,
        config: {
          systemInstruction: PIKACHU_SYSTEM_INSTRUCTION,
        },
      });
      const response = await chat.sendMessage({ message });
      const text = response.text?.trim();
      if (!text) {
        throw new Error('Respons kosong daripada model Gemini.');
      }
      return text;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      const isNonRetryable =
        msg.includes('api_key_invalid') ||
        msg.includes('permission_denied') ||
        msg.includes('400') ||
        msg.includes('403') ||
        msg.includes('404');
      if (isNonRetryable || i === attempts - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 450 * (i + 1)));
    }
  }
  throw lastError;
}

const ttsInFlight = new Map<string, Promise<Buffer>>();

async function synthesizeMalaySpeechWithRetry(
  ai: GoogleGenAI,
  ttsText: string,
  attempts = 2
): Promise<Buffer> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await ai.models.generateContent({
        model: TTS_MODEL_NAME,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: ttsText,
                speechMetadata: {
                  style: MALAY_TTS_STYLE,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: TTS_VOICE_NAME },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('Tiada data audio daripada model Gemini TTS.');
      }
      return Buffer.from(base64Audio, 'base64');
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      const isNonRetryable =
        msg.includes('api_key_invalid') ||
        msg.includes('permission_denied') ||
        msg.includes('400') ||
        msg.includes('403') ||
        msg.includes('404');
      if (isNonRetryable || i === attempts - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * (i + 1)));
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/tts', async (req: Request, res: Response) => {
    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!rawText) {
      res.status(400).json({ error: 'Teks suara diperlukan.' });
      return;
    }

    const ttsText = normalizeTtsInput(rawText).slice(0, 700);
    if (!ttsText) {
      res.status(400).json({ error: 'Teks suara tidak sah.' });
      return;
    }

    const cached = getCachedTtsAudio(ttsText);
    if (cached) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached);
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'Perkhidmatan suara Gemini tidak tersedia.' });
      return;
    }

    try {
      let pending = ttsInFlight.get(ttsText);
      if (!pending) {
        pending = synthesizeMalaySpeechWithRetry(ai, ttsText).finally(() => {
          ttsInFlight.delete(ttsText);
        });
        ttsInFlight.set(ttsText, pending);
      }

      const wavBuffer = await pending;
      setCachedTtsAudio(ttsText, wavBuffer);
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(wavBuffer);
    } catch (err) {
      console.error('Gemini TTS generation error:', err);
      res.status(503).json({ error: 'Penjanaan suara semula jadi gagal buat sementara.' });
    }
  });

  app.post('/api/pikachu-chat', async (req: Request, res: Response) => {
    const rawMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!rawMessage) {
      res.status(400).json({ error: 'Sila taip soalan untuk Pikachu terlebih dahulu.' });
      return;
    }

    const message = rawMessage.slice(0, 500);
    const ai = getGeminiClient();

    if (!ai) {
      const reply = generateSmartPikachuReply(message, req.body?.history);
      res.json({ reply });
      return;
    }

    const history = buildChatHistory(req.body?.history);

    try {
      const reply = await sendWithRetry(ai, message, history);
      res.json({ reply });
    } catch (err) {
      console.error('Pikachu AI fallback triggered due to error:', err);
      const reply = generateSmartPikachuReply(message, req.body?.history);
      res.json({ reply });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Aplikasi belum dibina.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
