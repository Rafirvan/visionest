import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import OpenAI from "openai";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
})


export const AIRouter = createTRPCRouter({

  idea: publicProcedure.input(z.object({
    major: z.string(),
    type: z.string(),
    field: z.string(),
    subject: z.string(),
    time: z.string(),
    constraint: z.string(),
  })).mutation(async ({ input }) => {
    const prompt = `
      Anda akan membantu mahasiswa menemukan ide cerdas untuk proyek mahasiswa selanjutnya, dengan daftar berikut:
      jurusan mahasiswa = ${input.major}
      tipe proyek yang diinginkan mahasiswa(baik praktis atau teoritis) = ${input.type}
      bidang yang diinginkan mahasiswa = ${input.field}
      subjek penelitian atau teknologi yang dikenal mahasiswa = ${input.subject}
      waktu maksimal mahasiswa untuk menyelesaikan proyek(opsional, abaikan jika kosong) = ${input.time}
      apa yang tidak diinginkan mahasiswa untuk proyek mereka(opsional, abaikan jika kosong) = ${input.constraint}

      harap kembalikan daftar ini dengan format yang tepat:
      Judul rekomendasi proyek = [your input here]
      Deskripsi singkat dari judul proyek yang direkomendasikan = [your input here, maksimal 40 kata]

      beberapa hal lain yang perlu dipertimbangkan:
    -jika ada bidang input yang tidak masuk akal, abaikan
    - jangan takut untuk merekomendasikan penggunaan teknologi / subjek yang berdekatan dengan yang mereka berikan
    - jika mungkin, coba condongkan ke proyek yang mungkin menghasilkan literatur ilmiah
    - tolong jangan pernah menggunakan titik dua sebagai pengganti tanda sama dengan
    - Selalu jawab dengan bahasa Indonesia
    - Jika suatu input non-opsional tidak jelas, mohon hanya kembalikan output "Coba Lagi"`

    const ideaCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 300,
    });
    return ideaCompletion.choices[0]?.message.content

  }),

  content: publicProcedure.input(z.object({
    text: z.string(),
    language: z.string().optional()
  })).mutation(async ({ input }) => {
    const prompt =
      `di sini, Anda adalah seorang pembuat konten yang mengkhususkan diri dalam menghasilkan konten teks bergaya blog 
      dari abstrak makalah ilmiah, konten HARUS mengandung 
      minimal 150 kata dan maksimal 250 kata
      dengan daftar berikut:

      abstrak makalah ilmiah = ${input.text}
      

      harap kembalikan dengan format yang tepat:

      [Your Input Here]

    kriteria yang perlu dipertimbangkan:
    -buat konten menjadi menarik namun tetap realistis
      - jelaskan dengan detail istilah ilmiah yang mungkin asing bagi kebanyakan orang
        - anggaplah Anda adalah pencipta makalah tersebut, mempromosikan makalah atau produk Anda
          - Jangan mengembalikan judul, catatan, hitungan kata, atau pesan kesalahan
          -Selalu Kembalikan Output anda dalam bahasa Indonesia
          
          `



    const contentCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 3000,
      temperature: 1.1
    });
    return contentCompletion.choices[0]?.message.content
  }),
});
