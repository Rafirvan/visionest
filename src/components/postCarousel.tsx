/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PostCard from "./postCard";
import { trpc } from "~/utils/api";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function PostCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const { data: CardContents, isLoading } = trpc.db.callpostid.useQuery({ limit: 5 })
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)




    // handle visibility of left/right arrows
    const handleScroll = () => {
        const element = carouselRef.current;
        if (element) {
            setAtStart(element.scrollLeft === 0)
            setAtEnd(element.scrollWidth - element.scrollLeft <= element.clientWidth+20)
        }
    };

    //scroll using button
    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                top: 0,
                left: direction === 'left' ? -332 : 332,
                behavior: 'smooth'
            });
            handleScroll()
        }
    };

    return (
        <div id="carouselcontainer" className="relative">

            <div id="carouselnavbtn">
                <button
                    className={`scale-150 absolute top-1/2 left-[-30px] transform -translate-y-1/2 z-10 ${atStart && "invisible"} `}
                    onClick={() => scroll('left')}
                >
                    <ArrowLeft className="hover:text-blue-500"/>
                </button>
                <button
                    className={`scale-150 absolute top-1/2 right-[-30px]  transform -translate-y-1/2 z-10 ${atEnd && "invisible"}`}
                    onClick={() => scroll('right')}
                >
                    <ArrowRight className="hover:text-blue-500"/>
                </button>
            </div>


            <div id="carousel" className="relative overflow-x-auto snap-x snap-mandatory" ref={carouselRef} onScroll={handleScroll}>
                <div
                    className="flex w-[1628px] h-[350px] gap-[32px]"
                >
                    {isLoading ? 
                    [1, 2, 3, 4, 5].map(e => {
                        return (<Card key={e} className="origin-left w-[300px] h-[350px] scale-x-90 xs:scale-x-100 snap-end border-4 text-left border-vision " >
                            <CardContent className="h-full w-full p-2 relative">
                                <Skeleton className="h-full w-full" delay={e*300}/>
                            </CardContent>
                        </Card>)
                    })
                        
                        : 


                        CardContents?.id?.map((id, index) => (
                        <PostCard key={index} postID={id} />))
                    }
                </div>

            </div>
        </div >
    );
}
