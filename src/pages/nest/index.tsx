/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useReducer } from "react";
import Link from "next/link"
import { Globe2, Star, Bird, Upload, Eye } from "lucide-react"

import { ScrollArea } from "~/components/ui/scroll-area";
import PostCard from "~/components/postCard";
import { trpc } from "~/utils/api";
import { useUser } from "@clerk/nextjs";


type State = {
    active: string[] | undefined;
};

type Action =
    | { type: 'SET_ACTIVE', payload: string[] | undefined };

const initialState: State = {
    active: undefined,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_ACTIVE':
            return { ...state, active: action.payload };
        default:
            throw new Error();
    }
}


export default function Nest() {
    const { isSignedIn } = useUser()
    const [tab, setTab] = useState<'ALL' | 'FAVORITE' | 'YOUR'>('ALL');
    const { data: allCards, isFetched: allFetched, isLoading: allLoading } = trpc.db.callpostid.useQuery({ many: 20 })
    const { mutate: callfav, isLoading: favLoading } = trpc.db.callfavpostid.useMutation({
        onSuccess: (result) => { if (tab === "FAVORITE") dispatch({ type: 'SET_ACTIVE', payload: result }) }
    })

    const { data: yourCards, } = trpc.db.callyourpostid.useQuery()

    const [state, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {
        if (tab === "ALL") {
            dispatch({ type: 'SET_ACTIVE', payload: allCards })
        }
        if (tab === "FAVORITE") {
            callfav();
        }
        if (tab === "YOUR") {
            dispatch({ type: 'SET_ACTIVE', payload: yourCards })
        }
    }, [tab]);

    useEffect(() => {
        if (allFetched) dispatch({ type: 'SET_ACTIVE', payload: allCards });
    }, [allFetched])

    const CardsArea = state.active?.map((content, index) => (
        <div className=" place-self-center" key={index}><PostCard postID={content} /></div>
    ))


    function TabStyle(currentTab: 'ALL' | 'FAVORITE' | 'YOUR') {
        return {
            backgroundColor: tab !== currentTab ? 'black' : "#7D5643"
        };
    };


    return (

        <section className="flex">
            <nav id="sidebar" className=" w-[50px] md:w-[200px] min-h-[400px] pt-5 md:pt-0  overflow-hidden  h-[calc(100lvh-80px)] text-white  bg-black grid grid-cols-1 grid-rows-20 z-10 gap-[2px]" >
                <div id="nest" className="row-span-3 hidden md:flex h-full w-full border-b-2 border-black bg-contain bg-center bg-opacity-70 md:bg-cover bg-no-repeat justify-center items-center font-boltext-black text-5xl" ><p className="hidden md:flex">NEST</p></div>
                <nav id="All" className="cursor-pointer gap-2  md:pt-0  md:pl-5 row-span-2 h-full w-full rounded-md hover:outline  hover:outline-vision flex place-items-center justify-center md:justify-start text-lg" style={TabStyle('ALL')} onClick={() => { setTab("ALL") }}><Globe2 /><span className="hidden md:flex">All Posts</span></nav>
                <nav id="Fav" className={`${!isSignedIn && "hidden"} cursor-pointer gap-2  md:pl-5 row-span-2 h-full w-full rounded-md hover:outline hover:outline-2 hover:outline-vision place-items-center justify-center md:justify-start flex text-lg`} style={TabStyle('FAVORITE')} onClick={() => { setTab("FAVORITE") }}><Star /><span className="hidden md:flex  ">Favorite</span></nav>
                <nav id="You" className={`${!isSignedIn && "hidden"} cursor-pointer gap-2  md:pl-5 row-span-2 h-full w-full rounded-md hover:outline hover:outline-2 hover:outline-vision place-items-center justify-center md:justify-start flex text-lg`} style={TabStyle('YOUR')} onClick={() => { setTab("YOUR") }}><Bird /><span className="hidden md:flex ">Your Posts</span></nav>

                <nav id="submit" className="hover:underline row-start-17 h-full w-full flex justify-center md:justify-end md:pr-5 border-t-2 pt-2 border-black"><Link href="submit" className="flex gap-2"><span className="hidden md:flex">Upload Post</span><Upload /></Link></nav>
                <nav id="vision" className="hover:underline row-start-18 h-full w-full flex justify-center md:justify-end md:pr-5"><Link href="vision" className="flex gap-2 pt-2"><span className="hidden md:flex">The Vision AI</span><Eye /></Link></nav>
            </nav>

            <nav id="postcontainer" className="min-h-[400px] md:px-4 h-[calc(100lvh-80px)] w-[calc(100vw-50px)] md:w-[calc(100vw-300px)]border border-black">
                <header className="relative top-0 w-[95%] h-[70px] flex flex-row justify-between place-items-center">
                    <p className="text-xl place-self-center font-bold pl-3">{tab} POSTS</p>
                    {(!allLoading && !favLoading) &&
                        <div id="found" className={`place-items-center gap-5 flex text-slate-500`} >
                            {!state.active ? "0" : state.active.length}  Result(s) Found
                        </div>
                    }
                </header>
                <ScrollArea className="h-[calc(100vh-150px)] w-full">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 pb-10">
                        {(!allFetched || favLoading) ? <div className="pt-10 pl-10">LOADING...</div> : CardsArea}

                    </div>
                    <hr className="text-center outline-dashed outline-2 outline-slate-600 relative bottom-3"></hr>
                </ScrollArea>

            </nav>


            <div className="bg-yellow-600"></div>


        </section>
    )

}

//HELLO