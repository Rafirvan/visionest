/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import Image from "next/image";
import { Star } from "lucide-react";
import ShareButton from "./shareButton";
import { useUser } from "@clerk/nextjs";
import Spinner from "./ui/spinner";
import { Bird } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "~/components/ui/hover-card"
import Link from "next/link";
import getRandomHexColor from "~/utils/getRandomHexColor";

interface posttype {
    id: string;
    creatorID: string;
    title: string;
    description: string;
    authors: string;
    year: number;
    originlink: string;
    imageURL: string;
    status: string;
    rejection: string;
    university: string;
}

interface cardType {
    postID: string,
    setmodal?: React.Dispatch<React.SetStateAction<string | undefined>>
    newtab?:boolean
}

export default function PostCard({ postID, setmodal, newtab=false }: cardType) {
    const [loaded, setLoaded] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)
    const [idMatch, setIdMatch] = useState(false)
    const [postData, setPostData] = useState<posttype | null | undefined>();
    const [saved, setSaved] = useState<boolean | undefined>(false)
    const [favCount, setFavCount] = useState<number | undefined>()
    const [imageLoaded, setImageLoaded] = useState(false)
    const [borderColor, setBorderColor] = useState<string>("vision")
    const { user } = useUser()




    useEffect(() => {
        if (!postID) return
        getpostfromid.mutate(postID)
        getFavCount.mutate(postID)
    }, [postID])

    useEffect(() => { if (user) refreshCheck.mutate() }, [user])

    const getpostfromid = trpc.db.callpostfromid.useMutation({
        onSuccess: (res) => {
            const result = res.postwithid
            setPostData(result)
            setLoaded(true)
            if (result?.creatorID == user?.id) setIdMatch(true)
            if (result?.status == "PENDING") setBorderColor("yellow-600")
            else if (result?.status == "REJECTED") setBorderColor("red-500")
            else setBorderColor("vision")
        }
    })

    const getFavCount = trpc.db.favcount.useMutation({
        onSuccess: (result) => {
            setFavCount(result); setSaveLoad(false)
        }
    })

    const refreshCheck = trpc.db.checksave.useMutation({
        onSuccess: (result) => {
            setSaved(result?.includes(postID))
            getFavCount.mutate(postID)
        }
    })


    const savepost = trpc.db.savepost.useMutation({
        onSuccess: () => {
                refreshCheck.mutate()
        }
    })

    const unsavepost = trpc.db.unsavepost.useMutation({
        onSuccess: () => {
                refreshCheck.mutate()
        }
    })

    const toggleSave = useCallback((e: React.MouseEvent, save?: boolean) => {
        e.preventDefault()
        e.stopPropagation()
        setSaveLoad(true)
        if (save) savepost.mutate(postID)
        else unsavepost.mutate(postID)
    }, [savepost, unsavepost, setSaveLoad])

    const handleNonUser=(e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        alert("Fitur favorit posting hanya tersedia bagi pengguna yang telah login")
    }

    const cardimage = loaded ?
        <div style={{backgroundColor:getRandomHexColor()}}>

        <Image src={postData?.imageURL ? postData?.imageURL : "https://utfs.io/f/a18934b5-b279-40cf-a84e-4813b44a72ac_placeholder.png"}
            alt="Loading"
            placeholder="empty"
            height={300}
            width={300}
            onLoad={()=>setImageLoaded(true)}
            className={`${imageLoaded? "opacity-100":"opacity-0"}`}
            />
        </div>
        : <Skeleton className="w-full h-full" />



    const cardtitle = loaded ? postData?.title : <div></div>
    const cardauthors = loaded ? postData?.authors : <Skeleton className="w-full h-[85%] mt-1" />
    const cardyear = loaded ? postData?.year : <Skeleton className="w-full h-full" />
    const carduni = loaded ? postData?.university : <Skeleton className="w-full h-full" />

    //CHANGE
    const cardshare = loaded && <ShareButton link={postData ? `https://visionest.xyz/nest/${postData.id}` : ""} />
    const cardfav =
         postData?.status != "ACCEPTED" ? <div></div> :
            (!loaded || saveLoad) ? <Spinner /> :
                saved ? <Star onClick={e => toggleSave(e, false)} fill="yellow" /> :
                    <Star onClick={e => { if (user) toggleSave(e, true); else (handleNonUser(e)) }} />;

    const mainContent =
        <Card className="origin-left w-[300px] h-[350px] scale-x-90 xs:scale-x-100 snap-end border-4 text-left border-vision cursor-pointer hover:border-yellow-600" >
        <CardContent className="h-full pb-10 relative">


            {/* birdicon if creator */}
            {idMatch &&
                <HoverCard>
                    <HoverCardTrigger asChild><div id="bird" className="absolute top-[-4px] left-[-4px] bg-vision w-10 h-10 z-10 rounded-md flex place-items-center justify-center"><Bird /></div></HoverCardTrigger>
                    <HoverCardContent className="absolute z-20">
                        Anda Pembuat Post Ini
                    </HoverCardContent>
                </HoverCard>
            }



            <div className="flex flex-col h-full justify-between gap-2">
                <div>

                    <div id="cardimage" className=" place-content-center w-[294px] h-[180px] aspect-square overflow-hidden  relative">{cardimage}</div>

                    <div id="cardtitle" className={`text-white bg-${borderColor} col-span-5 row-span-2 overflow-ellipsis overflow-hidden font-bold text-md w-[295px] h-[75px] line-clamp-3 px-2`}>{cardtitle}</div>
                    <div className="flex gap-3 ">
                        <div id="cardauthors" className="pl-2 pt-1 col-span-3 row-span-2 overflow-ellipsis text-gray-700 h-[50px] basis-4/5 overflow-hidden line-clamp-2">{cardauthors}</div>
                        <div id="cardyear" className="w-full h-full basis-1/5 place-self-center flex justify-center">{cardyear}</div>
                    </div>
                </div>
                    <div id="cardfooter" className="px-2 flex justify-between place-items-center border-t-2 border-black h-[25px] relative bottom-1">
                        <div id="share" className=" scale-95 mr-5 relative top-1">{cardshare}</div>
                    <div id="univ" className="text-sm align-self-start overflow-hidden overflow-ellipsis line-clamp-1 w-[200px] relative top-1 h-full">{carduni}</div>
                    
                        {(favCount != undefined || !user) ? postData?.status == "ACCEPTED" && 
                        <><div id="cardfavcount" className="relative top-1 pr-1 w-3">{favCount}</div>
                            <div id="cardfav" className=" text-green-700 relative top-1 hover:text-green-400 cursor-pointer">{cardfav}</div></> : <Skeleton className="w-9 h-full relative top-[15%] "></Skeleton>}
                </div>
            </div>
        </CardContent>
    </Card>

    
    if (!loaded || !postData) return (
        // full card with skeletons
        <>{mainContent}</>
    )
    
    return (
        <Link
            href={(postData && loaded) ? `nest/${postData.id}` : "/"}
            scroll={false}
            rel={newtab ? "noreferrer noopener" : ""}
            target={newtab? "_blank": ""}
        >
            <div
                onClick={(e) => {
                    if (setmodal) {
                        e.preventDefault(); // Prevent default navigation
                        setmodal(postData?.id);
                    }
                }}
            >
                {mainContent}
            </div>
        </Link>
    );
}



//TODO: setup sharebutton link after launch with domain name, fix favorites