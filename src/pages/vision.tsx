/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react"
import Onestwhite from "../../public/Onestwhite.png"
import Image from 'next/image';
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";


interface formProps {
  onSubmit: () => void
  onSubmitStep2: (result: string, description: string) => void
  buttonDisabled: boolean
}

export default function Vision() {
  const [showResult, setShowResult] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)

  const { isLoaded, isSignedIn } = useUser();

  function handleSubmit() {
    if (!showResult) { setShowResult(true) }
    else {
      document.getElementById("Section2")?.scrollIntoView({ behavior: "smooth" })
      console.log("scroll")
    }
    setLoading(true)

  }
  useEffect(() => {
    document.getElementById("Section2")?.scrollIntoView({ behavior: "smooth" })
  }, [showResult])

  function handleSubmitValue(title: string, description: string) {
    setTitle(title)
    setDescription(description)
    setLoading(false)
  }


  return (
    <React.Fragment>
      <section id="Section1" className="px-4 h-[100vh] w-full flex flex-col justify-between place-items-center bg-[100vw] md:flex-row gap-7 overflow-y-hidden ">
        <div id='Text' className='basis-2/5 h-full w-full flex flex-col place-content-center bg-green-700 text-white text-center '>
          <h1 className='font-bold text-7xl mb-2'>The <div>Visi<span><Image src={Onestwhite} alt="o" className="inline w-[40px] aspect-square" /></span>n</div></h1>
          <p>Powered by OpenAI&trade;</p>
        </div>

        <div className="basis-3/5 h-full w-full flex place-content-center">

          {(isLoaded && isSignedIn) ?
            <NewForm onSubmit={handleSubmit} onSubmitStep2={handleSubmitValue} buttonDisabled={loading} />
            : <p className="place-self-center font-bold text-2xl md:text-4xl text-center">Login Required to Access This Feature</p>}
        </div>
      </section>
      {showResult && <section id="Section2" className="pt-10 min-h-[100vh] w-full full-bg-darkgreen flex flex-col justify-center text-center">
        <p className="text-[4vw] text-white mb-8">{title == "" ? "Loading..." : title}</p>
        <p className="text-[3vw] text-gray-400">{loading ? "" : description}</p>

      </section>}
    </React.Fragment>
  )
}

function NewForm({ onSubmit, onSubmitStep2 }: formProps) {
  const [majorValue, setMajorValue] = useState<string>('');
  const [fieldValue, setFieldValue] = useState<string>('');
  const [subjectValue, setSubjectValue] = useState<string>('');
  const [typeValue, setTypeValue] = useState<string>("Practical")
  const [timeValue, setTimeValue] = useState<string>("")
  const [constraintValue, setConstraintValue] = useState<string>("")
  const [resultTitle, setResultTitle] = useState<string | undefined>("")
  const [resultDescription, setResultDescription] = useState<string | undefined>("")



  const AIcall = api.completion.idea.useMutation({
    onSuccess: (data) => {
      if (data) {
        console.log(data)

        const matches = data.match(/=(.+)/g);
        let matchArray;
        if (matches) {
          matchArray = matches.map(match => match.slice(1).trim());  // slice(1) removes the '=' from the start of each match
        }

        if (matchArray) {
          setResultTitle(matchArray[0]);
          setResultDescription(matchArray[1]);
          console.log("match")
        }

      }
    }
  });


  useEffect(() => {
    if (typeof resultTitle == "string" && typeof resultDescription == "string") { onSubmitStep2(resultTitle, resultDescription) }
  }
    , [onSubmitStep2, resultDescription, resultTitle])



  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResultTitle("")
    setResultDescription("")
    console.log("submit")
    onSubmit()

    const inputs = {
      major: majorValue,
      type: typeValue,
      subject: subjectValue,
      field: fieldValue,
      time: timeValue,
      constraint: constraintValue
    }

    AIcall.mutate(inputs);

  };



  return (
    <ScrollArea className="h-full w-full">
      <form onSubmit={handleSubmit} className="w-[90%] h-full flex flex-col justify-center">

        <div id="majorselect">
          <label htmlFor="major" className="block text-sm font-medium mb-2">
            Select your major
          </label>
          <select
            id="major"
            value={majorValue}
            onChange={(e) => setMajorValue(e.target.value)}
            className="ml-5 mb-5 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            required
          >
            <option value="">Select an option</option>
            {majors.map(major => <option key={major} value={major}>{major}</option>)}
          </select>
        </div>

        <div id="typeradio" className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Preferred project type
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
            Practical
          </label>

          <label>
            <input
              type="radio"
              value="Theoretical"
              checked={typeValue === 'Theoretical'}
              onChange={e => setTypeValue(e.target.value)}
              className="scale-125 mr-1"
            />
            Theoretical
          </label>
        </div>

        <div id="fieldinput">
          <label htmlFor="field" className="block text-sm font-medium  mb-2">
            What field(related to your major) are you interested in?
          </label>
          <input
            id="field"
            type="text"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="ml-5 mb-5 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            required
          />
        </div>

        <div id="subjectinput">
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            What research subject(s) and technologies are you familiar with, write as many as you can separated by commas(,)
          </label>
          <input
            id="subject"
            value={subjectValue}
            onChange={(e) => setSubjectValue(e.target.value)}
            className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            required
          ></input>
        </div>

        <Accordion type="single" id="optionalinput" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-red-700">Optional Inputs</AccordionTrigger>
            <AccordionContent>
              <div id="timeinput">
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  How much time are you given?
                </label>
                <input
                  id="time"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                ></input>
              </div> <div id="constraintinput">
                <label htmlFor="constraint" className="block text-sm font-medium mb-2">
                  What do you NOT want in your project?
                </label>
                <input
                  id="constraint"
                  value={constraintValue}
                  onChange={(e) => setConstraintValue(e.target.value)}
                  className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                ></input>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="submit"
          className="bg-blue-700 mb-10 disabled:bg-gray-600 w-[105%]"
        >
          Generate recommended project ideas
        </Button>
      </form>
      <div id="errorDiv" className="h-[180px] flex w-full md:hidden"></div>
    </ScrollArea>
  );
}



const majors = [
  "Accounting",
  "Agriculture",
  "Architecture",
  "Biology",
  "Business Administration",
  "Chemical Engineering",
  "Civil Engineering",
  "Communication Studies",
  "Computer Science",
  "Dentistry",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Environmental Engineering",
  "Fisheries",
  "Forestry",
  "Geography",
  "Geology",
  "History",
  "Industrial Engineering",
  "Informatics Engineering",
  "International Relations",
  "Law",
  "Management",
  "Marine Science",
  "Mathematics",
  "Mechanical Engineering",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Philosophy",
  "Physics",
  "Political Science",
  "Psychology",
  "Public Administration",
  "Public Health",
  "Sociology",
  "Statistics",
  "Tourism",
  "Veterinary Medicine",
  "Visual Arts",
  "Zoology",
  "Islamic Studies",
  "Anthropology",
  "Astronomy",
  "Chemistry",
  "Chinese Literature",
  "Japanese Literature",
  "Indonesian Literature",
  "Dutch Literature",
  "English Literature",
  "Culinary Arts",
  "Fashion Design",
  "Film Studies",
  "Finance",
  "Graphic Design",
  "Hospitality Management",
  "Interior Design",
  "Journalism",
  "Marketing",
  "Music"
]