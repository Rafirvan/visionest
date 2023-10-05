/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback, useEffect, useState } from "react"
import Onestwhite from "../../public/Onestwhite.png"
import Image from 'next/image';
import { Button } from "~/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion";
import { ScrollArea } from "~/components/ui/scroll-area";
import { trpc } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { RightOut } from "~/components/transitions/pageVariants";
import { TypeAnimation } from "react-type-animation";
import VisionBG from "~/components/backgrounds/vision";




export default function Vision() {
  //Section 2
  const [triggerScroll, setTriggerScroll] = useState(false);
  const [showResult, setShowResult] = useState(false)
  const [descriptionDelay, setDescriptionDelay] = useState(true)


  //AI
  const [AILoading, setAILoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [retries, setRetries] = useState(2)

  //form
  const [majorValue, setMajorValue] = useState<string>('');
  const [fieldValue, setFieldValue] = useState<string>('');
  const [subjectValue, setSubjectValue] = useState<string>('');
  const [typeValue, setTypeValue] = useState<string>("Practical")
  const [timeValue, setTimeValue] = useState<string>("")
  const [constraintValue, setConstraintValue] = useState<string>("")

  //clerk
  const { isLoaded, isSignedIn } = useUser();



  const AIcall = trpc.completion.idea.useMutation({
    onSuccess: (data) => {
      if (data) {
        console.log(data)
        const matches = data.match(/=(.+)/g);
        const matches2 = data.match(/:(.+)/g);
        let matchArray, matchArray2;
        if (matches) {
          matchArray = matches.map(match => match.slice(1).trim());  // slice(1) removes the '=' from the start of each match
        }

        if (matches2) {
          matchArray2 = matches2.map(match => match.slice(1).trim());  // slice(1) removes the '=' from the start of each match
        }

        if (matchArray) {
          if (matchArray[0]) setTitle(matchArray[0]);
          if (matchArray[1]) setDescription(matchArray[1]);
          console.log("match")
        }
        else if (matchArray2) {
          if (matchArray2[0]) setTitle(matchArray2[0]);
          if (matchArray2[1]) setDescription(matchArray2[1]);
          console.log("match")
        }

        else { setRetries(prev => prev - 1); handleSubmit() }
      }
      setAILoading(false)
    }
  });


  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) { e.preventDefault(); setRetries(2)};
    if (!retries) { setTitle("Nilai tidak ditemukan, mohon coba lagi"); return }
    setAILoading(true)
    setDescriptionDelay(true)
    setTitle("")
    setDescription("")
    if (!showResult) { setShowResult(true); }
    setTriggerScroll(prev => !prev);
    document.getElementById("Section2")?.scrollIntoView({ behavior: "smooth" })

    const inputs = {
      major: majorValue,
      type: typeValue,
      subject: subjectValue,
      field: fieldValue,
      time: timeValue,
      constraint: constraintValue
    }

    AIcall.mutate(inputs);

  }, [AIcall, constraintValue, fieldValue, majorValue, showResult, subjectValue, timeValue, typeValue]);

  useEffect(() => {
    if (showResult) {
      document.getElementById("Section2")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showResult, triggerScroll]);

  useEffect(() => {
    if (description) {
      const timer = setTimeout(() => {
        setDescriptionDelay(false);
      }, 1000);  

      return () => clearTimeout(timer); 
    }
  }, [description]);


  const showTitle = <TypeAnimation sequence={[title]} speed={90}></TypeAnimation>
  const showDescription = <TypeAnimation sequence={[description]} speed={90}></TypeAnimation>


  return (
    <motion.div
      animate="enter"
      exit="exit"
      variants={RightOut}>
      <section id="Section1" className="px-4 h-[100vh] w-full flex flex-col justify-between place-items-center bg-[100vw] md:flex-row gap-7 overflow-y-hidden ">
        <div id='Text' className='basis-2/5 h-full w-full flex flex-col place-content-center bg-green-700 text-white text-center '>
          <h1 className='font-bold text-7xl mb-2'>The <div>Visi<span><Image src={Onestwhite} alt="o" className="inline w-[40px] aspect-square" /></span>n</div></h1>
          <p>Powered by OpenAI&trade;</p>
        </div>

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

                <Accordion type="single" id="optionalinput" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-red-700">Input Opsional</AccordionTrigger>
                    <AccordionContent>
                      <div id="timeinput">
                        <label htmlFor="time" className="block text-sm font-medium mb-2">
                          Berapa Lama Waktu Pengerjaan Projek
                        </label>
                        <input
                          id="time"
                          value={timeValue}
                          onChange={(e) => setTimeValue(e.target.value)}
                          className="ml-5 mb-3 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        ></input>
                      </div> <div id="constraintinput">
                        <label htmlFor="constraint" className="block text-sm font-medium mb-2">
                          Apa yang anda tidak inginkan untuk projek ini?
                        </label>
                        <input
                          id="constraint"
                          value={constraintValue}
                          onChange={(e) => setConstraintValue(e.target.value)}
                          className="ml-5 mb-3 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        ></input>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

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
      {showResult && <section id="Section2" className="relative py-10 min-h-[100vh] w-full  flex flex-col justify-center text-center">
        <VisionBG/>
        <p className="text-3xl md:text-5xl lg:text-7xl text-white mb-8">{title == "" ? "Loading..." : showTitle}</p>
        <p className=" text-2xl md:text-4xl lg:text-5xl text-gray-400 ">{description && !descriptionDelay && showDescription}</p>
      </section>}

    </motion.div>
  )
}


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