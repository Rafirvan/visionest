/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useCallback, useEffect, useState } from "react";
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
}

export default function PostCard({ postID, setmodal }: cardType) {
    const [loaded, setLoaded] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)
    const [postData, setPostData] = useState<posttype | null | undefined>();
    const [saved, setSaved] = useState<boolean | undefined>(false)
    const [favCount, setFavCount] = useState<number | undefined>()
    const [borderColor, setBorderColor] = useState<string>("vision")
    const router = useRouter()
    const { user, isSignedIn } = useUser()




    useEffect(() => {
        getpostfromid.mutate(postID)
    }, [postID])

    useEffect(() => { if (user) refreshCheck.mutate() }, [user])

    const getpostfromid = trpc.db.callpostfromid.useMutation({
        onSuccess: (res) => {
            const result = res.postwithid
            setPostData(result)
            setLoaded(true)
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
            if (isSignedIn)
                refreshCheck.mutate()
        }
    })

    const unsavepost = trpc.db.unsavepost.useMutation({
        onSuccess: () => {
            if (isSignedIn)
                refreshCheck.mutate()
        }
    })

    const toggleSave = useCallback((e: React.MouseEvent, save?: boolean) => {
        e.stopPropagation()
        setSaveLoad(true)
        if (save) savepost.mutate(postID)
        else unsavepost.mutate(postID)
    }, [savepost, unsavepost, setSaveLoad])

    const handleClick = () => {
        const navigate = async () => {

            if (!postData?.id) return

            if (!setmodal) {
                await router.push(`nest/${postData.id}`, undefined, { scroll: false });
            }
            else {
                setmodal(postData?.id)
                void router.push(`/nest?${postData?.id}`, undefined, { shallow: true });
            }
        };
        void navigate();
    };

    const cardimage = loaded ?
        <Image src={postData?.imageURL ? postData?.imageURL : "https://utfs.io/f/a18934b5-b279-40cf-a84e-4813b44a72ac_placeholder.png"}
            alt="Loading"
            placeholder="blur"
            blurDataURL={Loadingimage.src}
            height={300}
            width={300}
            style={{ borderColor: "brown", }}
        />
        : <Skeleton className="w-full h-full" />



    const cardtitle = loaded ? postData?.title : <div></div>
    const cardauthors = loaded ? postData?.authors : <Skeleton className="w-full h-[85%] mt-2" />
    const cardyear = loaded ? postData?.year : <Skeleton className="w-full h-full" />
    const carduni = loaded ? postData?.university : <Skeleton className="w-full h-full" />

    //CHANGE
    const cardshare = loaded && <ShareButton link={postData ? `https://visionest.xyz/nest/${postData.id}` : ""} />
    const cardfav =
        !isSignedIn || postData?.status != "ACCEPTED" ? <div></div> :
            (!loaded || saveLoad) ? <Spinner /> :
                saved ? <Star onClick={e => toggleSave(e, false)} fill="yellow" /> :
                    <Star onClick={e => toggleSave(e, true)} />;




    return (
        
        <Card className="origin-left w-[300px] h-[350px] scale-x-90 xs:scale-x-100 snap-end border-4 text-left border-vision cursor-pointer hover:border-yellow-600" onClick={handleClick} >
            <CardContent className="h-full pb-10">
                <div className="flex flex-col h-full justify-between gap-2">
                    <div>
                        <div className="bg-vision">
                            <div id="cardimage" className=" place-content-center w-full max-h-[180px] aspect-square overflow-hidden relative rounded-md">{cardimage}</div>
                        </div>
                        <div id="cardtitle" className={`text-white bg-${borderColor} col-span-5 row-span-2 overflow-ellipsis overflow-hidden font-bold text-md w-[295px] h-[75px] line-clamp-3 px-2`}>{cardtitle}</div>
                        <div className="flex gap-3 ">
                            <div id="cardauthors" className="pl-2 pt-1 col-span-3 row-span-2 overflow-ellipsis text-gray-700 h-[50px] basis-4/5 overflow-hidden line-clamp-2">{cardauthors}</div>
                            <div id="cardyear" className="w-full h-full basis-1/5 place-self-center flex place-items-center">{cardyear}</div>
                        </div>
                    </div>
                    <div id="cardfooter" className="px-2 flex justify-between place-items-center border-t-2 border-black h-[25px] relative bottom-1">
                        <div id="univ" className="text-sm align-self-start overflow-hidden overflow-ellipsis line-clamp-1 w-[200px] relative top-1 h-full">{carduni}</div>
                        <div id="share" className=" scale-95 mr-5 relative top-1">{cardshare}</div>
                        {postData?.status == "ACCEPTED" && <div id="cardfavcount" className="relative top-1 pr-1 w-3">{favCount}</div>}
                        <div id="cardfav" className="col-start-5 row-start-10 text-green-700 relative top-1 hover:text-green-400 cursor-pointer">{cardfav}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


//TODO: setup sharebutton link after launch with domain name, fix favorites