/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback, useEffect, useState, useRef } from "react"
import Onestwhite from "../../public/Onestwhite.png"
import Image from 'next/image';
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { trpc } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { RightOut } from "~/components/transitions/pageVariants";
import VisionBG from "~/components/backgrounds/vision";
import PostCard from "~/components/postCard";
import Rating from "~/components/rating";
import { Clipboard } from "lucide-react";




type TabType = 'steps' | 'abstract' | 'tools';



export default function Vision() {
  //Section 2
  const [triggerScroll, setTriggerScroll] = useState(false);
  const [showResult, setShowResult] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState<number | undefined>()
  const timeoutIdRef = useRef<number | null>(null);

  //section 3 
  const [samplePostId, setSamplePostId] = useState<string | undefined>()

  //AI
  const [AILoading, setAILoading] = useState(false)
  const [titles, setTitles] = useState<string[] | undefined>()
  const [description, setDescription] = useState<Record<TabType, string | null | undefined>>();
  const [activeDescription, setActiveDescription] = useState<TabType>('steps')
  const [retries, setRetries] = useState(2)
  const [showRating, setShowRating] = useState(false)

  //form
  const [majorValue, setMajorValue] = useState<string>('');
  const [fieldValue, setFieldValue] = useState<string>('');
  const [subjectValue, setSubjectValue] = useState<string>('');
  const [typeValue, setTypeValue] = useState<string>("Practical")

  //clerk
  const { isLoaded, isSignedIn } = useUser();

  //backend calls
  const AICallForTitles = trpc.completion.ideatitles.useMutation({
    onSuccess: (data) => {
      if (data) {
        console.log(data)
        const matches = data.match(/=(.+)/g);
        const matches2 = data.match(/:(.+)/g);

        let matchArray, matchArray2;

        if (matches) {
          matchArray = matches.map(match => match.slice(1).trim());
        }
        if (matches2) {
          matchArray2 = matches2.map(match => match.slice(1).trim());
        }

        if (matchArray) {
          if (matchArray[0] && matchArray[1] && matchArray[2]) setTitles([matchArray[0], matchArray[1], matchArray[2]]);
        }
        else if (matchArray2) {
          if (matchArray2[0] && matchArray2[1] && matchArray2[2]) setTitles([matchArray2[0], matchArray2[1], matchArray2[2]]);
          console.log("match")
        }

        else { setRetries(prev => prev - 1); handleSubmit() }
      }
      setAILoading(false)
    }
  });

  const AIEmbedTitles = trpc.completion.embed.useMutation({
    onSuccess: (data) => console.log(data)
  })

  const AICallForDescription = trpc.completion.ideasteps.useMutation({
    onSuccess: (data) => {
      if (data) {
        if (data.tags) callSamplePost.mutate(data.tags.split(";"))
        setDescription({ steps: data.steps, abstract: data.abstract, tools: data.tools })
        setAILoading(false)
      }
    }
  });

  const callSamplePost = trpc.db.callsamplepostid.useMutation({
    onSuccess: (data) => setSamplePostId(data[0])
  })

  const AIrate = trpc.db.visionrate.useMutation();

  //functions
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) { e.preventDefault(); setRetries(2) };
    if (!retries) { setTitles(["Nilai tidak ditemukan, mohon coba lagi"]); return }
    setAILoading(true)
    setTitles(undefined)
    setSelectedTitle(undefined)
    setDescription(undefined)
    setSamplePostId(undefined)
    setActiveDescription('steps')
    setShowRating(false)
    cancelTimeout()
    if (!showResult) { setShowResult(true); }
    setTriggerScroll(prev => !prev);
    document.getElementById("Section2")?.scrollIntoView({ behavior: "smooth" })

    const inputs = {
      major: majorValue,
      type: typeValue,
      subject: subjectValue,
      field: fieldValue,
    }

    AICallForTitles.mutate(inputs);

  }, [AICallForTitles, fieldValue, majorValue, showResult, subjectValue, typeValue]);


  const giveRating = useCallback((rating: number) => {

    const input = majorValue + ";" + typeValue + ";" + fieldValue + ";" + subjectValue + ";"
    const output = selectedTitle + ";" + description?.steps + ";" + description?.abstract + ";" + description?.tools
    AIrate.mutate({ input: input, output: output, rating: rating })
    setTimeout(() => {
      setShowRating(false);
    }, 2000);
  }, [AIrate, titles, description]);

  useEffect(() => {
    if (description) {
      timeoutIdRef.current = window.setTimeout(() => {
        if (description) setShowRating(true);
      }, 5000);
    }
  }, [description]);

  useEffect(() => {
    if (showResult) {
      document.getElementById("Section2")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showResult, triggerScroll]);

  useEffect(() => { if (titles) AIEmbedTitles.mutate(titles) }, [titles])


  function cancelTimeout() {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
    }
  };

  function handleGetDescription(title: string) {
    setAILoading(true)
    AICallForDescription.mutate(title)
  }

  function handleCopy() {
    if (selectedTitle != undefined && description?.steps && description?.abstract && description?.tools)
      navigator.clipboard.writeText((
        [titles?.[selectedTitle],
        description?.steps,
        description?.abstract.replace(/\n\n/g, "\n"),
        description?.tools.replace(/\n\n/g, "\n")
        ].join("\n\n")
      ))
        .then(() => {
          alert('Teks Berhasil Dicopy');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
  };



  // returns blank div if clerk is not loaded

  if (!isLoaded) return <div></div>

  return (
    <motion.div
      animate="enter"
      exit="exit"
      variants={RightOut}>
      <section id="Section1" className="px-4 h-[100vh] min-h-[500px] w-full flex flex-col justify-between place-items-center bg-[100vw] md:flex-row gap-7 overflow-y-hidden ">
        <div id='Text' className='basis-2/5 h-full w-full flex flex-col place-content-center bg-green-700 text-white text-center '  >
          <h1 className='font-bold text-7xl mb-2'>The <div>Visi<span><Image src={Onestwhite} loading="eager" priority alt="o" className="inline w-[40px] aspect-square" /></span>n</div></h1>
          <p>Powered by OpenAI&trade;</p>
        </div>


        {/* forms */}
        <div className="basis-3/5 h-full w-full flex place-content-center">

          {(!isLoaded || !isSignedIn) ?
            <p className="place-self-center font-bold text-2xl md:text-4xl text-center">Login Untuk Mengakses Fitur</p>
            : <ScrollArea id="newform" className="h-full w-full pl-2">
              <form onSubmit={handleSubmit} className="w-[90%] h-full flex flex-col justify-center">

                <div id="majorselect">
                  <label htmlFor="major" className="block text-sm font-medium mb-2">
                    Pilih Jurusan Anda
                  </label>
                  <select
                    id="major"
                    value={majorValue}
                    onChange={(e) => setMajorValue(e.target.value)}
                    className="ml-5 mb-5 flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    required
                  >
                    <option value="">Pilih Satu Opsi</option>
                    {majors.map(major => <option key={major} value={major}>{major}</option>)}
                  </select>
                </div>

                <div id="typeradio" className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Tipe Projek Yang Diinginkan
                  </label>
                  <label className="mx-5">
                    <input
                      id="Practical"
                      type="radio"
                      value="Practical"
                      checked={typeValue === 'Practical'}
                      onChange={e => setTypeValue(e.target.value)}
                      className="scale-125 mr-1"
                    />
                    Praktikal
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="Theoretical"
                      checked={typeValue === 'Theoretical'}
                      onChange={e => setTypeValue(e.target.value)}
                      className="scale-125 mr-1"
                    />
                    Teoretikal
                  </label>
                </div>

                <div id="fieldinput">
                  <label htmlFor="field" className="block text-sm font-medium  mb-2">
                    Bidang Apa (terhubung dengan jurusan anda) Yang Anda Paling Sukai
                  </label>
                  <input
                    id="field"
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    className="ml-5 mb-5 flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    required
                  />
                </div>

                <div id="subjectinput">
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Teknologi atau subjek riset apa yang anda bisa gunakan, sampaikan sebanyak mungkin dan pisahkan dengan koma(,)
                  </label>
                  <input
                    id="subject"
                    value={subjectValue}
                    onChange={(e) => setSubjectValue(e.target.value)}
                    className="ml-5 mb-3 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    required
                  ></input>
                </div>


                <Button
                  type="submit"
                  className="bg-blue-700 mb-10 disabled:bg-gray-600 w-[105%]"
                  disabled={AILoading}
                >
                  Generasi Ide Rekomendasi
                </Button>
              </form>
              <div id="errorDiv" className="h-[180px] flex w-full md:hidden"></div>
            </ScrollArea>
          }
        </div>

        {/* Answer Area/section2 */}
      </section>
      {showResult && <section id="Section2" className="relative py-12 min-h-[100vh] max-h-[1000vh] h-auto flex flex-col justify-center text-center">
        <VisionBG />


        {titles ?
          <>
            {/* title select */}
            <AnimatePresence>
              {titles.map((title, index) => {
                if (selectedTitle === undefined) {
                  return (
                    <motion.p
                      exit={{ opacity: 0, transition: { duration: 0.5 } }}
                      layoutId={index.toString()}
                      key={index}
                      onClick={() => { handleGetDescription(title); setSelectedTitle(index) }}
                      className="text-lg md:text-2xl lg:text-4xl text-white mb-8 cursor-pointer underline hover:text-slate-400">
                      {/* text */}
                      {title.replace(/"/g, "")}
                    </motion.p>
                  );
                }
              })
              }
              {selectedTitle == undefined && <p className="absolute left-2 bottom-7 text-lg  animate-pulse duration-1000   text-white">Mohon pilih salah satu judul yang paling disukai</p>}
            </AnimatePresence>

            {(selectedTitle != undefined) && (
              <>
                <motion.p
                  layoutId={selectedTitle.toString()}
                  className="absolute top-20 text-lg md:text-2xl lg:text-4xl text-white mb-4 text-center w-full overflow-hidden overflow-ellipsis line-clamp-3"
                >
                  {titles[selectedTitle]?.replace(/"/g, "")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 1 } }}
                  className="absolute animate-rainbow border-2 top-52 w-[90%] left-[5%]"
                >
                  <nav className="h-8 w-full flex mb-3 pl-2 pr-12">
                    {navItems.map(item => (
                      <div key={item.value} className={`h-full w-full ${(activeDescription != item.value) && "hover:border-b"} border-slate-900`}>
                        <nav
                          className="text-white cursor-pointer  text-sm sm:text-lg border-white"
                          onClick={() => setActiveDescription(item.value as TabType)}
                        >
                          {item.label}
                        </nav>
                        {(activeDescription == item.value) &&
                          <motion.div layoutId="underline" className="h-[1px] w-[80%] relative left-[10%] top-1 bg-blue-700 " ></motion.div>
                        }
                      </div>
                    ))}
                  </nav>
                  <textarea
                    rows={100}
                    className="resize-none bg-transparent border-none w-full text-white cursor-text text-lg sm:text-xl md:text-2xl max-h-[440px] p-2 "
                    value={description?.[activeDescription] ?? "Loading... mohon tunggu beberapa menit"}
                    disabled
                  >
                  </textarea>
                  {description && <nav
                    onClick={handleCopy}
                    className=" h-8 w-8 top-1 right-1 bg-slate-800 z-10 absolute flex items-center justify-center rounded-md cursor-pointer hover:outline hover:outline-1 outline-white">
                    <Clipboard className="text-white" /></nav>}
                </motion.div>
              </>
            )}

          </>
          :
          <p className="text-xl md:text-5xl lg:text-7xl text-white mb-8">Loading...</p>
        }



        <Rating rate={giveRating} show={showRating} />

      </section>}

      {description && <section id="section3" className="min-h-[400px] w-full full-bg-black flex flex-col md:flex-row justify-center items-center gap-7 py-3 relative">
        <p className="text-white text-2xl">Post Rekomendasi Bagi Anda</p>
        <PostCard postID={samplePostId ? samplePostId : ""} newtab />
      </section>}

    </motion.div>
  )
}


const navItems = [
  { label: "Langkah-Langkah", value: "steps" },
  { label: "Contoh Abstrak", value: "abstract" },
  { label: "Alat Bantu", value: "tools" }
];


const majors = [
  "Administrasi Bisnis", "Administrasi Publik", "Akuntansi", "Antropologi", "Arsitektur", "Astronomi", "Biologi",
  "Desain Grafis", "Desain Interior", "Ekonomi", "Farmasi", "Filsafat", "Fisika", "Geografi", "Geologi",
  "Hubungan Internasional", "Ilmu Kelautan", "Ilmu Komputer", "Ilmu Komunikasi", "Ilmu Politik", "Jurnalistik",
  "Keagamaan", "Kedokteran", "Kedokteran Gigi", "Kedokteran Hewan", "Kehutanan", "Keperawatan",
  "Kesehatan Masyarakat", "Kimia", "Manajemen", "Manajemen Perhotelan", "Matematika", "Musik", "Pariwisata",
  "Pemasaran", "Pendidikan", "Perikanan", "Pertanian", "Psikologi", "Sastra Cina", "Sastra Indonesia",
  "Sastra Inggris", "Sastra Jepang", "Sejarah", "Seni Kuliner", "Seni Visual", "Sosiologi", "Statistika",
  "Studi Film", "Teknik Elektro", "Teknik Industri", "Teknik Informatika", "Teknik Kimia", "Teknik Lingkungan",
  "Teknik Mesin", "Teknik Sipil", "Flora dan Fauna"
]