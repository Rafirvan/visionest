import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure
} from "~/server/api/trpc";
import OpenAI from "openai";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
})


export const AIRouter = createTRPCRouter({

  ideatitles: privateProcedure.input(z.object({
    major: z.string(),
    type: z.string(),
    field: z.string(),
    subject: z.string(),
  })).mutation(async ({ input }) => {
    const prompt = `
      Anda akan membantu mahasiswa menemukan ide cerdas untuk proyek mahasiswa selanjutnya, dengan daftar berikut:
      jurusan mahasiswa = ${input.major}
      tipe proyek yang diinginkan mahasiswa(dari pilihan praktikal atau teoretikal) = ${input.type}
      bidang yang diinginkan mahasiswa = ${input.field}
      subjek penelitian atau teknologi yang dikenal mahasiswa = ${input.subject}

      harap kembalikan daftar ini dengan format yang tepat:
      Judul rekomendasi proyek 1 = [your input here]
      Judul rekomendasi proyek 2 = [your input here]
      Judul rekomendasi proyek 3 = [your input here]

      
      beberapa hal lain yang perlu dipertimbangkan:
      -tipe projek praktikal mencakup pembuatan suatu produk software maupun hardware, tipe projek teoretikal mencakup analisis dan studi lapangan
      -refrain from using made-up names
      -pastikan judul bersifat formal
    -ketiga judul rekomendasi proyek dibuat seberagam mungkin
    -judul pertama merupakan rekomendasi konvensional, judul kedua merupakan judul yang luar dari biasanya, dan judul ketiga merupakan judul yang sangat kreatif namun masih masuk akal dan dapat dijadikan literatur ilmiah
    -Semua judul dijelaskan sejelas mungkin, hindari ketidakjelasan
    -usahakan tidak mengulang kata terlalu banyak diantara 3 judul tersebut
    -jika ada bidang input yang tidak masuk akal, abaikan
    - jangan takut untuk merekomendasikan penggunaan teknologi / subjek yang berdekatan dengan yang mereka berikan
    - jika mungkin, coba condongkan ke proyek yang mungkin menghasilkan literatur ilmiah
    - tolong jangan pernah menggunakan titik dua sebagai pengganti tanda sama dengan
    - Selalu jawab dengan bahasa Indonesia
    - Setiap judul memiliki minimal 25 kata dan maksimal 35 kata
    - Setiap judul tidak perlu diberi deskripsi tambahan
    - Jika suatu input non-opsional tidak jelas, mohon hanya kembalikan output "Coba Lagi"`



    const ideaCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "gpt-3.5-turbo-0613",
      frequency_penalty: 1.2,
      presence_penalty: 1.2,
      max_tokens: 300,
      temperature: 1.2,

    });
    return ideaCompletion.choices[0]?.message.content

  }),

  ideasteps: privateProcedure.input(z.string()).mutation(async ({ input }) => {
    const stepsprompt =
      `tarik nafas panjang dan ikuti perintah ini, 
    anda adalah seorang yang telah membuat banyak literatur ilmiah dan ingin membantu mahasiswa anda 
    untuk menyelesaikan literatur ilmiah mereka. Anda tahu bahwa judul karya ilmiah adalah ${input}.
    mohon bantu mereka menyelesaikan langkah awal dari literatur ilmiah mereka, yaitu dengan membuatkan
    mereka langkah-langkah pengerjaan literatur ilmiah, mulai dari tahap penelitian hingga penyelesaian
     Mohon jawab dengan langkah-langkah singkat(maksimal 20 kata per langkah) dan pastikan bahwa hasil jawaban anda
     sangat relevan terhadap judul yang diberikan
    `

    const tagsprompt = `dari judul ${input}, mohon jawab dengan kategori apa saja yang cocok untuk 
    diberikan pada judul, bila diberi daftar kategori "Agama", "Agrikultur", "Astronomi",
  "Bangunan", "Biologi", "Desain Grafis", "Edukasi", "Ekonomi", "Energi",
  "Fauna", "Filosofi", "Fisika", "Flora", "Geografi", "Geologi",
  "Hukum", "Jurnalistik", "Kedokteran", "Kehutanan", "Kesenian", "Kesehatan",
  "Kewarganegaraan", "Kimia", "Komputer", "Komunikasi", "Manajemen", "Maritim",
  "Makanan", "Matematika", "Musik", "Olahraga", "Pariwisata", "Pemrograman",
  "Politik", "Psikologi", "Sastra Indonesia", "Sastra Internasional", "Sejarah",
  "Sosiologi", "Teknologi"
  
  -mohon dijawab hanya dengan kategori-kategori tanpa teks intro maupun outro
  -kategori-kategori dipisah dengan simbol ";"
  -jangan ubah besar kecil dari huruf dalam kategori`

    const abstractprompt = `dari judul ${input}, mohon jawab dengan contoh abstrak yang mungkin dihasilkan 
    dengan maksimal 200 kata dan berbahasa indonesia tanpa kata kunci, pastikan bahwa hasil jawaban anda
     sangat relevan terhadap judul yang diberikan`

    const toolsprompt =
      `tarik nafas panjang dan ikuti perintah ini, 
    anda adalah seorang yang telah membuat banyak literatur ilmiah dan ingin membantu mahasiswa anda 
    untuk menyelesaikan literatur ilmiah mereka. Anda tahu bahwa judul karya ilmiah adalah ${input}.
    mohon bantu mereka untuk mencari paling tidak 5 software maupun hardware yang dapat membantu mereka 
    dalam penyelesaian tugas akhir mereka, dan pastikan bahwa hasil jawaban anda
     sangat relevan terhadap judul yang diberikan
    `


    const stepsCompletion = openai.chat.completions.create({
      messages: [{ role: 'user', content: stepsprompt }],
      model: "gpt-3.5-turbo-0613",
      max_tokens: 1000,
    });

    const tagsCompletion = openai.chat.completions.create({
      messages: [{ role: 'user', content: tagsprompt }],
      model: "gpt-3.5-turbo-0613",
      max_tokens: 300,
    });

    const abstractCompletion = openai.chat.completions.create({
      messages: [{ role: 'user', content: abstractprompt }],
      model: "gpt-3.5-turbo-0613",
      max_tokens: 2000,
    });
    const toolsCompletion = openai.chat.completions.create({
      messages: [{ role: 'user', content: toolsprompt }],
      model: "gpt-3.5-turbo-0613",
      max_tokens: 2000,
    });

    const results = await Promise.allSettled([stepsCompletion, tagsCompletion, abstractCompletion, toolsCompletion]);

    return {
      steps: results[0].status === 'fulfilled' ? results[0].value.choices[0]?.message.content : "unable to fetch result",
      tags: results[1].status === 'fulfilled' ? results[1].value.choices[0]?.message.content : "unable to fetch result",
      abstract: results[2].status === 'fulfilled' ? results[2].value.choices[0]?.message.content : "unable to fetch result",
      tools: results[3].status === 'fulfilled' ? results[3].value.choices[0]?.message.content : "unable to fetch result",
    };
  }),

  embed: privateProcedure.input(z.string().array()).mutation(async ({ input }) => {

    const embeddings = await Promise.all(input.map(async (title) => {
      const result = await openai.embeddings.create({
        input: title,
        model: "text-embedding-ada-002"
      })
      return result
    }
    )
    )

    const embeddingData = embeddings.map(e => e.data[0]?.embedding)

    function cosineSimilarity(vectorA: number[], vectorB: number[]) {
      if (vectorA.length !== vectorB.length) {
        throw new Error("Vectors are not of the same length");
      }

      let dotProduct = 0;
      let normA = 0;
      let normB = 0;

      for (let i = 0; i < vectorA.length; i++) {

        dotProduct += vectorA[i]! * vectorB[i]!;
        normA += vectorA[i]! * vectorA[i]!;
        normB += vectorB[i]! * vectorB[i]!;

      }

      normA = Math.sqrt(normA);
      normB = Math.sqrt(normB);

      return dotProduct / (normA * normB);
    }

    const comparisons = [[0, 1], [1, 2], [0, 2]].map(e => {
      return cosineSimilarity(embeddingData[e[0]!]!, embeddingData[e[1]!]!)
    })

    const average = (comparisons.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / comparisons.length);

    return ("rata-rata kesamaan antara 3 judul adalah " + average);
  }),





  content: privateProcedure.input(z.object({
    text: z.string(),
  })).mutation(async ({ input }) => {
    const prompt = `tarik napas beberapa saat sebelum mengerjakan tugas ini, 
    di sini, Anda adalah seorang pembuat konten yang mengkhususkan diri dalam menghasilkan konten teks bergaya blog 
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
          -Jangan mengembalikan judul, catatan, hitungan kata, atau pesan kesalahan
          -Selalu Kembalikan Output anda dalam bahasa Indonesia
          `


    const contentCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "gpt-3.5-turbo-0613",
      max_tokens: 3000,
      temperature: 1.1,
      // functions=[]
    });

    return contentCompletion.choices[0]?.message.content
  }),
});
