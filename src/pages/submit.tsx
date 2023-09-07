"use client"

/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react"
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Image from "next/image";
import Onestwhite from "../../public/Onestwhite.png"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"





export default function Submit() {

    const { isLoaded, isSignedIn } = useUser();

    return (
        <React.Fragment>
            <section id="Section1" className="h-[100vh] w-full flex flex-col justify-between place-items-center bg-[100vw] md:flex-row gap-7 overflow-y-hidden">
                <div id='Text' className='basis-2/5 h-full w-full flex flex-col place-content-center bg-blue-600 text-white text-center px-4'>
                    <h1 className='font-bold text-7xl mb-2'>Submit a <div>P<span><Image src={Onestwhite} alt="o" className="inline w-[40px] aspect-square" /></span>st</div></h1>
                </div>

                <div className="basis-3/5 h-full w-full flex place-content-center">

                    {(isLoaded && isSignedIn) ?
                        <PostForm />
                        : <p className="place-self-center font-bold text-2xl md:text-4xl text-center">Login Required to Access This Feature</p>}
                </div>
            </section>
        </React.Fragment>
    )
}

function PostForm() {
    const [titleValue, setTitleValue] = useState('');
    const [authorValue, setAuthorValue] = useState('');
    const [creationYearValue, setCreationYearValue] = useState(2000);
    const [descriptionValue, setDescriptionValue] = useState("")
    const [abstractValue, setAbstractValue] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [paperLinkValue, setPaperLinkValue] = useState("");
    const [imageURLValue, setImageURLValue] = useState("");
    const router = useRouter()


    const AIcall = api.completion.content.useMutation({
        onSuccess: (result) => {
            if (result) {
                setDescriptionValue(result)
                setAiLoading(false)
            }
        }
    });

    const DBpush = api.db.submit.useMutation({
        onSuccess: () => {
            alert("Submission succesful! Reloading page...")
            // const timeout = setTimeout(() => { router.reload() }, 2000)
            router.reload()
        }
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("submit")

        const inputs = {
            title: titleValue,
            authors: authorValue,
            year: creationYearValue,
            description: descriptionValue,
            link: paperLinkValue,
            imageurl: imageURLValue
        }

        DBpush.mutate(inputs)

    };

    function generateDescription() {
        if (abstractValue.length < 500 || abstractValue.length > 3000)
            alert("you need an input with minimum of 500 characters and maximum of 3000 characters")

        else {
            setDescriptionValue("AI is generating output... this may take some time")
            setAiLoading(true)
            AIcall.mutate(abstractValue)
        }

    }


    return (
        <ScrollArea className="h-full w-full">
            <form onSubmit={handleSubmit} className="w-[90%] h-full flex flex-col justify-center">

                <div id="titleinput">
                    <label htmlFor="title" className="block text-sm font-medium  mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        className="ml-5 mb-5 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    />
                </div>

                <div id="authorinput">
                    <label htmlFor="author" className="block text-sm font-medium mb-2">
                        Author(s) <span className="text-slate-500">separate names with commas(,)</span>
                    </label>
                    <input
                        id="author"
                        type="text"
                        value={authorValue}
                        onChange={(e) => setAuthorValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    ></input>
                </div>

                <div id="paperlinkinput">
                    <label htmlFor="paperlink" className="block text-sm font-medium mb-2">
                        Link to proof of publication <span className="text-slate-500">either restricted or full scientific literature access</span>
                    </label>
                    <input
                        id="paperlink"
                        type="text"
                        value={paperLinkValue}
                        onChange={(e) => setPaperLinkValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    ></input>
                </div>

                <div id="imageurlinput">
                    <label htmlFor="imageurl" className="block text-sm font-medium mb-2">
                        (placeholder) imageURL
                    </label>
                    <input
                        id="imageurl"
                        type="text"
                        value={imageURLValue}
                        onChange={(e) => setImageURLValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    ></input>
                </div>

                <div id="yearinput">
                    <label htmlFor="year" className="block text-sm font-medium mb-2">
                        Year created
                    </label>
                    <input
                        id="year"
                        type="number"
                        value={creationYearValue}
                        onChange={(e) => setCreationYearValue(Number(e.target.value))}
                        className="ml-5 mb-3 flex w-50px rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        placeholder="1970"
                        min={1970}
                        max={2024}
                        required
                    ></input>
                </div>

                <div id="descriptioninput">
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Description <span>


                            <Dialog>
                                <DialogTrigger disabled={aiLoading} className="disabled:hidden">
                                    <p className="text-blue-700 hover:underline">{`Try generating your post's description using AI!`}</p>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{`Insert your paper's abstract`}</DialogTitle>
                                        <DialogDescription>
                                            <textarea
                                                id="abstract"
                                                value={abstractValue}
                                                onChange={(e) => setAbstractValue(e.target.value)}
                                                className=" my-2 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                                placeholder="minimum of 500 characters, maximum of 3000 characters"
                                                rows={15}
                                            />
                                            <DialogTrigger asChild>
                                                <Button onClick={generateDescription}>Generate</Button>
                                            </DialogTrigger>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>


                        </span>
                    </label>
                    <textarea
                        disabled={aiLoading}
                        id="description"
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        rows={15}
                        required
                    ></textarea>
                </div>

                <Button
                    type="submit"
                    className="bg-green-500 mb-10 disabled:bg-gray-600 w-[105%]"
                >
                    Post
                </Button>
            </form>
            <div id="errorDiv" className="h-[180px] flex w-full md:hidden"></div>
        </ScrollArea>
    );
}


//TODO: LEARN PRISMA, COMPLETE POSTING, CLOUDINARY UPLOAD
