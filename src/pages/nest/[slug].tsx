import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import { ScrollArea } from '~/components/ui/scroll-area';
import { useRouter } from 'next/router';
import Loadingimage from "public/loadingimage.gif"
import { trpc } from '~/utils/api';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import ShareButton from '~/components/shareButton';
import { Star } from 'lucide-react';
import Spinner from '~/components/ui/spinner';




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
    posttag: {
        tag: {
            name: string;
        };
    }[];
}

export default function BlogPost() {
    const router = useRouter()
    const postId = router.query.slug?.toString()
    const [postData, setPostData] = useState<posttype | null | undefined>();
    const [saved, setSaved] = useState<boolean | undefined>(false)
    const [saveLoad, setSaveLoad] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [favCount, setFavCount] = useState<number | undefined>()
    const getpostfromid = trpc.db.callpostfromid.useMutation({
        onSuccess: (result) => {
            setPostData(result.postwithid)
            setLoaded(true)
        }
    })
    const getFavCount = trpc.db.favcount.useMutation({
        onSuccess: (result) => setFavCount(result)
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
            if (postId) {
                setSaved(result?.includes(postId));
                getFavCount.mutate(postId)
            }
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

    const toggleSave = useCallback((e: React.MouseEvent, save?: boolean) => {
        e.stopPropagation()
        setSaveLoad(true)
        if (save && postId) savepost.mutate(postId)
        else if (postId) unsavepost.mutate(postId)
    }, [postId, savepost, unsavepost])

    const fav =
        (!isSignedIn || postData?.status != "ACCEPTED") ? <div></div> :
            (saveLoad) ? <div className='absolute top-2 right-2 scale-150 border-2 border-black rounded-md h-10 w-fit px-1 flex place-items-center justify-center z-10 bg-white'><Spinner />{favCount}</div> :
                saved ? <div className='absolute top-2 right-2 scale-150 border-2 border-black rounded-md h-10 w-fit px-1 flex place-items-center justify-center z-10 bg-white'><Star className='cursor-pointer' onClick={e => toggleSave(e, false)} fill="yellow" />{favCount}</div> :
                    <div className='absolute top-2 right-2 scale-150 border-2 border-black rounded-md h-10 w-fit px-1 flex place-items-center justify-center z-10 bg-white'><Star className='cursor-pointer' onClick={e => toggleSave(e, true)} />{favCount}</div>;


    // rejected or pending, only visible by admin or post creator
    if ((rejected || pending) && !idmatch && !adminmatch) {
        return (
            <section className='font-bold relative top-[100px] rounded-xl h-[300px] w-[60%]  left-[20%] flex justify-center place-items-center border-4 border-yellow-500 '>
                Post Privat
            </section>
        );
    }


    // wrong id
    if (!postData) return <section className='font-bold relative top-[100px] rounded-xl h-[300px] w-[60%]  left-[20%] flex justify-center place-items-center border-4 border-yellow-500'>post dengan ID ini tidak ditemukan, postID : {postId}</section>;

    return (
        <section className='overflow-y-hidden'>
            <ScrollArea className='h-full max-w-4xl mx-auto p-4 shadow-md rounded-md mb-10 border-2 border-black overflow-hidden min-h-[500px]'>
                {fav}
                {(!isLoaded || loaded) ? <div className='flex h-[500px] scale-[400%] justify-center items-center'><Spinner /></div> :
                    <div className='grid'>

                        {/* header only visible for post creator */}
                        <div id='header'>
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
                            />

                        </div>



                        <div id='descriptionArea'>
                            <h1 id="titleArea" className="text-2xl font-bold mb-2">{postData.title} <ShareButton link={`https://visionest.xyz/nest/${postData.id}`} /> </h1>
                            <p id="authorArea" className="text-gray-600 mb-1">
                                By <span className="break-words">{postData.authors}</span> • {postData.year}
                            </p>
                            <p id="uniArea" className="text-gray-600 mb-4">
                                <span className="break-words">{postData.university}</span>
                            </p>
                            <hr />
                            <div className='no-tailwindcss-base'><div dangerouslySetInnerHTML={{ __html: postData.description }}></div></div>


                            <div id="linkArea" className="border-4 p-2 mt-4 rounded-lg brightness-90">
                                <span className="mr-2">Baca Lebih Lanjut:</span>
                                <a
                                    href={postData.originlink}
                                    className="text-blue-500 hover:text-blue-600 hover:underline"
                                    target="_blank"
                                >
                                    Link
                                </a>
                            </div>

                            {!(pending || rejected) &&
                                <div
                                    id='tagsArea'
                                    className='text-slate-600 pt-2'>
                                    Kategori : {postData.posttag.map(e => e.tag.name).join(", ")}
                                </div>}

                        </div>
                    </div>}
            </ScrollArea>
        </section>
    );
}

