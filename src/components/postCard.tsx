/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import Image from "next/image";
import { Star } from "lucide-react";
import Loadingimage from "../../public/loadingimage.gif"
import ShareButton from "./shareButton";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import Spinner from "./ui/spinner";

interface posttype {
    id: string;
    creatorID: string;
    createdAt: Date;
    title: string;
    description: string;
    authors: string;
    year: number;
    originlink: string;
    imageURL: string;
    status: string;
    favcount: number;
    rejection: string;
    university: string;
}

export default function PostCard({ postID }: { postID: string }) {
    const [loaded, setLoaded] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)
    const [postData, setPostData] = useState<posttype | null | undefined>();
    const [saved, setSaved] = useState<boolean | undefined>(false)
    const [borderColor, setBorderColor] = useState<string>("vision")
    const router = useRouter()
    const { isSignedIn } = useUser()



    useEffect(() => {
        getpostfromid.mutate(postID)
        refreshCheck.mutate()
    }, [postID])

    const getpostfromid = trpc.db.callpostfromid.useMutation({
        onSuccess: (result) => {
            setPostData(result)
            setLoaded(true)
            if (result?.status == "PENDING") setBorderColor("yellow-600")
            else if (result?.status == "REJECTED") setBorderColor("red-500")
        }
    })

    const refreshCheck = trpc.db.checksave.useMutation({
        onSuccess: (result) => {
            setSaved(result?.includes(postID))
            setSaveLoad(false)
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

    function toggleSave(e: React.MouseEvent, save?: boolean) {
        e.stopPropagation()
        setSaveLoad(true)
        if (save) savepost.mutate(postID)
        else unsavepost.mutate(postID)
    }

    const cardimage = loaded ?
        <Image src={postData?.imageURL ? postData?.imageURL : "https://utfs.io/f/a18934b5-b279-40cf-a84e-4813b44a72ac_placeholder.png"}
            alt="Loading"
            placeholder="blur"
            blurDataURL={Loadingimage.src}
            layout="fill" objectFit="contain"
            style={{ borderRadius: "8%", borderColor: "brown", objectFit: "contain" }}
        />
        : <Skeleton className="w-full h-full" />

    //bug: savelist not showing on pageload



    const cardtitle = loaded ? postData?.title : <div className="w-full h-full" />
    const cardauthors = loaded ? postData?.authors : <Skeleton className="w-full h-[85%] mt-2" />
    const cardyear = loaded ? postData?.year : <Skeleton className="w-full h-full" />
    const carduni = loaded ? postData?.university : <Skeleton className="w-full h-full" />
    const cardshare = loaded && <ShareButton link="google.com" />
    const cardfav =
        !isSignedIn || postData?.status != "ACCEPTED" ? <div></div> :
            (!loaded || saveLoad) ? <Spinner /> :
                saved ? <Star onClick={e => toggleSave(e, false)} fill="yellow" /> :
                    <Star onClick={e => toggleSave(e, true)} />;




    return (
        <Card className=" w-[300px] h-[350px] snap-end border-4 text-left border-vision cursor-pointer hover:border-yellow-600" onClick={async () => { postData?.id && await router.push(`nest/${postData?.id}`, undefined, { scroll: false }) }} >
            <CardContent className="h-full py-2">
                <div className="flex flex-col h-full justify-between gap-2">
                    <div>
                        <div id="cardimage" className=" place-content-center w-full max-h-[150px] mb-4 aspect-square overflow-hidden relative">{cardimage}</div>
                        <div id="cardtitle" className={`text-white bg-${borderColor} col-span-5 row-span-2 overflow-ellipsis overflow-hidden font-bold text-md w-[295px] h-[75px] line-clamp-3 px-2`}>{cardtitle}</div>
                        <div className="flex gap-3">
                            <div id="cardauthors" className="pl-2 pt-1 col-span-3 row-span-2 overflow-ellipsis text-gray-700 h-[50px] basis-4/5 overflow-hidden line-clamp-2">{cardauthors}</div>
                            <div id="cardyear" className="w-full h-full basis-1/5 place-self-center">{cardyear}</div>
                        </div>
                    </div>
                    <div className="px-2 flex justify-between place-items-center border-t-2 border-black h-[25px]">
                        <div id="univ" className="text-sm align-self-start overflow-hidden overflow-ellipsis line-clamp-1 w-[200px] relative top-1">{carduni}</div>
                        <div id="share" className=" scale-95 mr-5 relative top-1">{cardshare}</div>
                        <div id="cardfav" className="col-start-5 row-start-10 text-green-700 relative top-1 hover:text-green-400 cursor-pointer">{cardfav}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


//TODO: setup sharebutton link after launch with domain name, fix favorites