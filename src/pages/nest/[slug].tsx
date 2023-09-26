import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { ScrollArea } from '~/components/ui/scroll-area';
import { useRouter } from 'next/router';
import Loadingimage from "../../../public/loadingimage.gif"
import { trpc } from '~/utils/api';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import ShareButton from '~/components/shareButton';
import { Star } from 'lucide-react';
import Spinner from '~/components/ui/spinner';




interface posttype {
    id: string;
    creatorID: string;
    createdAt: Date;
    title: string;
    description: string;
    authors: string;
    year: number; originlink: string;
    imageURL: string;
    status: string;
    favcount: number;
    rejection: string;
    university: string;
}

export default function BlogPost() {
    const router = useRouter()
    const postId = router.query.slug?.toString()
    const [postData, setPostData] = useState<posttype | null | undefined>();
    const [saved, setSaved] = useState<boolean | undefined>(false)
    const [saveLoad, setSaveLoad] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const getpostfromid = trpc.db.callpostfromid.useMutation({
        onSuccess: (result) => {
            setPostData(result)
            setLoaded(true)
        }
    })
    const { user, isLoaded, isSignedIn } = useUser()
    const idmatch = (user?.id == postData?.creatorID)
    const adminmatch = (user?.publicMetadata.role == "admin")
    const pending = (postData?.status == "PENDING")
    const rejected = (postData?.status == "REJECTED")


    useEffect(() => {
        if (postId) getpostfromid.mutate(postId)
        refreshCheck.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const refreshCheck = trpc.db.checksave.useMutation({
        onSuccess: (result) => {
            if (postId) setSaved(result?.includes(postId))
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
        if (save && postId) savepost.mutate(postId)
        else if (postId) unsavepost.mutate(postId)
    }

    const fav =
        !isSignedIn || postData?.status != "ACCEPTED" ? <div></div> :
            (saveLoad) ? <div className='absolute top-2 right-2 scale-150 border-2 border-black rounded-md h-10 w-10 flex place-items-center justify-center z-10 bg-white'><Spinner /></div> :
                saved ? <div className='absolute top-2 right-2 scale-150 border-2 border-black rounded-md h-10 w-10 flex place-items-center justify-center z-10 bg-white'><Star className='cursor-pointer' onClick={e => toggleSave(e, false)} fill="yellow" /></div> :
                    <div className='absolute top-2 right-2 scale-150 border-2 border-black rounded-md h-10 w-10 flex place-items-center justify-center z-10 bg-white'><Star className='cursor-pointer' onClick={e => toggleSave(e, true)} /></div>;


    if (!isLoaded || !loaded) return <section>Loading...</section>

    if (!postData) return <section>post dengan ID ini tidak diketemukan, postID : {postId}</section>

    if ((rejected || pending) && !idmatch && !adminmatch) {
        return (
            <section className='font-bold relative top-[100px] rounded-xl h-[50vh] w-full flex justify-center place-items-center border-4 border-yellow-500 bg-yellow-200'>
                Post Sedang Tidak Diperlihatkan untuk Publik
            </section>
        )
    }


    return (
        <section className='overflow-y-hidden h-[calc(100vh-30px)]'>

            <ScrollArea className='h-full max-w-4xl mx-auto p-4 shadow-md rounded-md mb-10 border-2 border-black overflow-hidden'>
                {fav}
                <div className='grid'>
                    <div>
                        {((idmatch || adminmatch) && pending) && <div id="statusarea" className='pb-6 font-bold'>Saat ini post ini <span className='text-yellow-500'>Pending</span> </div>}
                        {((idmatch || adminmatch) && rejected) &&
                            <>
                                <div id="statusarea" className='pb-3 font-bold'>
                                    Saat ini post ini <span className='text-red-500'>Rejected</span>
                                </div>
                                <p>Alasan = {postData.rejection}</p>
                            </>
                        }
                        {idmatch && <div>Anda pembuat post ini!<Link href={`/edit/${postId}`}><p className='font-bold text-blue-600 underline pb-4'>Edit post ini</p></Link></div>}
                    </div>
                    <hr />
                    <div id='imageArea' className="mb-2 overflow-hidden h-fit w-[100%] place-self-start relative md:place-self-center">
                        <Image src={postData.imageURL ? postData.imageURL : "https://utfs.io/f/a18934b5-b279-40cf-a84e-4813b44a72ac_placeholder.png"}
                            alt={postData.title}
                            placeholder="blur"
                            blurDataURL={Loadingimage.src}
                            height={300}
                            width={1000}
                        // style={{ aspectRatio: "16/9" }}
                        />

                    </div>



                    <div>
                        <h1 id="titleArea" className="text-2xl font-bold mb-2">{postData.title} <ShareButton link={router.asPath} /> </h1>
                        <p id="authorArea" className="text-gray-600 mb-1">
                            By <span className="break-words">{postData.authors}</span> • {postData.year}
                        </p>
                        <p id="uniArea" className="text-gray-600 mb-4">
                            <span className="break-words">{postData.university}</span>
                        </p>
                        <hr />
                        <div className='no-tailwindcss-base'><div dangerouslySetInnerHTML={{ __html: postData.description }}></div></div>


                        <div id="linkArea" className="border p-2 mt-4 rounded">
                            <span className="mr-2">Read More:</span>
                            <a
                                href={postData.originlink}
                                className="text-blue-500 hover:text-blue-600 hover:underline"
                                target="_blank"
                            >
                                Link to paper
                            </a>
                        </div>


                    </div>
                </div>
            </ScrollArea>
        </section>
    );
}


//TODO : work on editing posts, setup link for sharebutton, place univ name, maybe save button here too?