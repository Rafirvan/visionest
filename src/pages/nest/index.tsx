/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import Link from "next/link"
import { Globe2, Star, Bird, Upload, Eye } from "lucide-react"
import Onest from "../../../public/Onest.png"
import { ScrollArea } from "~/components/ui/scroll-area";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import PostCard from "~/components/postCard";
import { trpc } from "~/utils/api";
import { useUser } from "@clerk/nextjs";


export default function Page() {
    const { isSignedIn } = useUser()
    const [tab, setTab] = useState<'ALL' | 'FAVORITE' | 'YOUR'>('ALL');
    const allCards = trpc.db.callpostid.useQuery({ many: 20 }).data
    const favCardsCall = trpc.db.callfavpostid.useMutation({
        onSuccess: (result) => { setActive(undefined), setTimeout(() => { setActive(result) }, 1); }
    })
    const yourCardsCall = trpc.db.callyourpostid.useMutation({
        onSuccess: (result) => { setActive(undefined), setTimeout(() => { setActive(result) }, 1); }
    })

    const [active, setActive] = useState<string[] | undefined>()



    useEffect(() => {
        if (tab == "ALL") { setActive(undefined); setTimeout(() => setActive(allCards), 1) }
        if (tab == "FAVORITE") { favCardsCall.mutate() }
        if (tab == "YOUR") { yourCardsCall.mutate() }
    }, [tab])


    useEffect(() => {
        setActive(allCards)
    }, [allCards])




    const CardsArea = active?.map((content, index) => (
        <div className="mb-5 place-self-center" key={index}><PostCard postID={content} /></div>
    ))


    function TabStyle(currentTab: 'ALL' | 'FAVORITE' | 'YOUR') {
        return {
            backgroundColor: tab === currentTab ? 'lightblue' : 'white',
        };
    };


    return (
        <>
            <nav id="postcontainer" className="pl-9 md:rounded-tr-3xl h-[calc(100vh-80px)] w-[calc(100vw-50px)] md:w-[calc(100vw-300px)] absolute right-0 top-[80px] border-2 border-black">
                <header className="relative top-0 w-[95%] h-[70px] flex flex-row justify-between place-items-center">
                    <p className="text-xl place-self-center font-bold">{tab} POSTS</p>
                    <div id="search" className={`place-items-center gap-5 flex ${Boolean(tab !== "ALL") && "hidden"}`} >
                        <Label htmlFor="searchbar" className="text-lg w-[100px]" >Search : </Label>
                        <Input></Input>
                    </div>
                </header>
                <ScrollArea className="h-[calc(100%-80px)] w-full ">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {CardsArea}
                    </div>
                </ScrollArea>

            </nav>

            <nav id="sidebar" className=" w-[50px] md:rounded-tr-3xl overflow-hidden md:w-[300px] absolute left-0 top-[80px]  box-border h-[calc(100dvh-80px)]  bg-white border-2 border-red-700 grid grid-cols-1 grid-rows-20 z-10 gap-2" >
                <div id="nest" className="row-span-3 h-full w-full border-b-2 border-black bg-contain bg-center bg-opacity-70 md:bg-cover bg-no-repeat flex justify-center items-center font-bold text-transparent md:text-black text-5xl" style={{ backgroundImage: `url(${Onest.src})`, }} >The Nest</div>
                <nav id="All" className="cursor-pointer gap-2  md:pl-5 row-span-2 h-full w-full rounded-md hover:outline  hover:outline-slate-950 flex place-items-center justify-center md:justify-start text-lg" style={TabStyle('ALL')} onClick={() => { setTab("ALL") }}><Globe2 /><span className="hidden md:flex">All Posts</span></nav>
                <nav id="Fav" className={`${!isSignedIn && "hidden"} cursor-pointer gap-2  md:pl-5 row-span-2 h-full w-full rounded-md hover:outline hover:outline-2 hover:outline-slate-950 place-items-center justify-center md:justify-start flex text-lg`} style={TabStyle('FAVORITE')} onClick={() => { setTab("FAVORITE") }}><Star /><span className="hidden md:flex  ">Favorite Posts</span></nav>
                <nav id="You" className={`${!isSignedIn && "hidden"} cursor-pointer gap-2  md:pl-5 row-span-2 h-full w-full rounded-md hover:outline hover:outline-2 hover:outline-slate-950 place-items-center justify-center md:justify-start flex text-lg`} style={TabStyle('YOUR')} onClick={() => { setTab("YOUR") }}><Bird /><span className="hidden md:flex ">Your Posts</span></nav>
                <nav id="submit" className="hover:underline row-start-18 h-full w-full flex justify-center md:justify-end md:pr-5 border-t-2 pt-2 border-black"><Link href="submit" className="flex gap-2"><span className="hidden md:flex">Submit your own now!</span><Upload /></Link></nav>
                <nav id="vision" className="hover:underline row-start-19 h-full w-full flex justify-center md:justify-end md:pr-5"><Link href="vision" className="flex gap-2 pt-2"><span className="hidden md:flex">The Vision AI</span><Eye /></Link></nav>
            </nav>

            <div className="bg-yellow-600"></div>


        </>
    )

}
//TODO : Search, 