import React, { useState, useEffect } from "react"
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { trpc } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Image from "next/image";
import Onestwhite from "../../public/Onestwhite.png"
import Loadingimage from "../../public/loadingimage.gif"
import AImodal from "~/components/aigen";
import TextEditor from "~/components/texteditor";
import { UploadButton } from "~/utils/uploadthing";
import { motion } from "framer-motion";
import { LeftInRightOut } from "~/components/transitions/pageVariants";





export default function Submit() {

    const { isLoaded, isSignedIn } = useUser();

    // returns blank div if clerk is not loaded
    if (!isLoaded) return <div></div>

    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={LeftInRightOut}>
            <section id="Section1" className="h-[100vh] w-full flex flex-col justify-between place-items-center bg-[100vw] lg:flex-row gap-x-7 overflow-y-hidden">
                <div id='Text' className='basis-2/5 h-full w-full flex flex-col place-content-center bg-blue-600 text-white text-center px-4'>
                    <h1 className='font-bold text-7xl mb-2'>Submit a <div>P<span><Image src={Onestwhite} alt="o" className="inline w-[40px] aspect-square" /></span>st</div></h1>
                    <p>Masukkan Penjelasan Mengenai Karya Ilmiah Anda</p>
                </div>

                <div className="basis-3/5 h-full w-full flex place-content-center">

                    {(isLoaded && isSignedIn) ?
                        <PostForm />
                        : <p className="place-self-center font-bold text-2xl md:text-4xl text-center">Login Untuk Mengakses Fitur</p>}
                </div>
            </section>
            </motion.div>
    )
}

function PostForm() {
    const [titleValue, setTitleValue] = useState('');
    const [authorValue, setAuthorValue] = useState('');
    const [creationYearValue, setCreationYearValue] = useState(2000);
    const [universityValue, setUniversityValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState("")
    const [paperLinkValue, setPaperLinkValue] = useState("");
    const [imageURLValue, setImageURLValue] = useState<string | undefined>("");
    const [buttonOn, setButtonOn] = useState(true);
    const router = useRouter()

    const filledInput = Boolean(titleValue || authorValue || descriptionValue || paperLinkValue || universityValue || imageURLValue)

    //prevent closing if input is filled
    useEffect(() => {
        // for closing tab
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (filledInput) {
                e.preventDefault();
                e.returnValue = 'Anda memiliki input yang tidak tersimpan, apakah yakin ingin meninggalkan halaman?';
            }
        };
        // for changing route
        const handleRouteChange = () => {
            if ((filledInput) && !window.confirm('Anda memiliki input yang tidak tersimpan, apakah yakin ingin meninggalkan halaman?')) {
                router.events.emit('routeChangeError');
                throw 'Route change aborted.';
            }
        }
        router.events.on('routeChangeStart', handleRouteChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [authorValue, descriptionValue, filledInput, imageURLValue, paperLinkValue, router, titleValue, universityValue]);



    //push to db API in server/api/routers/Dbcall
    const DBpush = trpc.db.submit.useMutation({
        onSuccess: () => {
            alert("Berhasil Upload, post anda sekarang PENDING")
            setTitleValue("")
            setAuthorValue("")
            setCreationYearValue(2000)
            setDescriptionValue('')
            setImageURLValue('')
            setUniversityValue("")
            setPaperLinkValue("")
            setButtonOn(true)
        }
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("submit")
        setButtonOn(false)

        const inputs = {
            title: titleValue,
            authors: authorValue,
            year: creationYearValue,
            description: descriptionValue,
            link: paperLinkValue,
            university: universityValue,
            imageurl: imageURLValue!

        }
        DBpush.mutate(inputs)
    };





    return (
        <ScrollArea className="pl-2 h-full w-full">
            <form onSubmit={handleSubmit} className="w-[90%] h-full flex flex-col justify-center">

                <div id="titleinput">
                    <label htmlFor="title" className="block text-sm font-medium  mb-2">
                        Judul
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        className="ml-5 mb-5 flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        maxLength={200}
                        required
                    />
                </div>

                <div id="authorinput">
                    <label htmlFor="author" className="block text-sm font-medium mb-2">
                        Penulis
                    </label>
                    <input
                        id="author"
                        type="text"
                        value={authorValue}
                        onChange={(e) => setAuthorValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    ></input>
                </div>

                <div id="universityinput">
                    <label htmlFor="universitylink" className="block text-sm font-medium mb-2">
                        Universitas / Institusi
                    </label>
                    <input
                        id="universitylink"
                        type="text"
                        value={universityValue}
                        onChange={(e) => setUniversityValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    ></input>
                </div>

                <div id="paperlinkinput">
                    <label htmlFor="paperlink" className="block text-sm font-medium mb-2">
                        Link menuju bukti publikasi <span className="text-slate-500">{`Misal link menuju perpustakaan digital / webiste publikasi. Selalu mulai dengan "https://"`}</span>
                    </label>
                    <input
                        id="paperlink"
                        type="url"
                        value={paperLinkValue}
                        onChange={(e) => setPaperLinkValue(e.target.value)}
                        className="ml-5 mb-3 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        required
                    ></input>
                </div>

                <div id="yearinput">
                    <label htmlFor="year" className="block text-sm font-medium mb-2">
                        Tahun Terbuat
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

                <div id="descriptioninput" >
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Deskripsi
                        <AImodal setDescriptionValue={setDescriptionValue} />
                    </label>
                    <div className="border rounded-xl border-slate-300 h-fit relative left-3">
                        <TextEditor

                            formData={descriptionValue}
                            setFormData={(input: string) => { setDescriptionValue(input) }} />
                    </div>
                </div>


                <div id="imageinput" className="my-5 ml-5 grid h-fit text-center">
                    <label>Upload Gambar (opsional)</label>
                    <UploadButton
                        onClientUploadComplete={(e) => { if (e) setImageURLValue(e[0]?.url) }}
                        appearance={{
                            button:
                                "ut-ready:bg-red-500 ut-uploading:cursor-not-allowed rounded-r-none bg-green-500 bg-none after:bg-orange-400",
                            container: "w-max flex-row place-self-center my-8 rounded-md border-cyan-300 bg-slate-800",
                            allowedContent:
                                "flex h-8 flex-col items-center justify-center px-2 text-white",
                        }}
                        endpoint="imageUploader"
                    />
                    <div id="imgpreview" className="overflow-hidden place-self-center outline-dashed outline-slate-700 aspect-square w-[70%] rounded-md relative">
                        {(imageURLValue) &&
                            <Image src={imageURLValue} alt={imageURLValue.toString()} placeholder="blur" blurDataURL={Loadingimage.src} fill={true} style={{ objectFit: "contain" }}></Image>
                        }
                    </div>

                </div>


                <Button
                    type="submit"
                    className="bg-green-500 mb-10 disabled:bg-gray-600 w-[105%] "
                    disabled={!buttonOn}
                >
                    Post
                </Button>
            </form>
            <div id="errorDiv" className="h-[180px] flex w-full lg:hidden"></div>
        </ScrollArea>
    );
}


