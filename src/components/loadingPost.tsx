import { ScrollArea } from "./ui/scroll-area"


export default function Loadingpost() {
    return (<section className='overflow-y-hidden'>
        <ScrollArea className='h-full max-w-4xl mx-auto p-4 shadow-md rounded-md mb-10 border-2 border-black overflow-hidden'>
            <div className='grid'>

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
            </div>
        </ScrollArea>
    </section>)
}